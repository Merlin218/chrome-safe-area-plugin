// Phone Mockup Component for Safe Area Simulator
class PhoneMockup {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      scale: 0.4,
      showSafeArea: true,
      showContent: true,
      ...options
    };
    
    this.currentDevice = null;
    this.mockupElement = null;
    
    this.init();
  }

  init() {
    this.createMockupContainer();
  }

  createMockupContainer() {
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

  updateDevice(deviceKey, safeAreaInsets) {
    if (!DEVICES[deviceKey] || !DEVICES[deviceKey].appearance) {
      this.showPlaceholder();
      return;
    }

    this.currentDevice = DEVICES[deviceKey];
    this.renderPhone(safeAreaInsets);
  }

  showPlaceholder() {
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

  renderPhone(safeAreaInsets) {
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

  createGradient(colors) {
    // Add null/undefined check for colors parameter
    if (!colors || !Array.isArray(colors) || colors.length === 0) {
      return '#667eea'; // Default fallback color
    }
    
    if (colors.length === 1) {
      return colors[0];
    }
    return `linear-gradient(145deg, ${colors.join(', ')})`;
  }

  renderNotchOrCutout(appearance, scale) {
    if (!appearance.notch || appearance.notch.type === 'none') {
      return '';
    }

    const { notch } = appearance;
    const isLandscape = appearance.orientation === 'landscape';
    
    const notchWidth = notch.width * scale;
    const notchHeight = notch.height * scale;
    const notchRadius = notch.radius * scale;

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
        
      case 'dynamic-island':
        if (isLandscape && notch.position === 'left') {
          notchStyle += `
            width: ${notchWidth}px;
            height: ${notchHeight}px;
            border-radius: ${notchRadius}px;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            background: #1a1a1a;
            border: 1px solid #333;
          `;
        } else {
          notchStyle += `
            width: ${notchWidth}px;
            height: ${notchHeight}px;
            border-radius: ${notchRadius}px;
            top: ${notchHeight * 0.5}px;
            left: 50%;
            transform: translateX(-50%);
            background: #1a1a1a;
            border: 1px solid #333;
          `;
        }
        break;
        
      case 'punch-hole':
        notchStyle += `
          width: ${notchWidth}px;
          height: ${notchHeight}px;
          border-radius: 50%;
          top: ${notchHeight}px;
          left: 50%;
          transform: translateX(-50%);
          background: #000;
          border: 1px solid #333;
        `;
        break;
        
      case 'forehead':
        notchStyle += `
          width: ${notchWidth}px;
          height: ${notchHeight}px;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(to bottom, #2a2a2a, #1a1a1a);
        `;
        break;
    }

    return `<div class="phone-notch" style="${notchStyle}"></div>`;
  }

  renderSafeAreas(safeAreaInsets, screenWidth, screenHeight, scale) {
    if (!this.options.showSafeArea) return '';

    // Add null/undefined check for safeAreaInsets parameter
    if (!safeAreaInsets) {
      safeAreaInsets = { top: 0, bottom: 0, left: 0, right: 0 };
    }

    const topHeight = (safeAreaInsets.top || 0) * scale;
    const bottomHeight = (safeAreaInsets.bottom || 0) * scale;
    const leftWidth = (safeAreaInsets.left || 0) * scale;
    const rightWidth = (safeAreaInsets.right || 0) * scale;

    return `
      <!-- Top Safe Area -->
      ${topHeight > 0 ? `
        <div style="
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: ${topHeight}px;
          background: rgba(255, 59, 48, 0.3);
          border-bottom: 1px dashed rgba(255, 59, 48, 0.6);
          z-index: 5;
        "></div>
      ` : ''}
      
      <!-- Bottom Safe Area -->
      ${bottomHeight > 0 ? `
        <div style="
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: ${bottomHeight}px;
          background: rgba(255, 59, 48, 0.3);
          border-top: 1px dashed rgba(255, 59, 48, 0.6);
          z-index: 5;
        "></div>
      ` : ''}
      
      <!-- Left Safe Area -->
      ${leftWidth > 0 ? `
        <div style="
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          width: ${leftWidth}px;
          background: rgba(255, 59, 48, 0.3);
          border-right: 1px dashed rgba(255, 59, 48, 0.6);
          z-index: 5;
        "></div>
      ` : ''}
      
      <!-- Right Safe Area -->
      ${rightWidth > 0 ? `
        <div style="
          position: absolute;
          top: 0;
          bottom: 0;
          right: 0;
          width: ${rightWidth}px;
          background: rgba(255, 59, 48, 0.3);
          border-left: 1px dashed rgba(255, 59, 48, 0.6);
          z-index: 5;
        "></div>
      ` : ''}
    `;
  }

  renderContent(screenWidth, screenHeight) {
    if (!this.options.showContent) return '';

    return `
      <div style="
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        flex-direction: column;
        z-index: 1;
      ">
        <!-- Status Bar -->
        <div style="
          height: 20px;
          background: rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 8px;
          font-size: 8px;
          color: white;
          font-weight: 500;
        ">
          <span>9:41</span>
          <div style="display: flex; gap: 2px; align-items: center;">
            <div style="width: 12px; height: 6px; border: 1px solid white; border-radius: 1px;">
              <div style="width: 8px; height: 4px; background: white; border-radius: 1px;"></div>
            </div>
          </div>
        </div>
        
        <!-- App Content -->
        <div style="
          flex: 1;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        ">
          <!-- Header -->
          <div style="
            background: rgba(255,255,255,0.15);
            padding: 8px;
            border-radius: 6px;
            backdrop-filter: blur(10px);
            text-align: center;
            color: white;
            font-size: 10px;
            font-weight: 600;
          ">
            Safe Area Demo
          </div>
          
          <!-- Content Cards -->
          <div style="
            background: rgba(255,255,255,0.1);
            border-radius: 6px;
            padding: 8px;
            color: white;
            font-size: 8px;
            line-height: 1.4;
            flex: 1;
          ">
            <div style="font-weight: 600; margin-bottom: 4px;">Content Area</div>
            <div style="opacity: 0.8;">This area respects safe area insets and won't be covered by device notches or home indicators.</div>
          </div>
        </div>
        
        <!-- Navigation Bar -->
        <div style="
          height: 16px;
          background: rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        ">
          <div style="width: 6px; height: 6px; background: rgba(255,255,255,0.6); border-radius: 50%;"></div>
          <div style="width: 6px; height: 6px; background: rgba(255,255,255,0.3); border-radius: 50%;"></div>
          <div style="width: 6px; height: 6px; background: rgba(255,255,255,0.3); border-radius: 50%;"></div>
        </div>
      </div>
    `;
  }

  renderHomeIndicator(appearance, scale) {
    if (!appearance.homeIndicator) return '';

    const { homeIndicator } = appearance;
    const isLandscape = appearance.orientation === 'landscape';
    
    const indicatorWidth = homeIndicator.width * scale;
    const indicatorHeight = homeIndicator.height * scale;
    const indicatorRadius = homeIndicator.radius * scale;

    let style = `
      position: absolute;
      background: rgba(255, 255, 255, 0.6);
      border-radius: ${indicatorRadius}px;
    `;

    if (isLandscape && homeIndicator.position === 'bottom') {
      style += `
        width: ${indicatorHeight}px;
        height: ${indicatorWidth}px;
        bottom: 50%;
        right: 8px;
        transform: translateY(50%);
      `;
    } else {
      style += `
        width: ${indicatorWidth}px;
        height: ${indicatorHeight}px;
        bottom: 8px;
        left: 50%;
        transform: translateX(-50%);
      `;
    }

    return `<div class="home-indicator" style="${style}"></div>`;
  }

  renderBrandElements(appearance, scale) {
    if (appearance.brand === 'apple') {
      return `
        <div style="
          position: absolute;
          top: 50%;
          left: -${8 * scale}px;
          transform: translateY(-50%);
          width: ${2 * scale}px;
          height: ${12 * scale}px;
          background: rgba(0,0,0,0.3);
          border-radius: ${1 * scale}px;
        "></div>
        <div style="
          position: absolute;
          top: 35%;
          left: -${8 * scale}px;
          transform: translateY(-50%);
          width: ${2 * scale}px;
          height: ${8 * scale}px;
          background: rgba(0,0,0,0.3);
          border-radius: ${1 * scale}px;
        "></div>
        <div style="
          position: absolute;
          top: 30%;
          right: -${8 * scale}px;
          transform: translateY(-50%);
          width: ${2 * scale}px;
          height: ${20 * scale}px;
          background: rgba(0,0,0,0.3);
          border-radius: ${1 * scale}px;
        "></div>
      `;
    }
    
    return '';
  }

  setOptions(options) {
    this.options = { ...this.options, ...options };
    if (this.currentDevice) {
      // Get current safe area insets from the device or use default
      const safeAreaInsets = this.currentDevice.safeAreaInsets || { top: 0, bottom: 0, left: 0, right: 0 };
      this.renderPhone(safeAreaInsets);
    }
  }

  destroy() {
    if (this.mockupElement) {
      this.mockupElement.remove();
    }
  }
}

// Export for use in other files
if (typeof window !== 'undefined') {
  window.PhoneMockup = PhoneMockup;
} 