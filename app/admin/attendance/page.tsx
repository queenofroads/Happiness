import { ProtectedShell } from '@/components/ProtectedShell'
import { AdminOnly } from '@/components/AdminOnly'
import { Card } from '@/components/Card'
import { prisma } from '@/lib/db'
import { AttendanceForm } from './AttendanceForm'

export default async function AdminAttendancePage() {
  const events = await prisma.event.findMany({
    where: {
      active: true,
    },
    orderBy: {
      start: 'desc',
    },
    take: 20,
  })

  return (
    <ProtectedShell>
      <AdminOnly>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mark Attendance</h1>
            <p className="text-gray-600 mt-2">Record event attendance and award points</p>
          </div>

          <Card>
            <h2 className="text-xl font-semibold mb-4">Mark User Attendance</h2>
            <AttendanceForm events={events} />
          </Card>
        </div>
      </AdminOnly>
    </ProtectedShell>
  )
}
