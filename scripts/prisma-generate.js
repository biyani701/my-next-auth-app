#!/usr/bin/env node

// This script is used to generate Prisma Client during the build process on Vercel

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Log the start of the Prisma generation process
console.log('🚀 Starting Prisma Client generation');

try {
  // Check if the prisma directory exists
  const prismaDir = path.join(process.cwd(), 'prisma');
  if (!fs.existsSync(prismaDir)) {
    console.error('❌ Prisma directory not found');
    process.exit(1);
  }

  // Check if the schema.prisma file exists
  const schemaPath = path.join(prismaDir, 'schema.prisma');
  if (!fs.existsSync(schemaPath)) {
    console.error('❌ schema.prisma file not found');
    process.exit(1);
  }

  // Generate Prisma Client
  console.log('📊 Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma Client generated successfully');

} catch (error) {
  console.error('❌ Prisma generation failed:', error.message);
  process.exit(1);
}

console.log('🎉 Prisma generation process completed successfully');
