'use client'

import { Button } from '@/components/Button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface QuestActionsProps {
  questId: string
  proofType: string
  currentStatus: string
  evidenceUrl?: string | null
}

export function QuestActions({ questId, proofType, currentStatus, evidenceUrl: initialEvidence }: QuestActionsProps) {
  const [loading, setLoading] = useState(false)
  const [proofUrl, setProofUrl] = useState(initialEvidence || '')
  const router = useRouter()

  const handleComplete = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/quests/${questId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proofUrl: proofUrl || undefined }),
      })

      if (res.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error('Complete quest error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (currentStatus === 'completed') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-md p-4">
        <p className="text-green-800 font-medium">Quest Completed!</p>
      </div>
    )
  }

  if (currentStatus === 'submitted') {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <p className="text-blue-800 font-medium">Quest submitted for review</p>
        {initialEvidence && (
          <p className="text-sm text-blue-700 mt-1">Evidence: {initialEvidence}</p>
        )}
      </div>
    )
  }

  const needsProof = proofType === 'url' || proofType === 'file'

  return (
    <div className="space-y-4">
      {needsProof && (
        <div>
          <label htmlFor="proofUrl" className="block text-sm font-medium text-gray-700 mb-1">
            {proofType === 'url' ? 'Proof URL' : 'File URL'}
          </label>
          <input
            id="proofUrl"
            type="url"
            value={proofUrl}
            onChange={(e) => setProofUrl(e.target.value)}
            placeholder="https://..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      <Button onClick={handleComplete} disabled={loading || (needsProof && !proofUrl)}>
        {loading ? 'Submitting...' : proofType === 'admin_verify' ? 'Submit for Review' : 'Complete Quest'}
      </Button>
    </div>
  )
}
