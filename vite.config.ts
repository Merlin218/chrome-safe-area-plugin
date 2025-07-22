import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

// Enhanced plugin to copy static files and validate extension structure
function chromeExtensionPlugin() {
  return {
    name: 'chrome-extension-plugin',
    writeBundle() {
      console.log('📂 Copying static files...');
      
      // Copy HTML files
      if (fs.existsSync('popup.html')) {
        fs.copyFileSync('popup.html', 'dist/popup.html');
        console.log('  ✓ popup.html');
      }
      
      // Copy CSS files
      if (fs.existsSync('popup.css')) {
        fs.copyFileSync('popup.css', 'dist/popup.css');
        console.log('  ✓ popup.css');
      }
      
      // Copy manifest
      if (fs.existsSync('src/manifest.json')) {
        fs.copyFileSync('src/manifest.json', 'dist/manifest.json');
        console.log('  ✓ manifest.json');
      }
      
      // Copy icons directory
      if (fs.existsSync('icons')) {
        if (!fs.existsSync('dist/icons')) {
          fs.mkdirSync('dist/icons');
        }
        fs.readdirSync('icons').forEach(file => {
          if (file.endsWith('.png') || file.endsWith('.svg')) {
            fs.copyFileSync(`icons/${file}`, `dist/icons/${file}`);
            console.log(`  ✓ icons/${file}`);
          }
        });
      }
      
      // Validate manifest.json
      try {
        const manifest = JSON.parse(fs.readFileSync('dist/manifest.json', 'utf8'));
        if (!manifest.manifest_version) {
          console.warn('⚠️  Warning: manifest.json missing manifest_version');
        }
        console.log('✅ Extension structure validated');
      } catch (error) {
        console.error('❌ Error validating manifest.json:', error.message);
      }
      
      console.log('📦 Static files copied successfully');
    },
    buildStart() {
      console.log('🚀 Building Chrome Safe Area Extension with Vite...');
    },
    buildEnd() {
      console.log('✅ Build completed! Extension ready in ./dist directory');
      console.log('');
      console.log('📋 Next steps:');
      console.log('1. Open Chrome and go to chrome://extensions/');
      console.log('2. Enable "Developer mode"');
      console.log('3. Click "Load unpacked" and select the ./dist directory');
      console.log('4. The extension should now be loaded and ready to use!');
    }
  };
}

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@types': resolve(__dirname, 'types')
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true, // Keep readable for debugging
    minify: false, // Keep readable for debugging
    sourcemap: true, // External sourcemaps for debugging
    rollupOptions: {
      input: {
        // Background script
        background: resolve(__dirname, 'src/background.ts'),
        // Content scripts  
        content: resolve(__dirname, 'src/content.ts'),
        devices: resolve(__dirname, 'src/devices.ts'),
        'phone-frame-simple': resolve(__dirname, 'src/phone-frame-simple.ts'),
        'phone-mockup': resolve(__dirname, 'src/phone-mockup.ts'),
        // Popup
        popup: resolve(__dirname, 'src/popup.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
        format: 'es', // ES modules for Chrome extensions
        inlineDynamicImports: false
      },
      external: ['chrome']
    },
    target: 'es2020'
  },
  plugins: [chromeExtensionPlugin()],
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
  },
  // Optimization for Chrome extension
  optimizeDeps: {
    exclude: ['chrome']
  }
}); 