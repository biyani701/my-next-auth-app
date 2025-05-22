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
  // Check if tailwindcss is installed
  if (!isPackageInstalled('tailwindcss')) {
    console.log('Tailwind CSS is not installed. Installing...');
    if (isVercel) {
      execSync('npm install tailwindcss@4.1.7', { stdio: 'inherit' });
    } else {
      console.log('Not running on Vercel. Please install manually:');
      console.log('npm install tailwindcss@4.1.7');
    }
  } else {
    const tailwindVersion = getTailwindVersion();
    console.log(`Tailwind CSS is installed (version ${tailwindVersion}).`);

    // Check if we need to upgrade to v4
    if (tailwindVersion && !tailwindVersion.startsWith('4')) {
      console.log('Upgrading Tailwind CSS to v4...');
      if (isVercel) {
        execSync('npm install tailwindcss@4.1.7', { stdio: 'inherit' });
      } else {
        console.log('Not running on Vercel. Please upgrade manually:');
        console.log('npm install tailwindcss@4.1.7');
      }
    }
  }

  // Check if @tailwindcss/postcss is installed
  if (!isPackageInstalled('@tailwindcss/postcss')) {
    console.log('@tailwindcss/postcss is not installed. Installing...');
    if (isVercel) {
      execSync('npm install @tailwindcss/postcss@4.1.7', { stdio: 'inherit' });
    } else {
      console.log('Not running on Vercel. Please install manually:');
      console.log('npm install @tailwindcss/postcss@4.1.7');
    }
  } else {
    console.log('@tailwindcss/postcss is installed.');
  }

  // Check if autoprefixer is installed
  if (!isPackageInstalled('autoprefixer')) {
    console.log('Autoprefixer is not installed. Installing...');
    if (isVercel) {
      execSync('npm install autoprefixer', { stdio: 'inherit' });
    } else {
      console.log('Not running on Vercel. Please install manually:');
      console.log('npm install autoprefixer');
    }
  } else {
    console.log('Autoprefixer is installed.');
  }

  // Ensure PostCSS config is correct
  const postcssConfigPath = path.join(process.cwd(), 'postcss.config.js');
  if (fs.existsSync(postcssConfigPath)) {
    console.log('PostCSS configuration file exists.');

    // Update the PostCSS config to use @tailwindcss/postcss
    const postcssConfig = `
/**
 * PostCSS configuration for Tailwind CSS v4
 * This ensures compatibility with Vercel deployment
 */
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    'autoprefixer': {},
  },
};
`;
    fs.writeFileSync(postcssConfigPath, postcssConfig);
    console.log('Updated PostCSS configuration file for Tailwind CSS v4.');
  } else {
    console.log('PostCSS configuration file not found. Creating one...');
    const postcssConfig = `
/**
 * PostCSS configuration for Tailwind CSS v4
 * This ensures compatibility with Vercel deployment
 */
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
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
