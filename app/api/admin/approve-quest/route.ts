import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { awardPoints } from '@/lib/points'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized - Admin only' }, { status: 401 })
  }

  try {
    const { userQuestId, userId, questId } = await request.json()

    const quest = await prisma.quest.findUnique({
      where: { id: questId },
    })

    if (!quest) {
      return NextResponse.json({ error: 'Quest not found' }, { status: 404 })
    }

    // Update user quest to completed
    await prisma.userQuest.update({
      where: { id: userQuestId },
      data: {
        status: 'completed',
        completed_at: new Date(),
      },
    })

    // Award points idempotently
    const totalPoints = await awardPoints(
      userId,
      'quest_complete',
      questId,
      quest.points_on_complete
    )

    return NextResponse.json({ ok: true, totalPoints })
  } catch (error) {
    console.error('Approve quest error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
