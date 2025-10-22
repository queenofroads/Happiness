import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { awardPoints } from '@/lib/points'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized - Admin only' }, { status: 401 })
  }

  try {
    const { eventId, userEmail } = await request.json()

    if (!eventId || !userEmail) {
      return NextResponse.json({ error: 'Event ID and user email required' }, { status: 400 })
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if attendance already recorded
    const existingPoints = await prisma.pointsLedger.findFirst({
      where: {
        userId: user.id,
        source: 'event_attend',
        sourceId: eventId,
      },
    })

    const awarded = !existingPoints

    // Award attendance points idempotently
    const totalPoints = await awardPoints(
      user.id,
      'event_attend',
      eventId,
      event.points_on_attend
    )

    return NextResponse.json({ ok: true, awarded, totalPoints })
  } catch (error) {
    console.error('Attendance error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
