import { ProtectedShell } from '@/components/ProtectedShell'
import { Card } from '@/components/Card'
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '@/components/Table'
import { requireUser } from '@/lib/guards'
import { prisma } from '@/lib/db'

export default async function LeaderboardPage() {
  const user = await requireUser()

  // Get top users by points
  const topUsers = await prisma.pointsLedger.groupBy({
    by: ['userId'],
    _sum: {
      points: true,
    },
    orderBy: {
      _sum: {
        points: 'desc',
      },
    },
    take: 20,
  })

  // Get user details
  const userIds = topUsers.map((u) => u.userId)
  const users = await prisma.user.findMany({
    where: {
      id: {
        in: userIds,
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  })

  const userMap = new Map(users.map((u) => [u.id, u]))

  const leaderboard = topUsers.map((entry, index) => ({
    rank: index + 1,
    userId: entry.userId,
    name: userMap.get(entry.userId)?.name || userMap.get(entry.userId)?.email || 'Unknown',
    points: entry._sum.points || 0,
  }))

  // Find current user's rank
  const allUsers = await prisma.pointsLedger.groupBy({
    by: ['userId'],
    _sum: {
      points: true,
    },
    orderBy: {
      _sum: {
        points: 'desc',
      },
    },
  })

  const myRank = allUsers.findIndex((u) => u.userId === user.id) + 1
  const myPoints = allUsers.find((u) => u.userId === user.id)?._sum.points || 0

  return (
    <ProtectedShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
          <p className="text-gray-600 mt-2">Top performers in the relocation quest</p>
        </div>

        <Card>
          <h2 className="text-xl font-semibold mb-4">Your Rank</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-blue-600">#{myRank}</p>
              <p className="text-gray-600 mt-1">out of {allUsers.length} participants</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900">{myPoints}</p>
              <p className="text-gray-600 mt-1">total points</p>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4">Top 20</h2>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Rank</TableHeader>
                <TableHeader>Name</TableHeader>
                <TableHeader>Points</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaderboard.map((entry) => (
                <TableRow key={entry.userId}>
                  <TableCell>
                    <span className={entry.userId === user.id ? 'font-bold text-blue-600' : ''}>
                      #{entry.rank}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={entry.userId === user.id ? 'font-bold text-blue-600' : ''}>
                      {entry.name}
                      {entry.userId === user.id && ' (You)'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={entry.userId === user.id ? 'font-bold text-blue-600' : ''}>
                      {entry.points}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {leaderboard.length === 0 && (
            <p className="text-gray-600 text-center py-8">No participants yet</p>
          )}
        </Card>
      </div>
    </ProtectedShell>
  )
}
