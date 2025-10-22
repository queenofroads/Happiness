'use client'

import { Button } from '@/components/Button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ApproveQuestButtonProps {
  userQuestId: string
  userId: string
  questId: string
}

export function ApproveQuestButton({ userQuestId, userId, questId }: ApproveQuestButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleApprove = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/approve-quest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userQuestId, userId, questId }),
      })

      if (res.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error('Approve quest error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleApprove}
      disabled={loading}
      className="text-xs px-2 py-1"
    >
      {loading ? 'Approving...' : 'Approve'}
    </Button>
  )
}
