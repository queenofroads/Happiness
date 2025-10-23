# Finland Quest

Complete your relocation journey in Finland with gamified quests and events.

## 🚀 Deploy to Vercel

### Quick Deploy (5 minutes)

1. **Go to [vercel.com](https://vercel.com)** and sign in with GitHub

2. **Import this repository**
   - Click "Add New" → "Project"
   - Select this repository
   - Branch: `claude/finland-quest-fresh-011CUNCo4VSa4QNinXDWgjtL`

3. **Add Postgres Database** (BEFORE deploying!)
   - Click "Storage" tab
   - Click "Create Database" → "Postgres"
   - Click "Create"

4. **Add Environment Variable**
   - Go to "Settings" → "Environment Variables"
   - Add: `NEXTAUTH_SECRET` = `your-random-secret-key`

5. **Deploy!**
   - Click "Deploy"
   - Wait ~2 minutes

6. **Seed Database** (one-time)
   ```bash
   npm install -g vercel
   vercel login
   vercel link
   vercel exec -- npx tsx scripts/seed.ts
   ```

7. **Visit your app!**
   - Login with: `demo@demo.com` or `admin@demo.com`

## ✨ Features

- **Quest System**: Complete Finland relocation tasks (DVV, Kela, HSL, etc.)
- **Events**: RSVP to onboarding events
- **Points & Leaderboard**: Track progress
- **Admin Dashboard**: Manage events and quests

## 🛠️ Tech Stack

- Next.js 14 + TypeScript
- PostgreSQL + Prisma
- NextAuth
- Tailwind CSS

## 📝 Demo Accounts

- **User**: demo@demo.com
- **Admin**: admin@demo.com

No password needed!

---

**Ready to deploy?** Head to [vercel.com](https://vercel.com) now! 🚀
