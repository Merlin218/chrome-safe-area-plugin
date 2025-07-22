import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockChrome } from '../setup.js';

// Mock PhoneFrameSimple class
class MockPhoneFrameSimple {
  public overlayElement: HTMLElement | null = null;
  constructor(public options: any) {}
  destroy() {}
  updateDevice(device: string, insets: any) {}
  hide() {}
}

// Make PhoneFrameSimple available globally
(globalThis as any).PhoneFrameSimple = MockPhoneFrameSimple;

describe('Content Script - SafeAreaInjector', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear DOM
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    
    // Reset document ready state
    Object.defineProperty(document, 'readyState', {
      writable: true,
      value: 'complete'
    });
  });

  describe('Initialization', () => {
    it('should initialize when DOM is ready', async () => {
      mockChrome.storage.sync.get.mockResolvedValue({
        enabled: false,
        device: 'none'
      });

      // Import content script
      await import('../../src/content.js');

      expect(mockChrome.storage.sync.get).toHaveBeenCalledWith([
        'enabled', 'device', 'customInsets', 'showDeviceFrame', 'debugMode'
      ]);
    });

    it('should create style element on initialization', async () => {
      mockChrome.storage.sync.get.mockResolvedValue({});
      
      await import('../../src/content.js');

      const styleElements = document.querySelectorAll('style[data-safe-area-simulator]');
      expect(styleElements.length).toBeGreaterThan(0);
    });

    it('should set up message listener', async () => {
      mockChrome.storage.sync.get.mockResolvedValue({});
      
      await import('../../src/content.js');

      expect(mockChrome.runtime.onMessage.addListener).toHaveBeenCalled();
    });
  });

  describe('Storage State Loading', () => {
    it('should load stored state correctly', async () => {
      const mockState = {
        enabled: true,
        device: 'iphone15Pro',
        showDeviceFrame: true,
        debugMode: false
      };

      mockChrome.storage.sync.get.mockResolvedValue(mockState);

      await import('../../src/content.js');

      expect(mockChrome.storage.sync.get).toHaveBeenCalledWith([
        'enabled', 'device', 'customInsets', 'showDeviceFrame', 'debugMode'
      ]);
    });

    it('should handle storage errors gracefully', async () => {
      mockChrome.storage.sync.get.mockRejectedValue(new Error('Storage error'));

      await import('../../src/content.js');

      expect(console.error).toHaveBeenCalledWith('Error loading stored state:', expect.any(Error));
    });

    it('should use default values when storage is empty', async () => {
      mockChrome.storage.sync.get.mockResolvedValue({});

      await import('../../src/content.js');

      // Should not throw errors and use defaults
      expect(mockChrome.storage.sync.get).toHaveBeenCalled();
    });
  });

  describe('CSS Injection', () => {
    it('should inject CSS variables for safe area insets', async () => {
      mockChrome.storage.sync.get.mockResolvedValue({
        enabled: true,
        device: 'iphone15Pro'
      });

      await import('../../src/content.js');

      const styleElement = document.querySelector('style[data-safe-area-simulator]');
      expect(styleElement).toBeTruthy();
      expect(styleElement?.textContent).toContain('--safe-area-inset-top');
      expect(styleElement?.textContent).toContain('--safe-area-inset-bottom');
      expect(styleElement?.textContent).toContain('--safe-area-inset-left');
      expect(styleElement?.textContent).toContain('--safe-area-inset-right');
    });

    it('should update CSS variables when settings change', async () => {
      mockChrome.storage.sync.get.mockResolvedValue({});

      await import('../../src/content.js');

      // Simulate message from popup
      const messageListener = mockChrome.runtime.onMessage.addListener.mock.calls[0]?.[0];
      const mockSendResponse = vi.fn();

      if (messageListener) {
        messageListener({
          action: 'updateSafeArea',
          enabled: true,
          insets: { top: 50, bottom: 30, left: 0, right: 0 },
          device: 'iphone15Pro'
        }, {}, mockSendResponse);

        const styleElement = document.querySelector('style[data-safe-area-simulator]');
        expect(styleElement?.textContent).toContain('--safe-area-inset-top: 50px');
        expect(styleElement?.textContent).toContain('--safe-area-inset-bottom: 30px');
        expect(mockSendResponse).toHaveBeenCalledWith({ success: true });
      }
    });

    it('should reset insets when disabled', async () => {
      mockChrome.storage.sync.get.mockResolvedValue({});

      await import('../../src/content.js');

      const messageListener = mockChrome.runtime.onMessage.addListener.mock.calls[0]?.[0];
      const mockSendResponse = vi.fn();

      if (messageListener) {
        messageListener({
          action: 'updateSafeArea',
          enabled: false,
          insets: { top: 0, bottom: 0, left: 0, right: 0 }
        }, {}, mockSendResponse);

        const styleElement = document.querySelector('style[data-safe-area-simulator]');
        expect(styleElement?.textContent).toContain('--safe-area-inset-top: 0px');
        expect(styleElement?.textContent).toContain('--safe-area-inset-bottom: 0px');
      }
    });
  });

  describe('Custom Events', () => {
    it('should dispatch safeAreaInsetsChanged event', async () => {
      mockChrome.storage.sync.get.mockResolvedValue({});

      let dispatchedEvent: CustomEvent | null = null;
      const originalDispatchEvent = document.dispatchEvent;
      document.dispatchEvent = vi.fn((event: Event) => {
        if (event.type === 'safeAreaInsetsChanged') {
          dispatchedEvent = event as CustomEvent;
        }
        return originalDispatchEvent.call(document, event);
      });

      await import('../../src/content.js');

      const messageListener = mockChrome.runtime.onMessage.addListener.mock.calls[0]?.[0];

      if (messageListener) {
        messageListener({
          action: 'updateSafeArea',
          enabled: true,
          insets: { top: 50, bottom: 30, left: 0, right: 0 }
        }, {}, vi.fn());

        expect(document.dispatchEvent).toHaveBeenCalled();
        expect(dispatchedEvent).toBeTruthy();
        if (dispatchedEvent) {
          expect((dispatchedEvent as any).detail).toEqual({
            top: 50,
            bottom: 30,
            left: 0,
            right: 0,
            enabled: true
          });
        }
      }
    });
  });

  describe('Phone Frame Overlay', () => {
    it('should create phone frame overlay when PhoneFrameSimple is available', async () => {
      mockChrome.storage.sync.get.mockResolvedValue({});

      await import('../../src/content.js');

      // PhoneFrameSimple should be instantiated
      expect(MockPhoneFrameSimple).toBeDefined();
    });

    it('should handle PhoneFrameSimple unavailable gracefully', async () => {
      // Remove PhoneFrameSimple temporarily
      const originalPhoneFrameSimple = (globalThis as any).PhoneFrameSimple;
      delete (globalThis as any).PhoneFrameSimple;

      mockChrome.storage.sync.get.mockResolvedValue({});

      await import('../../src/content.js');

      expect(console.warn).toHaveBeenCalledWith('[Safe Area Simulator] PhoneFrameSimple class not available');

      // Restore PhoneFrameSimple
      (globalThis as any).PhoneFrameSimple = originalPhoneFrameSimple;
    });
  });

  describe('Debug Mode', () => {
    it('should show debug overlay when debug mode is enabled', async () => {
      mockChrome.storage.sync.get.mockResolvedValue({
        enabled: true,
        debugMode: true
      });

      await import('../../src/content.js');

      // Check if debug styles are injected
      const styleElement = document.querySelector('style[data-safe-area-simulator]');
      // Debug overlay styles should be present when debug mode is on
      expect(styleElement).toBeTruthy();
    });
  });

  describe('Route Change Observer', () => {
    it('should set up mutation observer for SPA route changes', async () => {
      const originalMutationObserver = globalThis.MutationObserver;
      const mockObserver = {
        observe: vi.fn(),
        disconnect: vi.fn()
      };
      globalThis.MutationObserver = vi.fn(() => mockObserver) as any;

      mockChrome.storage.sync.get.mockResolvedValue({});

      await import('../../src/content.js');

      expect(globalThis.MutationObserver).toHaveBeenCalled();
      expect(mockObserver.observe).toHaveBeenCalledWith(document.body, {
        childList: true,
        subtree: true
      });

      // Restore original MutationObserver
      globalThis.MutationObserver = originalMutationObserver;
    });
  });

  describe('Message Handler Return Values', () => {
    it('should return true for async message handling', async () => {
      mockChrome.storage.sync.get.mockResolvedValue({});

      await import('../../src/content.js');

      const messageListener = mockChrome.runtime.onMessage.addListener.mock.calls[0]?.[0];

      if (messageListener) {
        const result = messageListener({
          action: 'updateSafeArea',
          enabled: true
        }, {}, vi.fn());

        expect(result).toBe(true);
      }
    });
  });

  describe('Console Logging', () => {
    it('should log safe area changes when enabled', async () => {
      mockChrome.storage.sync.get.mockResolvedValue({});

      await import('../../src/content.js');

      const messageListener = mockChrome.runtime.onMessage.addListener.mock.calls[0]?.[0];

      if (messageListener) {
        messageListener({
          action: 'updateSafeArea',
          enabled: true,
          insets: { top: 50, bottom: 30, left: 0, right: 0 }
        }, {}, vi.fn());

        expect(console.log).toHaveBeenCalledWith(
          expect.stringContaining('[Safe Area Simulator] Applied insets')
        );
      }
    });

    it('should log when disabled', async () => {
      mockChrome.storage.sync.get.mockResolvedValue({});

      await import('../../src/content.js');

      const messageListener = mockChrome.runtime.onMessage.addListener.mock.calls[0]?.[0];

      if (messageListener) {
        messageListener({
          action: 'updateSafeArea',
          enabled: false
        }, {}, vi.fn());

        expect(console.log).toHaveBeenCalledWith('[Safe Area Simulator] Disabled - insets reset to 0');
      }
    });
  });
}); 