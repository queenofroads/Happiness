import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import Card from '@/components/Card'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default async function QuestsPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login')
  }

  const userId = (session.user as any).id

  // Get all categories
  const categories = await prisma.quest.findMany({
    where: { active: true },
    select: { category: true },
    distinct: ['category'],
  })

  const uniqueCategories = Array.from(
    new Set(categories.map((c) => c.category).filter(Boolean))
  ) as string[]

  // Get quests filtered by category if specified
  const quests = await prisma.quest.findMany({
    where: {
      active: true,
      ...(searchParams.category && { category: searchParams.category }),
    },
    orderBy: {
      createdAt: 'asc',
    },
    include: {
      userQuests: {
        where: {
          userId,
        },
      },
    },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Quests</h1>
          <p className="text-gray-600 mt-2">Complete quests to earn points</p>
        </div>

        {/* Category Filter */}
        {uniqueCategories.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              <Link href="/quests">
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    !searchParams.category
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  All
                </button>
              </Link>
              {uniqueCategories.map((category) => (
                <Link key={category} href={`/quests?category=${category}`}>
                  <button
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      searchParams.category === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {category}
                  </button>
                </Link>
              ))}
            </div>
          </div>
        )}

        {quests.length === 0 ? (
          <Card>
            <p className="text-gray-500 text-center py-8">No quests available</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quests.map((quest) => {
              const userQuest = quest.userQuests[0]
              const status = userQuest?.status || 'pending'

              const statusColors = {
                pending: 'bg-gray-100 text-gray-800',
                submitted: 'bg-yellow-100 text-yellow-800',
                completed: 'bg-green-100 text-green-800',
              }

              return (
                <Link key={quest.id} href={`/quests/${quest.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">{quest.title}</h3>
                      {userQuest && (
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            statusColors[status as keyof typeof statusColors]
                          }`}
                        >
                          {status}
                        </span>
                      )}
                    </div>

                    {quest.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {quest.description}
                      </p>
                    )}

                    <div className="space-y-2">
                      {quest.category && (
                        <div>
                          <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                            {quest.category}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-2">
                        <span className="text-sm text-gray-600">
                          Proof: <span className="font-medium">{quest.proofType}</span>
                        </span>
                        <span className="text-lg font-bold text-purple-600">
                          {quest.points} pts
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}

        <footer className="mt-12 text-center text-gray-500 text-sm">
          Finland Quest - Prototype for demonstration
        </footer>
      </main>
    </div>
  )
}
