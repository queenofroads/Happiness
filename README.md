# Finland Quest - Relocation Onboarding Platform

A Next.js 14 application for new hires relocating to Finland to complete quests, RSVP to events, and earn points.

## Features

- **Authentication**: Simple email-based login with auto-user creation
- **Dashboard**: View your points, upcoming events, and available quests
- **Events**: Browse and RSVP to relocation events
- **Quests**: Complete Finland-specific onboarding quests
- **Leaderboard**: See how you rank against other participants
- **Points System**: Idempotent points tracking for all activities

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- NextAuth (Credentials provider)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/finland_quest"
NEXTAUTH_SECRET="your-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

### Installation

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# Seed the database with Finland-specific data
npm run seed
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Accounts

- User: `demo@demo.com`
- Admin: `admin@demo.com`

No password required - just enter the email to sign in.

## Database Schema

- **User**: User accounts with points tracking
- **Event**: Relocation events with RSVP functionality
- **EventRsvp**: User RSVPs to events
- **Quest**: Onboarding quests with various proof types
- **UserQuest**: User quest completions and submissions
- **PointsLedger**: Idempotent points tracking

## Points System

Points are awarded for:
- **RSVP to events**: 5 points (default)
- **Event attendance**: 25 points (default)
- **Quest completion**: 20-50 points (varies by quest)

The points system is idempotent - users can only earn points once per action.

## Project Structure

```
/app
  /api
    /auth/[...nextauth]  - NextAuth configuration
    /rsvp                - RSVP to events
    /quests/complete     - Complete quests
  /dashboard             - User dashboard
  /events                - Events list and detail
  /quests                - Quests list and detail
  /leaderboard           - Points leaderboard
  /login                 - Login page
/components              - Reusable UI components
/lib                     - Utility functions
/prisma                  - Database schema
/scripts                 - Seed scripts
```

## Deployment

### Replit

1. Create a new Repl with Next.js template
2. Paste your code
3. Replit will automatically set up PostgreSQL
4. Run `npm run seed` to populate data
5. Your app will be live instantly!

### Vercel

1. Connect your GitHub repository
2. Add environment variables
3. Deploy

## License

MIT

## Credits

Finland Quest - Prototype for demonstration
