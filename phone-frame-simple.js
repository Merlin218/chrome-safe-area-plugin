// Simple Phone Frame Overlay for Safe Area Simulator
class PhoneFrameSimple {
  constructor(options = {}) {
    this.options = {
      scale: 0.5,
      showSafeArea: true,
      showDeviceFrame: true,
      theme: 'light',
      ...options
    };
    
    this.currentDevice = null;
    this.currentInsets = { top: 0, bottom: 0, left: 0, right: 0 };
    this.overlayElement = null;
    this.frameElement = null;
    this.screenElement = null;
    
    this.init();
  }

  init() {
    this.createOverlayContainer();
  }

  createOverlayContainer() {
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

  updateDevice(deviceKey, safeAreaInsets) {
    if (!DEVICES[deviceKey]) {
      this.hide();
      return;
    }

    this.currentDevice = deviceKey;
    this.currentInsets = safeAreaInsets;
    this.renderPhoneFrame();
    this.show();
  }

  renderPhoneFrame() {
    const device = DEVICES[this.currentDevice];
    const { appearance } = device;
    const scale = this.options.scale;
    
    // Calculate dimensions
    const phoneWidth = appearance.width * scale;
    const phoneHeight = appearance.height * scale;
    
    // Update frame container
    this.frameElement.style.width = `${phoneWidth}px`;
    this.frameElement.style.height = `${phoneHeight}px`;
    this.frameElement.style.borderRadius = `${appearance.borderRadius * scale}px`;
    
    // Update screen overlay
    const screenPadding = Math.min(phoneWidth, phoneHeight) * 0.05;
    this.screenElement.style.top = `${screenPadding}px`;
    this.screenElement.style.left = `${screenPadding}px`;
    this.screenElement.style.right = `${screenPadding}px`;
    this.screenElement.style.bottom = `${screenPadding}px`;
    this.screenElement.style.borderRadius = `${appearance.screenRadius * scale}px`;
    
    // Render notch/dynamic island
    this.renderNotch(device);
    
    // Render safe areas
    this.renderSafeAreas();
  }

  renderNotch(device) {
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
          width: ${notch.width * scale}px;
          height: ${notch.height * scale}px;
          border-radius: ${notch.radius * scale}px;
          top: ${12 * scale}px;
          left: 50%;
          transform: translateX(-50%);
          background: #1a1a1a;
          border: 1px solid #333;
        `;
        break;
        
      case 'notch':
        notchElement.style.cssText += `
          width: ${notch.width * scale}px;
          height: ${notch.height * scale}px;
          border-radius: 0 0 ${notch.radius * scale}px ${notch.radius * scale}px;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          background: #000;
        `;
        break;
        
      case 'punch-hole':
        notchElement.style.cssText += `
          width: ${notch.width * scale}px;
          height: ${notch.height * scale}px;
          border-radius: 50%;
          top: ${16 * scale}px;
          left: 50%;
          transform: translateX(-50%);
          background: #000;
        `;
        break;
    }
    
    this.frameElement.appendChild(notchElement);
  }

  renderSafeAreas() {
    // Remove existing safe area elements
    const existingAreas = this.screenElement.querySelectorAll('.safe-area-indicator');
    existingAreas.forEach(el => el.remove());
    
    if (!this.options.showSafeArea) return;
    
    const { top, bottom, left, right } = this.currentInsets;
    const scale = this.options.scale;
    
    // Top safe area
    if (top > 0) {
      const topArea = document.createElement('div');
      topArea.className = 'safe-area-indicator';
      topArea.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: ${top * scale}px;
        background: rgba(255, 59, 48, 0.3);
        border-bottom: 1px dashed rgba(255, 59, 48, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        color: white;
        font-family: Arial, sans-serif;
      `;
      topArea.innerHTML = `<span style="background: rgba(0,0,0,0.7); padding: 2px 4px; border-radius: 2px;">${top}px</span>`;
      this.screenElement.appendChild(topArea);
    }
    
    // Bottom safe area
    if (bottom > 0) {
      const bottomArea = document.createElement('div');
      bottomArea.className = 'safe-area-indicator';
      bottomArea.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: ${bottom * scale}px;
        background: rgba(255, 59, 48, 0.3);
        border-top: 1px dashed rgba(255, 59, 48, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        color: white;
        font-family: Arial, sans-serif;
      `;
      bottomArea.innerHTML = `<span style="background: rgba(0,0,0,0.7); padding: 2px 4px; border-radius: 2px;">${bottom}px</span>`;
      this.screenElement.appendChild(bottomArea);
    }
    
    // Left safe area
    if (left > 0) {
      const leftArea = document.createElement('div');
      leftArea.className = 'safe-area-indicator';
      leftArea.style.cssText = `
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        width: ${left * scale}px;
        background: rgba(255, 59, 48, 0.3);
        border-right: 1px dashed rgba(255, 59, 48, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        color: white;
        font-family: Arial, sans-serif;
      `;
      leftArea.innerHTML = `<span style="background: rgba(0,0,0,0.7); padding: 2px 4px; border-radius: 2px; writing-mode: vertical-rl;">${left}px</span>`;
      this.screenElement.appendChild(leftArea);
    }
    
    // Right safe area
    if (right > 0) {
      const rightArea = document.createElement('div');
      rightArea.className = 'safe-area-indicator';
      rightArea.style.cssText = `
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        width: ${right * scale}px;
        background: rgba(255, 59, 48, 0.3);
        border-left: 1px dashed rgba(255, 59, 48, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        color: white;
        font-family: Arial, sans-serif;
      `;
      rightArea.innerHTML = `<span style="background: rgba(0,0,0,0.7); padding: 2px 4px; border-radius: 2px; writing-mode: vertical-rl;">${right}px</span>`;
      this.screenElement.appendChild(rightArea);
    }
  }

  setOptions(options) {
    this.options = { ...this.options, ...options };
    if (this.currentDevice) {
      this.renderPhoneFrame();
    }
  }

  show() {
    if (this.overlayElement) {
      this.overlayElement.style.display = 'block';
    }
  }

  hide() {
    if (this.overlayElement) {
      this.overlayElement.style.display = 'none';
    }
  }

  destroy() {
    if (this.overlayElement && this.overlayElement.parentNode) {
      this.overlayElement.remove();
      this.overlayElement = null;
    }
  }

  isVisible() {
    return this.overlayElement && this.overlayElement.style.display !== 'none';
  }

  isInDOM() {
    return this.overlayElement && document.body.contains(this.overlayElement);
  }

  // Check if overlay is still in DOM and recreate if needed
  ensureOverlayInDOM() {
    if (this.overlayElement && !document.body.contains(this.overlayElement)) {
      // Overlay was removed, recreate it
      this.destroy();
      this.createOverlayContainer();
      
      if (this.currentDevice) {
        this.renderPhoneFrame();
      }
    }
  }
}

// Export for use in other files
if (typeof window !== 'undefined') {
  window.PhoneFrameSimple = PhoneFrameSimple;
}