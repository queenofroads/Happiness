# Deployment Guide

## Option 1: Vercel (Recommended - Free & Easy)

**Note:** Vercel doesn't support SQLite files, so you'll need to use Postgres.

### Quick Deploy with Vercel Postgres

1. **Push your code to GitHub** (already done!)

2. **Go to [vercel.com](https://vercel.com)** and sign in with GitHub

3. **Import your repository**
   - Click "Add New" → "Project"
   - Select `queenofroads/Happiness`
   - Select branch: `claude/relocation-quest-mvp-011CUNCo4VSa4QNinXDWgjtL`

4. **Add Vercel Postgres** (before deploying)
   - In your project dashboard, go to "Storage" tab
   - Click "Create Database" → "Postgres"
   - This will automatically add `POSTGRES_URL` environment variable

5. **Update Prisma Schema for Postgres**
   - You'll need to change one line in `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"  // Changed from "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

6. **Add Environment Variables** in Vercel:
   - `NEXTAUTH_SECRET`: `your-secret-key-here` (generate a random string)
   - `NEXTAUTH_URL`: Will be auto-set by Vercel
   - `DATABASE_URL`: Auto-set when you add Postgres

7. **Deploy!**
   - Vercel will automatically run migrations and deploy
   - Your app will be live at: `https://your-project.vercel.app`

### After First Deploy

Run the seed script to populate data:
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link to your project
vercel link

# Run seed remotely (or use Vercel dashboard to run commands)
vercel env pull
npx prisma db push --accept-data-loss
npx tsx scripts/seed.ts
```

---

## Option 2: Railway (Postgres Included - Free Tier)

1. **Go to [railway.app](https://railway.app)**

2. **Click "Start a New Project"**
   - Connect your GitHub account
   - Select `queenofroads/Happiness`
   - Select branch: `claude/relocation-quest-mvp-011CUNCo4VSa4QNinXDWgjtL`

3. **Add Postgres Database**
   - Click "New" → "Database" → "Add PostgreSQL"
   - Railway will automatically connect it

4. **Update Prisma Schema** (same as Vercel above)

5. **Add Environment Variables**:
   - `NEXTAUTH_SECRET`: `your-random-secret`
   - `NEXTAUTH_URL`: Your Railway app URL
   - `DATABASE_URL`: Auto-set by Railway

6. **Deploy and Seed**
   - Railway will build and deploy
   - Use Railway CLI to seed: `railway run npm run seed`

---

## Option 3: Fix Local Setup (If you want to run locally)

If you want to fix the local error:

```bash
# Clear everything and start fresh
./clean-setup.sh

# Then start
npm run dev
```

If still having issues, try:
```bash
# Nuclear option - full clean
rm -rf .next node_modules package-lock.json
npm install
npx prisma generate
npx prisma db push
npm run seed
npm run dev
```

---

## Option 4: Netlify with Supabase

1. **Create a Supabase project** at [supabase.com](https://supabase.com)
2. **Get your Postgres connection string** from Supabase
3. **Update Prisma schema** to use PostgreSQL
4. **Deploy to Netlify** and add environment variables
5. **Run migrations** via Netlify CLI

---

## Recommended: Vercel

For the fastest preview, I recommend **Vercel** because:
- ✅ Free tier is generous
- ✅ One-click Postgres database
- ✅ Automatic deployments from GitHub
- ✅ Built specifically for Next.js
- ✅ Live URL in ~2 minutes

**Live preview in 5 steps:**
1. Go to vercel.com
2. Import your GitHub repo
3. Add Vercel Postgres storage
4. Update schema.prisma provider to "postgresql"
5. Deploy!

Your app will be live at `https://happiness-xxx.vercel.app`
