import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { PrismaClient } from '@prisma/client'
import { awardPoints, getUserTotalPoints } from '../lib/points'

const prisma = new PrismaClient()

describe('Points System', () => {
  const testUserId = 'test-user-' + Date.now()

  afterEach(async () => {
    // Clean up test data
    await prisma.pointsLedger.deleteMany({
      where: { userId: testUserId },
    })
    await prisma.user.deleteMany({
      where: { id: testUserId },
    })
  })

  it('should award points idempotently', async () => {
    // Create test user
    await prisma.user.create({
      data: {
        id: testUserId,
        email: `test-${Date.now()}@test.com`,
        interests: '',
      },
    })

    // Award points first time
    const total1 = await awardPoints(testUserId, 'event_rsvp', 'event-1', 10)
    expect(total1).toBe(10)

    // Award same points again (should be idempotent)
    const total2 = await awardPoints(testUserId, 'event_rsvp', 'event-1', 10)
    expect(total2).toBe(10) // Should still be 10, not 20

    // Award points for different event
    const total3 = await awardPoints(testUserId, 'event_rsvp', 'event-2', 15)
    expect(total3).toBe(25) // Now should be 10 + 15
  })

  it('should calculate total points correctly', async () => {
    // Create test user
    await prisma.user.create({
      data: {
        id: testUserId,
        email: `test-${Date.now()}@test.com`,
        interests: '',
      },
    })

    // Award different types of points
    await awardPoints(testUserId, 'event_rsvp', 'event-1', 5)
    await awardPoints(testUserId, 'event_attend', 'event-1', 25)
    await awardPoints(testUserId, 'quest_complete', 'quest-1', 50)

    const total = await getUserTotalPoints(testUserId)
    expect(total).toBe(80)
  })

  it('should not duplicate points for same source and sourceId', async () => {
    // Create test user
    await prisma.user.create({
      data: {
        id: testUserId,
        email: `test-${Date.now()}@test.com`,
        interests: '',
      },
    })

    // Award points multiple times
    await awardPoints(testUserId, 'quest_complete', 'quest-1', 50)
    await awardPoints(testUserId, 'quest_complete', 'quest-1', 50)
    await awardPoints(testUserId, 'quest_complete', 'quest-1', 50)

    // Check that only one entry exists
    const entries = await prisma.pointsLedger.findMany({
      where: {
        userId: testUserId,
        source: 'quest_complete',
        sourceId: 'quest-1',
      },
    })

    expect(entries.length).toBe(1)
    expect(entries[0].points).toBe(50)

    const total = await getUserTotalPoints(testUserId)
    expect(total).toBe(50)
  })
})
