import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
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
      },
    })

    const userMap = new Map(users.map((u) => [u.id, u]))

    const top = topUsers.map((entry) => ({
      userId: entry.userId,
      name: userMap.get(entry.userId)?.name || null,
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

    const rank = allUsers.findIndex((u) => u.userId === session.user.id) + 1
    const points = allUsers.find((u) => u.userId === session.user.id)?._sum.points || 0

    return NextResponse.json({
      top,
      me: {
        rank,
        points,
      },
    })
  } catch (error) {
    console.error('Leaderboard error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
