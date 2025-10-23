'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/Button'

export default function CompleteQuestForm({
  questId,
  proofType,
  status,
  currentEvidence,
}: {
  questId: string
  proofType: string
  status: string
  currentEvidence?: string | null
}) {
  const [evidence, setEvidence] = useState(currentEvidence || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const isCompleted = status === 'completed'
  const isSubmitted = status === 'submitted'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validate evidence for URL proof type
    if (proofType === 'url' && !evidence) {
      setError('Please provide a URL as evidence')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/quests/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questId,
          evidence: evidence || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to complete quest')
      }

      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (isCompleted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <p className="text-green-800 font-medium text-lg mb-2">✓ Quest Completed!</p>
        <p className="text-green-700 text-sm">You've earned the points for this quest</p>
      </div>
    )
  }

  if (isSubmitted && proofType === 'admin_verify') {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <p className="text-yellow-800 font-medium text-lg mb-2">⏳ Pending Admin Verification</p>
        <p className="text-yellow-700 text-sm">
          Your submission is awaiting admin approval. You'll receive points once verified.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-4 bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {proofType === 'url' && (
        <div className="mb-4">
          <label htmlFor="evidence" className="block text-sm font-medium text-gray-700 mb-2">
            Evidence URL *
          </label>
          <input
            type="url"
            id="evidence"
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            placeholder="https://example.com/proof"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Provide a link that proves you completed this quest
          </p>
        </div>
      )}

      {proofType === 'admin_verify' && (
        <div className="mb-4">
          <label htmlFor="evidence" className="block text-sm font-medium text-gray-700 mb-2">
            Evidence (Optional)
          </label>
          <textarea
            id="evidence"
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            placeholder="Any additional information or proof..."
            rows={3}
          />
          <p className="text-xs text-gray-500 mt-1">
            Your submission will be reviewed by an admin
          </p>
        </div>
      )}

      {proofType === 'checkbox' && (
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            By clicking Complete Quest, you confirm that you have completed this quest.
          </p>
        </div>
      )}

      <Button type="submit" disabled={loading} className="w-full" variant="success">
        {loading ? 'Processing...' : 'Complete Quest'}
      </Button>
    </form>
  )
}
