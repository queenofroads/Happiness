import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized - Admin only' }, { status: 401 })
  }

  try {
    const data = await request.json()

    const event = await prisma.event.create({
      data: {
        title: data.title,
        start: new Date(data.start),
        end: new Date(data.end),
        venue: data.venue || null,
        address: data.address || null,
        category: data.category || null,
        external_link: data.external_link || null,
        capacity: data.capacity || null,
        points_on_rsvp: data.points_on_rsvp,
        points_on_attend: data.points_on_attend,
        active: data.active ?? true,
      },
    })

    return NextResponse.json(event)
  } catch (error) {
    console.error('Create event error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
