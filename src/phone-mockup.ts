// Phone Mockup Component for Safe Area Simulator
import type { SafeAreaInsets, MockupOptions, Device, DeviceAppearance } from '../types/global.js';
import DEVICES from './devices.js';

class PhoneMockup {
  private container: HTMLElement;
  private options: MockupOptions & { scale: number };
  private currentDevice: Device | null = null;
  private mockupElement: HTMLElement | null = null;
  
  constructor(container: HTMLElement, options: Partial<MockupOptions & { scale: number }> = {}) {
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
    this.createMockupContainer();
  }

  private createMockupContainer(): void {
    this.mockupElement = document.createElement('div');
    this.mockupElement.className = 'phone-mockup';
    this.mockupElement.style.cssText = `
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 20px auto;
      transform-origin: center;
    `;
    
    this.container.appendChild(this.mockupElement);
  }

  updateDevice(deviceKey: string, safeAreaInsets: SafeAreaInsets): void {
    const device = DEVICES[deviceKey];
    if (!device || !device.appearance) {
      this.showPlaceholder();
      return;
    }

    this.currentDevice = device;
    this.renderPhone(safeAreaInsets);
  }

  showPlaceholder(): void {
    if (!this.mockupElement) return;
    
    this.mockupElement.innerHTML = `
      <div style="
        width: 120px;
        height: 200px;
        background: linear-gradient(145deg, #f0f0f0, #d0d0d0);
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #666;
        font-size: 12px;
        text-align: center;
        border: 2px solid #e0e0e0;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      ">
        Select Device<br>to Preview
      </div>
    `;
  }

  private renderPhone(safeAreaInsets: SafeAreaInsets): void {
    if (!this.currentDevice || !this.mockupElement) return;
    
    const { appearance } = this.currentDevice;
    const scale = this.options.scale;
    
    // Calculate scaled dimensions
    const phoneWidth = appearance.width * scale;
    const phoneHeight = appearance.height * scale;
    const screenWidth = appearance.screenWidth * scale;
    const screenHeight = appearance.screenHeight * scale;
    
    // Create gradient based on device colors
    const gradient = this.createGradient(appearance.colors);
    
    this.mockupElement.innerHTML = `
      <div class="phone-container" style="
        position: relative;
        width: ${phoneWidth}px;
        height: ${phoneHeight}px;
        background: ${gradient};
        border-radius: ${appearance.borderRadius * scale}px;
        box-shadow: 
          0 8px 32px rgba(0,0,0,0.3),
          0 4px 16px rgba(0,0,0,0.2),
          inset 0 1px 2px rgba(255,255,255,0.1);
        padding: ${(appearance.width - appearance.screenWidth) * scale / 2}px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      ">
        ${this.renderNotchOrCutout(appearance, scale)}
        
        <div class="phone-screen" style="
          position: relative;
          width: ${screenWidth}px;
          height: ${screenHeight}px;
          background: #000;
          border-radius: ${appearance.screenRadius * scale}px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.1);
        ">
          ${this.renderSafeAreas(safeAreaInsets, screenWidth, screenHeight, scale)}
          ${this.renderContent(screenWidth, screenHeight)}
        </div>
        
        ${this.renderHomeIndicator(appearance, scale)}
        ${this.renderBrandElements(appearance, scale)}
      </div>
    `;
  }

  private createGradient(colors: string[]): string {
    // Add null/undefined check for colors parameter
    if (!colors || !Array.isArray(colors) || colors.length === 0) {
      return '#667eea'; // Default fallback color
    }
    
    if (colors.length === 1) {
      return colors[0] || '#667eea';
    }
    return `linear-gradient(145deg, ${colors.join(', ')})`;
  }

  private renderNotchOrCutout(appearance: DeviceAppearance, scale: number): string {
    if (!appearance.notch || appearance.notch.type === 'none') {
      return '';
    }

    const { notch } = appearance;
    
    const notchWidth = (notch.width || 30) * scale;
    const notchHeight = (notch.height || 8) * scale;
    const notchRadius = (notch.radius || 4) * scale;

    let notchStyle = `
      position: absolute;
      background: #000;
      z-index: 10;
    `;

    switch (notch.type) {
      case 'notch':
        notchStyle += `
          width: ${notchWidth}px;
          height: ${notchHeight}px;
          border-radius: 0 0 ${notchRadius}px ${notchRadius}px;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
        `;
        break;
        
      case 'dynamic-island':
        notchStyle += `
          width: ${notchWidth}px;
          height: ${notchHeight}px;
          border-radius: ${notchRadius}px;
          top: 8px;
          left: 50%;
          transform: translateX(-50%);
          background: #1a1a1a;
          border: 1px solid #333;
        `;
        break;
        
      case 'small-notch':
        notchStyle += `
          width: ${notchWidth}px;
          height: ${notchHeight}px;
          border-radius: 0 0 ${notchRadius}px ${notchRadius}px;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
        `;
        break;
        
      case 'punch-hole':
        if ((notch.position || 'center-top') === 'center-top') {
          notchStyle += `
            width: ${notchWidth}px;
            height: ${notchHeight}px;
            border-radius: 50%;
            top: 8px;
            left: 50%;
            transform: translateX(-50%);
          `;
        }
        break;
        
      case 'forehead':
        notchStyle += `
          width: 100%;
          height: ${notchHeight}px;
          top: 0;
          left: 0;
          border-radius: 0;
        `;
        break;
    }

    return `<div class="phone-notch" style="${notchStyle}"></div>`;
  }

