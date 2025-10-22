import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateICS } from '@/lib/ics'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get('eventId')

    if (!eventId) {
      return NextResponse.json({ error: 'Event ID required' }, { status: 400 })
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    const icsContent = generateICS(event)

    return new NextResponse(icsContent, {
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="${event.title.replace(/[^a-z0-9]/gi, '_')}.ics"`,
      },
    })
  } catch (error) {
    console.error('ICS generation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
