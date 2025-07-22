import { describe, it, expect } from 'vitest';
import DEVICES from '../../src/devices.js';
import type { Device } from '../../types/global.js';

describe('Devices Configuration', () => {
  it('should export a devices collection', () => {
    expect(DEVICES).toBeDefined();
    expect(typeof DEVICES).toBe('object');
  });

  it('should include a "none" device as default', () => {
    expect(DEVICES.none).toBeDefined();
    expect(DEVICES.none.name).toBe('None (Default)');
    expect(DEVICES.none.safeAreaInsets).toEqual({
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    });
  });

  it('should have valid structure for all devices', () => {
    Object.keys(DEVICES).forEach(deviceKey => {
      const device: Device = DEVICES[deviceKey];
      
      // Check required properties
      expect(device).toHaveProperty('name');
      expect(device).toHaveProperty('safeAreaInsets');
      expect(device).toHaveProperty('appearance');
      
      // Check safe area insets structure
      expect(device.safeAreaInsets).toHaveProperty('top');
      expect(device.safeAreaInsets).toHaveProperty('bottom');
      expect(device.safeAreaInsets).toHaveProperty('left');
      expect(device.safeAreaInsets).toHaveProperty('right');
      
      // Check that insets are numbers
      expect(typeof device.safeAreaInsets.top).toBe('number');
      expect(typeof device.safeAreaInsets.bottom).toBe('number');
      expect(typeof device.safeAreaInsets.left).toBe('number');
      expect(typeof device.safeAreaInsets.right).toBe('number');
      
      // Check appearance structure
      expect(device.appearance).toHaveProperty('width');
      expect(device.appearance).toHaveProperty('height');
      expect(device.appearance).toHaveProperty('screenWidth');
      expect(device.appearance).toHaveProperty('screenHeight');
      expect(device.appearance).toHaveProperty('borderRadius');
      expect(device.appearance).toHaveProperty('screenRadius');
      expect(device.appearance).toHaveProperty('notch');
      expect(device.appearance).toHaveProperty('colors');
      expect(device.appearance).toHaveProperty('brand');
    });
  });

  it('should include iPhone devices', () => {
    const iPhoneDevices = Object.keys(DEVICES).filter(key => 
      key.toLowerCase().includes('iphone')
    );
    
    expect(iPhoneDevices.length).toBeGreaterThan(0);
    
    // Check specific iPhone devices
    expect(DEVICES.iphone14).toBeDefined();
    expect(DEVICES.iphone14Pro).toBeDefined();
    expect(DEVICES.iphone15).toBeDefined();
    expect(DEVICES.iphone15Pro).toBeDefined();
  });

  it('should include Android devices', () => {
    const androidDevices = Object.keys(DEVICES).filter(key => 
      DEVICES[key].appearance.brand === 'google' || 
      DEVICES[key].appearance.brand === 'samsung'
    );
    
    expect(androidDevices.length).toBeGreaterThan(0);
  });

  it('should have valid safe area insets for flagship devices', () => {
    // Test iPhone 15 Pro
    if (DEVICES.iphone15Pro) {
      expect(DEVICES.iphone15Pro.safeAreaInsets.top).toBeGreaterThan(0);
      expect(DEVICES.iphone15Pro.safeAreaInsets.bottom).toBeGreaterThan(0);
    }
    
    // Test iPhone 14
    if (DEVICES.iphone14) {
      expect(DEVICES.iphone14.safeAreaInsets.top).toBeGreaterThan(0);
      expect(DEVICES.iphone14.safeAreaInsets.bottom).toBeGreaterThan(0);
    }
  });

  it('should have landscape variants for some devices', () => {
    const landscapeDevices = Object.keys(DEVICES).filter(key => 
      key.toLowerCase().includes('landscape')
    );
    
    expect(landscapeDevices.length).toBeGreaterThan(0);
    
    // Check that landscape devices have correct orientation
    landscapeDevices.forEach(deviceKey => {
      const device = DEVICES[deviceKey];
      if (device.appearance.orientation) {
        expect(device.appearance.orientation).toBe('landscape');
      }
    });
  });

  it('should have notch/dynamic island information for modern iPhones', () => {
    const modernIPhones = ['iphone14', 'iphone14Pro', 'iphone15', 'iphone15Pro'];
    
    modernIPhones.forEach(deviceKey => {
      if (DEVICES[deviceKey]) {
        const device = DEVICES[deviceKey];
        expect(device.appearance.notch).toBeDefined();
        expect(['notch', 'dynamic-island', 'none']).toContain(device.appearance.notch.type);
      }
    });
  });

  it('should have home indicator for devices that need it', () => {
    const devicesWithHomeIndicator = Object.keys(DEVICES).filter(key => 
      DEVICES[key].appearance.homeIndicator !== null
    );
    
    expect(devicesWithHomeIndicator.length).toBeGreaterThan(0);
    
    devicesWithHomeIndicator.forEach(deviceKey => {
      const device = DEVICES[deviceKey];
      if (device.appearance.homeIndicator) {
        expect(typeof device.appearance.homeIndicator.width).toBe('number');
        expect(typeof device.appearance.homeIndicator.height).toBe('number');
        expect(typeof device.appearance.homeIndicator.radius).toBe('number');
      }
    });
  });

  it('should have colors array for device appearance', () => {
    Object.keys(DEVICES).forEach(deviceKey => {
      const device = DEVICES[deviceKey];
      expect(Array.isArray(device.appearance.colors)).toBe(true);
      
      // Colors should be strings (hex codes or color names)
      device.appearance.colors.forEach(color => {
        expect(typeof color).toBe('string');
      });
    });
  });

  it('should have valid brand names', () => {
    const validBrands = ['apple', 'google', 'samsung', 'custom'];
    
    Object.keys(DEVICES).forEach(deviceKey => {
      const device = DEVICES[deviceKey];
      expect(validBrands).toContain(device.appearance.brand);
    });
  });
}); 