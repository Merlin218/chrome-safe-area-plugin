import type { SafeAreaInsets, SafeAreaMessage } from '../types/global.js';
import { DEVICES } from '../src/shared/devices.js';
import { createSafeAreaCSS, BASE_SAFE_AREA_STYLES, createSafeAreaEvent, debounce } from '../src/shared/utils.js';
import { PhoneFrameSimple } from '../src/phone-frame-simple.js';
import { HardwareRegionsRenderer } from '../src/hardware-renderer.js';

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_start',
  main(ctx) {
    console.log('Content script initialized');
    
    const injector = new SafeAreaInjector();
    
    // Clean up when the content script is invalidated
    ctx.onInvalidated(() => {
      injector.handleExtensionDisable();
    });
  }
});

class SafeAreaInjector {
  private isEnabled: boolean = false;
  private currentDevice: string | null = null;
  private currentInsets: SafeAreaInsets = { top: 0, bottom: 0, left: 0, right: 0 };
  private styleElement: HTMLStyleElement | null = null;
  private phoneFrameOverlay: PhoneFrameSimple | null = null;
  private hardwareRenderer: HardwareRegionsRenderer | null = null;
  private debugMode: boolean = false;
  private showHardwareRegions: boolean = false;
  private observer: MutationObserver | null = null;
  private routeChangeTimeout: number | null = null;
  private debugOverlayObserver: MutationObserver | null = null;
  private overlayRecreationTimeout: number | null = null;
  
  constructor() {
    this.init();
  }

  private init(): void {
    // Setup message listener immediately
    this.setupMessageListener();
    
    // Wait for DOM to be ready for other operations
    this.waitForDOM(() => {
      this.loadStoredState();
      this.createStyleElement();
      this.injectInitialStyles();
      this.createPhoneFrameOverlay();
      this.createHardwareRenderer();
      this.setupRouteObserver();
    });
  }

