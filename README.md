# Relocation Quest MVP

A gamified onboarding platform to help new hires complete essential relocation tasks in Finland. Built with Next.js 14, Prisma, and SQLite for rapid development, with easy migration path to Postgres/Supabase.

## Features

- **Quest System**: Complete relocation tasks (DVV, Kela, HSL, etc.) and earn points
- **Events**: RSVP to onboarding events and download calendar invites
- **Leaderboard**: Track progress and compete with colleagues
- **Learning Resources**: Access helpful videos and materials
- **Admin Dashboard**: Manage events, quests, and mark attendance
- **Idempotent Points**: Ensures users don't get duplicate points for the same action

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Auth**: NextAuth with Credentials provider (dev-only)
- **ORM**: Prisma
- **Database**: SQLite (dev) → Postgres/Supabase (production)
- **Tests**: Vitest for unit tests
- **Runtime**: Node 20 LTS

## Quick Start

### Prerequisites

- Node.js 20.x or higher
- pnpm (recommended) or npm

### Installation

**Option 1: Automated Setup (Recommended)**

```bash
# Run the setup script
./setup.sh
```

**Option 2: Manual Setup**

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Set up the database
npm run db:push

# Seed with Finland-specific data
npm run seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Accounts

- **Regular User**: demo@demo.com
- **Admin User**: admin@demo.com

Just enter the email on the login page (no password needed in dev mode).

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run typecheck    # Run TypeScript type checking
npm run db:push      # Push Prisma schema to database
npm run seed         # Seed database with test data
npm run test         # Run Vitest tests
```

## Project Structure

```
app/
├── (public)/login/          # Public login page
├── (protected)/             # Protected user pages
│   ├── dashboard/
│   ├── events/
│   ├── quests/
│   ├── leaderboard/
│   └── learning/
├── (admin)/admin/           # Admin-only pages
│   ├── events/
│   ├── quests/
│   └── attendance/
└── api/                     # API routes
    ├── rsvp/
    ├── attendance/
    ├── quests/
    ├── leaderboard/
    ├── ics/
    └── admin/

components/                  # Reusable UI components
lib/                        # Utilities and helpers
prisma/                     # Database schema
scripts/                    # Database seeding
tests/                      # Vitest tests
```

## Database Schema

- **User**: User accounts with office location and preferences
- **Event**: Onboarding events with RSVP and attendance tracking
- **Quest**: Relocation tasks with different proof types
- **PointsLedger**: Idempotent points tracking
- **Video**: Learning resources

## Switching to Postgres/Supabase

The Prisma schema is compatible with PostgreSQL. To switch:

1. Update `DATABASE_URL` in `.env.local` to your Postgres connection string
2. Change `provider = "sqlite"` to `provider = "postgresql"` in `prisma/schema.prisma`
3. Run `pnpm db:push` or `prisma migrate dev`
4. Run `pnpm seed` to populate data

## Testing

Run unit tests to verify points idempotency:

```bash
pnpm test
```

## Extensibility

### Future Enhancements Ready

- **QR Code Attendance**: Placeholder components ready in `/api/attendance/qr`
- **Internationalization**: Structure ready for `i18n` with en.json and fi.json
- **Database Migration**: Schema compatible with Postgres/Supabase

## Notes

- Type-checking runs separately (`pnpm typecheck`) to keep dev server fast
- Uses server components by default for better performance
- Tailwind-only design system (no heavy UI libraries)
- All points are awarded idempotently to prevent duplicates

## Acceptance Criteria

✅ Login as demo@demo.com and see dashboard with points
✅ RSVP to events (points awarded once)
✅ Admin can mark attendance (points awarded once)
✅ Complete quests (checkbox, URL, admin verify)
✅ Leaderboard shows correct rankings
✅ Download ICS calendar files
✅ Watch embedded learning videos
✅ Admin CRUD for events and quests

## License

Prototype for demonstration purposes. All trademarks belong to their owners.

## Support

For issues or questions, please contact your team administrator.
