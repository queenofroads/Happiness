# 🚀 Deploy to Vercel - Step by Step

Your code is now ready for Vercel! Follow these exact steps:

## Step 1: Go to Vercel
Visit [https://vercel.com](https://vercel.com) and click **"Sign Up"** or **"Login"** with GitHub

## Step 2: Import Your Repository
1. Click **"Add New..."** → **"Project"**
2. Find and select your repository: **`queenofroads/Happiness`**
3. When asked for branch, select: **`claude/relocation-quest-mvp-011CUNCo4VSa4QNinXDWgjtL`**

## Step 3: Add Postgres Database (IMPORTANT - Do this BEFORE first deploy!)
1. **Don't click Deploy yet!**
2. In your project page, click on **"Storage"** tab
3. Click **"Create Database"** → **"Postgres"**
4. Click **"Create"** - Vercel will automatically connect it
5. This sets the `DATABASE_URL` environment variable automatically

## Step 4: Add Environment Variables
1. Go to **"Settings"** → **"Environment Variables"**
2. Add these variables:

   **Name:** `NEXTAUTH_SECRET`
   **Value:** `your-very-secret-random-string-12345` (Change this to any random string)

   **Name:** `NEXTAUTH_URL`
   **Value:** Leave blank for now (Vercel auto-sets this)

## Step 5: Deploy!
1. Go back to the **"Deployments"** tab
2. Click **"Redeploy"** or wait for automatic deployment
3. Wait ~2 minutes for build to complete
4. You'll get a live URL like: `https://happiness-xxx.vercel.app`

## Step 6: Seed Your Database (One-time setup)
After first successful deployment:

### Option A: Using Vercel Dashboard
1. Go to your project → **"Settings"** → **"Functions"**
2. Or use the Vercel CLI (see Option B)

### Option B: Using Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Link to your project
vercel link

# Run migrations and seed
vercel env pull .env.production
npx prisma migrate deploy
npx tsx scripts/seed.ts
```

## Step 7: Test Your App! 🎉
1. Visit your Vercel URL: `https://happiness-xxx.vercel.app`
2. Login with:
   - **Regular user:** `demo@demo.com`
   - **Admin user:** `admin@demo.com`

---

## Troubleshooting

### Build Failed?
- Make sure you added Postgres Storage BEFORE deploying
- Check that `NEXTAUTH_SECRET` is set in Environment Variables

### Database Connection Error?
- Verify Postgres database is created in Storage tab
- Check that `DATABASE_URL` appears in Environment Variables

### Need to Re-seed?
```bash
vercel exec -- npx tsx scripts/seed.ts
```

---

## What You'll See

✅ **Dashboard** - Your points and next actions
✅ **Events** - RSVP to onboarding events
✅ **Quests** - 10 relocation tasks with points
✅ **Leaderboard** - Rankings and scores
✅ **Learning** - Educational videos
✅ **Admin** (admin@demo.com) - Manage events, quests, attendance

---

## Automatic Deployments

Every push to your branch will automatically deploy to Vercel! 🚀

Your production URL will be: `https://happiness-[your-project-name].vercel.app`

---

**Need help?** Check the full [DEPLOYMENT.md](./DEPLOYMENT.md) for other hosting options.
