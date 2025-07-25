// Popup script for Safe Area Simulator
/// <reference types="chrome" />
import type { SafeAreaSettings, SafeAreaMessage, SafeAreaInsets, MockupOptions } from '../types/global.js';
import { DEVICES } from './shared/devices.js';
import { sendMessageToTab, isValidTabUrl } from './shared/utils.js';
import { PhoneMockup } from './phone-mockup.js';

class SafeAreaPopup {
  private currentDevice: string = 'none';
  private isEnabled: boolean = false;
  private customInsets: SafeAreaInsets = { top: 0, bottom: 0, left: 0, right: 0 };
  private phoneMockup: PhoneMockup | null = null;
  private mockupOptions: MockupOptions = {
    showSafeArea: true,
    showContent: true
  };
  private showDeviceFrame: boolean = false;
  
  constructor() {
    this.init();
  }

  private async init(): Promise<void> {
    await this.loadState();
    this.initPhoneMockup();
    this.bindEvents();
    this.updateUI();
    this.updatePreview();
  }

  private async loadState(): Promise<void> {
    try {
      const result = await chrome.storage.sync.get(['device', 'enabled', 'customInsets', 'mockupOptions', 'showDeviceFrame']);
      this.currentDevice = result.device || 'none';
      this.isEnabled = result.enabled || false;
      this.customInsets = result.customInsets || { top: 0, bottom: 0, left: 0, right: 0 };
      this.mockupOptions = result.mockupOptions || { showSafeArea: true, showContent: true };
      this.showDeviceFrame = result.showDeviceFrame || false;
    } catch (error) {
      console.error('Error loading state:', error);
    }
  }

  private async saveState(): Promise<void> {
    try {
      await chrome.storage.sync.set({
        device: this.currentDevice,
        enabled: this.isEnabled,
        customInsets: this.customInsets,
        mockupOptions: this.mockupOptions,
        showDeviceFrame: this.showDeviceFrame
      });
    } catch (error) {
      console.error('Error saving state:', error);
    }
  }

  private initPhoneMockup(): void {
    try {
      const container = document.getElementById('phoneMockupContainer') as HTMLElement;
      if (!container) {
        console.error('[Safe Area Simulator] Phone mockup container not found');
        return;
      }
      
      if (typeof PhoneMockup === 'undefined') {
        console.error('[Safe Area Simulator] PhoneMockup class not available');
        return;
      }
      
      this.phoneMockup = new PhoneMockup(container, {
        scale: 0.5,
        showSafeArea: this.mockupOptions.showSafeArea,
        showContent: this.mockupOptions.showContent
      });
    } catch (error) {
      console.error('[Safe Area Simulator] Error initializing phone mockup:', error);
    }
  }

  private bindEvents(): void {
    // Toggle switch
    const enableToggle = document.getElementById('enablePlugin') as HTMLInputElement;
    if (enableToggle) {
      enableToggle.addEventListener('change', this.handleToggle.bind(this));
    }

    // Device selection
    const deviceSelect = document.getElementById('deviceSelect') as HTMLSelectElement;
    if (deviceSelect) {
      deviceSelect.addEventListener('change', this.handleDeviceChange.bind(this));
    }

    // Custom inputs
    const customInputs = ['customTop', 'customBottom', 'customLeft', 'customRight'];
    customInputs.forEach(id => {
      const input = document.getElementById(id) as HTMLInputElement;
      if (input) {
        input.addEventListener('input', this.handleCustomInput.bind(this));
      }
    });

    // Apply custom button
    const applyCustomBtn = document.getElementById('applyCustom') as HTMLButtonElement;
    if (applyCustomBtn) {
      applyCustomBtn.addEventListener('click', this.handleApplyCustom.bind(this));
    }

    // Mockup control buttons
    const toggleSafeAreaBtn = document.getElementById('toggleSafeArea') as HTMLButtonElement;
    const toggleContentBtn = document.getElementById('toggleContent') as HTMLButtonElement;
    const toggleDeviceFrameBtn = document.getElementById('toggleDeviceFrame') as HTMLButtonElement;
    
    if (toggleSafeAreaBtn) {
      toggleSafeAreaBtn.addEventListener('click', this.handleToggleSafeArea.bind(this));
    }
    if (toggleContentBtn) {
      toggleContentBtn.addEventListener('click', this.handleToggleContent.bind(this));
    }
    if (toggleDeviceFrameBtn) {
      toggleDeviceFrameBtn.addEventListener('click', this.handleToggleDeviceFrame.bind(this));
    }

    // Update button states
    this.updateMockupControls();
  }

