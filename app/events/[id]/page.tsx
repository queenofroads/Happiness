import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import Card from '@/components/Card'
import Navbar from '@/components/Navbar'
import RSVPButton from './RSVPButton'

export default async function EventDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login')
  }

  const userId = (session.user as any).id

  const event = await prisma.event.findUnique({
    where: { id: params.id },
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

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <p className="text-center text-gray-500">Event not found</p>
          </Card>
        </main>
      </div>
    )
  }

  const hasRSVPd = event.rsvps.length > 0
  const startDate = new Date(event.start)
  const endDate = new Date(event.end)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
              {event.category && (
                <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded">
                  {event.category}
                </span>
              )}
            </div>
            {hasRSVPd && (
              <span className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-medium">
                ✓ RSVP'd
              </span>
            )}
          </div>

          {event.description && (
            <div className="mb-6">
              <p className="text-gray-700 leading-relaxed">{event.description}</p>
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-6 mb-6 space-y-4">
            <div className="flex items-start">
              <span className="text-2xl mr-4">📅</span>
              <div>
                <p className="font-medium text-gray-900">Date</p>
                <p className="text-gray-700">
                  {startDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <span className="text-2xl mr-4">🕒</span>
              <div>
                <p className="font-medium text-gray-900">Time</p>
                <p className="text-gray-700">
                  {startDate.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  {' - '}
                  {endDate.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>

            {event.venue && (
              <div className="flex items-start">
                <span className="text-2xl mr-4">📍</span>
                <div>
                  <p className="font-medium text-gray-900">Venue</p>
                  <p className="text-gray-700">{event.venue}</p>
                </div>
              </div>
            )}

            <div className="flex items-start">
              <span className="text-2xl mr-4">👥</span>
              <div>
                <p className="font-medium text-gray-900">Attendees</p>
                <p className="text-gray-700">
                  {event._count.rsvps} {event._count.rsvps === 1 ? 'person has' : 'people have'} RSVP'd
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <span className="text-2xl mr-4">🎯</span>
              <div>
                <p className="font-medium text-gray-900">Points</p>
                <p className="text-gray-700">
                  RSVP: <span className="font-semibold text-blue-600">{event.rsvpPoints} points</span>
                  <br />
                  Attendance: <span className="font-semibold text-blue-600">{event.attendPoints} points</span>
                </p>
              </div>
            </div>
          </div>

          <RSVPButton eventId={event.id} hasRSVPd={hasRSVPd} />
        </Card>

        <footer className="mt-12 text-center text-gray-500 text-sm">
          Finland Quest - Prototype for demonstration
        </footer>
      </main>
    </div>
  )
}
