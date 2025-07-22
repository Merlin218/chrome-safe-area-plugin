import { defineConfig } from 'wxt';
import { resolve } from 'path';

export default defineConfig({
  // Configure the source directory (WXT looks for entrypoints in the root by default)
  srcDir: '.', 
  
  // Configure the output directory  
  outDir: '.output',
  
  // TypeScript support is built-in
  // Manifest version 3 is default
  manifestVersion: 3,
  
  // Configure Vite options to handle aliases and imports
  vite: () => ({
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@types': resolve(__dirname, 'types')
      }
    },
    build: {
      // Enable source maps for development
      sourcemap: true,
      // Target ES2020 like the original config
      target: 'es2020'
    }
  }),
  
  // Configure additional static assets
  publicDir: 'icons',
  
  // Configure the manifest
  manifest: {
    name: 'Safe Area Simulator',
    version: '1.0.0',
    description: 'Simulate mobile device safe area insets for web development',
    permissions: ['activeTab', 'storage'],
    icons: {
      '16': 'icon16.png',
      '48': 'icon48.png',
      '128': 'icon128.png'
    }
  }
});