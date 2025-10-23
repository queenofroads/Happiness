#!/bin/bash

echo "🚀 Setting up Finland Quest locally..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Push database schema
echo "🗄️  Creating SQLite database..."
npx prisma db push --accept-data-loss

# Seed database
echo "🌱 Seeding database with Finland data..."
npx tsx scripts/seed.ts

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎉 Run 'npm run dev' and visit http://localhost:3000"
echo ""
echo "Login with:"
echo "  - demo@demo.com (regular user)"
echo "  - admin@demo.com (admin)"
echo ""
