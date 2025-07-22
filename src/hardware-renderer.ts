// Hardware regions renderer for realistic device simulation
/// <reference types="chrome" />
import type { HardwareRegion, Device } from '../types/global.js';

export class HardwareRegionsRenderer {
  private container: HTMLElement | null = null;
  private regions: HardwareRegion[] = [];
  private isVisible: boolean = true;

  constructor() {
    this.init();
  }

  private init(): void {
    this.createContainer();
  }

  private createContainer(): void {
    // Remove existing container
    this.removeContainer();
    
    this.container = document.createElement('div');
    this.container.id = 'safe-area-hardware-regions';
    this.container.className = 'safe-area-hardware-regions';
    
    // Base styles for the hardware regions container
    this.container.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      pointer-events: none !important;
      z-index: 999998 !important;
      display: ${this.isVisible ? 'block' : 'none'} !important;
    `;
    
    // Try to append to body, fallback to documentElement
    if (document.body) {
      document.body.appendChild(this.container);
    } else if (document.documentElement) {
      document.documentElement.appendChild(this.container);
    }
  }

  public setVisible(visible: boolean): void {
    this.isVisible = visible;
    if (this.container) {
      this.container.style.display = visible ? 'block' : 'none';
    }
  }

  public updateDevice(device: Device): void {
    if (!device.appearance.hardwareRegions) {
      this.generateHardwareRegions(device);
    } else {
      this.regions = device.appearance.hardwareRegions;
    }
    this.renderRegions();
  }

  private generateHardwareRegions(device: Device): void {
    const regions: HardwareRegion[] = [];
    const { appearance } = device;
    const viewport = this.getViewportSize();
    
    // Calculate scaling factor to fit screen
    const scaleX = viewport.width / appearance.screenWidth;
    const scaleY = viewport.height / appearance.screenHeight;
    const scale = Math.min(scaleX, scaleY);

    // Generate Dynamic Island
    if (appearance.notch.type === 'dynamic-island') {
      regions.push(this.createDynamicIslandRegion(appearance, scale, viewport));
    }
    
    // Generate traditional notch
    if (appearance.notch.type === 'notch' || appearance.notch.type === 'small-notch') {
      regions.push(this.createNotchRegion(appearance, scale, viewport));
    }
    
    // Generate punch hole (for Samsung devices)
    if (appearance.notch.type === 'punch-hole') {
      regions.push(this.createPunchHoleRegion(appearance, scale, viewport));
    }
    
    // Generate home indicator
    if (appearance.homeIndicator) {
      regions.push(this.createHomeIndicatorRegion(appearance, scale, viewport));
    }
    
    // Generate status bar area
    if (appearance.brand === 'apple' && appearance.notch.type !== 'none') {
      regions.push(...this.createStatusBarRegions(appearance, scale, viewport));
    }

    this.regions = regions;
  }

  private createDynamicIslandRegion(appearance: any, scale: number, viewport: any): HardwareRegion {
    const island = appearance.notch;
    const centerX = viewport.width / 2;
    const topOffset = 15;
    
    // Create a proper Dynamic Island - single unified element
    const islandWidth = 120; // Fixed width for better visibility
    const islandHeight = 30;  // Fixed height
    
    return {
      type: 'dynamic-island',
      position: {
        x: centerX - islandWidth / 2,
        y: topOffset,
        width: islandWidth,
        height: islandHeight
      },
      style: {
        backgroundColor: '#000000',
        borderRadius: '15px', // Perfect pill shape
        boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.1), 0 2px 8px rgba(0,0,0,0.4)',
        opacity: 0.98,
        zIndex: 1000001
      },
      content: {
        type: 'sensors',
        elements: [
          // Front camera (left side)
          {
            type: 'circle',
            x: 25,
            y: 15,
            radius: 5,
            color: '#1a1a1a'
          },
          // Face ID sensors (tiny dots)
          {
            type: 'circle',
            x: 40,
            y: 12,
            radius: 1.5,
            color: '#333333'
          },
          {
            type: 'circle',
            x: 45,
            y: 18,
            radius: 1,
            color: '#333333'
          },
          {
            type: 'circle',
            x: 50,
            y: 15,
            radius: 1,
            color: '#333333'
          },
          // Speaker grille (center-right)
          {
            type: 'rect',
            x: 60,
            y: 12,
            width: 30,
            height: 6,
            color: '#2a2a2a',
            borderRadius: '3px'
          },
          // Proximity sensor (far right)
          {
            type: 'circle',
            x: 95,
            y: 15,
            radius: 3,
            color: '#1a1a1a'
          }
        ]
      }
    };
  }

  private createNotchRegion(appearance: any, scale: number, viewport: any): HardwareRegion {
    const notch = appearance.notch;
    const centerX = viewport.width / 2;
    
    return {
      type: 'notch',
      position: {
        x: centerX - (notch.width * scale) / 2,
        y: 0,
        width: notch.width * scale,
        height: notch.height * scale
      },
      style: {
        backgroundColor: '#000000',
        borderRadius: `0 0 ${notch.radius * scale}px ${notch.radius * scale}px`,
        opacity: 0.98,
        zIndex: 999999
      },
      content: {
        type: 'sensors',
        elements: [
          // Speaker grille
          {
            type: 'rect',
            x: (notch.width * scale) * 0.35,
            y: (notch.height * scale) * 0.3,
            width: (notch.width * scale) * 0.3,
            height: (notch.height * scale) * 0.15,
            color: '#333333'
          },
          // Camera
          {
            type: 'circle',
            x: (notch.width * scale) * 0.2,
            y: (notch.height * scale) * 0.5,
            radius: (notch.height * scale) * 0.2,
            color: '#1a1a1a'
          },
          // Sensors
          {
            type: 'dot',
            x: (notch.width * scale) * 0.8,
            y: (notch.height * scale) * 0.5,
            width: 2 * scale,
            height: 2 * scale,
            color: '#444444'
          }
        ]
      }
    };
  }

  private createPunchHoleRegion(appearance: any, scale: number, viewport: any): HardwareRegion {
    const punchHole = appearance.notch;
    const centerX = viewport.width / 2;
    const topOffset = 15 * scale;
    
    return {
      type: 'camera-cutout',
      position: {
        x: centerX - (punchHole.width * scale) / 2,
        y: topOffset,
        width: punchHole.width * scale,
        height: punchHole.height * scale
      },
      style: {
        backgroundColor: '#000000',
        borderRadius: '50%',
        boxShadow: '0 0 8px rgba(0,0,0,0.5)',
        opacity: 0.95,
        zIndex: 999999
      },
      content: {
        type: 'camera',
        elements: [
          {
            type: 'circle',
            x: (punchHole.width * scale) / 2,
            y: (punchHole.height * scale) / 2,
            radius: (punchHole.width * scale) * 0.3,
            color: '#2a2a2a'
          }
        ]
      }
    };
  }

  private createHomeIndicatorRegion(appearance: any, scale: number, viewport: any): HardwareRegion {
    const indicator = appearance.homeIndicator;
    const centerX = viewport.width / 2;
    const bottomOffset = 12;
    
    return {
      type: 'home-indicator',
      position: {
        x: centerX - (indicator.width * 2) / 2,
        y: viewport.height - bottomOffset - (indicator.height * 2),
        width: indicator.width * 2,
        height: indicator.height * 2
      },
      style: {
        backgroundColor: '#000000', // iOS原生黑色
        borderRadius: `${indicator.radius * 2}px`,
        opacity: 0.9,
        zIndex: 1000001,
        boxShadow: '0 1px 3px rgba(0,0,0,0.4)' // 更深的阴影
      }
    };
  }

  private createStatusBarRegions(appearance: any, scale: number, viewport: any): HardwareRegion[] {
    // No status bar regions - removed time display
    return [];
  }

  private renderRegions(): void {
    if (!this.container) {
      this.createContainer();
    }
    
    if (!this.container) return;
    
    // Clear existing regions
    this.container.innerHTML = '';
    
    // Render each hardware region
    this.regions.forEach(region => {
      const element = this.createRegionElement(region);
      if (element) {
        this.container!.appendChild(element);
      }
    });
  }

  private createRegionElement(region: HardwareRegion): HTMLElement | null {
    const element = document.createElement('div');
    element.className = `hardware-region hardware-region-${region.type}`;
    
    // Apply position and basic styles
    const style = {
      position: 'absolute',
      left: `${region.position.x}px`,
      top: `${region.position.y}px`,
      width: `${region.position.width}px`,
      height: `${region.position.height}px`,
      pointerEvents: 'none',
      ...region.style
    };
    
    Object.assign(element.style, style);
    
    // Add content elements if specified
    if (region.content?.elements) {
      region.content.elements.forEach(contentElement => {
        const contentEl = this.createContentElement(contentElement);
        if (contentEl) {
          element.appendChild(contentEl);
        }
      });
    }
    
    return element;
  }

  private createContentElement(content: any): HTMLElement | null {
    const element = document.createElement('div');
    element.className = `hardware-content hardware-content-${content.type}`;
    
    const baseStyle = {
      position: 'absolute',
      left: `${content.x}px`,
      top: `${content.y}px`,
      pointerEvents: 'none',
      backgroundColor: content.color || 'transparent'
    };
    
    switch (content.type) {
      case 'text':
        Object.assign(element.style, {
          ...baseStyle,
          width: `${content.width}px`,
          height: `${content.height}px`,
          color: content.color,
          fontSize: '14px',
          fontWeight: '600',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          lineHeight: '1',
          textShadow: '0 1px 2px rgba(0,0,0,0.3)',
          backgroundColor: 'transparent'
        });
        element.textContent = content.content || '';
        break;
        
      case 'circle':
        Object.assign(element.style, {
          ...baseStyle,
          width: `${content.radius * 2}px`,
          height: `${content.radius * 2}px`,
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)'
        });
        break;
        
      case 'rect':
        Object.assign(element.style, {
          ...baseStyle,
          width: `${content.width}px`,
          height: `${content.height}px`,
          borderRadius: content.borderRadius || '1px'
        });
        break;
        
      case 'dot':
        Object.assign(element.style, {
          ...baseStyle,
          width: `${content.width}px`,
          height: `${content.height}px`,
          borderRadius: '50%'
        });
        break;
        
      case 'line':
        Object.assign(element.style, {
          ...baseStyle,
          width: `${content.width}px`,
          height: `${content.height}px`
        });
        break;
    }
    
    return element;
  }

  private getViewportSize(): { width: number; height: number } {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  public removeContainer(): void {
    // Remove our specific container instance
    if (this.container) {
      this.container.remove();
      this.container = null;
    }
    
    // Also clean up any orphaned containers with the same ID
    const orphanedContainers = document.querySelectorAll('#safe-area-hardware-regions');
    orphanedContainers.forEach(container => {
      if (container !== this.container) {
        container.remove();
      }
    });
  }


  public destroy(): void {
    this.removeContainer();
    this.regions = [];
  }
}