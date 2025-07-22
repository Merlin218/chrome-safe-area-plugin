// PhoneFrameSimple implementation for Chrome extension
import type { SafeAreaInsets } from '../types/global.js';

class PhoneFrameSimple {
  public overlayElement: HTMLElement | null = null;
  private options: any;

  constructor(options: any = {}) {
    this.options = {
      scale: 0.4,
      showSafeArea: true,
      showDeviceFrame: true,
      theme: 'light',
      ...options
    };
    console.log('[Safe Area Simulator] PhoneFrameSimple initialized');
  }

  destroy(): void {
    if (this.overlayElement && this.overlayElement.parentNode) {
      this.overlayElement.parentNode.removeChild(this.overlayElement);
    }
    this.overlayElement = null;
  }

  updateDevice(device: string, insets: SafeAreaInsets): void {
    console.log('[Safe Area Simulator] PhoneFrameSimple device updated:', device, insets);
    // Basic implementation for visual feedback
    // In a full implementation, this would create device frame overlay
  }

  hide(): void {
    if (this.overlayElement) {
      this.overlayElement.style.display = 'none';
    }
  }

  show(): void {
    if (this.overlayElement) {
      this.overlayElement.style.display = 'block';
    }
  }
}

// Export for module systems
export { PhoneFrameSimple };
export default PhoneFrameSimple; 