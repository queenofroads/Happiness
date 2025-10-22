import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized - Admin only' }, { status: 401 })
  }

  try {
    const data = await request.json()

    const quest = await prisma.quest.create({
      data: {
        title: data.title,
        description: data.description || null,
        category: data.category || null,
        helpful_links: data.helpful_links || '',
        points_on_complete: data.points_on_complete,
        proof_type: data.proof_type,
        active: data.active ?? true,
      },
    })

    return NextResponse.json(quest)
  } catch (error) {
    console.error('Create quest error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
