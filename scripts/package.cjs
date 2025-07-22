const fs = require('fs');
const archiver = require('archiver');
const path = require('path');

// Function to create zip package
async function createZipPackage(sourceDir, outputPath) {
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

async function main() {
  try {
    // Check if dist directory exists
    if (!fs.existsSync('dist')) {
      console.error('❌ Error: dist directory not found. Please run "npm run build" first.');
      process.exit(1);
    }

    // Ensure packages directory exists
    const packagesDir = 'packages';
    if (!fs.existsSync(packagesDir)) {
      fs.mkdirSync(packagesDir, { recursive: true });
      console.log('📁 Created packages directory');
    }

    // Read version from manifest
    let version = '1.0.0';
    try {
      const manifestPath = path.join('dist', 'manifest.json');
      if (fs.existsSync(manifestPath)) {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        version = manifest.version || '1.0.0';
      }
    } catch (error) {
      console.warn('⚠️  Warning: Could not read version from manifest.json');
    }

    // Generate filename with version and timestamp
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
    const zipFileName = `${packagesDir}/chrome-safe-area-plugin-v${version}-${timestamp}.zip`;

    console.log('🏗️  Creating extension package...');
    await createZipPackage('dist', zipFileName);
    console.log('🎉 Extension package ready for Chrome Web Store!');
    
  } catch (error) {
    console.error('❌ Error creating package:', error);
    process.exit(1);
  }
}

main(); 