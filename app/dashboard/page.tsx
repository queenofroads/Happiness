import { ProtectedShell } from '@/components/ProtectedShell'
import { Card } from '@/components/Card'
import { requireUser } from '@/lib/guards'
import { getUserTotalPoints } from '@/lib/points'
import { getRecommendations } from '@/lib/recommend'
import Link from 'next/link'

export default async function DashboardPage() {
  const user = await requireUser()
  const totalPoints = await getUserTotalPoints(user.id)
  const recommendations = await getRecommendations(user.id)

  return (
    <ProtectedShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user.name || user.email}!</p>
        </div>

        <Card>
          <h2 className="text-xl font-semibold mb-2">Your Points</h2>
          <p className="text-4xl font-bold text-blue-600">{totalPoints}</p>
        </Card>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Next Actions</h2>

          {recommendations.events.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Upcoming Events</h3>
              <div className="space-y-3">
                {recommendations.events.map((event) => (
                  <Link key={event.id} href={`/events/${event.id}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900">{event.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {new Date(event.start).toLocaleDateString()} at {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          {event.venue && (
                            <p className="text-sm text-gray-500 mt-1">{event.venue}</p>
                          )}
                        </div>
                        <span className="text-sm font-medium text-blue-600">
                          +{event.points_on_rsvp} pts
                        </span>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {recommendations.quest && (
            <div>
              <h3 className="text-lg font-medium mb-3">Recommended Quest</h3>
              <Link href={`/quests/${recommendations.quest.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900">{recommendations.quest.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{recommendations.quest.description}</p>
                      {recommendations.quest.category && (
                        <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                          {recommendations.quest.category}
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-medium text-blue-600">
                      +{recommendations.quest.points_on_complete} pts
                    </span>
                  </div>
                </Card>
              </Link>
            </div>
          )}
        </div>
      </div>
    </ProtectedShell>
  )
}
