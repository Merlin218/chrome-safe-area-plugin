// Global type definitions for Chrome Safe Area Plugin

// Device safe area insets interface
interface SafeAreaInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

// Device notch types
type NotchType = 'none' | 'notch' | 'dynamic-island' | 'small-notch' | 'punch-hole' | 'forehead';

// Device notch configuration
interface DeviceNotch {
  type: NotchType;
  width?: number;
  height?: number;
  radius?: number;
  position?: 'center-top' | 'left' | 'right';
  // Enhanced properties for realistic rendering
  color?: string;
  shadow?: boolean;
  borderRadius?: string;
}

// Hardware regions for realistic device simulation
interface HardwareRegion {
  type: 'notch' | 'dynamic-island' | 'status-bar' | 'navigation-bar' | 'home-indicator' | 'camera-cutout';
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  style: {
    backgroundColor?: string;
    borderRadius?: string;
    boxShadow?: string;
    opacity?: number;
    zIndex?: number;
  };
  content?: {
    type?: 'sensors' | 'camera' | 'speaker';
    elements?: Array<{
      type: 'dot' | 'line' | 'rect' | 'circle' | 'text';
      x: number;
      y: number;
      width?: number;
      height?: number;
      radius?: number;
      color?: string;
      content?: string;
      borderRadius?: string;
      id?: string;
    }>;
  };
}

// Device home indicator configuration
interface DeviceHomeIndicator {
  width: number;
  height: number;
  radius: number;
  position?: 'bottom' | 'center';
}

// Device frame image configuration
interface DeviceFrameImage {
  light: string;
  dark: string;
  hasDynamicIsland: boolean;
  hasHomeIndicator: boolean;
  screenOffset: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// Device appearance configuration
interface DeviceAppearance {
  width: number;
  height: number;
  screenWidth: number;
  screenHeight: number;
  borderRadius: number;
  screenRadius: number;
  notch: DeviceNotch;
  homeIndicator: DeviceHomeIndicator | null;
  colors: string[];
  brand: 'apple' | 'google' | 'samsung' | 'custom';
  orientation?: 'portrait' | 'landscape';
  frameImage?: DeviceFrameImage;
  show?: boolean;
  // Enhanced hardware regions for realistic rendering
  hardwareRegions?: HardwareRegion[];
}

// Device configuration interface
interface Device {
  name: string;
  safeAreaInsets: SafeAreaInsets;
  appearance: DeviceAppearance;
}

// Devices collection type
interface DevicesCollection {
  [key: string]: Device;
}

// Chrome extension message types
interface SafeAreaMessage {
  action: 'updateSafeArea' | 'getCurrentSettings' | 'updateAllTabs';
  enabled?: boolean;
  device?: string;
  insets?: SafeAreaInsets;
  showDeviceFrame?: boolean;
  settings?: SafeAreaSettings;
}

// Custom CSS variable names configuration
interface CustomCSSVariables {
  top: string;
  bottom: string;
  left: string;
  right: string;
}

// Extension settings interface
interface SafeAreaSettings {
  enabled: boolean;
  device: string;
  customInsets: SafeAreaInsets;
  showDebugOverlay: boolean;
  showDeviceFrame?: boolean;
  showHardwareRegions?: boolean;
  mockupOptions?: MockupOptions;
  customCSSVariables?: CustomCSSVariables;
}

// Phone mockup options
interface MockupOptions {
  showSafeArea: boolean;
  showContent: boolean;
}

// Phone frame options
interface PhoneFrameOptions {
  scale: number;
  showSafeArea: boolean;
  showDeviceFrame: boolean;
  theme: 'light' | 'dark';
}

// Global DEVICES constant
declare const DEVICES: DevicesCollection;

// Custom event for safe area changes
interface SafeAreaChangeEvent extends CustomEvent {
  detail: {
    top: number;
    bottom: number;
    left: number;
    right: number;
    enabled: boolean;
  };
}

// Extend the global window interface for custom events
declare global {
  interface WindowEventMap {
    'safeAreaInsetsChanged': SafeAreaChangeEvent;
  }
}

// Export types for use in other modules
export {
  SafeAreaInsets,
  NotchType,
  DeviceNotch,
  DeviceHomeIndicator,
  DeviceFrameImage,
  DeviceAppearance,
  Device,
  DevicesCollection,
  SafeAreaMessage,
  SafeAreaSettings,
  MockupOptions,
  PhoneFrameOptions,
  SafeAreaChangeEvent,
  HardwareRegion,
  CustomCSSVariables
}; 