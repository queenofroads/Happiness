import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getUserPoints } from '@/lib/points'
import Card from '@/components/Card'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import Button from '@/components/Button'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login')
  }

  const userId = (session.user as any).id

  // Get user's total points
  const totalPoints = await getUserPoints(userId)

  // Get 3 upcoming events
  const upcomingEvents = await prisma.event.findMany({
    where: {
      active: true,
      start: {
        gte: new Date(),
      },
    },
    orderBy: {
      start: 'asc',
    },
    take: 3,
    include: {
      rsvps: {
        where: {
          userId,
        },
      },
    },
  })

  // Get 3 incomplete quests
  const incompleteQuests = await prisma.quest.findMany({
    where: {
      active: true,
      userQuests: {
        none: {
          userId,
          status: 'completed',
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
    take: 3,
    include: {
      userQuests: {
        where: {
          userId,
        },
      },
    },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {session.user.name || session.user.email}!</p>
        </div>

        {/* Points Card */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Points</p>
                <p className="text-5xl font-bold mt-2">{totalPoints}</p>
              </div>
              <div className="text-6xl opacity-20">🏆</div>
            </div>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Upcoming Events */}
          <Card title="Upcoming Events">
            {upcomingEvents.length === 0 ? (
              <p className="text-gray-500">No upcoming events</p>
            ) : (
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="border-l-4 border-blue-500 pl-4 py-2">
                    <h3 className="font-semibold text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(event.start).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    {event.venue && (
                      <p className="text-sm text-gray-500">{event.venue}</p>
                    )}
                    {event.rsvps.length > 0 && (
                      <span className="inline-block mt-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        RSVP'd
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
            <div className="mt-6">
              <Link href="/events">
                <Button variant="secondary" className="w-full">View All Events</Button>
              </Link>
            </div>
          </Card>

          {/* Incomplete Quests */}
          <Card title="Available Quests">
            {incompleteQuests.length === 0 ? (
              <p className="text-gray-500">No quests available</p>
            ) : (
              <div className="space-y-4">
                {incompleteQuests.map((quest) => {
                  const userQuest = quest.userQuests[0]
                  return (
                    <div key={quest.id} className="border-l-4 border-purple-500 pl-4 py-2">
                      <h3 className="font-semibold text-gray-900">{quest.title}</h3>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm text-gray-600">{quest.points} points</span>
                        {userQuest && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                            {userQuest.status}
                          </span>
                        )}
                      </div>
                      {quest.category && (
                        <span className="inline-block mt-1 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {quest.category}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
            <div className="mt-6">
              <Link href="/quests">
                <Button variant="secondary" className="w-full">View All Quests</Button>
              </Link>
            </div>
          </Card>
        </div>

        <footer className="mt-12 text-center text-gray-500 text-sm">
          Finland Quest - Prototype for demonstration
        </footer>
      </main>
    </div>
  )
}
