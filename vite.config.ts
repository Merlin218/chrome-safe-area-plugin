import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';
import archiver from 'archiver';

// Function to create zip package
async function createZipPackage(sourceDir: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath);
    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximum compression
    });

    output.on('close', () => {
      const sizeInMB = (archive.pointer() / 1024 / 1024).toFixed(2);
      console.log(`📦 Extension package created: ${outputPath}`);
      console.log(`   Size: ${sizeInMB} MB (${archive.pointer()} bytes)`);
      resolve();
    });

    archive.on('error', (err) => {
      reject(err);
    });

    archive.pipe(output);

    // Add all files from the dist directory
    archive.directory(sourceDir, false);
    archive.finalize();
  });
}

// Enhanced plugin to copy static files and handle Chrome extension specifics
function chromeExtensionPlugin() {
  return {
    name: 'chrome-extension-plugin',
    generateBundle(options, bundle) {
      // Process all JS files to handle imports/exports for Chrome extension compatibility
      Object.keys(bundle).forEach(fileName => {
        if (fileName.endsWith('.js') && bundle[fileName].code) {
          let code = bundle[fileName].code;
          
          // Remove all import statements
          code = code.replace(/import\s+.*?from\s+['"`].*?['"`];?\s*\n?/g, '');
          code = code.replace(/import\s*\{[^}]*\}\s*from\s+['"`].*?['"`];?\s*\n?/g, '');
          code = code.replace(/import\s+\*\s+as\s+\w+\s+from\s+['"`].*?['"`];?\s*\n?/g, '');
          
          // Remove all export statements
          code = code.replace(/export\s*\{\s*[^}]*\s*\};?\s*\n?/g, '');
          code = code.replace(/export\s+default\s+[^;\n]+;?\s*\n?/g, '');
          code = code.replace(/export\s+\{[^}]+\};?\s*\n?/g, '');
          
          // For devices.js, add global assignment
          if (fileName === 'devices.js') {
            code += '\n\n// Make DEVICES available globally for Chrome extension\nwindow.DEVICES = DEVICES;\nif (typeof globalThis !== "undefined") globalThis.DEVICES = DEVICES;\n';
          }
          
          // For content scripts that might need DEVICES, add a comment about the dependency
          if (['content.js', 'popup.js'].includes(fileName)) {
            code = '// DEVICES will be loaded globally from devices.js\n' + code;
          }
          
          bundle[fileName].code = code;
        }
      });
    },
    async writeBundle() {
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
      let manifest;
      try {
        manifest = JSON.parse(fs.readFileSync('dist/manifest.json', 'utf8'));
        if (!manifest.manifest_version) {
          console.warn('⚠️  Warning: manifest.json missing manifest_version');
        }
        console.log('✅ Extension structure validated');
      } catch (error) {
        console.error('❌ Error validating manifest.json:', error.message);
      }
      
      console.log('📦 Static files copied successfully');
      
      // Create zip package if enabled
      if (process.env.CREATE_ZIP !== 'false') {
        try {
          // Ensure packages directory exists
          const packagesDir = 'packages';
          if (!fs.existsSync(packagesDir)) {
            fs.mkdirSync(packagesDir, { recursive: true });
          }

          // Generate filename with version and timestamp
          const version = manifest?.version || '1.0.0';
          const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
          const zipFileName = `${packagesDir}/chrome-safe-area-plugin-v${version}-${timestamp}.zip`;
          
          await createZipPackage('dist', zipFileName);
          console.log('🎉 Extension package ready for Chrome Web Store!');
        } catch (error) {
          console.error('❌ Error creating zip package:', error);
        }
      }
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
    emptyOutDir: true,
    minify: false,
        sourcemap: true,
    rollupOptions: {
      input: {
        background: resolve(__dirname, 'src/background.ts'),
        content: resolve(__dirname, 'src/content.ts'),
        devices: resolve(__dirname, 'src/devices.ts'),
        'phone-frame-simple': resolve(__dirname, 'src/phone-frame-simple.ts'),
        'phone-mockup': resolve(__dirname, 'src/phone-mockup.ts'),
        popup: resolve(__dirname, 'src/popup.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
        format: 'es'
      },
      external: ['chrome']
    },
    target: 'es2020'
  },
  plugins: [chromeExtensionPlugin()],
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
  },
  optimizeDeps: {
    exclude: ['chrome']
  }
}); 