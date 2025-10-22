import { ProtectedShell } from '@/components/ProtectedShell'
import { Card } from '@/components/Card'
import { requireUser } from '@/lib/guards'
import { prisma } from '@/lib/db'
import Link from 'next/link'

export default async function EventsPage() {
  const user = await requireUser()

  const events = await prisma.event.findMany({
    where: {
      active: true,
      start: {
        gte: new Date(),
      },
    },
    orderBy: {
      start: 'asc',
    },
    include: {
      rsvps: {
        where: {
          userId: user.id,
        },
      },
    },
  })

  return (
    <ProtectedShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-600 mt-2">Upcoming events and activities</p>
        </div>

        <div className="grid gap-4">
          {events.map((event) => {
            const hasRsvp = event.rsvps.length > 0

            return (
              <Link key={event.id} href={`/events/${event.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-semibold text-gray-900">{event.title}</h2>
                        {hasRsvp && (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                            Added
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mt-2">
                        {new Date(event.start).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-gray-600">
                        {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {event.venue && (
                        <p className="text-gray-600 mt-2">{event.venue}</p>
                      )}
                      {event.address && (
                        <p className="text-sm text-gray-500">{event.address}</p>
                      )}
                      {event.category && (
                        <span className="inline-block mt-3 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                          {event.category}
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">RSVP: +{event.points_on_rsvp} pts</p>
                      <p className="text-sm text-gray-600">Attend: +{event.points_on_attend} pts</p>
                    </div>
                  </div>
                </Card>
              </Link>
            )
          })}

          {events.length === 0 && (
            <Card>
              <p className="text-gray-600 text-center">No upcoming events</p>
            </Card>
          )}
        </div>
      </div>
    </ProtectedShell>
  )
}
