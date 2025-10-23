import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { getLeaderboard, getUserPoints } from '@/lib/points'
import Card from '@/components/Card'
import Navbar from '@/components/Navbar'

export default async function LeaderboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login')
  }

  const userId = (session.user as any).id

  // Get top 20 users
  const leaderboard = await getLeaderboard(20)

  // Get current user's points and rank
  const currentUserPoints = await getUserPoints(userId)
  const currentUserRank = leaderboard.findIndex((entry) => entry.userId === userId)
  const userRank = currentUserRank !== -1 ? currentUserRank + 1 : null

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
          <p className="text-gray-600 mt-2">See how you rank against other participants</p>
        </div>

        {/* Current User Stats */}
        <Card className="mb-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Your Position</p>
              <p className="text-4xl font-bold mt-2">
                {userRank ? `#${userRank}` : 'Unranked'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-blue-100 text-sm font-medium">Your Points</p>
              <p className="text-4xl font-bold mt-2">{currentUserPoints}</p>
            </div>
          </div>
        </Card>

        {/* Leaderboard Table */}
        <Card>
          {leaderboard.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No participants yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Rank</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry) => {
                    const isCurrentUser = entry.userId === userId
                    const medalEmojis = ['🥇', '🥈', '🥉']

                    return (
                      <tr
                        key={entry.userId}
                        className={`border-b border-gray-100 ${
                          isCurrentUser ? 'bg-blue-50' : 'hover:bg-gray-50'
                        }`}
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            {entry.rank <= 3 && (
                              <span className="text-2xl mr-2">{medalEmojis[entry.rank - 1]}</span>
                            )}
                            <span
                              className={`font-semibold ${
                                entry.rank <= 3 ? 'text-lg' : 'text-gray-700'
                              }`}
                            >
                              #{entry.rank}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className={`font-medium ${isCurrentUser ? 'text-blue-700' : 'text-gray-900'}`}>
                              {entry.name}
                              {isCurrentUser && (
                                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  You
                                </span>
                              )}
                            </p>
                            <p className="text-sm text-gray-500">{entry.email}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span
                            className={`font-bold text-lg ${
                              entry.rank <= 3 ? 'text-purple-600' : 'text-gray-700'
                            }`}
                          >
                            {entry.points}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <footer className="mt-12 text-center text-gray-500 text-sm">
          Finland Quest - Prototype for demonstration
        </footer>
      </main>
    </div>
  )
}
