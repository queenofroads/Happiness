import { ProtectedShell } from '@/components/ProtectedShell'
import { Card } from '@/components/Card'
import { requireUser } from '@/lib/guards'
import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import { QuestActions } from './QuestActions'
import Link from 'next/link'

export default async function QuestDetailPage({ params }: { params: { id: string } }) {
  const user = await requireUser()

  const quest = await prisma.quest.findUnique({
    where: { id: params.id },
    include: {
      userQuests: {
        where: {
          userId: user.id,
        },
      },
    },
  })

  if (!quest) {
    notFound()
  }

  const userQuest = quest.userQuests[0]
  const status = userQuest?.status || 'not_started'

  const helpfulLinks = quest.helpful_links ? quest.helpful_links.split(',').filter(Boolean) : []

  return (
    <ProtectedShell>
      <div className="space-y-6">
        <Link href="/quests" className="text-blue-600 hover:text-blue-700">
          ← Back to Quests
        </Link>

        <Card>
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{quest.title}</h1>
            <span className="text-xl font-semibold text-blue-600">
              +{quest.points_on_complete} pts
            </span>
          </div>

          {quest.category && (
            <span className="inline-block mb-4 px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded">
              {quest.category}
            </span>
          )}

          {quest.description && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
              <p className="text-gray-900">{quest.description}</p>
            </div>
          )}

          {helpfulLinks.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Helpful Links</h3>
              <ul className="space-y-2">
                {helpfulLinks.map((link, idx) => (
                  <li key={idx}>
                    <a
                      href={link.trim()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 break-all"
                    >
                      {link.trim()}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Proof Type</h3>
            <p className="text-gray-900 capitalize">{quest.proof_type.replace('_', ' ')}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
            <p className="text-gray-900 capitalize">{status.replace('_', ' ')}</p>
          </div>

          <QuestActions
            questId={quest.id}
            proofType={quest.proof_type}
            currentStatus={status}
            evidenceUrl={userQuest?.evidence_url}
          />
        </Card>
      </div>
    </ProtectedShell>
  )
}
