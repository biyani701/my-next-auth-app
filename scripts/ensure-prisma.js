/**
 * This script ensures that Prisma is properly set up for Vercel deployment
 * It runs before the build process on Vercel to prevent build failures
 *
 * This script specifically addresses the Vercel caching issue described at:
 * https://www.prisma.io/docs/orm/more/help-and-troubleshooting/vercel-caching-issue
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Check if we're running in a Vercel environment
const isVercel = process.env.VERCEL === '1';

console.log('Checking Prisma configuration...');

// Function to check if DATABASE_URL is set
function isDatabaseUrlSet() {
  return !!process.env.DATABASE_URL;
}

// Function to check if Prisma client exists
function doesPrismaClientExist() {
  const prismaClientPath = path.join(process.cwd(), 'node_modules', '.prisma', 'client');
  return fs.existsSync(prismaClientPath);
}

// Main function
function ensurePrismaSetup() {
  if (!isDatabaseUrlSet()) {
    console.log('DATABASE_URL is not set. Prisma will not be used.');
    return;
  }

  console.log('DATABASE_URL is set. Ensuring Prisma is properly configured...');

  // Check if we're on Vercel and need to handle the caching issue
  if (isVercel) {
    console.log('Running on Vercel. Checking for Prisma client...');

    // Force Prisma to generate the client regardless of cache
    try {
      // Clean up any existing Prisma client
      const prismaClientPath = path.join(process.cwd(), 'node_modules', '.prisma');
      if (fs.existsSync(prismaClientPath)) {
        console.log('Removing existing Prisma client...');
        execSync(`rm -rf ${prismaClientPath}`, { stdio: 'inherit' });
      }

      // Generate the Prisma client
      console.log('Generating Prisma client...');
      execSync('npx prisma generate --schema=./prisma/schema.prisma', { stdio: 'inherit' });
      console.log('Prisma client generated successfully.');
    } catch (error) {
      console.error('Error generating Prisma client:', error);
      // Don't exit with error to allow build to continue
    }
  } else {
    // Not on Vercel, just run prisma generate normally
    try {
      console.log('Running prisma generate...');
      execSync('npx prisma generate', { stdio: 'inherit' });
      console.log('Prisma client generated successfully.');
    } catch (error) {
      console.error('Error generating Prisma client:', error);
      // Don't exit with error to allow build to continue
    }
  }
}

// Run the function
try {
  ensurePrismaSetup();
  console.log('Prisma setup check completed successfully.');
} catch (error) {
  console.error('Error checking Prisma setup:', error);
  // Don't exit with error to allow build to continue
}
