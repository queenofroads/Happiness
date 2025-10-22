import { ProtectedShell } from '@/components/ProtectedShell'
import { AdminOnly } from '@/components/AdminOnly'
import { Card } from '@/components/Card'
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '@/components/Table'
import { prisma } from '@/lib/db'
import { EventForm } from './EventForm'
import { DeleteEventButton } from './DeleteEventButton'

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({
    orderBy: {
      start: 'desc',
    },
    take: 50,
  })

  return (
    <ProtectedShell>
      <AdminOnly>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Events</h1>
            <p className="text-gray-600 mt-2">Create, update, and delete events</p>
          </div>

          <Card>
            <h2 className="text-xl font-semibold mb-4">Create New Event</h2>
            <EventForm />
          </Card>

          <Card>
            <h2 className="text-xl font-semibold mb-4">Existing Events</h2>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Title</TableHeader>
                  <TableHeader>Date</TableHeader>
                  <TableHeader>Category</TableHeader>
                  <TableHeader>Active</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>{event.title}</TableCell>
                    <TableCell>
                      {new Date(event.start).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{event.category || '-'}</TableCell>
                    <TableCell>{event.active ? 'Yes' : 'No'}</TableCell>
                    <TableCell>
                      <DeleteEventButton eventId={event.id} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {events.length === 0 && (
              <p className="text-gray-600 text-center py-8">No events yet</p>
            )}
          </Card>
        </div>
      </AdminOnly>
    </ProtectedShell>
  )
}
