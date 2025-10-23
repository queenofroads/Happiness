import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getUserPoints } from '@/lib/points'
import { Card } from '@/components/Card'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')

  const userId = (session.user as any).id
  const points = await getUserPoints(userId)

  const upcomingEvents = await prisma.event.findMany({
    where: { active: true, start: { gte: new Date() } },
    orderBy: { start: 'asc' },
    take: 3,
  })

  const incompleteQuests = await prisma.quest.findMany({
    where: {
      active: true,
      userQuests: { none: { userId, status: 'completed' } },
    },
    take: 3,
  })

  return (
    <div className="min-h-screen">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex gap-6">
            <Link href="/dashboard" className="font-semibold text-blue-600">Dashboard</Link>
            <Link href="/events" className="hover:text-blue-600">Events</Link>
            <Link href="/quests" className="hover:text-blue-600">Quests</Link>
            <Link href="/leaderboard" className="hover:text-blue-600">Leaderboard</Link>
            {(session.user as any).isAdmin && (
              <Link href="/admin/events" className="text-purple-600 hover:text-purple-700">Admin</Link>
            )}
          </div>
          <span className="text-sm text-gray-600">{session.user.email}</span>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <Card>
          <h2 className="text-xl font-semibold mb-2">Your Points</h2>
          <p className="text-4xl font-bold text-blue-600">{points}</p>
        </Card>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
          <div className="grid gap-4">
            {upcomingEvents.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`}>
                <Card className="hover:shadow-lg transition cursor-pointer">
                  <h3 className="font-semibold">{event.title}</h3>
                  <p className="text-sm text-gray-600">{new Date(event.start).toLocaleDateString()}</p>
                  <span className="text-sm text-blue-600">+{event.rsvpPoints} pts</span>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Available Quests</h2>
          <div className="grid gap-4">
            {incompleteQuests.map((quest) => (
              <Link key={quest.id} href={`/quests/${quest.id}`}>
                <Card className="hover:shadow-lg transition cursor-pointer">
                  <h3 className="font-semibold">{quest.title}</h3>
                  <p className="text-sm text-gray-600">{quest.description}</p>
                  <span className="text-sm text-blue-600">+{quest.points} pts</span>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <footer className="mt-12 py-4 text-center text-sm text-gray-500 border-t">
        Finland Quest - Prototype for demonstration
      </footer>
    </div>
  )
}
