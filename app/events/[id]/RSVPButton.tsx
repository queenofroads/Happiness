'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/Button'

export default function RSVPButton({
  eventId,
  hasRSVPd,
}: {
  eventId: string
  hasRSVPd: boolean
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleRSVP = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to RSVP')
      }

      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {error && (
        <div className="mb-4 bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <Button
        onClick={handleRSVP}
        disabled={loading || hasRSVPd}
        className="w-full"
        variant={hasRSVPd ? 'secondary' : 'primary'}
      >
        {loading ? 'Processing...' : hasRSVPd ? 'Already RSVP\'d' : 'RSVP to Event'}
      </Button>

      {hasRSVPd && (
        <p className="mt-2 text-sm text-center text-gray-600">
          You've already RSVP'd to this event
        </p>
      )}
    </div>
  )
}
