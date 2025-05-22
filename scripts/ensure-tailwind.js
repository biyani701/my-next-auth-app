/**
 * This script ensures that the correct Tailwind CSS packages are installed
 * It runs before the build process on Vercel to prevent build failures
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Check if we're running in a Vercel environment
const isVercel = process.env.VERCEL === '1';

console.log('Checking Tailwind CSS configuration...');

// Function to check if a package is installed
function isPackageInstalled(packageName) {
  try {
    require.resolve(packageName);
    return true;
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
function ensureTailwindSetup() {
  const tailwindVersion = getTailwindVersion();
  console.log(`Detected Tailwind CSS version: ${tailwindVersion || 'Not installed'}`);
  
  // Check if we need @tailwindcss/postcss
  const needsPostcssPlugin = tailwindVersion && tailwindVersion.startsWith('4');
  const hasPostcssPlugin = isPackageInstalled('@tailwindcss/postcss');
  
  if (needsPostcssPlugin && !hasPostcssPlugin) {
    console.log('Tailwind CSS v4+ detected but @tailwindcss/postcss is not installed.');
    console.log('Installing @tailwindcss/postcss...');
    
    if (isVercel) {
      // On Vercel, we need to install the package
      execSync('npm install @tailwindcss/postcss', { stdio: 'inherit' });
    } else {
      console.log('Not running on Vercel. Please install manually:');
      console.log('npm install @tailwindcss/postcss');
    }
  } else if (needsPostcssPlugin && hasPostcssPlugin) {
    console.log('Tailwind CSS v4+ and @tailwindcss/postcss are both installed. Configuration is correct.');
  } else if (!needsPostcssPlugin && tailwindVersion) {
    console.log('Using Tailwind CSS v3 or earlier. No additional packages needed.');
  }
  
  // Ensure PostCSS config is correct
  const postcssConfigPath = path.join(process.cwd(), 'postcss.config.js');
  if (fs.existsSync(postcssConfigPath)) {
    console.log('PostCSS configuration file exists.');
  } else {
    console.log('PostCSS configuration file not found. Creating one...');
    const postcssConfig = `
module.exports = {
  plugins: {
    ${needsPostcssPlugin ? "'@tailwindcss/postcss': {}" : "'tailwindcss': {}"},
    'autoprefixer': {},
  },
};
`;
    fs.writeFileSync(postcssConfigPath, postcssConfig);
    console.log('Created PostCSS configuration file.');
  }
}

// Run the function
try {
  ensureTailwindSetup();
  console.log('Tailwind CSS setup check completed successfully.');
} catch (error) {
  console.error('Error checking Tailwind CSS setup:', error);
  // Don't exit with error to allow build to continue
}
