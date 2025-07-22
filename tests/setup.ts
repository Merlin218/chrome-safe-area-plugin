import { vi, beforeEach } from 'vitest';

// Mock Chrome APIs
const mockChrome = {
  runtime: {
    onInstalled: {
      addListener: vi.fn()
    },
    onMessage: {
      addListener: vi.fn()
    },
    sendMessage: vi.fn(),
    getManifest: vi.fn(() => ({
      version: '1.0.0',
      manifest_version: 3
    }))
  },
  storage: {
    sync: {
      get: vi.fn(),
      set: vi.fn(),
      clear: vi.fn()
    },
    local: {
      get: vi.fn(),
      set: vi.fn(),
      clear: vi.fn()
    }
  },
  tabs: {
    query: vi.fn(),
    sendMessage: vi.fn(),
    onUpdated: {
      addListener: vi.fn()
    }
  },
  notifications: {
    create: vi.fn()
  },
  action: {
    setBadgeText: vi.fn(),
    setBadgeBackgroundColor: vi.fn()
  }
};

// Define global chrome object
Object.defineProperty(globalThis, 'chrome', {
  value: mockChrome,
  writable: true
});

// Mock DOM APIs for JSDOM
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock console methods for testing
const originalConsole = { ...console };
globalThis.console = {
  ...originalConsole,
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};

// Reset mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});

// Export mock objects for use in tests
export { mockChrome }; 