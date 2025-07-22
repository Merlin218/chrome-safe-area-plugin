// Simple Phone Frame Overlay for Safe Area Simulator
import type { SafeAreaInsets, PhoneFrameOptions, Device } from '../types/global.js';
import DEVICES from './devices.js';

class PhoneFrameSimple {
  private options: PhoneFrameOptions;
  private currentDevice: string | null = null;
  private currentInsets: SafeAreaInsets = { top: 0, bottom: 0, left: 0, right: 0 };
  public overlayElement: HTMLElement | null = null;
  private frameElement: HTMLElement | null = null;
  private screenElement: HTMLElement | null = null;
  
  constructor(options: Partial<PhoneFrameOptions> = {}) {
    this.options = {
      scale: 0.5,
      showSafeArea: true,
      showDeviceFrame: true,
      theme: 'light',
      ...options
    };
    
    this.init();
  }

  private init(): void {
    this.createOverlayContainer();
  }

  private createOverlayContainer(): void {
    // Create main overlay container
    this.overlayElement = document.createElement('div');
    this.overlayElement.className = 'phone-frame-overlay';
    this.overlayElement.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 9999;
      pointer-events: none;
      transition: all 0.3s ease;
      display: none;
    `;
    
    // Create frame container
    this.frameElement = document.createElement('div');
    this.frameElement.className = 'phone-frame';
    this.frameElement.style.cssText = `
      position: relative;
      transition: all 0.3s ease;
      border-radius: 20px;
      background: linear-gradient(145deg, #1f1f1f, #2d2d2d);
      box-shadow: 0 8px 32px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.2);
    `;
    
    // Create screen overlay
    this.screenElement = document.createElement('div');
    this.screenElement.className = 'phone-screen-overlay';
    this.screenElement.style.cssText = `
      position: absolute;
      top: 12px;
      left: 8px;
      right: 8px;
      bottom: 12px;
      background: #000;
      border-radius: 16px;
      overflow: hidden;
      pointer-events: none;
    `;
    
    this.frameElement.appendChild(this.screenElement);
    this.overlayElement.appendChild(this.frameElement);
    document.body.appendChild(this.overlayElement);
  }

  updateDevice(deviceKey: string, safeAreaInsets: SafeAreaInsets): void {
    if (!DEVICES[deviceKey]) {
      this.hide();
      return;
    }

    this.currentDevice = deviceKey;
    this.currentInsets = safeAreaInsets;
    this.renderPhoneFrame();
    this.show();
  }

  private renderPhoneFrame(): void {
    if (!this.currentDevice) return;
    
    const device = DEVICES[this.currentDevice];
    if (!device) return;
    
    const { appearance } = device;
    const scale = this.options.scale;
    
    // Calculate dimensions
    const phoneWidth = appearance.width * scale;
    const phoneHeight = appearance.height * scale;
    
    // Update frame container
    if (this.frameElement) {
      this.frameElement.style.width = `${phoneWidth}px`;
      this.frameElement.style.height = `${phoneHeight}px`;
      this.frameElement.style.borderRadius = `${appearance.borderRadius * scale}px`;
    }
    
    // Update screen overlay
    const screenPadding = Math.min(phoneWidth, phoneHeight) * 0.05;
    if (this.screenElement) {
      this.screenElement.style.top = `${screenPadding}px`;
      this.screenElement.style.left = `${screenPadding}px`;
      this.screenElement.style.right = `${screenPadding}px`;
      this.screenElement.style.bottom = `${screenPadding}px`;
      this.screenElement.style.borderRadius = `${appearance.screenRadius * scale}px`;
    }
    
    // Render notch/dynamic island
    this.renderNotch(device);
    
    // Render safe areas
    this.renderSafeAreas();
  }

  private renderNotch(device: Device): void {
    if (!this.frameElement) return;
    
    // Remove existing notch
    const existingNotch = this.frameElement.querySelector('.phone-notch');
    if (existingNotch) {
      existingNotch.remove();
    }
    
    const { appearance } = device;
    if (!appearance.notch || appearance.notch.type === 'none') return;
    
    const { notch } = appearance;
    const scale = this.options.scale;
    
    const notchElement = document.createElement('div');
    notchElement.className = 'phone-notch';
    notchElement.style.cssText = `
      position: absolute;
      z-index: 10;
    `;
    
    switch (notch.type) {
      case 'dynamic-island':
        notchElement.style.cssText += `
          width: ${(notch.width || 30) * scale}px;
          height: ${(notch.height || 8) * scale}px;
          border-radius: ${(notch.radius || 4) * scale}px;
          top: ${12 * scale}px;
          left: 50%;
          transform: translateX(-50%);
          background: #1a1a1a;
          border: 1px solid #333;
        `;
        break;
        
      case 'notch':
        notchElement.style.cssText += `
          width: ${(notch.width || 40) * scale}px;
          height: ${(notch.height || 8) * scale}px;
          border-radius: 0 0 ${(notch.radius || 4) * scale}px ${(notch.radius || 4) * scale}px;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          background: #000;
        `;
        break;
        
      case 'small-notch':
        notchElement.style.cssText += `
          width: ${(notch.width || 32) * scale}px;
          height: ${(notch.height || 6) * scale}px;
          border-radius: 0 0 ${(notch.radius || 3) * scale}px ${(notch.radius || 3) * scale}px;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          background: #000;
        `;
        break;
        
      case 'punch-hole':
        notchElement.style.cssText += `
          width: ${(notch.width || 8) * scale}px;
          height: ${(notch.height || 8) * scale}px;
          border-radius: 50%;
          top: ${10 * scale}px;
          left: 50%;
          transform: translateX(-50%);
          background: #000;
        `;
        break;
        
      case 'forehead':
        notchElement.style.cssText += `
          width: 100%;
          height: ${(notch.height || 6) * scale}px;
          top: 0;
          left: 0;
          background: #000;
        `;
        break;
    }
    
    this.frameElement.appendChild(notchElement);
  }

  private renderSafeAreas(): void {
    if (!this.screenElement || !this.options.showSafeArea) return;
    
    // Remove existing safe area indicators
    const existingSafeAreas = this.screenElement.querySelectorAll('.safe-area-indicator');
    existingSafeAreas.forEach(el => el.remove());
    
    const scale = this.options.scale;
    
    // Top safe area
    if (this.currentInsets.top > 0) {
      const topIndicator = document.createElement('div');
      topIndicator.className = 'safe-area-indicator safe-area-top';
      topIndicator.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: ${this.currentInsets.top * scale}px;
        background: rgba(255, 59, 48, 0.3);
        border-bottom: 1px solid rgba(255, 59, 48, 0.6);
        z-index: 5;
      `;
      this.screenElement.appendChild(topIndicator);
    }
    
