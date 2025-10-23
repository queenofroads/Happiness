import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create users
  const demo = await prisma.user.upsert({
    where: { email: 'demo@demo.com' },
    update: {},
    create: { email: 'demo@demo.com', name: 'Demo User', isAdmin: false },
  })

  const admin = await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: { email: 'admin@demo.com', name: 'Admin User', isAdmin: true },
  })

  // Create quests
  const quests = await Promise.all([
    prisma.quest.create({
      data: {
        title: 'Register at DVV',
        description: 'Complete your DVV registration with passport and address proof',
        category: 'Legal',
        points: 50,
        proofType: 'url',
      },
    }),
    prisma.quest.create({
      data: {
        title: 'Apply for Kela benefits',
        description: 'Create Kela account and apply for necessary benefits',
        category: 'Legal',
        points: 50,
        proofType: 'url',
      },
    }),
    prisma.quest.create({
      data: {
        title: 'Get HSL travel card',
        description: 'Register for HSL card or activate app for public transport',
        category: 'Transport',
        points: 40,
        proofType: 'checkbox',
      },
    }),
    prisma.quest.create({
      data: {
        title: 'Open Finnish bank account',
        description: 'Book appointment and open bank account for salary',
        category: 'Money',
        points: 50,
        proofType: 'admin_verify',
      },
    }),
    prisma.quest.create({
      data: {
        title: 'Submit Tax Card',
        description: 'Complete MyTax registration and send tax card to payroll',
        category: 'Legal',
        points: 50,
        proofType: 'url',
      },
    }),
  ])

  // Create events
  const now = new Date()
  const events = await Promise.all([
    prisma.event.create({
      data: {
        title: 'Welcome Orientation',
        description: 'Get started with your relocation journey',
        start: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
        end: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
        venue: 'Helsinki Office',
        category: 'Onboarding',
        rsvpPoints: 5,
        attendPoints: 25,
      },
    }),
    prisma.event.create({
      data: {
        title: 'City Walking Tour',
        description: 'Explore Helsinki with fellow newcomers',
        start: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        end: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
        venue: 'Senate Square',
        category: 'Culture',
        rsvpPoints: 5,
        attendPoints: 25,
      },
    }),
    prisma.event.create({
      data: {
        title: 'Paperwork Help Session',
        description: 'Get help with DVV, Kela, and tax registration',
        start: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
        end: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
        venue: 'Oodi Library',
        category: 'Support',
        rsvpPoints: 5,
        attendPoints: 25,
      },
    }),
  ])

  // Award demo user some points
  await prisma.eventRsvp.create({
    data: { eventId: events[0].id, userId: demo.id },
  })
  await prisma.pointsLedger.create({
    data: {
      userId: demo.id,
      source: 'rsvp',
      sourceId: events[0].id,
      points: events[0].rsvpPoints,
    },
  })

  console.log('✅ Seeding complete!')
  console.log(`Created ${quests.length} quests and ${events.length} events`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
