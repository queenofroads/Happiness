import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { awardPoints } from '@/lib/points'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { proofUrl } = await request.json()
    const questId = params.id

    const quest = await prisma.quest.findUnique({
      where: { id: questId },
    })

    if (!quest) {
      return NextResponse.json({ error: 'Quest not found' }, { status: 404 })
    }

    // Determine status based on proof type
    let status = 'completed'
    if (quest.proof_type === 'admin_verify') {
      status = 'submitted'
    } else if (quest.proof_type === 'url' || quest.proof_type === 'file') {
      if (!proofUrl) {
        return NextResponse.json({ error: 'Proof URL required' }, { status: 400 })
      }
      status = 'completed'
    }

    // Upsert user quest
    const userQuest = await prisma.userQuest.upsert({
      where: {
        userId_questId: {
          userId: session.user.id,
          questId,
        },
      },
      update: {
        status,
        evidence_url: proofUrl || null,
        completed_at: status === 'completed' ? new Date() : null,
      },
      create: {
        userId: session.user.id,
        questId,
        status,
        evidence_url: proofUrl || null,
        completed_at: status === 'completed' ? new Date() : null,
      },
    })

    // Award points only if completed (not submitted for review)
    let totalPoints = 0
    if (status === 'completed') {
      totalPoints = await awardPoints(
        session.user.id,
        'quest_complete',
        questId,
        quest.points_on_complete
      )
    }

    return NextResponse.json({ ok: true, status, totalPoints })
  } catch (error) {
    console.error('Quest complete error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