  private renderSafeAreas(safeAreaInsets: SafeAreaInsets, screenWidth: number, screenHeight: number, scale: number): string {
    if (!this.options.showSafeArea) return '';
    
    let safeAreaHtml = '';
    
    // Top safe area
    if (safeAreaInsets.top > 0) {
      safeAreaHtml += `
        <div class="safe-area-top" style="
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: ${safeAreaInsets.top * scale}px;
          background: rgba(255, 59, 48, 0.3);
          border-bottom: 1px solid rgba(255, 59, 48, 0.6);
          z-index: 5;
        "></div>
      `;
    }
    
    // Bottom safe area
    if (safeAreaInsets.bottom > 0) {
      safeAreaHtml += `
        <div class="safe-area-bottom" style="
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: ${safeAreaInsets.bottom * scale}px;
          background: rgba(255, 59, 48, 0.3);
          border-top: 1px solid rgba(255, 59, 48, 0.6);
          z-index: 5;
        "></div>
      `;
    }
    
    // Left safe area
    if (safeAreaInsets.left > 0) {
      safeAreaHtml += `
        <div class="safe-area-left" style="
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          width: ${safeAreaInsets.left * scale}px;
          background: rgba(255, 59, 48, 0.3);
          border-right: 1px solid rgba(255, 59, 48, 0.6);
          z-index: 5;
        "></div>
      `;
    }
    
    // Right safe area
    if (safeAreaInsets.right > 0) {
      safeAreaHtml += `
        <div class="safe-area-right" style="
          position: absolute;
          top: 0;
          bottom: 0;
          right: 0;
          width: ${safeAreaInsets.right * scale}px;
          background: rgba(255, 59, 48, 0.3);
          border-left: 1px solid rgba(255, 59, 48, 0.6);
          z-index: 5;
        "></div>
      `;
    }
    
    return safeAreaHtml;
  }

  private renderContent(screenWidth: number, screenHeight: number): string {
    if (!this.options.showContent) return '';
    
    return `
      <div class="phone-content" style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #fff;
        text-align: center;
        font-size: 10px;
        opacity: 0.7;
        pointer-events: none;
        z-index: 3;
      ">
        <div style="margin-bottom: 8px;">📱 Safe Area</div>
        <div style="font-size: 8px; opacity: 0.8;">Preview</div>
      </div>
    `;
  }

  private renderHomeIndicator(appearance: DeviceAppearance, scale: number): string {
    if (!appearance.homeIndicator) return '';
    
    const { homeIndicator } = appearance;
    const position = homeIndicator.position || 'bottom';
    
    let indicatorStyle = `
      position: absolute;
      background: rgba(255, 255, 255, 0.8);
      border-radius: ${homeIndicator.radius * scale}px;
    `;
    
    if (position === 'bottom') {
      indicatorStyle += `
        width: ${homeIndicator.width * scale}px;
        height: ${homeIndicator.height * scale}px;
        bottom: 6px;
        left: 50%;
        transform: translateX(-50%);
      `;
    }
    
    return `<div class="home-indicator" style="${indicatorStyle}"></div>`;
  }

  private renderBrandElements(appearance: DeviceAppearance, scale: number): string {
    let brandHtml = '';
    
    // Add brand-specific elements
    switch (appearance.brand) {
      case 'apple':
        brandHtml += `
          <div class="brand-element apple-logo" style="
            position: absolute;
            top: 50%;
            left: ${appearance.width * scale / 2 - 6}px;
            transform: translateY(-50%);
            width: 12px;
            height: 12px;
            background: rgba(255,255,255,0.1);
            border-radius: 50%;
            opacity: 0.3;
          "></div>
        `;
        break;
        
      case 'samsung':
        brandHtml += `
          <div class="brand-element samsung-logo" style="
            position: absolute;
            bottom: 4px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 6px;
            color: rgba(255,255,255,0.2);
            opacity: 0.5;
          ">SAMSUNG</div>
        `;
        break;
        
      case 'google':
        brandHtml += `
          <div class="brand-element google-logo" style="
            position: absolute;
            bottom: 4px;
            right: 8px;
            font-size: 6px;
            color: rgba(255,255,255,0.2);
            opacity: 0.5;
          ">G</div>
        `;
        break;
    }
    
    return brandHtml;
  }

  setOptions(options: Partial<MockupOptions>): void {
    this.options = { ...this.options, ...options };
    
    // Re-render if we have a current device
    if (this.currentDevice) {
      this.renderPhone({ top: 0, bottom: 0, left: 0, right: 0 });
    }
  }
} 