import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockChrome } from '../setup.js';

// Since background.ts has a class that's instantiated immediately, we need to mock it
// We'll test the individual methods by importing and testing them separately

describe('Background Script', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Chrome Extension Event Listeners', () => {
    it('should set up onInstalled listener', async () => {
      // Import background script (this will execute the initialization)
      await import('../../src/background.js');
      
      expect(mockChrome.runtime.onInstalled.addListener).toHaveBeenCalledOnce();
    });

    it('should set up onMessage listener', async () => {
      await import('../../src/background.js');
      
      expect(mockChrome.runtime.onMessage.addListener).toHaveBeenCalledOnce();
    });

    it('should set up tab update listener', async () => {
      await import('../../src/background.js');
      
      expect(mockChrome.tabs.onUpdated.addListener).toHaveBeenCalledOnce();
    });
  });

  describe('Installation Handler', () => {
    it('should handle fresh install', () => {
      const mockInstallDetails = { reason: 'install' as chrome.runtime.OnInstalledReason };
      
      // Mock the storage operations
      mockChrome.storage.sync.set.mockResolvedValue(undefined);
      mockChrome.notifications.create.mockResolvedValue('notification-id');
      
      // Get the install listener callback
      const installListener = mockChrome.runtime.onInstalled.addListener.mock.calls[0]?.[0];
      
      if (installListener) {
        installListener(mockInstallDetails);
        
        // Should set default settings
        expect(mockChrome.storage.sync.set).toHaveBeenCalledWith({
          enabled: false,
          device: 'none',
          customInsets: { top: 0, bottom: 0, left: 0, right: 0 },
          showDebugOverlay: false
        });
      }
    });

    it('should handle extension update', () => {
      const mockInstallDetails = { 
        reason: 'update' as chrome.runtime.OnInstalledReason,
        previousVersion: '0.9.0'
      };
      
      const installListener = mockChrome.runtime.onInstalled.addListener.mock.calls[0]?.[0];
      
      if (installListener) {
        installListener(mockInstallDetails);
        
        // Should handle update (no default settings set for updates)
        expect(mockChrome.storage.sync.set).not.toHaveBeenCalled();
      }
    });
  });

  describe('Message Handler', () => {
    it('should handle getCurrentSettings message', async () => {
      const mockSettings = {
        enabled: true,
        device: 'iphone15Pro',
        customInsets: { top: 50, bottom: 30, left: 0, right: 0 }
      };
      
      mockChrome.storage.sync.get.mockResolvedValue(mockSettings);
      
      const messageListener = mockChrome.runtime.onMessage.addListener.mock.calls[0]?.[0];
      const mockSendResponse = vi.fn();
      
      if (messageListener) {
        const result = messageListener(
          { action: 'getCurrentSettings' },
          { tab: { id: 1 } },
          mockSendResponse
        );
        
        expect(result).toBe(true); // Should return true for async response
        
        // Wait for async operation
        await new Promise(resolve => setTimeout(resolve, 0));
        
        expect(mockChrome.storage.sync.get).toHaveBeenCalled();
      }
    });

    it('should handle updateAllTabs message', async () => {
      const mockSettings = {
        enabled: true,
        device: 'iphone15Pro'
      };
      
      const mockTabs = [
        { id: 1, url: 'https://example.com' },
        { id: 2, url: 'https://test.com' }
      ];
      
      mockChrome.tabs.query.mockResolvedValue(mockTabs);
      mockChrome.tabs.sendMessage.mockResolvedValue({ success: true });
      
      const messageListener = mockChrome.runtime.onMessage.addListener.mock.calls[0]?.[0];
      const mockSendResponse = vi.fn();
      
      if (messageListener) {
        const result = messageListener(
          { action: 'updateAllTabs', settings: mockSettings },
          { tab: { id: 1 } },
          mockSendResponse
        );
        
        expect(result).toBe(true);
        
        // Wait for async operation
        await new Promise(resolve => setTimeout(resolve, 0));
        
        expect(mockChrome.tabs.query).toHaveBeenCalledWith({});
      }
    });

    it('should handle unknown action', () => {
      const messageListener = mockChrome.runtime.onMessage.addListener.mock.calls[0]?.[0];
      const mockSendResponse = vi.fn();
      
      if (messageListener) {
        const result = messageListener(
          { action: 'unknownAction' },
          { tab: { id: 1 } },
          mockSendResponse
        );
        
        expect(result).toBe(false);
        expect(mockSendResponse).toHaveBeenCalledWith({ error: 'Unknown action' });
      }
    });
  });

  describe('Tab Update Handler', () => {
    it('should apply settings to completed tabs', async () => {
      const mockTab = {
        id: 1,
        status: 'complete',
        url: 'https://example.com'
      };
      
      mockChrome.storage.sync.get.mockResolvedValue({
        enabled: true,
        device: 'iphone15Pro'
      });
      mockChrome.tabs.sendMessage.mockResolvedValue({ success: true });
      
      const tabUpdateListener = mockChrome.tabs.onUpdated.addListener.mock.calls[0]?.[0];
      
      if (tabUpdateListener) {
        await tabUpdateListener(1, { status: 'complete' }, mockTab);
        
        expect(mockChrome.storage.sync.get).toHaveBeenCalled();
      }
    });

    it('should skip chrome:// URLs', async () => {
      const mockTab = {
        id: 1,
        status: 'complete',
        url: 'chrome://extensions/'
      };
      
      const tabUpdateListener = mockChrome.tabs.onUpdated.addListener.mock.calls[0]?.[0];
      
      if (tabUpdateListener) {
        await tabUpdateListener(1, { status: 'complete' }, mockTab);
        
        // Should not try to send message to chrome:// URLs
        expect(mockChrome.tabs.sendMessage).not.toHaveBeenCalled();
      }
    });

    it('should skip incomplete tabs', async () => {
      const mockTab = {
        id: 1,
        status: 'loading',
        url: 'https://example.com'
      };
      
      const tabUpdateListener = mockChrome.tabs.onUpdated.addListener.mock.calls[0]?.[0];
      
      if (tabUpdateListener) {
        await tabUpdateListener(1, { status: 'loading' }, mockTab);
        
        // Should not process loading tabs
        expect(mockChrome.storage.sync.get).not.toHaveBeenCalled();
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle storage errors gracefully', async () => {
      mockChrome.storage.sync.get.mockRejectedValue(new Error('Storage error'));
      
      const messageListener = mockChrome.runtime.onMessage.addListener.mock.calls[0]?.[0];
      const mockSendResponse = vi.fn();
      
      if (messageListener) {
        messageListener(
          { action: 'getCurrentSettings' },
          { tab: { id: 1 } },
          mockSendResponse
        );
        
        // Wait for async operation
        await new Promise(resolve => setTimeout(resolve, 0));
        
        // Should handle error without crashing
        expect(console.error).toHaveBeenCalled();
      }
    });

    it('should handle tab message errors gracefully', async () => {
      mockChrome.tabs.sendMessage.mockRejectedValue(new Error('Tab not found'));
      mockChrome.storage.sync.get.mockResolvedValue({ enabled: true });
      
      const mockTab = {
        id: 1,
        status: 'complete',
        url: 'https://example.com'
      };
      
      const tabUpdateListener = mockChrome.tabs.onUpdated.addListener.mock.calls[0]?.[0];
      
      if (tabUpdateListener) {
        await tabUpdateListener(1, { status: 'complete' }, mockTab);
        
        // Should handle error without crashing
        expect(console.error).toHaveBeenCalled();
      }
    });
  });
}); 