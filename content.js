// Content script for Safe Area Simulator
class SafeAreaInjector {
  constructor() {
    this.isEnabled = false;
    this.currentDevice = null;
    this.currentInsets = { top: 0, bottom: 0, left: 0, right: 0 };
    this.styleElement = null;
    this.phoneFrameOverlay = null;
    this.debugMode = false;
    this.observer = null;
    this.routeChangeTimeout = null;
    
    this.init();
  }

  init() {
    this.loadStoredState();
    this.createStyleElement();
    this.setupMessageListener();
    this.injectInitialStyles();
    this.createPhoneFrameOverlay();
    this.setupRouteObserver();
  }

  async loadStoredState() {
    try {
      const result = await chrome.storage.sync.get(['enabled', 'device', 'customInsets', 'showDeviceFrame', 'debugMode']);
      this.isEnabled = result.enabled || false;
      this.currentDevice = result.device || null;
      this.debugMode = result.debugMode || false;
      
      if (this.isEnabled && result.device) {
        const device = DEVICES[result.device];
        if (device) {
          this.currentInsets = device.safeAreaInsets;
        }
      }
    } catch (error) {
      console.error('Error loading stored state:', error);
    }
  }

  createPhoneFrameOverlay() {
    try {
      // Check if PhoneFrameSimple class is available
      if (typeof PhoneFrameSimple === 'undefined') {
        console.warn('[Safe Area Simulator] PhoneFrameSimple class not available');
        return;
      }
      
      this.phoneFrameOverlay = new PhoneFrameSimple({
        scale: 0.4,
        showSafeArea: true,
        showDeviceFrame: true,
        theme: 'light'
      });
    } catch (error) {
      console.error('[Safe Area Simulator] Error creating phone frame overlay:', error);
    }
  }

  setupRouteObserver() {
    // Watch for SPA route changes using History API
    this.observeHistoryChanges();
    
    // Watch for URL changes
    this.observeUrlChanges();
    
    // Watch for DOM mutations that might indicate route changes
    this.observeDomChanges();
  }

  observeHistoryChanges() {
    // Override pushState and replaceState to detect route changes
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = (...args) => {
      originalPushState.apply(history, args);
      this.handleRouteChange();
    };
    
    history.replaceState = (...args) => {
      originalReplaceState.apply(history, args);
      this.handleRouteChange();
    };
    
    // Listen for popstate events
    window.addEventListener('popstate', () => {
      this.handleRouteChange();
    });
  }

