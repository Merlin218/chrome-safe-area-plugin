// Shared utilities for the Safe Area Simulator extension
import type { SafeAreaInsets, SafeAreaMessage, CustomCSSVariables } from '../../types/global.js';
import { DEVICES } from './devices.js';

/**
 * Get device safe area insets by device key
 */
export function getDeviceInsets(deviceKey: string): SafeAreaInsets {
  const device = DEVICES[deviceKey];
  return device ? device.safeAreaInsets : { top: 0, bottom: 0, left: 0, right: 0 };
}

/**
 * Get default CSS variable names
 */
export function getDefaultCSSVariables(): CustomCSSVariables {
  return {
    top: 'safe-area-inset-top',
    bottom: 'safe-area-inset-bottom',
    left: 'safe-area-inset-left',
    right: 'safe-area-inset-right'
  };
}

/**
 * Create safe area CSS custom properties with custom variable names
 */
export function createSafeAreaCSS(insets: SafeAreaInsets, customVariables?: CustomCSSVariables): string {
  const vars = customVariables || getDefaultCSSVariables();
  
  return `
:root {
  --${vars.top}: ${insets.top}px;
  --${vars.bottom}: ${insets.bottom}px;
  --${vars.left}: ${insets.left}px;
  --${vars.right}: ${insets.right}px;
}

/* Override env() function for safe area insets */
html {
  --${vars.top}: ${insets.top}px;
  --${vars.bottom}: ${insets.bottom}px;
  --${vars.left}: ${insets.left}px;
  --${vars.right}: ${insets.right}px;
}`;
}

/**
 * Create base styles for safe area visualization with custom variable names
 */
export function createBaseSafeAreaStyles(customVariables?: CustomCSSVariables): string {
  const vars = customVariables || getDefaultCSSVariables();
  
  return `
/* Safe Area Simulator - Base Styles */
.safe-area-simulator-debug {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 999999;
}

.safe-area-simulator-debug::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-width: var(--${vars.top}, 0) var(--${vars.right}, 0) var(--${vars.bottom}, 0) var(--${vars.left}, 0);
  background: 
    linear-gradient(to bottom, rgba(255, 59, 48, 0.1) 0, rgba(255, 59, 48, 0.1) var(--${vars.top}, 0), transparent var(--${vars.top}, 0)),
    linear-gradient(to top, rgba(255, 59, 48, 0.1) 0, rgba(255, 59, 48, 0.1) var(--${vars.bottom}, 0), transparent var(--${vars.bottom}, 0)),
    linear-gradient(to right, rgba(255, 59, 48, 0.1) 0, rgba(255, 59, 48, 0.1) var(--${vars.left}, 0), transparent var(--${vars.left}, 0)),
    linear-gradient(to left, rgba(255, 59, 48, 0.1) 0, rgba(255, 59, 48, 0.1) var(--${vars.right}, 0), transparent var(--${vars.right}, 0));
}

/* Utility classes for developers */
.safe-area-inset-top {
  padding-top: env(safe-area-inset-top, var(--${vars.top}, 0)) !important;
}

.safe-area-inset-bottom {
  padding-bottom: env(safe-area-inset-bottom, var(--${vars.bottom}, 0)) !important;
}

.safe-area-inset-left {
  padding-left: env(safe-area-inset-left, var(--${vars.left}, 0)) !important;
}

.safe-area-inset-right {
  padding-right: env(safe-area-inset-right, var(--${vars.right}, 0)) !important;
}

.safe-area-inset-all {
  padding: 
    env(safe-area-inset-top, var(--${vars.top}, 0))
    env(safe-area-inset-right, var(--${vars.right}, 0))
    env(safe-area-inset-bottom, var(--${vars.bottom}, 0))
    env(safe-area-inset-left, var(--${vars.left}, 0)) !important;
}`;
}

/**
 * @deprecated Use createBaseSafeAreaStyles() instead
 * Base styles for safe area visualization
 */
export const BASE_SAFE_AREA_STYLES = createBaseSafeAreaStyles();

/**
 * Send message to content script with error handling
 */
export async function sendMessageToTab(tabId: number, message: SafeAreaMessage): Promise<boolean> {
  try {
    await chrome.tabs.sendMessage(tabId, message);
    return true;
  } catch (error) {
    console.log('[Safe Area Simulator] Could not send message to tab:', error);
    return false;
  }
}

/**
 * Check if tab URL is valid for content script injection
 */
export function isValidTabUrl(url?: string): boolean {
  if (!url) return false;
  return !url.startsWith('chrome://') && !url.startsWith('chrome-extension://') && !url.startsWith('moz-extension://');
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number | undefined;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = window.setTimeout(() => func(...args), wait);
  };
}

/**
 * Create custom event for safe area changes
 */
export function createSafeAreaEvent(insets: SafeAreaInsets, enabled: boolean): CustomEvent {
  return new CustomEvent('safeAreaInsetsChanged', {
    detail: {
      top: insets.top,
      bottom: insets.bottom,
      left: insets.left,
      right: insets.right,
      enabled
    }
  });
}