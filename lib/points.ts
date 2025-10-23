import { prisma } from './db'

export async function awardPoints(
  userId: string,
  source: string,
  sourceId: string,
  points: number
) {
  // Upsert ensures idempotency - only awards points once per unique combination
  await prisma.pointsLedger.upsert({
    where: {
      userId_source_sourceId: {
        userId,
        source,
        sourceId,
      },
    },
    update: {}, // If exists, do nothing
    create: {
      userId,
      source,
      sourceId,
      points,
    },
  })

  // Calculate total points for the user
  const total = await prisma.pointsLedger.aggregate({
    where: { userId },
    _sum: { points: true },
  })

  return total._sum.points || 0
}

export async function getUserPoints(userId: string): Promise<number> {
  const total = await prisma.pointsLedger.aggregate({
    where: { userId },
    _sum: { points: true },
  })

  return total._sum.points || 0
}

export async function getLeaderboard(limit: number = 20) {
  const leaderboard = await prisma.pointsLedger.groupBy({
    by: ['userId'],
    _sum: {
      points: true,
    },
    orderBy: {
      _sum: {
        points: 'desc',
      },
    },
    take: limit,
  })

  // Fetch user details
  const userIds = leaderboard.map((entry) => entry.userId)
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

  // Combine user details with points
  const userMap = new Map(users.map((user) => [user.id, user]))

  return leaderboard.map((entry, index) => {
    const user = userMap.get(entry.userId)
    return {
      rank: index + 1,
      userId: entry.userId,
      name: user?.name || user?.email || 'Unknown',
      email: user?.email || '',
      points: entry._sum.points || 0,
    }
  })
}
