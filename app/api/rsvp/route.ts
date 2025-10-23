import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { awardPoints } from '@/lib/points'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id
    const { eventId } = await request.json()

    if (!eventId) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 })
    }

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    if (!event.active) {
      return NextResponse.json({ error: 'Event is not active' }, { status: 400 })
    }

    // Create RSVP (upsert ensures idempotency)
    await prisma.eventRsvp.upsert({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
      update: {},
      create: {
        eventId,
        userId,
      },
    })

    // Award points (idempotent - only awards once per user+event)
    const totalPoints = await awardPoints(userId, 'rsvp', eventId, event.rsvpPoints)

    return NextResponse.json({
      success: true,
      totalPoints,
      message: `RSVP successful! You earned ${event.rsvpPoints} points.`,
    })
  } catch (error: any) {
    console.error('RSVP error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to RSVP' },
      { status: 500 }
    )
  }
}
