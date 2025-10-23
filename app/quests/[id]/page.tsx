import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import Card from '@/components/Card'
import Navbar from '@/components/Navbar'
import CompleteQuestForm from './CompleteQuestForm'

export default async function QuestDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login')
  }

  const userId = (session.user as any).id

  const quest = await prisma.quest.findUnique({
    where: { id: params.id },
    include: {
      userQuests: {
        where: {
          userId,
        },
      },
    },
  })

  if (!quest) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <p className="text-center text-gray-500">Quest not found</p>
          </Card>
        </main>
      </div>
    )
  }

  const userQuest = quest.userQuests[0]
  const status = userQuest?.status || 'not_started'

  const statusColors = {
    not_started: 'bg-gray-100 text-gray-800',
    pending: 'bg-gray-100 text-gray-800',
    submitted: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{quest.title}</h1>
              {quest.category && (
                <span className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded">
                  {quest.category}
                </span>
              )}
            </div>
            {userQuest && (
              <span
                className={`px-4 py-2 rounded-lg font-medium capitalize ${
                  statusColors[status as keyof typeof statusColors]
                }`}
              >
                {status}
              </span>
            )}
          </div>

          {quest.description && (
            <div className="mb-6">
              <p className="text-gray-700 leading-relaxed">{quest.description}</p>
            </div>
          )}

          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-900 font-medium mb-1">Quest Reward</p>
                <p className="text-4xl font-bold text-purple-600">{quest.points} points</p>
              </div>
              <div className="text-6xl opacity-30">🎯</div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6 space-y-4">
            <div className="flex items-start">
              <span className="text-2xl mr-4">📋</span>
              <div>
                <p className="font-medium text-gray-900">Proof Type</p>
                <p className="text-gray-700 capitalize">{quest.proofType.replace('_', ' ')}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {quest.proofType === 'checkbox' && 'Simply confirm that you completed this quest'}
                  {quest.proofType === 'url' && 'Provide a URL as evidence of completion'}
                  {quest.proofType === 'admin_verify' &&
                    'Submit for admin verification (you can provide optional evidence)'}
                </p>
              </div>
            </div>

            {userQuest?.evidence && (
              <div className="flex items-start">
                <span className="text-2xl mr-4">📎</span>
                <div>
                  <p className="font-medium text-gray-900">Your Evidence</p>
                  <p className="text-gray-700 break-all">{userQuest.evidence}</p>
                </div>
              </div>
            )}

            {userQuest?.completedAt && (
              <div className="flex items-start">
                <span className="text-2xl mr-4">✓</span>
                <div>
                  <p className="font-medium text-gray-900">Completed</p>
                  <p className="text-gray-700">
                    {new Date(userQuest.completedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>

          <CompleteQuestForm
            questId={quest.id}
            proofType={quest.proofType}
            status={status}
            currentEvidence={userQuest?.evidence}
          />
        </Card>

        <footer className="mt-12 text-center text-gray-500 text-sm">
          Finland Quest - Prototype for demonstration
        </footer>
      </main>
    </div>
  )
}
