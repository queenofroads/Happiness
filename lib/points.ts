import { prisma } from './db'

/**
 * Award points to a user idempotently.
 * Only creates a ledger entry if one doesn't exist for the same (userId, source, sourceId).
 * @returns The user's new total points
 */
export async function awardPoints(
  userId: string,
  source: string,
  sourceId: string | null,
  points: number
): Promise<number> {
  // Check if points have already been awarded for this specific action
  const existing = await prisma.pointsLedger.findFirst({
    where: {
      userId,
      source,
      sourceId: sourceId ?? null,
    },
  })

  if (!existing) {
    await prisma.pointsLedger.create({
      data: {
        userId,
        source,
        sourceId,
        points,
      },
    })
  }

  // Return the user's total points
  return getUserTotalPoints(userId)
}

/**
 * Get the total points for a user
 */
export async function getUserTotalPoints(userId: string): Promise<number> {
  const result = await prisma.pointsLedger.aggregate({
    where: { userId },
    _sum: { points: true },
  })

  return result._sum.points ?? 0
}
