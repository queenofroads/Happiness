import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized - Admin only' }, { status: 401 })
  }

  try {
    await prisma.quest.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Delete quest error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
