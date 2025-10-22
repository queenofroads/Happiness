import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: {
      email: 'admin@demo.com',
      name: 'Admin User',
      office_city: 'Helsinki',
      preferred_language: 'en',
      interests: 'family,outdoors,language',
      is_admin: true,
    },
  })

  const demo = await prisma.user.upsert({
    where: { email: 'demo@demo.com' },
    update: {},
    create: {
      email: 'demo@demo.com',
      name: 'Demo User',
      office_city: 'Espoo',
      preferred_language: 'en',
      interests: 'food,museum,sports',
      is_admin: false,
    },
  })

  console.log('✓ Created users:', { admin: admin.email, demo: demo.email })

  // Create quests
  const questsData = [
    {
      title: 'Register at DVV',
      description: 'Book DVV registration after arrival. Bring passport, residence permit, and address details.',
      category: 'Legal',
      helpful_links: 'https://dvv.fi/en/first-steps-in-finland,https://dvv.fi/en/notice-of-move',
      points_on_complete: 50,
      proof_type: 'url',
      active: true,
    },
    {
      title: 'Apply for Kela benefits',
      description: 'Create a Kela account and apply for necessary benefits (e.g., Kela card).',
      category: 'Legal',
      helpful_links: 'https://www.kela.fi/web/en',
      points_on_complete: 50,
      proof_type: 'url',
      active: true,
    },
    {
      title: 'Open a Finnish bank account',
      description: 'Choose a bank, book an appointment, and open an account for salary.',
      category: 'Money',
      helpful_links: 'https://www.infofinland.fi/en/living-in-finland/money-and-consumer-protection/bank-services',
      points_on_complete: 50,
      proof_type: 'admin_verify',
      active: true,
    },
    {
      title: 'Get HSL travel card',
      description: 'Buy and register an HSL card or activate HSL app for public transport.',
      category: 'Transport',
      helpful_links: 'https://www.hsl.fi/en',
      points_on_complete: 40,
      proof_type: 'checkbox',
      active: true,
    },
    {
      title: 'Submit Tax Card (Vero)',
      description: 'Log into MyTax, set withholding rate, and send tax card to payroll.',
      category: 'Legal',
      helpful_links: 'https://www.vero.fi/en/individuals/tax-card/',
      points_on_complete: 50,
      proof_type: 'url',
      active: true,
    },
    {
      title: 'Healthcare center registration',
      description: 'Find your municipal health center and register as a client.',
      category: 'Health',
      helpful_links: 'https://www.infofinland.fi/en/health',
      points_on_complete: 40,
      proof_type: 'checkbox',
      active: true,
    },
    {
      title: 'Daycare or school application',
      description: 'If you have children, apply for daycare or school in your municipality.',
      category: 'Family',
      helpful_links: 'https://www.infofinland.fi/en/family/children',
      points_on_complete: 60,
      proof_type: 'url',
      active: true,
    },
    {
      title: 'Sign rental agreement and home insurance',
      description: 'Finalize rental contract and purchase home insurance.',
      category: 'Housing',
      helpful_links: 'https://www.infofinland.fi/en/housing,https://www.infofinland.fi/en/housing/rental-housing',
      points_on_complete: 50,
      proof_type: 'admin_verify',
      active: true,
    },
    {
      title: 'Emergency numbers + Finnish basics',
      description: 'Save 112 and health helpline numbers; learn 10 daily Finnish phrases.',
      category: 'Safety',
      helpful_links: 'https://112.fi/en',
      points_on_complete: 30,
      proof_type: 'checkbox',
      active: true,
    },
    {
      title: 'Neighborhood groups & recycling',
      description: 'Join local FB/WhatsApp groups; find recycling points.',
      category: 'Community',
      helpful_links: 'https://www.hel.fi/en,https://www.kierratys.info/en',
      points_on_complete: 30,
      proof_type: 'checkbox',
      active: true,
    },
  ]

  const quests = []
  for (const questData of questsData) {
    const quest = await prisma.quest.create({ data: questData })
    quests.push(quest)
  }

  console.log('✓ Created quests:', quests.length)

  // Create events
  const now = new Date()
  const day = 24 * 60 * 60 * 1000

  const createEvent = (
    offset: number,
    title: string,
    venue: string = 'City Venue',
    address: string = 'Helsinki',
    category: string = 'Community',
    rsvp: number = 5,
    attend: number = 25
  ) => {
    const start = new Date(now.getTime() + offset * day)
    start.setHours(17, 0, 0, 0)
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000)
    return {
      title,
      start,
      end,
      venue,
      address,
      category,
      external_link: '',
      capacity: 50,
      points_on_rsvp: rsvp,
      points_on_attend: attend,
      active: true,
    }
  }

  const eventsData = [
    createEvent(3, 'Welcome Lunch & Orientation', 'Super Welcome Hub', 'Mikonkatu 7, Helsinki', 'Onboarding'),
    createEvent(7, 'City Walking Tour – Helsinki Core', 'Senate Square', 'Hallituskatu 7, Helsinki', 'Culture'),
    createEvent(10, 'Paperwork Clinic – DVV/Kela Help Desk', 'Oodi Library', 'Töölönlahdenkatu 4, Helsinki', 'Support'),
    createEvent(14, 'Language Café – Simple Finnish', 'Espoo Library', 'Entresse, Espoo', 'Learning'),
    createEvent(17, 'Family Picnic – Kaivopuisto', 'Kaivopuisto Park', 'Helsinki', 'Family'),
    createEvent(21, 'Museum Night – Ateneum Visit', 'Ateneum', 'Kaivokatu 2, Helsinki', 'Culture'),
  ]

  const events = []
  for (const eventData of eventsData) {
    const event = await prisma.event.create({ data: eventData })
    events.push(event)
  }

  console.log('✓ Created events:', events.length)

  // Create videos
  const videosData = [
    {
      title: 'First weeks in Finland: registrations and essentials',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      tags: 'onboarding,registrations',
      description: 'Overview of DVV, Kela, tax card, and transport.',
    },
    {
      title: 'Moving around HSL: how to public transport',
      url: 'https://www.youtube.com/watch?v=3GwjfUFyY6M',
      tags: 'transport,HSL',
      description: 'Using the HSL app and cards in the capital area.',
    },
    {
      title: 'Life hacks for newcomers: housing, health, community',
      url: 'https://www.youtube.com/watch?v=oHg5SJYRHA0',
      tags: 'housing,health,community',
      description: 'Where to find help and how to integrate faster.',
    },
  ]

  for (const videoData of videosData) {
    await prisma.video.create({ data: videoData })
  }

  console.log('✓ Created videos:', videosData.length)

  // Give demo user an RSVP and some points
  const firstEvent = events[0]
  await prisma.eventRsvp.upsert({
    where: {
      eventId_userId: {
        eventId: firstEvent.id,
        userId: demo.id,
      },
    },
    update: {},
    create: {
      eventId: firstEvent.id,
      userId: demo.id,
      status: 'going',
    },
  })

  await prisma.pointsLedger.create({
    data: {
      userId: demo.id,
      source: 'event_rsvp',
      sourceId: firstEvent.id,
      points: firstEvent.points_on_rsvp,
    },
  })

  console.log('✓ Awarded demo user initial points')

  console.log('🎉 Seeding complete!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
