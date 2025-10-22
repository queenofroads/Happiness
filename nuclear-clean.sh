#!/bin/bash

echo "🧹 NUCLEAR CLEANUP - Removing ALL cache and build files..."

# Remove Next.js build cache
echo "Removing .next build folder..."
rm -rf .next

# Remove node modules
echo "Removing node_modules..."
rm -rf node_modules

# Remove package lock
echo "Removing package-lock.json..."
rm -f package-lock.json

# Remove Prisma generated client
echo "Removing Prisma client..."
rm -rf node_modules/.prisma
rm -rf prisma/generated

# Remove any TypeScript build info
echo "Removing TypeScript cache..."
rm -f *.tsbuildinfo

# Remove Vercel cache
echo "Removing Vercel cache..."
rm -rf .vercel

# Remove any SQLite database files (we're using Postgres now)
echo "Removing old SQLite files..."
rm -f dev.db
rm -f dev.db-journal
rm -f prisma/dev.db
rm -f prisma/dev.db-journal

# Remove any lingering route group folders (just in case)
echo "Removing any route group folders..."
rm -rf "app/(protected)"
rm -rf "app/(public)"
rm -rf "app/(admin)"

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "Now run these commands:"
echo "1. npm install"
echo "2. npx prisma generate"
echo "3. npm run dev"
echo ""
