'use client'

import { Button } from '@/components/Button'
import { useState } from 'react'
import { Event } from '@prisma/client'

interface AttendanceFormProps {
  events: Event[]
}

export function AttendanceForm({ events }: AttendanceFormProps) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const formData = new FormData(e.currentTarget)
    const data = {
      eventId: formData.get('eventId'),
      userEmail: formData.get('userEmail'),
    }

    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (res.ok) {
        setMessage(
          result.awarded
            ? `✓ Attendance recorded and ${result.totalPoints} total points awarded!`
            : `✓ Attendance already recorded. User has ${result.totalPoints} total points.`
        )
        e.currentTarget.reset()
      } else {
        setMessage(`Error: ${result.error || 'Failed to record attendance'}`)
      }
    } catch (error) {
      console.error('Attendance error:', error)
      setMessage('Error: Failed to record attendance')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event *
          </label>
          <select
            name="eventId"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select an event...</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title} - {new Date(event.start).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            User Email *
          </label>
          <input
            name="userEmail"
            type="email"
            required
            placeholder="user@example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? 'Recording...' : 'Mark Attended'}
        </Button>
      </form>

      {message && (
        <div className={`mt-4 p-4 rounded-md ${message.startsWith('✓') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message}
        </div>
      )}
    </div>
  )
}
