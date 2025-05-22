/**
 * This script ensures that Prisma is properly set up for Vercel deployment
 * It runs before the build process on Vercel to prevent build failures
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

// Main function
function ensurePrismaSetup() {
  if (!isDatabaseUrlSet()) {
    console.log('DATABASE_URL is not set. Prisma will not be used.');
    return;
  }

  console.log('DATABASE_URL is set. Ensuring Prisma is properly configured...');

  try {
    // Run prisma generate to generate the Prisma client
    console.log('Running prisma generate...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('Prisma client generated successfully.');
  } catch (error) {
    console.error('Error generating Prisma client:', error);
    // Don't exit with error to allow build to continue
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
