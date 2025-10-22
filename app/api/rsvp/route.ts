import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { awardPoints } from '@/lib/points'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { eventId } = await request.json()

    if (!eventId) {
      return NextResponse.json({ error: 'Event ID required' }, { status: 400 })
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Upsert RSVP (unique per user+event)
    await prisma.eventRsvp.upsert({
      where: {
        eventId_userId: {
          eventId,
          userId: session.user.id,
        },
      },
      update: {},
      create: {
        eventId,
        userId: session.user.id,
        status: 'going',
      },
    })

    // Award points idempotently
    const totalPoints = await awardPoints(
      session.user.id,
      'event_rsvp',
      eventId,
      event.points_on_rsvp
    )

    return NextResponse.json({ ok: true, totalPoints })
  } catch (error) {
    console.error('RSVP error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
