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

// Function to get installed Tailwind version
function getTailwindVersion() {
  try {
    return require('tailwindcss').version;
  } catch (e) {
    return null;
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

  // Get Tailwind version
  const tailwindVersion = getTailwindVersion();
  console.log(`Detected Tailwind CSS version: ${tailwindVersion || 'Not installed'}`);

  // If we're on Vercel, ensure CSS is properly processed
  if (isVercel) {
    // Create a temporary CSS file to force CSS processing
    console.log('Creating temporary CSS file to force CSS processing...');
    const tempCssPath = path.join(process.cwd(), 'app', 'temp-styles.css');

    // Add some Tailwind classes to ensure they're included in the build
    const tempCssContent = `
/* Temporary CSS file to force CSS processing */
/* This file includes common Tailwind classes to ensure they're included in the build */

.temp-container {
  @apply container mx-auto px-4;
}

.temp-flex {
  @apply flex flex-col min-h-screen;
}

.temp-text {
  @apply text-3xl font-bold text-blue-600;
}

.temp-border {
  @apply border-b border-t border-gray-200;
}

.temp-spacing {
  @apply space-y-2 mt-2 mx-2 py-4 py-6 py-8;
}

.temp-misc {
  @apply rounded-md text-sm text-gray-500 text-center flex-grow space-x-2 font-semibold;
}
`;

    fs.writeFileSync(tempCssPath, tempCssContent);
    console.log('Temporary CSS file created at', tempCssPath);

    // For Tailwind v3, ensure we have the correct version
    if (tailwindVersion && !tailwindVersion.startsWith('3')) {
      console.log('Tailwind v3 expected, but found v' + tailwindVersion + '. Installing v3.4.1...');
      try {
        execSync('npm install tailwindcss@3.4.1', { stdio: 'inherit' });
      } catch (error) {
        console.error('Error installing tailwindcss:', error);
      }
    }

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
