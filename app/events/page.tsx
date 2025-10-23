import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import Card from '@/components/Card'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default async function EventsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login')
  }

  const userId = (session.user as any).id

  // Get all upcoming events
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
          userId,
        },
      },
      _count: {
        select: {
          rsvps: true,
        },
      },
    },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-600 mt-2">RSVP to events and earn points</p>
        </div>

        {events.length === 0 ? (
          <Card>
            <p className="text-gray-500 text-center py-8">No upcoming events</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
              const hasRSVPd = event.rsvps.length > 0
              const startDate = new Date(event.start)
              const endDate = new Date(event.end)

              return (
                <Link key={event.id} href={`/events/${event.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                      {hasRSVPd && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          RSVP'd
                        </span>
                      )}
                    </div>

                    {event.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {event.description}
                      </p>
                    )}

                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex items-center">
                        <span className="font-medium mr-2">📅</span>
                        {startDate.toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>

                      <div className="flex items-center">
                        <span className="font-medium mr-2">🕒</span>
                        {startDate.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                        {' - '}
                        {endDate.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>

                      {event.venue && (
                        <div className="flex items-center">
                          <span className="font-medium mr-2">📍</span>
                          {event.venue}
                        </div>
                      )}

                      {event.category && (
                        <div className="mt-2">
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {event.category}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {event._count.rsvps} RSVP{event._count.rsvps !== 1 ? 's' : ''}
                      </span>
                      <span className="text-sm font-medium text-blue-600">
                        +{event.rsvpPoints} pts
                      </span>
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}

        <footer className="mt-12 text-center text-gray-500 text-sm">
          Finland Quest - Prototype for demonstration
        </footer>
      </main>
    </div>
  )
}
