// Background script for Safe Area Simulator
class SafeAreaBackground {
  constructor() {
    this.init();
  }

  init() {
    this.setupInstallListener();
    this.setupTabUpdateListener();
    this.setupMessageListener();
  }

  setupInstallListener() {
    chrome.runtime.onInstalled.addListener((details) => {
      if (details.reason === 'install') {
        this.setDefaultSettings();
        this.showWelcomeNotification();
      } else if (details.reason === 'update') {
        this.handleUpdate(details.previousVersion);
      }
    });
  }

  setupTabUpdateListener() {
    chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
      // When a tab finishes loading, apply current safe area settings
      if (changeInfo.status === 'complete' && tab.url && !tab.url.startsWith('chrome://')) {
        await this.applyCurrentSettings(tabId);
      }
    });
  }

  setupMessageListener() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      switch (message.action) {
        case 'getCurrentSettings':
          this.getCurrentSettings().then(sendResponse);
          return true;
        case 'updateAllTabs':
          this.updateAllTabs(message.settings).then(sendResponse);
          return true;
        default:
          sendResponse({ error: 'Unknown action' });
      }
    });
  }

  async setDefaultSettings() {
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

  async showWelcomeNotification() {
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

  async handleUpdate(previousVersion) {
    console.log(`Updated from version ${previousVersion}`);
    // Handle any migration logic here if needed
  }

  async getCurrentSettings() {
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

  async applyCurrentSettings(tabId) {
    try {
      const settings = await this.getCurrentSettings();
      if (!settings || !settings.enabled) return;

      // Get device insets (this would need to be implemented)
      const insets = await this.getDeviceInsets(settings.device);
      if (!insets) return;

      const message = {
        action: 'updateSafeArea',
        enabled: settings.enabled,
        device: settings.device,
        insets: insets
      };

      await chrome.tabs.sendMessage(tabId, message);
    } catch (error) {
      // Tab might not be ready or content script not injected yet
      console.log('Could not apply settings to tab:', error.message);
    }
  }

  async getDeviceInsets(deviceKey) {
    // This would need to include the device data or fetch it
    // For now, return basic iPhone 14 Pro data as example
    const deviceData = {
      'none': { top: 0, bottom: 0, left: 0, right: 0 },
      'iphone14Pro': { top: 59, bottom: 34, left: 0, right: 0 },
      'iphone14': { top: 47, bottom: 34, left: 0, right: 0 },
      // Add more devices as needed
    };

    return deviceData[deviceKey] || { top: 0, bottom: 0, left: 0, right: 0 };
  }

  async updateAllTabs(settings) {
    try {
      const tabs = await chrome.tabs.query({});
      const updatePromises = tabs
        .filter(tab => tab.url && !tab.url.startsWith('chrome://'))
        .map(tab => this.applyCurrentSettings(tab.id));

      await Promise.allSettled(updatePromises);
      return { success: true };
    } catch (error) {
      console.error('Error updating all tabs:', error);
      return { success: false, error: error.message };
    }
  }
}

// Initialize background script
new SafeAreaBackground(); 