  private async handleToggle(event: Event): Promise<void> {
    const target = event.target as HTMLInputElement;
    this.isEnabled = target.checked;
    await this.saveState();
    this.updateUI();
    this.updatePhoneMockup();
    this.sendMessageToContentScript();
  }

  private async handleDeviceChange(event: Event): Promise<void> {
    const target = event.target as HTMLSelectElement;
    this.currentDevice = target.value;
    await this.saveState();
    this.updatePreview();
    this.updatePhoneMockup();
    
    if (this.isEnabled) {
      this.sendMessageToContentScript();
    }
  }

  private handleCustomInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const property = target.id.replace('custom', '').toLowerCase() as keyof SafeAreaInsets;
    this.customInsets[property] = parseInt(target.value) || 0;
  }

  private async handleApplyCustom(): Promise<void> {
    // Create a custom device configuration
    const customDevice = {
      name: 'Custom',
      safeAreaInsets: { ...this.customInsets },
      appearance: {
        width: 146.7,
        height: 284,
        screenWidth: 130,
        screenHeight: 260,
        borderRadius: 20,
        screenRadius: 16,
        notch: {
          type: 'none' as const
        },
        homeIndicator: {
          width: 36,
          height: 2,
          radius: 1
        },
        colors: ['#667eea', '#764ba2', '#8b7bc7'],
        brand: 'custom' as const
      }
    };

    // Temporarily add to devices list
    DEVICES.custom = customDevice;
    
    // Update current device to custom
    this.currentDevice = 'custom';
    
    // Update device select
    const deviceSelect = document.getElementById('deviceSelect') as HTMLSelectElement;
    let customOption = deviceSelect.querySelector('option[value="custom"]') as HTMLOptionElement;
    if (!customOption) {
      customOption = document.createElement('option');
      customOption.value = 'custom';
      customOption.textContent = 'Custom';
      deviceSelect.appendChild(customOption);
    }
    deviceSelect.value = 'custom';

    await this.saveState();
    this.updatePreview();
    this.updatePhoneMockup();
    
    if (this.isEnabled) {
      this.sendMessageToContentScript();
    }
  }

  private async handleToggleSafeArea(): Promise<void> {
    this.mockupOptions.showSafeArea = !this.mockupOptions.showSafeArea;
    await this.saveState();
    this.updateMockupControls();
    if (this.phoneMockup) {
      this.phoneMockup.setOptions({ showSafeArea: this.mockupOptions.showSafeArea });
      this.updatePhoneMockup();
    }
  }

  private async handleToggleContent(): Promise<void> {
    this.mockupOptions.showContent = !this.mockupOptions.showContent;
    await this.saveState();
    this.updateMockupControls();
    if (this.phoneMockup) {
      this.phoneMockup.setOptions({ showContent: this.mockupOptions.showContent });
      this.updatePhoneMockup();
    }
  }

  private async handleToggleDeviceFrame(): Promise<void> {
    this.showDeviceFrame = !this.showDeviceFrame;
    await this.saveState();
    this.updateMockupControls();
    this.sendMessageToContentScript();
  }

  private updateMockupControls(): void {
    const toggleSafeAreaBtn = document.getElementById('toggleSafeArea') as HTMLButtonElement;
    const toggleContentBtn = document.getElementById('toggleContent') as HTMLButtonElement;
    const toggleDeviceFrameBtn = document.getElementById('toggleDeviceFrame') as HTMLButtonElement;
    
    toggleSafeAreaBtn.classList.toggle('active', this.mockupOptions.showSafeArea);
    toggleContentBtn.classList.toggle('active', this.mockupOptions.showContent);
    toggleDeviceFrameBtn.classList.toggle('active', this.showDeviceFrame);
    
    toggleSafeAreaBtn.title = this.mockupOptions.showSafeArea ? 'Hide Safe Area' : 'Show Safe Area';
    toggleContentBtn.title = this.mockupOptions.showContent ? 'Hide Content' : 'Show Content';
    toggleDeviceFrameBtn.title = this.showDeviceFrame ? 'Hide Device Frame' : 'Show Device Frame';
  }

  private updateUI(): void {
    const enableToggle = document.getElementById('enablePlugin') as HTMLInputElement;
    const popupContent = document.querySelector('.popup-content') as HTMLElement;
    const deviceSelect = document.getElementById('deviceSelect') as HTMLSelectElement;

    enableToggle.checked = this.isEnabled;
    deviceSelect.value = this.currentDevice;
    
    if (this.isEnabled) {
      popupContent.classList.remove('disabled');
      deviceSelect.disabled = false;
    } else {
      popupContent.classList.add('disabled');
      deviceSelect.disabled = true;
    }
  }

  private updatePreview(): void {
    const device = DEVICES[this.currentDevice];
    if (!device) return;

    const { safeAreaInsets } = device;

    // Update numeric values
    const topValue = document.getElementById('topValue') as HTMLElement;
    const bottomValue = document.getElementById('bottomValue') as HTMLElement;
    const leftValue = document.getElementById('leftValue') as HTMLElement;
    const rightValue = document.getElementById('rightValue') as HTMLElement;

    topValue.textContent = `${safeAreaInsets.top}px`;
    bottomValue.textContent = `${safeAreaInsets.bottom}px`;
    leftValue.textContent = `${safeAreaInsets.left}px`;
    rightValue.textContent = `${safeAreaInsets.right}px`;

    // Update custom inputs if it's a custom device
    if (this.currentDevice === 'custom') {
      const customTop = document.getElementById('customTop') as HTMLInputElement;
      const customBottom = document.getElementById('customBottom') as HTMLInputElement;
      const customLeft = document.getElementById('customLeft') as HTMLInputElement;
      const customRight = document.getElementById('customRight') as HTMLInputElement;

      customTop.value = safeAreaInsets.top.toString();
      customBottom.value = safeAreaInsets.bottom.toString();
      customLeft.value = safeAreaInsets.left.toString();
      customRight.value = safeAreaInsets.right.toString();
    }
  }

  private updatePhoneMockup(): void {
    if (!this.phoneMockup) return;

    const device = DEVICES[this.currentDevice];
    if (!device) {
      this.phoneMockup.showPlaceholder();
      return;
    }

    const safeAreaInsets = this.isEnabled ? device.safeAreaInsets : { top: 0, bottom: 0, left: 0, right: 0 };
    this.phoneMockup.updateDevice(this.currentDevice, safeAreaInsets);
  }

  private async sendMessageToContentScript(): Promise<void> {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab || !tab.id) {
        console.log('[Safe Area Simulator] No active tab found');
        return;
      }

      // Check if the tab URL is valid for content script injection
      if (!isValidTabUrl(tab.url)) {
        console.log('[Safe Area Simulator] Cannot inject into browser internal pages');
        return;
      }

      const message: SafeAreaMessage = {
        action: 'updateSafeArea',
        enabled: this.isEnabled,
        device: this.currentDevice,
        showDeviceFrame: this.showDeviceFrame,
        insets: this.isEnabled && this.currentDevice && DEVICES[this.currentDevice] 
          ? DEVICES[this.currentDevice]!.safeAreaInsets 
          : { top: 0, bottom: 0, left: 0, right: 0 }
      };

      await chrome.tabs.sendMessage(tab.id, message);
    } catch (error) {
      // Silently handle connection errors as they're common when content script isn't ready
      if (error instanceof Error && error.message && error.message.includes('Could not establish connection')) {
        console.log('[Safe Area Simulator] Content script not ready yet');
      } else {
        console.error('Error sending message to content script:', error);
      }
    }
  }
}

// Initialize popup when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new SafeAreaPopup();
  });
} else {
  new SafeAreaPopup();
} 