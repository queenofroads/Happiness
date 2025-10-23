import { prisma } from './db'

export async function awardPoints(
  userId: string,
  source: string,
  sourceId: string,
  points: number
) {
  await prisma.pointsLedger.upsert({
    where: { userId_source_sourceId: { userId, source, sourceId } },
    update: {},
    create: { userId, source, sourceId, points },
  })

  const total = await prisma.pointsLedger.aggregate({
    where: { userId },
    _sum: { points: true },
  })

  return total._sum.points || 0
}

export async function getUserPoints(userId: string) {
  const total = await prisma.pointsLedger.aggregate({
    where: { userId },
    _sum: { points: true },
  })
  return total._sum.points || 0
}
