import { ProtectedShell } from '@/components/ProtectedShell'
import { Card } from '@/components/Card'
import { requireUser } from '@/lib/guards'
import { prisma } from '@/lib/db'
import Link from 'next/link'

export default async function QuestsPage({ searchParams }: { searchParams: { category?: string } }) {
  const user = await requireUser()

  const quests = await prisma.quest.findMany({
    where: {
      active: true,
      ...(searchParams.category && { category: searchParams.category }),
    },
    include: {
      userQuests: {
        where: {
          userId: user.id,
        },
      },
    },
    orderBy: {
      category: 'asc',
    },
  })

  const categories = await prisma.quest.findMany({
    where: { active: true },
    select: { category: true },
    distinct: ['category'],
  })

  const uniqueCategories = categories.map((c) => c.category).filter(Boolean) as string[]

  return (
    <ProtectedShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quests</h1>
          <p className="text-gray-600 mt-2">Complete tasks to earn points</p>
        </div>

        {uniqueCategories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Link
              href="/quests"
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                !searchParams.category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </Link>
            {uniqueCategories.map((category) => (
              <Link
                key={category}
                href={`/quests?category=${category}`}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  searchParams.category === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </Link>
            ))}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {quests.map((quest) => {
            const userQuest = quest.userQuests[0]
            const status = userQuest?.status || 'not_started'

            const statusColors = {
              not_started: 'bg-gray-100 text-gray-800',
              in_progress: 'bg-yellow-100 text-yellow-800',
              submitted: 'bg-blue-100 text-blue-800',
              completed: 'bg-green-100 text-green-800',
            }

            const statusLabels = {
              not_started: 'Not Started',
              in_progress: 'In Progress',
              submitted: 'Submitted',
              completed: 'Completed',
            }

            return (
              <Link key={quest.id} href={`/quests/${quest.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-xl font-semibold text-gray-900">{quest.title}</h2>
                    <span className="text-sm font-medium text-blue-600">
                      +{quest.points_on_complete} pts
                    </span>
                  </div>

                  {quest.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{quest.description}</p>
                  )}

                  <div className="flex items-center gap-2 mt-auto">
                    {quest.category && (
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                        {quest.category}
                      </span>
                    )}
                    <span className={`px-2 py-1 text-xs font-medium rounded ${statusColors[status as keyof typeof statusColors]}`}>
                      {statusLabels[status as keyof typeof statusLabels]}
                    </span>
                  </div>
                </Card>
              </Link>
            )
          })}

          {quests.length === 0 && (
            <Card className="col-span-2">
              <p className="text-gray-600 text-center">No quests found</p>
            </Card>
          )}
        </div>
      </div>
    </ProtectedShell>
  )
}
