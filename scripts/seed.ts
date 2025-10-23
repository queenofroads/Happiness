import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Create demo users
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@demo.com' },
    update: {},
    create: {
      email: 'demo@demo.com',
      name: 'Demo User',
      isAdmin: false,
    },
  })

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: {
      email: 'admin@demo.com',
      name: 'Admin User',
      isAdmin: true,
    },
  })

  console.log('Created users:', { demoUser, adminUser })

  // Give demo user some starting points
  await prisma.pointsLedger.upsert({
    where: {
      userId_source_sourceId: {
        userId: demoUser.id,
        source: 'welcome',
        sourceId: 'initial',
      },
    },
    update: {},
    create: {
      userId: demoUser.id,
      source: 'welcome',
      sourceId: 'initial',
      points: 5,
    },
  })

  // Create Finland-specific quests
  const quests = [
    {
      title: 'Register at DVV (Digital and Population Data Services Agency)',
      description:
        'Register your residence in Finland at the DVV. This is mandatory for all residents and gives you a Finnish personal identity code (henkilötunnus).',
      category: 'Legal',
      points: 50,
      proofType: 'url',
    },
    {
      title: 'Apply for Kela benefits',
      description:
        'Register with Kela (Social Insurance Institution of Finland) to access healthcare and social security benefits. Bring your residence permit and DVV registration.',
      category: 'Legal',
      points: 50,
      proofType: 'url',
    },
    {
      title: 'Get HSL travel card',
      description:
        'Get an HSL travel card for public transportation in the Helsinki region. You can order it online or get it from R-kioski stores.',
      category: 'Transport',
      points: 40,
      proofType: 'checkbox',
    },
    {
      title: 'Open Finnish bank account',
      description:
        'Open a bank account at a Finnish bank (e.g., Nordea, OP, Danske Bank). You will need your passport, residence permit, and proof of address.',
      category: 'Money',
      points: 50,
      proofType: 'admin_verify',
    },
    {
      title: 'Submit Tax Card application',
      description:
        'Apply for a tax card (verokortti) from the Finnish Tax Administration. This ensures your employer deducts the correct amount of tax from your salary.',
      category: 'Legal',
      points: 50,
      proofType: 'url',
    },
    {
      title: 'Visit Finnish library',
      description:
        'Get a library card at your local Finnish library. Libraries offer free books, magazines, internet access, and often language learning resources.',
      category: 'Culture',
      points: 30,
      proofType: 'checkbox',
    },
    {
      title: 'Try traditional Finnish sauna',
      description:
        'Experience an authentic Finnish sauna! Many apartment buildings have their own saunas, or visit a public sauna like Löyly or Allas Sea Pool.',
      category: 'Culture',
      points: 25,
      proofType: 'checkbox',
    },
    {
      title: 'Learn 10 Finnish words',
      description:
        'Learn 10 basic Finnish words or phrases. Examples: Kiitos (thank you), Hei (hello), Moi (hi/bye), Anteeksi (excuse me), Kyllä (yes), Ei (no).',
      category: 'Language',
      points: 20,
      proofType: 'checkbox',
    },
  ]

  for (const quest of quests) {
    await prisma.quest.upsert({
      where: { title: quest.title },
      update: quest,
      create: quest,
    })
  }

  console.log(`Created ${quests.length} quests`)

  // Create Finland-specific events
  const now = new Date()

  const events = [
    {
      title: 'Welcome Orientation',
      description:
        'Join us for a comprehensive orientation session covering life in Finland, Finnish culture, and practical tips for settling in. Meet other new arrivals and ask questions!',
      start: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      end: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours
      venue: 'Office Conference Room A',
      category: 'Orientation',
      rsvpPoints: 5,
      attendPoints: 25,
    },
    {
      title: 'Helsinki City Walking Tour',
      description:
        'Explore central Helsinki with a guided walking tour. Visit landmarks like Senate Square, Market Square, and Esplanadi Park. Learn about Finnish history and culture.',
      start: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      end: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // 3 hours
      venue: 'Meeting point: Kamppi Center main entrance',
      category: 'Culture',
      rsvpPoints: 5,
      attendPoints: 25,
    },
    {
      title: 'Paperwork Help Session',
      description:
        'Get help with your Finnish paperwork! Bring your questions about DVV registration, Kela, tax cards, and more. Our team will guide you through the process.',
      start: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      end: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours
      venue: 'Office Meeting Room B',
      category: 'Support',
      rsvpPoints: 5,
      attendPoints: 25,
    },
    {
      title: 'Finnish Language Café',
      description:
        'Practice your Finnish in a relaxed, informal setting. All levels welcome! Native speakers will be present to help with pronunciation and conversation.',
      start: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      end: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000), // 1.5 hours
      venue: 'Café Engel, Aleksanterinkatu 26',
      category: 'Language',
      rsvpPoints: 5,
      attendPoints: 25,
    },
    {
      title: 'Winter Survival Workshop',
      description:
        'Learn how to survive and thrive during the Finnish winter! Tips on clothing, transportation, vitamin D, and making the most of the dark months.',
      start: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
      end: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000), // 1.5 hours
      venue: 'Office Conference Room A',
      category: 'Lifestyle',
      rsvpPoints: 5,
      attendPoints: 25,
    },
    {
      title: 'Networking Dinner',
      description:
        'Connect with fellow expats and Finnish colleagues over dinner. Enjoy traditional Finnish cuisine and share your relocation experiences.',
      start: new Date(now.getTime() + 28 * 24 * 60 * 60 * 1000), // 28 days from now
      end: new Date(now.getTime() + 28 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // 3 hours
      venue: 'Restaurant Savotta, Helsinki',
      category: 'Social',
      rsvpPoints: 5,
      attendPoints: 25,
    },
  ]

  for (const event of events) {
    await prisma.event.upsert({
      where: { title: event.title },
      update: event,
      create: event,
    })
  }

  console.log(`Created ${events.length} events`)

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
