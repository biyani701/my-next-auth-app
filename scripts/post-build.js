/**
 * This script runs after the build to ensure CSS is properly generated
 */

const fs = require('fs');
const path = require('path');

console.log('Running post-build checks...');

// Function to check if a directory exists
function directoryExists(dirPath) {
  try {
    return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
  } catch (e) {
    return false;
  }
}

// Function to check if a file exists
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
  } catch (e) {
    return false;
  }
}

// Function to recursively find CSS files in a directory
function findCssFiles(dir, fileList = []) {
  if (!directoryExists(dir)) return fileList;
  
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    
    if (fs.statSync(filePath).isDirectory()) {
      findCssFiles(filePath, fileList);
    } else if (file.endsWith('.css')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Main function
function runPostBuildChecks() {
  // Check if .next directory exists
  const nextDir = path.join(process.cwd(), '.next');
  if (!directoryExists(nextDir)) {
    console.error('.next directory not found. Build may have failed.');
    return;
  }
  
  console.log('.next directory found.');
  
  // Find CSS files in the .next directory
  const cssFiles = findCssFiles(nextDir);
  console.log(`Found ${cssFiles.length} CSS files in the .next directory:`);
  cssFiles.forEach(file => {
    console.log(`- ${path.relative(process.cwd(), file)}`);
  });
  
  if (cssFiles.length === 0) {
    console.warn('No CSS files found in the .next directory. This may indicate a CSS processing issue.');
  }
}

// Run the function
try {
  runPostBuildChecks();
  console.log('Post-build checks completed successfully.');
} catch (error) {
  console.error('Error running post-build checks:', error);
}
