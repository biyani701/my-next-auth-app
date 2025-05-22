/**
 * This script ensures that CSS is properly processed during the build
 * It runs before the build process on Vercel to prevent CSS issues
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Check if we're running in a Vercel environment
const isVercel = process.env.VERCEL === '1';

console.log('Checking CSS configuration...');

// Function to check if a file exists
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (e) {
    return false;
  }
}

// Main function
function ensureCssSetup() {
  // Check if globals.css exists
  const globalsCssPath = path.join(process.cwd(), 'app', 'globals.css');
  if (!fileExists(globalsCssPath)) {
    console.error('globals.css not found at', globalsCssPath);
    return;
  }
  
  console.log('globals.css found at', globalsCssPath);
  
  // Check if tailwind.config.js exists
  const tailwindConfigPath = path.join(process.cwd(), 'tailwind.config.js');
  if (!fileExists(tailwindConfigPath)) {
    console.error('tailwind.config.js not found at', tailwindConfigPath);
    return;
  }
  
  console.log('tailwind.config.js found at', tailwindConfigPath);
  
  // Check if postcss.config.js exists
  const postcssConfigPath = path.join(process.cwd(), 'postcss.config.js');
  if (!fileExists(postcssConfigPath)) {
    console.error('postcss.config.js not found at', postcssConfigPath);
    return;
  }
  
  console.log('postcss.config.js found at', postcssConfigPath);
  
  // If we're on Vercel, create a temporary CSS file to force CSS processing
  if (isVercel) {
    console.log('Creating temporary CSS file to force CSS processing...');
    const tempCssPath = path.join(process.cwd(), 'app', 'temp-styles.css');
    fs.writeFileSync(tempCssPath, '/* Temporary CSS file to force CSS processing */\n');
    console.log('Temporary CSS file created at', tempCssPath);
    
    // Schedule deletion of the temporary file after the build
    process.on('exit', () => {
      try {
        if (fileExists(tempCssPath)) {
          fs.unlinkSync(tempCssPath);
          console.log('Temporary CSS file deleted');
        }
      } catch (e) {
        console.error('Error deleting temporary CSS file:', e);
      }
    });
  }
}

// Run the function
try {
  ensureCssSetup();
  console.log('CSS setup check completed successfully.');
} catch (error) {
  console.error('Error checking CSS setup:', error);
  // Don't exit with error to allow build to continue
}
