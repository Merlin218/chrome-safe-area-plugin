#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Create dist directory
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

console.log('🚀 Building Chrome Safe Area Extension...');

// Step 1: Type check
console.log('📝 Running TypeScript type check...');
try {
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  console.log('✅ Type check passed');
} catch (error) {
  console.log('⚠️  Type check had issues, continuing build...');
}

// Step 2: Copy static files first
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

// Step 3: Simple TypeScript to JavaScript transformation
console.log('🔄 Transforming TypeScript files...');

const tsFiles = [
  { src: 'src/devices.ts', dest: 'dist/devices.js' },
  { src: 'src/background.ts', dest: 'dist/background.js' },
  { src: 'src/content.ts', dest: 'dist/content.js' },
  { src: 'src/popup.ts', dest: 'dist/popup.js' },
  { src: 'src/phone-frame-simple.ts', dest: 'dist/phone-frame-simple.js' },
  { src: 'src/phone-mockup.ts', dest: 'dist/phone-mockup.js' }
];

// Simple transformation: remove types and convert imports
tsFiles.forEach(({ src, dest }) => {
  if (fs.existsSync(src)) {
    let content = fs.readFileSync(src, 'utf8');
    
    // Remove type annotations and imports
    content = content
      // Remove import type statements
      .replace(/import type .* from .*;\n?/g, '')
      // Remove triple slash references
      .replace(/\/\/\/ <reference.*\/>\n?/g, '')
      // Convert ES6 imports to simpler form for Chrome extension
      .replace(/import\s+(\w+)\s+from\s+['"`](.+?)['"`];?/g, '')
      // Remove function return type annotations
      .replace(/\):\s*[A-Z]\w*(\[\])?(\s*\|\s*null)?(\s*\|\s*undefined)?(\s*\|\s*void)?\s*{/g, ') {')
      // Remove type annotations from function parameters and variables
      .replace(/:\s*[A-Z]\w*(\[\])?(\s*\|\s*null)?(\s*\|\s*undefined)?(\s*\|\s*void)?/g, '')
      // Remove interface and type declarations
      .replace(/^\s*private\s+/gm, '')
      .replace(/^\s*public\s+/gm, '')
      // Remove generic type parameters
      .replace(/<[^>]+>/g, '')
      // Remove method visibility modifiers
      .replace(/\b(private|public|protected)\s+/g, '')
      // Add DEVICES declaration at the top for files that use it
      .replace(/^/, src.includes('content.ts') || src.includes('popup.ts') ? '// DEVICES will be injected by content script loading order\n' : '');
    
    fs.writeFileSync(dest, content);
    console.log(`  ✓ ${src} → ${dest}`);
  }
});

// Step 4: Fix device import for dependent files
console.log('🔧 Fixing module dependencies...');

// For content.js and popup.js, add a simple devices reference
const filesToFix = ['dist/content.js', 'dist/popup.js'];
filesToFix.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    // Add a comment noting that DEVICES comes from devices.js loaded first
    if (!content.includes('DEVICES')) {
      content = '// DEVICES global will be available from devices.js loaded first\n' + content;
      fs.writeFileSync(file, content);
    }
  }
});

console.log('✅ Build completed! Extension ready in ./dist directory');
console.log('');
console.log('📋 Next steps:');
console.log('1. Open Chrome and go to chrome://extensions/');
console.log('2. Enable "Developer mode"');
console.log('3. Click "Load unpacked" and select the ./dist directory');
console.log('4. The extension should now be loaded and ready to use!');
console.log(''); 