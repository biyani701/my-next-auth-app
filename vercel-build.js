#!/usr/bin/env node

// This script is used by Vercel to build the project
// It ensures that Prisma Client is generated before the build

const { execSync } = require('child_process');

// Log the start of the build process
console.log('🚀 Starting Vercel build process');

try {
  // Generate Prisma Client
  console.log('📊 Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma Client generated successfully');

  // Build the Next.js application
  console.log('🏗️ Building Next.js application...');
  execSync('next build', { stdio: 'inherit' });
  console.log('✅ Next.js build completed successfully');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

console.log('🎉 Build process completed successfully');
