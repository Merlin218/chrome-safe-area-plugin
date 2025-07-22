import type { SafeAreaSettings, SafeAreaMessage, SafeAreaInsets } from '../types/global.js';
import { getDeviceInsets, sendMessageToTab, isValidTabUrl } from '../src/shared/utils.js';

export default defineBackground(() => {
  console.log('Background script initialized');

  const background = new SafeAreaBackground();
});

class SafeAreaBackground {
  constructor() {
    this.init();
  }

  private init(): void {
    this.setupInstallListener();
    this.setupTabUpdateListener();
    this.setupMessageListener();
  }

  private setupInstallListener(): void {
    chrome.runtime.onInstalled.addListener((details: chrome.runtime.InstalledDetails) => {
      if (details.reason === 'install') {
        this.setDefaultSettings();
        this.showWelcomeNotification();
      } else if (details.reason === 'update') {
        this.handleUpdate(details.previousVersion);
      }
    });
  }

  private setupTabUpdateListener(): void {
    chrome.tabs.onUpdated.addListener(async (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
      // When a tab finishes loading, apply current safe area settings
      if (changeInfo.status === 'complete' && tab.url && !tab.url.startsWith('chrome://')) {
        await this.applyCurrentSettings(tabId);
      }
    });
  }

  private setupMessageListener(): void {
    chrome.runtime.onMessage.addListener((
      message: SafeAreaMessage, 
      sender: chrome.runtime.MessageSender, 
      sendResponse: (response: any) => void
    ) => {
      switch (message.action) {
        case 'getCurrentSettings':
          this.getCurrentSettings().then(sendResponse);
          return true;
        case 'updateAllTabs':
          this.updateAllTabs(message.settings).then(sendResponse);
          return true;
        default:
          sendResponse({ error: 'Unknown action' });
          return false;
      }
    });
  }

  private async setDefaultSettings(): Promise<void> {
    try {
      await chrome.storage.sync.set({
        enabled: false,
        device: 'none',
        customInsets: { top: 0, bottom: 0, left: 0, right: 0 },
        showDebugOverlay: true
      });
    } catch (error) {
      console.error('Error setting default settings:', error);
    }
  }

  private async showWelcomeNotification(): Promise<void> {
    try {
      await chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'Safe Area Simulator Installed',
        message: 'Click the extension icon to start simulating mobile device safe areas!'
      });
    } catch (error) {
      // Notifications might not be available, ignore the error
      console.log('Notifications not available');
    }
  }

  private async handleUpdate(previousVersion?: string): Promise<void> {
    console.log(`Updated from version ${previousVersion}`);
    // Handle any migration logic here if needed
  }

  private async getCurrentSettings(): Promise<SafeAreaSettings | null> {
    try {
      const settings = await chrome.storage.sync.get(['enabled', 'device', 'customInsets', 'showDebugOverlay']);
      return {
        enabled: settings.enabled || false,
        device: settings.device || 'none',
        customInsets: settings.customInsets || { top: 0, bottom: 0, left: 0, right: 0 },
        showDebugOverlay: settings.showDebugOverlay !== false
      };
    } catch (error) {
      console.error('Error getting current settings:', error);
      return null;
    }
  }

  private async applyCurrentSettings(tabId: number): Promise<void> {
    try {
      const settings = await this.getCurrentSettings();
      if (!settings || !settings.enabled) return;

      // Get device insets (this would need to be implemented)
      const insets = await this.getDeviceInsets(settings.device);
      if (!insets) return;

      const message: SafeAreaMessage = {
        action: 'updateSafeArea',
        enabled: settings.enabled,
        device: settings.device,
        insets: insets
      };

      await chrome.tabs.sendMessage(tabId, message);
    } catch (error) {
      // Tab might not be ready or content script not injected yet
      console.log('Could not apply settings to tab:', error);
    }
  }

  private async getDeviceInsets(deviceKey: string): Promise<SafeAreaInsets | null> {
    return getDeviceInsets(deviceKey);
  }

  private async updateAllTabs(settings?: SafeAreaSettings): Promise<{ success: boolean; error?: string }> {
    try {
      const tabs = await chrome.tabs.query({});
      const updatePromises = tabs
        .filter((tab: chrome.tabs.Tab) => isValidTabUrl(tab.url))
        .map((tab: chrome.tabs.Tab) => tab.id ? this.applyCurrentSettings(tab.id) : Promise.resolve());

      await Promise.allSettled(updatePromises);
      return { success: true };
    } catch (error) {
      console.error('Error updating all tabs:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}