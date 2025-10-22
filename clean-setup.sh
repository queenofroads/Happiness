#!/bin/bash

echo "🧹 Cleaning Next.js cache and rebuilding..."

# Remove build artifacts
rm -rf .next
rm -rf node_modules/.cache

# Reinstall and setup
npm install
npx prisma generate || PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npx prisma generate
npx prisma db push
npm run seed

echo "✅ Clean setup complete! Run 'npm run dev' to start."
