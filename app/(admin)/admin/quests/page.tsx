import { ProtectedShell } from '@/components/ProtectedShell'
import { AdminOnly } from '@/components/AdminOnly'
import { Card } from '@/components/Card'
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '@/components/Table'
import { prisma } from '@/lib/db'
import { QuestForm } from './QuestForm'
import { DeleteQuestButton } from './DeleteQuestButton'
import { ApproveQuestButton } from './ApproveQuestButton'

export default async function AdminQuestsPage() {
  const quests = await prisma.quest.findMany({
    orderBy: {
      category: 'asc',
    },
  })

  const submittedQuests = await prisma.userQuest.findMany({
    where: {
      status: 'submitted',
    },
    include: {
      user: {
        select: {
          email: true,
          name: true,
        },
      },
      quest: {
        select: {
          title: true,
        },
      },
    },
  })

  return (
    <ProtectedShell>
      <AdminOnly>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Quests</h1>
            <p className="text-gray-600 mt-2">Create, update, delete quests and approve submissions</p>
          </div>

          {submittedQuests.length > 0 && (
            <Card>
              <h2 className="text-xl font-semibold mb-4">Pending Approvals</h2>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>User</TableHeader>
                    <TableHeader>Quest</TableHeader>
                    <TableHeader>Evidence</TableHeader>
                    <TableHeader>Actions</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {submittedQuests.map((uq) => (
                    <TableRow key={uq.id}>
                      <TableCell>{uq.user.name || uq.user.email}</TableCell>
                      <TableCell>{uq.quest.title}</TableCell>
                      <TableCell>
                        {uq.evidence_url ? (
                          <a
                            href={uq.evidence_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 text-sm"
                          >
                            View
                          </a>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        <ApproveQuestButton userQuestId={uq.id} userId={uq.userId} questId={uq.questId} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}

          <Card>
            <h2 className="text-xl font-semibold mb-4">Create New Quest</h2>
            <QuestForm />
          </Card>

          <Card>
            <h2 className="text-xl font-semibold mb-4">Existing Quests</h2>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Title</TableHeader>
                  <TableHeader>Category</TableHeader>
                  <TableHeader>Points</TableHeader>
                  <TableHeader>Proof Type</TableHeader>
                  <TableHeader>Active</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {quests.map((quest) => (
                  <TableRow key={quest.id}>
                    <TableCell>{quest.title}</TableCell>
                    <TableCell>{quest.category || '-'}</TableCell>
                    <TableCell>{quest.points_on_complete}</TableCell>
                    <TableCell>{quest.proof_type}</TableCell>
                    <TableCell>{quest.active ? 'Yes' : 'No'}</TableCell>
                    <TableCell>
                      <DeleteQuestButton questId={quest.id} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {quests.length === 0 && (
              <p className="text-gray-600 text-center py-8">No quests yet</p>
            )}
          </Card>
        </div>
      </AdminOnly>
    </ProtectedShell>
  )
}
