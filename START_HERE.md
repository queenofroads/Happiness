# 🚀 START HERE - Complete Fresh Setup

## You're getting the "(protected)/dashboard" error?

This is a **cache issue**. Follow these exact steps to fix it:

---

## Step 1: Pull Latest Code

```bash
cd /path/to/Happiness
git fetch origin
git checkout claude/relocation-quest-mvp-011CUNCo4VSa4QNinXDWgjtL
git pull origin claude/relocation-quest-mvp-011CUNCo4VSa4QNinXDWgjtL
```

---

## Step 2: Nuclear Cleanup (Removes ALL Cache)

```bash
./nuclear-clean.sh
```

This removes:
- ✅ .next build folder
- ✅ node_modules
- ✅ All cache files
- ✅ Any old route group folders
- ✅ SQLite database files

---

## Step 3: Fresh Install

```bash
npm install
```

---

## Step 4: Generate Prisma Client

```bash
npx prisma generate
```

If you get a 403 error, run:
```bash
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npx prisma generate
```

---

## Step 5: Setup Database (For Local Development)

**Option A: Use PostgreSQL (Recommended for deployment)**

Skip this if deploying to Vercel - Vercel provides Postgres.

**Option B: Use SQLite (Local dev only)**

1. Switch back to SQLite schema:
```bash
cp prisma/schema.sqlite.prisma prisma/schema.prisma
```

2. Update `.env.local`:
```bash
DATABASE_URL="file:./dev.db"
```

3. Push schema and seed:
```bash
npx prisma db push
npm run seed
```

---

## Step 6: Start Development Server

```bash
npm run dev
```

Visit: **http://localhost:3000**

Login with:
- **demo@demo.com** (regular user)
- **admin@demo.com** (admin)

---

## 🎯 DEPLOYMENT TO VERCEL (Skip Local Setup)

If you just want to deploy to Vercel and skip local development:

### Quick Deploy:

1. **Go to:** https://vercel.com
2. **Import:** `queenofroads/Happiness` repository
3. **Branch:** `claude/relocation-quest-mvp-011CUNCo4VSa4QNinXDWgjtL`
4. **Add Storage:** Click "Storage" → "Create Database" → "Postgres"
5. **Environment Variables:**
   - `NEXTAUTH_SECRET` = `your-random-secret-key`
6. **Deploy!**
7. **Seed Database:**
   ```bash
   npm install -g vercel
   vercel login
   vercel link
   vercel exec -- npx tsx scripts/seed.ts
   ```

Your app will be live at: `https://happiness-[random].vercel.app`

---

## ❌ Still Getting Errors?

Run this diagnostic:

```bash
# Check your current directory structure
ls -la app/

# You should see ONLY:
# admin/ api/ dashboard/ events/ leaderboard/ learning/ login/ quests/
# globals.css layout.tsx page.tsx

# You should NOT see:
# (protected)/ (public)/ (admin)/
```

If you see route group folders `(protected)` etc., run:
```bash
rm -rf "app/(protected)" "app/(public)" "app/(admin)"
```

Then start from Step 2 again.

---

## 📞 Need Help?

1. **What command are you running?**
2. **What's the exact error message?**
3. **What does `ls -la app/` show?**

Report back and I'll fix it immediately!
