// Phone Frame Overlay for Safe Area Simulator
class PhoneFrameOverlay {
  constructor(options = {}) {
    this.options = {
      scale: 0.6,
      showSafeArea: true,
      showDeviceFrame: true,
      theme: 'light',
      ...options
    };
    
    this.currentDevice = null;
    this.overlayElement = null;
    this.frameElement = null;
    this.screenElement = null;
    this.safeAreaElements = {};
    
    this.init();
  }

  init() {
    this.createOverlayContainer();
    this.setupEventListeners();
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
    `;
    
    // Create frame container
    this.frameElement = document.createElement('div');
    this.frameElement.className = 'phone-frame';
    this.frameElement.style.cssText = `
      position: relative;
      transition: all 0.3s ease;
    `;
    
    // Create screen overlay
    this.screenElement = document.createElement('div');
    this.screenElement.className = 'phone-screen-overlay';
    this.screenElement.style.cssText = `
      position: absolute;
      overflow: hidden;
      border-radius: inherit;
      pointer-events: none;
    `;
    
    this.frameElement.appendChild(this.screenElement);
    this.overlayElement.appendChild(this.frameElement);
    document.body.appendChild(this.overlayElement);
  }

  setupEventListeners() {
    // Handle window resize
    window.addEventListener('resize', () => {
      if (this.currentDevice) {
        this.updateDevice(this.currentDevice, this.currentInsets);
      }
    });

    // Handle scroll events to keep overlay centered
    window.addEventListener('scroll', () => {
      this.overlayElement.style.transform = 'translate(-50%, -50%)';
    });
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
    
    // Create frame content
    if (appearance.frameImage && this.options.showDeviceFrame) {
      this.renderRealFrame(device, scale);
    } else {
      this.renderSimulatedFrame(device, scale);
    }
    
    // Render safe areas
    if (this.options.showSafeArea) {
      this.renderSafeAreas(this.currentInsets, scale);
    }
  }

  renderRealFrame(device, scale) {
    const { appearance } = device;
    const frameImage = appearance.frameImage;
    
    // Use SVG-based frame rendering for scalability and realism
    const frameHTML = this.createSVGFrame(device, scale);
    this.frameElement.innerHTML = frameHTML;
    
    // Update screen overlay position
    const offset = frameImage.screenOffset;
    const screenX = offset.x * scale;
    const screenY = offset.y * scale;
    const screenWidth = offset.width * scale;
    const screenHeight = offset.height * scale;
    
    this.screenElement.style.left = `${screenX}px`;
    this.screenElement.style.top = `${screenY}px`;
    this.screenElement.style.width = `${screenWidth}px`;
    this.screenElement.style.height = `${screenHeight}px`;
    this.screenElement.style.borderRadius = `${appearance.screenRadius * scale}px`;
  }

  createSVGFrame(device, scale) {
    const { appearance } = device;
    const width = appearance.width * scale;
    const height = appearance.height * scale;
    const radius = appearance.borderRadius * scale;
    
    // Create realistic device frame using SVG
    const svg = `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <!-- Device Frame -->
        <defs>
          <!-- Frame gradient -->
          <linearGradient id="frame-gradient-${this.options.theme}" x1="0%" y1="0%" x2="100%" y2="100%">
            ${this.options.theme === 'light' ? `
              <stop offset="0%" style="stop-color:#f8f9fa"/>
              <stop offset="50%" style="stop-color:#e9ecef"/>
              <stop offset="100%" style="stop-color:#dee2e6"/>
            ` : `
              <stop offset="0%" style="stop-color:#212529"/>
              <stop offset="50%" style="stop-color:#343a40"/>
              <stop offset="100%" style="stop-color:#495057"/>
            `}
          </linearGradient>
          
          <!-- Screen mask -->
          <mask id="screen-mask-${device.name}">
            <rect x="0" y="0" width="${width}" height="${height}" fill="black"/>
            <rect 
              x="${appearance.frameImage.screenOffset.x * scale}" 
              y="${appearance.frameImage.screenOffset.y * scale}" 
              width="${appearance.frameImage.screenOffset.width * scale}" 
              height="${appearance.frameImage.screenOffset.height * scale}"
              rx="${appearance.screenRadius * scale}"
              fill="white"
            />
          </mask>
          
          <!-- Notch/Dynamic Island -->
          ${this.createNotchSVG(device, scale)}
        </defs>
        
        <!-- Main frame -->
        <rect width="${width}" height="${height}" rx="${radius}" fill="url(#frame-gradient-${this.options.theme})"/>
        
        <!-- Frame edge highlight -->
        <rect 
          x="1" y="1" 
          width="${width-2}" height="${height-2}" 
          rx="${radius-1}" 
          fill="none" 
          stroke="${this.options.theme === 'light' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.3)}" 
          stroke-width="0.5"
        />
        
        <!-- Screen area -->
        <g mask="url(#screen-mask-${device.name})">
          <rect 
            x="${appearance.frameImage.screenOffset.x * scale}" 
            y="${appearance.frameImage.screenOffset.y * scale}" 
            width="${appearance.frameImage.screenOffset.width * scale}" 
            height="${appearance.frameImage.screenOffset.height * scale}"
            rx="${appearance.screenRadius * scale}"
            fill="#000"
          />
        </g>
        
        <!-- Notch/Dynamic Island -->
        ${this.renderNotchSVG(device, scale)}
        
        <!-- Brand-specific elements -->
        ${this.renderBrandElementsSVG(device, scale)}
      </svg>
    `;
    
    return svg;
  }

  createNotchSVG(device, scale) {
    const { appearance } = device;
    if (!appearance.notch || appearance.notch.type === 'none') return '';
    
    const { notch } = appearance;
    const notchWidth = notch.width * scale;
    const notchHeight = notch.height * scale;
    const notchRadius = notch.radius * scale;
    
    let svg = '';
    
    switch (notch.type) {
      case 'dynamic-island':
        svg = `
          <filter id="dynamic-island-glow">
            <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        `;
        break;
      case 'notch':
        svg = `
          <path id="notch-path" d="
            M ${(appearance.width * scale - notchWidth) / 2} 0
            L ${(appearance.width * scale + notchWidth) / 2} 0
            L ${(appearance.width * scale + notchWidth) / 2} ${notchHeight}
            Q ${appearance.width * scale / 2} ${notchHeight + notchRadius} ${(appearance.width * scale - notchWidth) / 2} ${notchHeight}
            Z
          " fill="black"/>
        `;
        break;
    }
    
    return svg;
  }

  renderNotchSVG(device, scale) {
    const { appearance } = device;
    if (!appearance.notch || appearance.notch.type === 'none') return '';
    
    const { notch } = appearance;
    const notchWidth = notch.width * scale;
    const notchHeight = notch.height * scale;
    const notchRadius = notch.radius * scale;
    
    switch (notch.type) {
      case 'dynamic-island':
        const islandX = (appearance.width * scale - notchWidth) / 2;
        const islandY = 12 * scale; // Position from top
        return `
          <rect 
            x="${islandX}" 
            y="${islandY}" 
            width="${notchWidth}" 
            height="${notchHeight}" 
            rx="${notchRadius}" 
            fill="#1a1a1a"
            stroke="#333"
            stroke-width="0.5"
            filter="url(#dynamic-island-glow)"
          />
          <rect 
            x="${islandX + 2}" 
            y="${islandY + 1}" 
            width="${notchWidth - 4}" 
            height="${notchHeight - 2}" 
            rx="${notchRadius - 1}" 
            fill="#000"
          />
        `;
        
      case 'notch':
        return `<use href="#notch-path"/>`;
        
      case 'punch-hole':
        const holeX = (appearance.width * scale) / 2;
        const holeY = 16 * scale;
        return `
          <circle 
            cx="${holeX}" 
            cy="${holeY}" 
            r="${notchRadius}" 
            fill="#000"
          />
        `;
    }
    
    return '';
  }

  renderBrandElementsSVG(device, scale) {
    const { appearance } = device;
    let elements = '';
    
    if (appearance.brand === 'apple') {
      // Volume buttons
      const buttonWidth = 2 * scale;
      const buttonHeight = 12 * scale;
      const buttonRadius = 1 * scale;
      const buttonX = -buttonWidth - 1;
      const centerY = appearance.height * scale / 2;
      
      elements += `
        <rect 
          x="${buttonX}" 
          y="${centerY - 15 * scale}" 
          width="${buttonWidth}" 
          height="${buttonHeight}" 
          rx="${buttonRadius}" 
          fill="url(#frame-gradient-${this.options.theme})"
          stroke="${this.options.theme === 'light' ? '#adb5bd' : '#495057'}"
          stroke-width="0.5"
        />
        <rect 
          x="${buttonX}" 
          y="${centerY + 5 * scale}" 
          width="${buttonWidth}" 
          height="${8 * scale}" 
          rx="${buttonRadius}" 
          fill="url(#frame-gradient-${this.options.theme})"
          stroke="${this.options.theme === 'light' ? '#adb5bd' : '#495057'}"
          stroke-width="0.5"
        />
      `;
    } else if (appearance.brand === 'samsung') {
      // Samsung frame elements
      const buttonWidth = 1.5 * scale;
      const buttonHeight = 8 * scale;
      const buttonX = -buttonWidth - 1;
      const centerY = appearance.height * scale / 2;
      
      elements += `
        <rect 
          x="${buttonX}" 
          y="${centerY - 10 * scale}" 
          width="${buttonWidth}" 
          height="${buttonHeight}" 
          rx="1" 
          fill="url(#frame-gradient-${this.options.theme})"
          stroke="${this.options.theme === 'light' ? '#dee2e6' : '#6c757d'}"
          stroke-width="0.5"
        />
      `;
    }
    
    return elements;
  }

  renderSimulatedFrame(device, scale) {
    // Fallback to simulated frame if no real images
    const { appearance } = device;
    const phoneWidth = appearance.width * scale;
    const phoneHeight = appearance.height * scale;
    const screenWidth = appearance.screenWidth * scale;
    const screenHeight = appearance.screenHeight * scale;
    
    const gradient = this.createGradient(appearance.colors);
    
    this.frameElement.innerHTML = `
      <div style="
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
        
        <div style="
          position: absolute;
          width: ${screenWidth}px;
          height: ${screenHeight}px;
          background: #000;
          border-radius: ${appearance.screenRadius * scale}px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.1);
        ">
          ${this.screenElement}
        </div>
      </div>
    `;
  }

  renderSafeAreas(safeAreaInsets, scale) {
    // Clear existing safe area elements
    Object.values(this.safeAreaElements).forEach(el => el && el.remove());
    this.safeAreaElements = {};
    
    if (!this.options.showSafeArea) return;
    
    const colors = {
      top: 'rgba(255, 59, 48, 0.3)',
      bottom: 'rgba(255, 59, 48, 0.3)',
      left: 'rgba(255, 59, 48, 0.3)',
      right: 'rgba(255, 59, 48, 0.3)'
    };
    
    const borderColors = {
      top: 'rgba(255, 59, 48, 0.6)',
      bottom: 'rgba(255, 59, 48, 0.6)',
      left: 'rgba(255, 59, 48, 0.6)',
      right: 'rgba(255, 59, 48, 0.6)'
    };
    
    // Create safe area overlays
    ['top', 'bottom', 'left', 'right'].forEach(position => {
      const value = safeAreaInsets[position] * scale;
      if (value <= 0) return;
      
      const element = document.createElement('div');
      element.style.cssText = `
        position: absolute;
        background: ${colors[position]};
        border: 1px dashed ${borderColors[position]};
        pointer-events: none;
        z-index: 1000;
        font-size: 8px;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
      `;
      
      switch (position) {
        case 'top':
          element.style.top = '0';
          element.style.left = '0';
          element.style.right = '0';
          element.style.height = `${value}px`;
          element.style.borderBottom = `1px dashed ${borderColors.top}`;
          element.innerHTML = `<span style="background: rgba(0,0,0,0.7); padding: 2px 4px; border-radius: 2px;">${safeAreaInsets.top}px</span>`;
          break;
        case 'bottom':
          element.style.bottom = '0';
          element.style.left = '0';
          element.style.right = '0';
          element.style.height = `${value}px`;
          element.style.borderTop = `1px dashed ${borderColors.bottom}`;
          element.innerHTML = `<span style="background: rgba(0,0,0,0.7); padding: 2px 4px; border-radius: 2px;">${safeAreaInsets.bottom}px</span>`;
          break;
        case 'left':
          element.style.top = '0';
          element.style.bottom = '0';
          element.style.left = '0';
          element.style.width = `${value}px`;
          element.style.borderRight = `1px dashed ${borderColors.left}`;
          element.innerHTML = `<span style="background: rgba(0,0,0,0.7); padding: 2px 4px; border-radius: 2px; writing-mode: vertical-rl;">${safeAreaInsets.left}px</span>`;
          break;
        case 'right':
          element.style.top = '0';
          element.style.bottom = '0';
          element.style.right = '0';
          element.style.width = `${value}px`;
          element.style.borderLeft = `1px dashed ${borderColors.right}`;
          element.innerHTML = `<span style="background: rgba(0,0,0,0.7); padding: 2px 4px; border-radius: 2px; writing-mode: vertical-rl;">${safeAreaInsets.right}px</span>`;
          break;
      }
      
      this.screenElement.appendChild(element);
      this.safeAreaElements[position] = element;
    });
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
    if (this.overlayElement) {
      this.overlayElement.remove();
      this.overlayElement = null;
    }
  }

  createGradient(colors) {
    if (colors.length === 1) {
      return colors[0];
    }
    return `linear-gradient(145deg, ${colors.join(', ')})`;
  }

  renderNotchOrCutout(appearance, scale) {
    // Similar to PhoneMockup but adapted for overlay
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
      case 'dynamic-island':
        notchStyle += `
          width: ${notchWidth}px;
          height: ${notchHeight}px;
          border-radius: ${notchRadius}px;
          top: ${12 * scale}px;
          left: 50%;
          transform: translateX(-50%);
          background: #1a1a1a;
          border: 1px solid #333;
        `;
        break;
      // ... other cases similar to PhoneMockup
    }

    return `<div class="phone-notch" style="${notchStyle}"></div>`;
  }
}

// Export for use in other files
if (typeof window !== 'undefined') {
  window.PhoneFrameOverlay = PhoneFrameOverlay;
}