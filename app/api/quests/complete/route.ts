import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { awardPoints } from '@/lib/points'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id
    const { questId, evidence } = await request.json()

    if (!questId) {
      return NextResponse.json({ error: 'Quest ID is required' }, { status: 400 })
    }

    // Check if quest exists
    const quest = await prisma.quest.findUnique({
      where: { id: questId },
    })

    if (!quest) {
      return NextResponse.json({ error: 'Quest not found' }, { status: 404 })
    }

    if (!quest.active) {
      return NextResponse.json({ error: 'Quest is not active' }, { status: 400 })
    }

    // Validate evidence for URL proof type
    if (quest.proofType === 'url' && !evidence) {
      return NextResponse.json(
        { error: 'Evidence URL is required for this quest' },
        { status: 400 }
      )
    }

    // Determine status based on proof type
    let status = 'completed'
    let completedAt: Date | null = new Date()

    if (quest.proofType === 'admin_verify') {
      status = 'submitted'
      completedAt = null
    }

    // Create or update user quest
    const existingUserQuest = await prisma.userQuest.findUnique({
      where: {
        userId_questId: {
          userId,
          questId,
        },
      },
    })

    if (existingUserQuest?.status === 'completed') {
      return NextResponse.json(
        { error: 'Quest already completed' },
        { status: 400 }
      )
    }

    await prisma.userQuest.upsert({
      where: {
        userId_questId: {
          userId,
          questId,
        },
      },
      update: {
        status,
        evidence: evidence || null,
        completedAt,
      },
      create: {
        userId,
        questId,
        status,
        evidence: evidence || null,
        completedAt,
      },
    })

    let totalPoints = 0

    // Award points only if completed (not pending admin verification)
    if (status === 'completed') {
      totalPoints = await awardPoints(userId, 'quest', questId, quest.points)
    }

    return NextResponse.json({
      success: true,
      status,
      totalPoints,
      message:
        status === 'completed'
          ? `Quest completed! You earned ${quest.points} points.`
          : 'Quest submitted for admin verification.',
    })
  } catch (error: any) {
    console.error('Quest completion error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to complete quest' },
      { status: 500 }
    )
  }
}