    // Bottom safe area
    if (this.currentInsets.bottom > 0) {
      const bottomIndicator = document.createElement('div');
      bottomIndicator.className = 'safe-area-indicator safe-area-bottom';
      bottomIndicator.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: ${this.currentInsets.bottom * scale}px;
        background: rgba(255, 59, 48, 0.3);
        border-top: 1px solid rgba(255, 59, 48, 0.6);
        z-index: 5;
      `;
      this.screenElement.appendChild(bottomIndicator);
    }
    
    // Left safe area
    if (this.currentInsets.left > 0) {
      const leftIndicator = document.createElement('div');
      leftIndicator.className = 'safe-area-indicator safe-area-left';
      leftIndicator.style.cssText = `
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        width: ${this.currentInsets.left * scale}px;
        background: rgba(255, 59, 48, 0.3);
        border-right: 1px solid rgba(255, 59, 48, 0.6);
        z-index: 5;
      `;
      this.screenElement.appendChild(leftIndicator);
    }
    
    // Right safe area
    if (this.currentInsets.right > 0) {
      const rightIndicator = document.createElement('div');
      rightIndicator.className = 'safe-area-indicator safe-area-right';
      rightIndicator.style.cssText = `
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        width: ${this.currentInsets.right * scale}px;
        background: rgba(255, 59, 48, 0.3);
        border-left: 1px solid rgba(255, 59, 48, 0.6);
        z-index: 5;
      `;
      this.screenElement.appendChild(rightIndicator);
    }
  }

  private show(): void {
    if (this.overlayElement && this.options.showDeviceFrame) {
      this.overlayElement.style.display = 'block';
    }
  }

  hide(): void {
    if (this.overlayElement) {
      this.overlayElement.style.display = 'none';
    }
  }

  destroy(): void {
    if (this.overlayElement && this.overlayElement.parentNode) {
      this.overlayElement.parentNode.removeChild(this.overlayElement);
    }
    this.overlayElement = null;
    this.frameElement = null;
    this.screenElement = null;
  }
} 