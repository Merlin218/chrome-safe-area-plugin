#!/usr/bin/env node

/**
 * Icon Generation Script
 * 
 * Automatically generates PNG icons from SVG source using Sharp library.
 * 
 * Required icon sizes for Chrome extension:
 * - 16x16 (icon16.png) - Extension icon in extension management page
 * - 48x48 (icon48.png) - Extension icon in extension management page and notifications
 * - 128x128 (icon128.png) - Extension icon in Chrome Web Store and installation dialog
 */

const fs = require('fs');
const path = require('path');

console.log('🎨 Safe Area Simulator - Auto Icon Generation');
console.log('===============================================');
console.log('');

const iconSizes = [16, 48, 128];
const iconsDir = path.join(__dirname, 'icons');
const svgPath = path.join(iconsDir, 'icon.svg');

// Check if Sharp is available
let sharp;
try {
  sharp = require('sharp');
  console.log('✅ Sharp library detected - using automatic conversion');
} catch (error) {
  console.log('⚠️  Sharp library not found - falling back to manual instructions');
  sharp = null;
}

// Check if SVG exists
if (!fs.existsSync(svgPath)) {
  console.error('❌ SVG icon not found at:', svgPath);
  console.log('Please ensure icon.svg exists in the icons directory.');
  process.exit(1);
}

console.log('✅ SVG icon found:', svgPath);
console.log('');

async function generatePngIcons() {
  if (!sharp) {
    showManualInstructions();
    return;
  }

  try {
    console.log('🔄 Generating PNG icons automatically...');
    console.log('');

    // Read SVG content
    const svgBuffer = fs.readFileSync(svgPath);
    
    // Generate PNG files for each size
    for (const size of iconSizes) {
      const pngPath = path.join(iconsDir, `icon${size}.png`);
      
      console.log(`📐 Generating ${size}x${size} icon...`);
      
      await sharp(svgBuffer)
        .resize(size, size)
        .png({
          quality: 100,
          compressionLevel: 9,
          adaptiveFiltering: true
        })
        .toFile(pngPath);
      
      console.log(`   ✅ Created: icon${size}.png`);
    }

    console.log('');
    console.log('🎉 All PNG icons generated successfully!');
    console.log('');
    
    // Verify generated files
    console.log('📋 Generated files:');
    iconSizes.forEach(size => {
      const pngPath = path.join(iconsDir, `icon${size}.png`);
      if (fs.existsSync(pngPath)) {
        const stats = fs.statSync(pngPath);
        console.log(`   ✅ icon${size}.png (${Math.round(stats.size / 1024)}KB)`);
      } else {
        console.log(`   ❌ icon${size}.png - generation failed`);
      }
    });

    console.log('');
    console.log('🚀 Your Chrome extension is now ready to install!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Open Chrome and go to chrome://extensions/');
    console.log('2. Enable "Developer mode"');
    console.log('3. Click "Load unpacked" and select this directory');
    console.log('4. Test with the included test.html file');

  } catch (error) {
    console.error('❌ Error generating PNG icons:', error.message);
    console.log('');
    console.log('💡 Falling back to manual instructions:');
    showManualInstructions();
  }
}

function showManualInstructions() {
  console.log('📝 Manual conversion instructions:');
  console.log('');
  console.log('Since Sharp library is not available, please convert manually:');
  console.log('');
  console.log('Method 1 - Install Sharp dependency:');
  console.log('npm install sharp');
  console.log('npm run generate-icons');
  console.log('');
  console.log('Method 2 - Online Tools:');
  console.log('1. Visit https://svgtopng.com/ or https://cloudconvert.com/svg-to-png');
  console.log('2. Upload icons/icon.svg');
  console.log('3. Generate PNG files at these sizes:');
  iconSizes.forEach(size => {
    console.log(`   - ${size}x${size} → save as icons/icon${size}.png`);
  });
  console.log('');
  console.log('Method 3 - Command Line Tools:');
  console.log('If you have ImageMagick or Inkscape installed:');
  console.log('');
  console.log('ImageMagick:');
  iconSizes.forEach(size => {
    console.log(`convert -background none -size ${size}x${size} icons/icon.svg icons/icon${size}.png`);
  });
  console.log('');
  console.log('Inkscape:');
  iconSizes.forEach(size => {
    console.log(`inkscape -w ${size} -h ${size} icons/icon.svg -o icons/icon${size}.png`);
  });
  console.log('');
  
  // Create placeholder files for development
  console.log('🔧 Creating placeholder files for development...');
  iconSizes.forEach(size => {
    const pngPath = path.join(iconsDir, `icon${size}.png`);
    if (!fs.existsSync(pngPath)) {
      const placeholder = `# Placeholder for icon${size}.png\n# Convert the SVG icon to ${size}x${size} PNG format\n# and replace this file.`;
      fs.writeFileSync(pngPath + '.placeholder', placeholder);
      console.log(`   📄 Created ${pngPath}.placeholder`);
    }
  });
}

// Check for existing PNG files
console.log('📋 Checking for existing PNG icons:');
let allExist = true;
iconSizes.forEach(size => {
  const pngPath = path.join(iconsDir, `icon${size}.png`);
  if (fs.existsSync(pngPath)) {
    const stats = fs.statSync(pngPath);
    console.log(`   ✅ icon${size}.png exists (${Math.round(stats.size / 1024)}KB)`);
  } else {
    console.log(`   ❌ icon${size}.png missing`);
    allExist = false;
  }
});

console.log('');

if (allExist) {
  console.log('🎉 All PNG icons already exist!');
  console.log('💡 To regenerate icons, delete the existing PNG files and run this script again.');
} else {
  // Generate missing icons
  generatePngIcons();
}

console.log('');
console.log('✨ Icon generation complete!'); 