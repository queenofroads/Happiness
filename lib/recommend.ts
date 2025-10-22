import { prisma } from './db'

export async function getRecommendations(userId: string) {
  // Get top 3 soonest active events
  const upcomingEvents = await prisma.event.findMany({
    where: {
      active: true,
      start: {
        gte: new Date(),
      },
    },
    orderBy: {
      start: 'asc',
    },
    take: 3,
  })

  // Get 1 quest not yet completed by the user
  const completedQuestIds = await prisma.userQuest.findMany({
    where: {
      userId,
      status: 'completed',
    },
    select: {
      questId: true,
    },
  })

  const completedIds = completedQuestIds.map((uq) => uq.questId)

  const recommendedQuest = await prisma.quest.findFirst({
    where: {
      active: true,
      id: {
        notIn: completedIds,
      },
    },
    orderBy: {
      points_on_complete: 'desc',
    },
  })

  return {
    events: upcomingEvents,
    quest: recommendedQuest,
  }
}
