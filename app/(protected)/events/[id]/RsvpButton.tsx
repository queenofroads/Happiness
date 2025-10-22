'use client'

import { Button } from '@/components/Button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface RsvpButtonProps {
  eventId: string
  hasRsvp: boolean
}

export function RsvpButton({ eventId, hasRsvp: initialHasRsvp }: RsvpButtonProps) {
  const [hasRsvp, setHasRsvp] = useState(initialHasRsvp)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRsvp = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId }),
      })

      if (res.ok) {
        setHasRsvp(true)
        router.refresh()
      }
    } catch (error) {
      console.error('RSVP error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (hasRsvp) {
    return (
      <Button variant="secondary" disabled>
        Already RSVPed
      </Button>
    )
  }

  return (
    <Button onClick={handleRsvp} disabled={loading}>
      {loading ? 'Saving...' : 'RSVP'}
    </Button>
  )
}
