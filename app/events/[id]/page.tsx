import { ProtectedShell } from '@/components/ProtectedShell'
import { Card } from '@/components/Card'
import { requireUser } from '@/lib/guards'
import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import { RsvpButton } from './RsvpButton'
import Link from 'next/link'

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const user = await requireUser()

  const event = await prisma.event.findUnique({
    where: { id: params.id },
    include: {
      rsvps: {
        where: {
          userId: user.id,
        },
      },
    },
  })

  if (!event) {
    notFound()
  }

  const hasRsvp = event.rsvps.length > 0

  return (
    <ProtectedShell>
      <div className="space-y-6">
        <Link href="/events" className="text-blue-600 hover:text-blue-700">
          ← Back to Events
        </Link>

        <Card>
          <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>

          {event.category && (
            <span className="inline-block mt-3 px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded">
              {event.category}
            </span>
          )}

          <div className="mt-6 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Date & Time</h3>
              <p className="mt-1 text-lg text-gray-900">
                {new Date(event.start).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <p className="text-gray-700">
                {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            {event.venue && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Venue</h3>
                <p className="mt-1 text-gray-900">{event.venue}</p>
                {event.address && (
                  <p className="text-gray-600">{event.address}</p>
                )}
              </div>
            )}

            {event.capacity && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Capacity</h3>
                <p className="mt-1 text-gray-900">{event.capacity} people</p>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium text-gray-500">Points</h3>
              <p className="mt-1 text-gray-900">
                RSVP: +{event.points_on_rsvp} pts | Attend: +{event.points_on_attend} pts
              </p>
            </div>

            {event.external_link && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">More Info</h3>
                <a
                  href={event.external_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 text-blue-600 hover:text-blue-700"
                >
                  {event.external_link}
                </a>
              </div>
            )}
          </div>

          <div className="mt-8 flex gap-4">
            <RsvpButton eventId={event.id} hasRsvp={hasRsvp} />
            <a
              href={`/api/ics?eventId=${event.id}`}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md font-medium hover:bg-gray-300 transition-colors"
            >
              Add to Calendar
            </a>
          </div>
        </Card>
      </div>
    </ProtectedShell>
  )
}