  observeUrlChanges() {
    let lastUrl = location.href;
    
    // Check for URL changes periodically
    setInterval(() => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        this.handleRouteChange();
      }
    }, 500);
  }

  observeDomChanges() {
    // Use MutationObserver to detect significant DOM changes
    this.observer = new MutationObserver((mutations) => {
      let shouldRecreate = false;
      
      mutations.forEach((mutation) => {
        // Check for body or root element changes
        if (mutation.type === 'childList') {
          mutation.removedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (node.tagName === 'BODY' || node.contains(document.body)) {
                shouldRecreate = true;
              }
            }
          });
          
          // Check if our overlay was removed
          if (!document.body.contains(this.phoneFrameOverlay?.overlayElement)) {
            shouldRecreate = true;
          }
        }
      });
      
      if (shouldRecreate) {
        // Debounce the recreation to avoid rapid recreation
        clearTimeout(this.routeChangeTimeout);
        this.routeChangeTimeout = setTimeout(() => {
          this.recreateOverlay();
        }, 100);
      }
    });
    
    this.observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: false
    });
  }

  handleRouteChange() {
    // Delay recreation to allow SPA to finish rendering
    clearTimeout(this.routeChangeTimeout);
    this.routeChangeTimeout = setTimeout(() => {
      this.recreateOverlay();
    }, 300);
  }

  recreateOverlay() {
    // Only recreate if enabled and device is selected
    if (!this.isEnabled || !this.currentDevice) return;
    
    // Recreate the overlay
    if (this.phoneFrameOverlay) {
      this.phoneFrameOverlay.destroy();
    }
    
    // Ensure body exists
    if (!document.body) {
      setTimeout(() => this.recreateOverlay(), 100);
      return;
    }
    
    this.createPhoneFrameOverlay();
    this.updatePhoneFrame();
  }

  createStyleElement() {
    this.styleElement = document.createElement('style');
    this.styleElement.id = 'safe-area-simulator-styles';
    document.head.appendChild(this.styleElement);
  }

  setupMessageListener() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'updateSafeArea') {
        this.isEnabled = message.enabled;
        this.currentInsets = message.insets;
        this.currentDevice = message.device || this.currentDevice;
        
        // Save device frame preference
        if (message.showDeviceFrame !== undefined) {
          chrome.storage.sync.set({ showDeviceFrame: message.showDeviceFrame });
        }
        
        this.updateStyles();
        this.updatePhoneFrame();
        sendResponse({ success: true });
      }
      return true;
    });
  }

  injectInitialStyles() {
    // Add base styles that might be useful for developers
    const baseStyles = `
/* Safe Area Simulator - Base Styles */
.safe-area-simulator-debug {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 999999;
}

.safe-area-simulator-debug::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-width: var(--safe-area-inset-top, 0) var(--safe-area-inset-right, 0) var(--safe-area-inset-bottom, 0) var(--safe-area-inset-left, 0);
  background: 
    linear-gradient(to bottom, rgba(255, 59, 48, 0.1) 0, rgba(255, 59, 48, 0.1) var(--safe-area-inset-top, 0), transparent var(--safe-area-inset-top, 0)),
    linear-gradient(to top, rgba(255, 59, 48, 0.1) 0, rgba(255, 59, 48, 0.1) var(--safe-area-inset-bottom, 0), transparent var(--safe-area-inset-bottom, 0)),
    linear-gradient(to right, rgba(255, 59, 48, 0.1) 0, rgba(255, 59, 48, 0.1) var(--safe-area-inset-left, 0), transparent var(--safe-area-inset-left, 0)),
    linear-gradient(to left, rgba(255, 59, 48, 0.1) 0, rgba(255, 59, 48, 0.1) var(--safe-area-inset-right, 0), transparent var(--safe-area-inset-right, 0));
}

/* Utility classes for developers */
.safe-area-inset-top {
  padding-top: env(safe-area-inset-top, var(--safe-area-inset-top, 0)) !important;
}

.safe-area-inset-bottom {
  padding-bottom: env(safe-area-inset-bottom, var(--safe-area-inset-bottom, 0)) !important;
}

.safe-area-inset-left {
  padding-left: env(safe-area-inset-left, var(--safe-area-inset-left, 0)) !important;
}

.safe-area-inset-right {
  padding-right: env(safe-area-inset-right, var(--safe-area-inset-right, 0)) !important;
}

.safe-area-inset-all {
  padding: 
    env(safe-area-inset-top, var(--safe-area-inset-top, 0))
    env(safe-area-inset-right, var(--safe-area-inset-right, 0))
    env(safe-area-inset-bottom, var(--safe-area-inset-bottom, 0))
    env(safe-area-inset-left, var(--safe-area-inset-left, 0)) !important;
}
`;

    this.styleElement.textContent = baseStyles;
    this.updateStyles();
  }

  updateStyles() {
    if (!this.styleElement) return;

    const { top, bottom, left, right } = this.isEnabled ? this.currentInsets : { top: 0, bottom: 0, left: 0, right: 0 };

    // Create CSS custom properties
    const safeAreaStyles = `
:root {
  --safe-area-inset-top: ${top}px;
  --safe-area-inset-bottom: ${bottom}px;
  --safe-area-inset-left: ${left}px;
  --safe-area-inset-right: ${right}px;
}

/* Override env() function for safe area insets */
html {
  --safe-area-inset-top: ${top}px;
  --safe-area-inset-bottom: ${bottom}px;
  --safe-area-inset-left: ${left}px;
  --safe-area-inset-right: ${right}px;
}
`;

    // Update existing styles
    const existingStyles = this.styleElement.textContent;
    const baseStylesMatch = existingStyles.match(/(\/\* Safe Area Simulator - Base Styles \*\/[\s\S]*?)(:root {|$)/);
    
    if (baseStylesMatch) {
      const baseStyles = baseStylesMatch[1];
      this.styleElement.textContent = baseStyles + safeAreaStyles;
    } else {
      this.styleElement.textContent += safeAreaStyles;
    }

    // Add or remove debug overlay
    this.updateDebugOverlay();

    // Update phone frame overlay
    this.updatePhoneFrame();

    // Dispatch custom event for websites that want to listen for safe area changes
    const event = new CustomEvent('safeAreaInsetsChanged', {
      detail: {
        top,
        bottom,
        left,
        right,
        enabled: this.isEnabled
      }
    });
    document.dispatchEvent(event);

    // Log for debugging
    if (this.isEnabled) {
      console.log(`[Safe Area Simulator] Applied insets: top=${top}px, bottom=${bottom}px, left=${left}px, right=${right}px`);
    } else {
      console.log('[Safe Area Simulator] Disabled - insets reset to 0');
    }
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    
    if (this.routeChangeTimeout) {
      clearTimeout(this.routeChangeTimeout);
      this.routeChangeTimeout = null;
    }
    
    if (this.phoneFrameOverlay) {
      this.phoneFrameOverlay.destroy();
      this.phoneFrameOverlay = null;
    }
    
    if (this.styleElement) {
      this.styleElement.remove();
      this.styleElement = null;
    }
    
    // Remove debug overlay
    const debugOverlay = document.querySelector('.safe-area-simulator-debug');
    if (debugOverlay) {
      debugOverlay.remove();
    }
  }

  // Handle extension disable/unload
  handleExtensionDisable() {
    this.destroy();
  }

  updatePhoneFrame() {
    if (!this.phoneFrameOverlay) return;
    
    try {
      chrome.storage.sync.get(['showDeviceFrame'], (result) => {
        const showFrame = result.showDeviceFrame || false;
        
        if (this.isEnabled && this.currentDevice && showFrame) {
          if (this.phoneFrameOverlay && typeof this.phoneFrameOverlay.updateDevice === 'function') {
            this.phoneFrameOverlay.updateDevice(this.currentDevice, this.currentInsets);
          }
        } else {
          if (this.phoneFrameOverlay && typeof this.phoneFrameOverlay.hide === 'function') {
            this.phoneFrameOverlay.hide();
          }
        }
      });
    } catch (error) {
      console.error('[Safe Area Simulator] Error updating phone frame:', error);
    }
  }

  updateDebugOverlay() {
    const existingOverlay = document.querySelector('.safe-area-simulator-debug');
    
    if (this.isEnabled && (this.currentInsets.top > 0 || this.currentInsets.bottom > 0 || this.currentInsets.left > 0 || this.currentInsets.right > 0)) {
      if (!existingOverlay) {
        const overlay = document.createElement('div');
        overlay.className = 'safe-area-simulator-debug';
        overlay.title = 'Safe Area Simulator - Visual Guide';
        document.body.appendChild(overlay);
      }
    } else {
      if (existingOverlay) {
        existingOverlay.remove();
      }
    }
  }
}

// Initialize the injector
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new SafeAreaInjector();
  });
} else {
  new SafeAreaInjector();
} 