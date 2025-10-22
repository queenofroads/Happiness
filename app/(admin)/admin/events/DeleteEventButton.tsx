'use client'

import { Button } from '@/components/Button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function DeleteEventButton({ eventId }: { eventId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this event?')) {
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/admin/events/${eventId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error('Delete event error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="danger"
      onClick={handleDelete}
      disabled={loading}
      className="text-xs px-2 py-1"
    >
      {loading ? 'Deleting...' : 'Delete'}
    </Button>
  )
}
