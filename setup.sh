#!/bin/bash

echo "🚀 Setting up Relocation Quest MVP..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate || PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npx prisma generate

# Push database schema
echo "🗄️  Setting up database..."
npx prisma db push

# Seed database
echo "🌱 Seeding database..."
npm run seed

echo "✅ Setup complete! Run 'npm run dev' to start the application."
