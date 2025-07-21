// Popup script for Safe Area Simulator
class SafeAreaPopup {
  constructor() {
    this.currentDevice = 'none';
    this.isEnabled = false;
    this.customInsets = { top: 0, bottom: 0, left: 0, right: 0 };
    this.phoneMockup = null;
    this.mockupOptions = {
      showSafeArea: true,
      showContent: true
    };
    
    this.init();
  }

  async init() {
    await this.loadState();
    this.initPhoneMockup();
    this.bindEvents();
    this.updateUI();
    this.updatePreview();
  }

  async loadState() {
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

  async saveState() {
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

  initPhoneMockup() {
    try {
      const container = document.getElementById('phoneMockupContainer');
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

  bindEvents() {
    // Toggle switch
    const enableToggle = document.getElementById('enablePlugin');
    if (enableToggle) {
      enableToggle.addEventListener('change', this.handleToggle.bind(this));
    }

    // Device selection
    const deviceSelect = document.getElementById('deviceSelect');
    if (deviceSelect) {
      deviceSelect.addEventListener('change', this.handleDeviceChange.bind(this));
    }

    // Custom inputs
    const customInputs = ['customTop', 'customBottom', 'customLeft', 'customRight'];
    customInputs.forEach(id => {
      const input = document.getElementById(id);
      if (input) {
        input.addEventListener('input', this.handleCustomInput.bind(this));
      }
    });

    // Apply custom button
    const applyCustomBtn = document.getElementById('applyCustom');
    if (applyCustomBtn) {
      applyCustomBtn.addEventListener('click', this.handleApplyCustom.bind(this));
    }

    // Mockup control buttons
    const toggleSafeAreaBtn = document.getElementById('toggleSafeArea');
    const toggleContentBtn = document.getElementById('toggleContent');
    const toggleDeviceFrameBtn = document.getElementById('toggleDeviceFrame');
    
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

  async handleToggle(event) {
    this.isEnabled = event.target.checked;
    await this.saveState();
    this.updateUI();
    this.updatePhoneMockup();
    this.sendMessageToContentScript();
  }

  async handleDeviceChange(event) {
    this.currentDevice = event.target.value;
    await this.saveState();
    this.updatePreview();
    this.updatePhoneMockup();
    
    if (this.isEnabled) {
      this.sendMessageToContentScript();
    }
  }

  handleCustomInput(event) {
    const property = event.target.id.replace('custom', '').toLowerCase();
    this.customInsets[property] = parseInt(event.target.value) || 0;
  }

  async handleApplyCustom() {
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
          type: 'none'
        },
        homeIndicator: {
          width: 36,
          height: 2,
          radius: 1
        },
        colors: ['#667eea', '#764ba2', '#8b7bc7'],
        brand: 'custom'
      }
    };

    // Temporarily add to devices list
    DEVICES.custom = customDevice;
    
    // Update current device to custom
    this.currentDevice = 'custom';
    
    // Update device select
    const deviceSelect = document.getElementById('deviceSelect');
    let customOption = deviceSelect.querySelector('option[value="custom"]');
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

  async handleToggleSafeArea() {
    this.mockupOptions.showSafeArea = !this.mockupOptions.showSafeArea;
    await this.saveState();
    this.updateMockupControls();
    if (this.phoneMockup) {
      this.phoneMockup.setOptions({ showSafeArea: this.mockupOptions.showSafeArea });
      this.updatePhoneMockup();
    }
  }

  async handleToggleContent() {
    this.mockupOptions.showContent = !this.mockupOptions.showContent;
    await this.saveState();
    this.updateMockupControls();
    if (this.phoneMockup) {
      this.phoneMockup.setOptions({ showContent: this.mockupOptions.showContent });
      this.updatePhoneMockup();
    }
  }

  async handleToggleDeviceFrame() {
    this.showDeviceFrame = !this.showDeviceFrame;
    await this.saveState();
    this.updateMockupControls();
    this.sendMessageToContentScript();
  }

  updateMockupControls() {
    const toggleSafeAreaBtn = document.getElementById('toggleSafeArea');
    const toggleContentBtn = document.getElementById('toggleContent');
    const toggleDeviceFrameBtn = document.getElementById('toggleDeviceFrame');
    
    toggleSafeAreaBtn.classList.toggle('active', this.mockupOptions.showSafeArea);
    toggleContentBtn.classList.toggle('active', this.mockupOptions.showContent);
    toggleDeviceFrameBtn.classList.toggle('active', this.showDeviceFrame);
    
    toggleSafeAreaBtn.title = this.mockupOptions.showSafeArea ? 'Hide Safe Area' : 'Show Safe Area';
    toggleContentBtn.title = this.mockupOptions.showContent ? 'Hide Content' : 'Show Content';
    toggleDeviceFrameBtn.title = this.showDeviceFrame ? 'Hide Device Frame' : 'Show Device Frame';
  }

  updateUI() {
    const enableToggle = document.getElementById('enablePlugin');
    const popupContent = document.querySelector('.popup-content');
    const deviceSelect = document.getElementById('deviceSelect');

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

  updatePreview() {
    const device = DEVICES[this.currentDevice];
    if (!device) return;

    const { safeAreaInsets } = device;

    // Update numeric values
    document.getElementById('topValue').textContent = `${safeAreaInsets.top}px`;
    document.getElementById('bottomValue').textContent = `${safeAreaInsets.bottom}px`;
    document.getElementById('leftValue').textContent = `${safeAreaInsets.left}px`;
    document.getElementById('rightValue').textContent = `${safeAreaInsets.right}px`;

    // Update custom inputs if it's a custom device
    if (this.currentDevice === 'custom') {
      document.getElementById('customTop').value = safeAreaInsets.top;
      document.getElementById('customBottom').value = safeAreaInsets.bottom;
      document.getElementById('customLeft').value = safeAreaInsets.left;
      document.getElementById('customRight').value = safeAreaInsets.right;
    }
  }

  updatePhoneMockup() {
    if (!this.phoneMockup) return;

    const device = DEVICES[this.currentDevice];
    if (!device) {
      this.phoneMockup.showPlaceholder();
      return;
    }

    const safeAreaInsets = this.isEnabled ? device.safeAreaInsets : { top: 0, bottom: 0, left: 0, right: 0 };
    this.phoneMockup.updateDevice(this.currentDevice, safeAreaInsets);
  }

  async sendMessageToContentScript() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab || !tab.id) {
        console.log('[Safe Area Simulator] No active tab found');
        return;
      }

      // Check if the tab URL is valid for content script injection
      if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://'))) {
        console.log('[Safe Area Simulator] Cannot inject into browser internal pages');
        return;
      }

      const message = {
        action: 'updateSafeArea',
        enabled: this.isEnabled,
        device: this.currentDevice,
        showDeviceFrame: this.showDeviceFrame,
        insets: this.isEnabled && DEVICES[this.currentDevice] 
          ? DEVICES[this.currentDevice].safeAreaInsets 
          : { top: 0, bottom: 0, left: 0, right: 0 }
      };

      await chrome.tabs.sendMessage(tab.id, message);
    } catch (error) {
      // Silently handle connection errors as they're common when content script isn't ready
      if (error.message && error.message.includes('Could not establish connection')) {
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