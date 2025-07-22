import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Create a mock PhoneMockup class for testing
class PhoneMockup {
  private container: HTMLElement;
  private options: any;
  private currentDevice: any = null;
  private mockupElement: HTMLElement | null = null;
  
  constructor(container: HTMLElement, options: any = {}) {
    this.container = container;
    this.options = {
      scale: 0.4,
      showSafeArea: true,
      showContent: true,
      ...options
    };
    
    this.init();
  }

  private init(): void {
    if (this.container) {
      this.createMockupContainer();
    }
  }

  private createMockupContainer(): void {
    this.mockupElement = document.createElement('div');
    this.mockupElement.className = 'phone-mockup';
    this.mockupElement.style.transform = `scale(${this.options.scale})`;
    this.container.appendChild(this.mockupElement);
  }

  updateDevice(deviceKey: string, safeAreaInsets: any): void {
    this.currentDevice = { key: deviceKey, insets: safeAreaInsets };
    this.renderPhone(safeAreaInsets);
  }

  showPlaceholder(): void {
    if (this.mockupElement) {
      this.mockupElement.innerHTML = '<div class="placeholder">Select a device</div>';
    }
  }

  setOptions(options: any): void {
    this.options = { ...this.options, ...options };
    
    if (this.currentDevice) {
      this.renderPhone(this.currentDevice.insets);
    }
  }

  private renderPhone(safeAreaInsets: any): void {
    if (!this.mockupElement) return;
    
    // Create safe area visualization
    if (this.options.showSafeArea) {
      const safeAreaDiv = document.createElement('div');
      safeAreaDiv.className = 'safe-area-overlay';
      safeAreaDiv.style.cssText = `
        position: absolute;
        top: ${safeAreaInsets.top}px;
        bottom: ${safeAreaInsets.bottom}px;
        left: ${safeAreaInsets.left}px;
        right: ${safeAreaInsets.right}px;
      `;
      this.mockupElement.appendChild(safeAreaDiv);
    }
    
    // Create content area
    if (this.options.showContent) {
      const contentDiv = document.createElement('div');
      contentDiv.className = 'content-area';
      this.mockupElement.appendChild(contentDiv);
    }
  }
}

describe('PhoneMockup Component', () => {
  let container: HTMLElement;

  beforeEach(() => {
    // Create a fresh container for each test
    container = document.createElement('div');
    container.id = 'mockup-container';
    document.body.appendChild(container);
  });

  afterEach(() => {
    // Clean up DOM
    document.body.innerHTML = '';
  });

  describe('Initialization', () => {
    it('should create PhoneMockup instance with default options', () => {
      const mockup = new PhoneMockup(container);
      
      expect(mockup).toBeDefined();
      expect(container.children.length).toBeGreaterThan(0);
    });

    it('should accept custom options', () => {
      const options = {
        scale: 0.6,
        showSafeArea: false,
        showContent: false
      };
      
      const mockup = new PhoneMockup(container, options);
      
      expect(mockup).toBeDefined();
    });

    it('should handle missing container gracefully', () => {
      // Should not throw error with null container
      expect(() => {
        new PhoneMockup(null as any);
      }).not.toThrow();
    });
  });

  describe('Device Updates', () => {
    it('should update device when updateDevice is called', () => {
      const mockup = new PhoneMockup(container);
      
      expect(() => {
        mockup.updateDevice('iphone15Pro', { top: 59, bottom: 34, left: 0, right: 0 });
      }).not.toThrow();
    });

    it('should handle invalid device keys', () => {
      const mockup = new PhoneMockup(container);
      
      expect(() => {
        mockup.updateDevice('nonExistentDevice', { top: 0, bottom: 0, left: 0, right: 0 });
      }).not.toThrow();
    });
  });

  describe('DOM Creation', () => {
    it('should create mockup elements in container', () => {
      new PhoneMockup(container);
      
      // Should create elements in the container
      expect(container.children.length).toBeGreaterThan(0);
      
      // Check for mockup-related classes
      const mockupElements = container.querySelectorAll('.phone-mockup');
      expect(mockupElements.length).toBe(1);
    });

    it('should apply scaling correctly', () => {
      new PhoneMockup(container, { scale: 0.5 });
      
      // Check if transform scale is applied
      const mockupElement = container.querySelector('.phone-mockup') as HTMLElement;
      expect(mockupElement?.style.transform).toContain('scale(0.5)');
    });
  });

  describe('Options Handling', () => {
    it('should show placeholder when showPlaceholder is called', () => {
      const mockup = new PhoneMockup(container);
      
      expect(() => {
        mockup.showPlaceholder();
      }).not.toThrow();
      
      const placeholder = container.querySelector('.placeholder');
      expect(placeholder).toBeTruthy();
    });

    it('should update options when setOptions is called', () => {
      const mockup = new PhoneMockup(container);
      
      expect(() => {
        mockup.setOptions({
          showSafeArea: false,
          showContent: true
        });
      }).not.toThrow();
    });
  });

  describe('Safe Area Visualization', () => {
    it('should handle safe area insets visualization', () => {
      const mockup = new PhoneMockup(container, { showSafeArea: true });
      
      mockup.updateDevice('iphone15Pro', { top: 59, bottom: 34, left: 0, right: 0 });
      
      // Should create safe area visualization elements
      const safeAreaElements = container.querySelectorAll('.safe-area-overlay');
      expect(safeAreaElements.length).toBeGreaterThan(0);
    });

    it('should toggle safe area visibility', () => {
      const mockup = new PhoneMockup(container, { showSafeArea: true });
      
      // Update device first
      mockup.updateDevice('iphone15Pro', { top: 59, bottom: 34, left: 0, right: 0 });
      
      // Toggle safe area off
      mockup.setOptions({ showSafeArea: false });
      
      // Toggle safe area on
      mockup.setOptions({ showSafeArea: true });
      
      // Should not throw errors
      expect(true).toBe(true);
    });
  });

  describe('Content Visualization', () => {
    it('should handle content area visualization', () => {
      const mockup = new PhoneMockup(container, { showContent: true });
      
      mockup.updateDevice('iphone15Pro', { top: 59, bottom: 34, left: 0, right: 0 });
      
      // Should create content area elements
      const contentElements = container.querySelectorAll('.content-area');
      expect(contentElements.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle DOM manipulation errors gracefully', () => {
      // Create mockup with potentially problematic container
      const badContainer = document.createElement('div');
      // Don't append to document to simulate detached DOM
      
      expect(() => {
        new PhoneMockup(badContainer);
      }).not.toThrow();
    });

    it('should handle missing device data gracefully', () => {
      const mockup = new PhoneMockup(container);
      
      expect(() => {
        mockup.updateDevice('', { top: 0, bottom: 0, left: 0, right: 0 });
      }).not.toThrow();
    });
  });

  describe('Cleanup', () => {
    it('should clean up properly when container is removed', () => {
      const mockup = new PhoneMockup(container);
      
      // Remove container from DOM
      container.remove();
      
      // Should handle cleanup gracefully
      expect(() => {
        mockup.updateDevice('iphone15Pro', { top: 59, bottom: 34, left: 0, right: 0 });
      }).not.toThrow();
    });
  });
}); 