# Quick Start Guide

## Run Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Edit `.env.local` with your database connection

3. **Set up database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Seed the database:**
   ```bash
   npm run seed
   ```

5. **Run development server:**
   ```bash
   npm run dev
   ```

6. **Open in browser:**
   http://localhost:3000

7. **Login with:**
   - Email: demo@demo.com (or any email)
   - No password needed!

## Deploy to Replit (Easiest - Live in 2 minutes)

1. Go to https://replit.com
2. Click "Create Repl"
3. Choose "Import from GitHub"
4. Enter your repository URL
5. Replit will auto-configure PostgreSQL
6. Run: `npm install && npx prisma db push && npm run seed && npm run dev`
7. You'll get a live URL instantly!

## Deploy to Vercel (Production)

1. Go to https://vercel.com
2. Import your GitHub repository
3. Add Vercel Postgres database
4. Deploy!
5. Run seed command after deployment