  private waitForDOM(callback: () => void): void {
    if (document.head && document.body) {
      callback();
    } else if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      // DOM is ready but head/body might not be fully constructed
      setTimeout(() => this.waitForDOM(callback), 10);
    }
  }

  private async loadStoredState(): Promise<void> {
    try {
      const result = await chrome.storage.sync.get(['enabled', 'device', 'customInsets', 'showDeviceFrame', 'showHardwareRegions', 'debugMode']);
      this.isEnabled = result.enabled || false;
      this.currentDevice = result.device || null;
      this.debugMode = result.debugMode || false;
      this.showHardwareRegions = result.showHardwareRegions !== false; // Default to true
      
      if (this.isEnabled && result.device && DEVICES[result.device]) {
        const device = DEVICES[result.device];
        if (device) {
          this.currentInsets = device.safeAreaInsets;
        }
      }
    } catch (error) {
      console.error('Error loading stored state:', error);
    }
  }

  private createPhoneFrameOverlay(): void {
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

  private createHardwareRenderer(): void {
    try {
      // Clean up existing hardware renderer if it exists
      if (this.hardwareRenderer) {
        this.hardwareRenderer.destroy();
      }
      this.hardwareRenderer = new HardwareRegionsRenderer();
      console.log('[Safe Area Simulator] Hardware regions renderer initialized');
    } catch (error) {
      console.error('[Safe Area Simulator] Error creating hardware renderer:', error);
    }
  }

  private setupRouteObserver(): void {
    // Watch for SPA route changes using History API
    this.observeHistoryChanges();
    
    // Watch for URL changes
    this.observeUrlChanges();
    
    // Watch for DOM mutations that might indicate route changes
    this.observeDomChanges();
    
    // Setup periodic check for debug overlay integrity
    this.setupPeriodicCheck();
  }

  private observeHistoryChanges(): void {
    // Override pushState and replaceState to detect route changes
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = (...args: Parameters<typeof history.pushState>) => {
      console.log('[Safe Area Simulator] pushState detected');
      originalPushState.apply(history, args);
      this.handleRouteChange();
    };
    
    history.replaceState = (...args: Parameters<typeof history.replaceState>) => {
      console.log('[Safe Area Simulator] replaceState detected');
      originalReplaceState.apply(history, args);
      this.handleRouteChange();
    };
    
    // Listen for multiple navigation events
    window.addEventListener('popstate', () => {
      console.log('[Safe Area Simulator] popstate detected');
      this.handleRouteChange();
    });
    
    // Listen for hashchange events (for hash-based routing)
    window.addEventListener('hashchange', () => {
      console.log('[Safe Area Simulator] hashchange detected');
      this.handleRouteChange();
    });
    
    // Listen for focus events (user might navigate back to tab)
    window.addEventListener('focus', () => {
      console.log('[Safe Area Simulator] window focus detected');
      this.handleRouteChange();
    });
  }

  private observeUrlChanges(): void {
    let lastUrl = location.href;
    let lastPathname = location.pathname;
    let lastHash = location.hash;
    
    // Check for URL changes more frequently
    setInterval(() => {
      const currentUrl = location.href;
      const currentPathname = location.pathname;
      const currentHash = location.hash;
      
      if (currentUrl !== lastUrl || currentPathname !== lastPathname || currentHash !== lastHash) {
        console.log('[Safe Area Simulator] Route change detected:', { from: lastUrl, to: currentUrl });
        lastUrl = currentUrl;
        lastPathname = currentPathname;
        lastHash = currentHash;
        this.handleRouteChange();
      }
    }, 100); // Check every 100ms for more responsive detection
  }

  private observeDomChanges(): void {
    // Use MutationObserver to detect significant DOM changes
    this.observer = new MutationObserver((mutations: MutationRecord[]) => {
      let shouldRecreate = false;
      let shouldRecreateDebugOverlay = false;
      
      mutations.forEach((mutation) => {
        // Check for body or root element changes
        if (mutation.type === 'childList') {
          mutation.removedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              
              // Check if body was removed/replaced
              if (element.tagName === 'BODY' || element.contains(document.body)) {
                console.log('[Safe Area Simulator] Body element change detected');
                shouldRecreate = true;
              }
              
              // Check if documentElement's children were modified
              if (element.parentNode === document.documentElement) {
                console.log('[Safe Area Simulator] DocumentElement child change detected');
                shouldRecreateDebugOverlay = true;
              }
              
              // Check if our debug overlay was removed
              if (element.classList?.contains('safe-area-simulator-debug')) {
                console.log('[Safe Area Simulator] Debug overlay directly removed');
                shouldRecreateDebugOverlay = true;
              }
              
              // Check if any removed element contains our debug overlay
              if (element.querySelector && element.querySelector('.safe-area-simulator-debug')) {
                console.log('[Safe Area Simulator] Container with debug overlay removed');
                shouldRecreateDebugOverlay = true;
              }
            }
          });
          
          // Also check added nodes for framework re-renders
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              
              // If a new body or major container was added, ensure overlay exists
              if (element.tagName === 'BODY' || element.tagName === 'MAIN' || element.id === 'root' || element.id === 'app') {
                console.log('[Safe Area Simulator] Major container added, checking overlay');
                shouldRecreateDebugOverlay = true;
              }
            }
          });
          
          // Check if our phone frame overlay was removed
          if (this.phoneFrameOverlay?.overlayElement && !document.body.contains(this.phoneFrameOverlay.overlayElement)) {
            shouldRecreate = true;
          }
        }
      });
      
      // Handle debug overlay recreation immediately if needed
      if (shouldRecreateDebugOverlay && this.isEnabled) {
        console.log('[Safe Area Simulator] Triggering debug overlay recreation');
        // Immediate synchronous recreation for critical scenarios
        this.updateDebugOverlay();
        // Also trigger debounced recreation as backup
        this.debouncedRecreateDebugOverlay();
      }
      
      if (shouldRecreate) {
        // Debounce the recreation to avoid rapid recreation
        if (this.routeChangeTimeout) {
          clearTimeout(this.routeChangeTimeout);
        }
        this.routeChangeTimeout = window.setTimeout(() => {
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

  private setupPeriodicCheck(): void {
    // High-frequency check for debug overlay integrity
    setInterval(() => {
      if (this.isEnabled && (this.currentInsets.top > 0 || this.currentInsets.bottom > 0 || this.currentInsets.left > 0 || this.currentInsets.right > 0)) {
        const existingOverlay = document.querySelector('.safe-area-simulator-debug');
        if (!existingOverlay) {
          console.log('[Safe Area Simulator] Debug overlay missing, recreating...');
          this.updateDebugOverlay();
        }
      }
    }, 100); // Check every 100ms for much faster recovery
    
    // Additional requestAnimationFrame-based check for maximum responsiveness
    const animationFrameCheck = () => {
      if (this.isEnabled && (this.currentInsets.top > 0 || this.currentInsets.bottom > 0 || this.currentInsets.left > 0 || this.currentInsets.right > 0)) {
        const existingOverlay = document.querySelector('.safe-area-simulator-debug');
        if (!existingOverlay) {
          this.updateDebugOverlay();
        }
      }
      requestAnimationFrame(animationFrameCheck);
    };
    requestAnimationFrame(animationFrameCheck);
  }

  private debouncedRecreateDebugOverlay(): void {
    // Clear any existing recreation timeout to prevent rapid recreation
    if (this.overlayRecreationTimeout) {
      clearTimeout(this.overlayRecreationTimeout);
    }
    
    // Immediate recreation for critical scenarios - no debouncing delay
    this.updateDebugOverlay();
    
    // Also schedule a follow-up check to ensure it sticks
    this.overlayRecreationTimeout = window.setTimeout(() => {
      this.updateDebugOverlay();
    }, 10);
  }

  private handleRouteChange(): void {
    console.log('[Safe Area Simulator] Handling route change');
    
    // Immediately check if overlay still exists
    const existingOverlay = document.querySelector('.safe-area-simulator-debug');
    if (this.isEnabled && !existingOverlay && (this.currentInsets.top > 0 || this.currentInsets.bottom > 0 || this.currentInsets.left > 0 || this.currentInsets.right > 0)) {
      console.log('[Safe Area Simulator] Overlay missing after route change, recreating immediately');
      this.updateDebugOverlay();
    }
    
    // Delay recreation to allow SPA to finish rendering
    if (this.routeChangeTimeout) {
      clearTimeout(this.routeChangeTimeout);
    }
    this.routeChangeTimeout = window.setTimeout(() => {
      this.recreateOverlay();
      // Force update debug overlay after route change
      this.updateDebugOverlay();
    }, 100); // Reduced delay for faster response
    
    // Also check again after a longer delay in case the SPA does late rendering
    setTimeout(() => {
      const laterOverlay = document.querySelector('.safe-area-simulator-debug');
      if (this.isEnabled && !laterOverlay && (this.currentInsets.top > 0 || this.currentInsets.bottom > 0 || this.currentInsets.left > 0 || this.currentInsets.right > 0)) {
        console.log('[Safe Area Simulator] Late overlay check - recreating');
        this.updateDebugOverlay();
      }
    }, 1000);
  }

  private recreateOverlay(): void {
    // Only recreate if enabled and device is selected
    if (!this.isEnabled || !this.currentDevice) return;
    
    // Recreate the phone frame overlay
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
    
    // Recreate hardware renderer
    if (this.hardwareRenderer) {
      this.hardwareRenderer.destroy();
      this.hardwareRenderer = null;
    }
    this.createHardwareRenderer();
    this.updateHardwareRegions();
    
    // Also recreate debug overlay if needed
    this.updateDebugOverlay();
  }

  private createStyleElement(): void {
    this.styleElement = document.createElement('style');
    this.styleElement.id = 'safe-area-simulator-styles';
    document.head.appendChild(this.styleElement);
  }

  private setupMessageListener(): void {
    chrome.runtime.onMessage.addListener((
      message: SafeAreaMessage, 
      _sender: chrome.runtime.MessageSender, 
      sendResponse: (response: any) => void
    ) => {
      if (message.action === 'updateSafeArea') {
        this.isEnabled = message.enabled || false;
        this.currentInsets = message.insets || { top: 0, bottom: 0, left: 0, right: 0 };
        this.currentDevice = message.device || this.currentDevice;
        
        // Save device frame preference
        if (message.showDeviceFrame !== undefined) {
          chrome.storage.sync.set({ showDeviceFrame: message.showDeviceFrame });
        }
        
        // Handle hardware regions setting
        if (message.settings?.showHardwareRegions !== undefined) {
          this.showHardwareRegions = message.settings.showHardwareRegions;
          chrome.storage.sync.set({ showHardwareRegions: this.showHardwareRegions });
        }
        
        this.updateStyles();
        this.updatePhoneFrame();
        this.updateHardwareRegions();
        sendResponse({ success: true });
      }
      return true;
    });
  }

  private injectInitialStyles(): void {
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

    if (this.styleElement) {
      this.styleElement.textContent = baseStyles;
    }
    this.updateStyles();
  }

  private updateStyles(): void {
    if (!this.styleElement) return;


    const currentDevice = DEVICES[this.currentDevice || 'none'];

    const { top, bottom, left, right } = this.isEnabled ? currentDevice.safeAreaInsets : { top: 0, bottom: 0, left: 0, right: 0 };

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
    const existingStyles = this.styleElement.textContent || '';
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

    // Update hardware regions
    this.updateHardwareRegions();

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

  private updateHardwareRegions(): void {
    if (!this.hardwareRenderer) return;
    
    try {
      // Set visibility based on enabled state and showHardwareRegions setting
      const shouldShow = this.isEnabled && this.showHardwareRegions && this.currentDevice;
      this.hardwareRenderer.setVisible(shouldShow);
      
      if (shouldShow && this.currentDevice && DEVICES[this.currentDevice]) {
        const device = DEVICES[this.currentDevice];
        this.hardwareRenderer.updateDevice(device);
        console.log(`[Safe Area Simulator] Updated hardware regions for ${device.name}`);
      }
    } catch (error) {
      console.error('[Safe Area Simulator] Error updating hardware regions:', error);
    }
  }

  private destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    
    if (this.debugOverlayObserver) {
      this.debugOverlayObserver.disconnect();
      this.debugOverlayObserver = null;
    }
    
    if (this.routeChangeTimeout) {
      clearTimeout(this.routeChangeTimeout);
      this.routeChangeTimeout = null;
    }
    
    if (this.overlayRecreationTimeout) {
      clearTimeout(this.overlayRecreationTimeout);
      this.overlayRecreationTimeout = null;
    }
    
    if (this.phoneFrameOverlay) {
      this.phoneFrameOverlay.destroy();
      this.phoneFrameOverlay = null;
    }
    
    if (this.hardwareRenderer) {
      this.hardwareRenderer.destroy();
      this.hardwareRenderer = null;
    }
    
    if (this.styleElement) {
      this.styleElement.remove();
      this.styleElement = null;
    }
    
    // Remove debug overlay from documentElement
    const debugOverlays = document.querySelectorAll('.safe-area-simulator-debug');
    debugOverlays.forEach(overlay => overlay.remove());
  }

  // Handle extension disable/unload
  handleExtensionDisable(): void {
    this.destroy();
  }

  private updatePhoneFrame(): void {
    if (!this.phoneFrameOverlay) return;
    
    try {
      chrome.storage.sync.get(['showDeviceFrame'], (result) => {
        const showFrame = result.showDeviceFrame || false;
        
        if (this.isEnabled && this.currentDevice && showFrame) {
          if (this.phoneFrameOverlay && typeof this.phoneFrameOverlay.updateDevice === 'function') {
            const device = DEVICES[this.currentDevice || 'none'];
            this.phoneFrameOverlay.updateDevice(this.currentDevice, device.safeAreaInsets);
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

  private updateDebugOverlay(): void {
    const existingOverlay = document.querySelector('.safe-area-simulator-debug');
    const shouldShowOverlay = this.isEnabled && (this.currentInsets.top > 0 || this.currentInsets.bottom > 0 || this.currentInsets.left > 0 || this.currentInsets.right > 0);
    
    if (shouldShowOverlay) {
      if (!existingOverlay) {
        console.log('[Safe Area Simulator] Creating new debug overlay');
        const overlay = document.createElement('div');
        overlay.className = 'safe-area-simulator-debug';
        overlay.title = 'Safe Area Simulator - Visual Guide';
        overlay.setAttribute('data-safe-area-overlay', 'true');
        overlay.style.cssText = 'position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important; pointer-events: none !important; z-index: 999999 !important;';
        
        // Try multiple insertion strategies for maximum compatibility
        let insertionSuccess = false;
        
        // Strategy 1: Insert into body first (more stable for SPAs)
        if (document.body && !insertionSuccess) {
          try {
            document.body.appendChild(overlay);
            insertionSuccess = true;
            this.setupOverlayProtection();
          } catch (error) {
            console.warn('[Safe Area Simulator] Failed to insert overlay into body:', error);
          }
        }
        
        // Strategy 2: Insert before the first child of documentElement
        if (!insertionSuccess && document.documentElement.firstChild) {
          try {
            document.documentElement.insertBefore(overlay, document.documentElement.firstChild);
            insertionSuccess = true;
            this.setupOverlayProtection();
          } catch (error) {
            console.warn('[Safe Area Simulator] Failed to insert overlay before first child:', error);
          }
        }
        
        // Strategy 3: Append to documentElement
        if (!insertionSuccess) {
          try {
            document.documentElement.appendChild(overlay);
            insertionSuccess = true;
            this.setupOverlayProtection();
          } catch (error) {
            console.error('[Safe Area Simulator] All overlay insertion strategies failed:', error);
          }
        }
        
        if (!insertionSuccess) {
          console.error('[Safe Area Simulator] Could not insert debug overlay into DOM');
        }
      }
    } else {
      if (existingOverlay) {
        existingOverlay.remove();
      }
    }
  }

  private setupOverlayProtection(): void {
    // Clear any existing observer
    if (this.debugOverlayObserver) {
      this.debugOverlayObserver.disconnect();
    }
    
    this.debugOverlayObserver = new MutationObserver((mutations) => {
      let overlayRemoved = false;
      let containerRemoved = false;
      let needsRecreation = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.removedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              
              // Check if our specific overlay was removed
              if (element.classList?.contains('safe-area-simulator-debug')) {
                overlayRemoved = true;
              }
              
              // Check if container holding our overlay was removed
              if (element.querySelector && element.querySelector('.safe-area-simulator-debug')) {
                containerRemoved = true;
              }
              
              // Check for body or documentElement changes
              if (element.tagName === 'BODY' || element === document.documentElement) {
                needsRecreation = true;
              }
            }
          });
        }
      });
      
      if (overlayRemoved || containerRemoved || needsRecreation) {
        console.log('[Safe Area Simulator] Overlay protection triggered, recreating overlay...');
        // Immediate synchronous recreation
        this.updateDebugOverlay();
        // Also trigger debounced recreation as backup
        this.debouncedRecreateDebugOverlay();
      }
    });
    
    // Observe both documentElement and body for maximum protection
    this.debugOverlayObserver.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
    
    if (document.body) {
      this.debugOverlayObserver.observe(document.body, {
        childList: true,
        subtree: false
      });
    }
  }
}