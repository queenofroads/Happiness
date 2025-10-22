'use client'

import { Button } from '@/components/Button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function QuestForm() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      category: formData.get('category'),
      helpful_links: formData.get('helpful_links'),
      points_on_complete: parseInt(formData.get('points_on_complete') as string),
      proof_type: formData.get('proof_type'),
      active: formData.get('active') === 'on',
    }

    try {
      const res = await fetch('/api/admin/quests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        e.currentTarget.reset()
        router.refresh()
      }
    } catch (error) {
      console.error('Create quest error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            name="title"
            type="text"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <input
            name="category"
            type="text"
            placeholder="e.g., Legal, Health"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Points on Complete *
          </label>
          <input
            name="points_on_complete"
            type="number"
            min="0"
            defaultValue="50"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Helpful Links (comma-separated)
          </label>
          <textarea
            name="helpful_links"
            rows={2}
            placeholder="https://example.com, https://example2.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Proof Type *
          </label>
          <select
            name="proof_type"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="checkbox">Checkbox</option>
            <option value="url">URL</option>
            <option value="file">File</option>
            <option value="admin_verify">Admin Verify</option>
          </select>
        </div>

        <div>
          <label className="flex items-center pt-6">
            <input
              name="active"
              type="checkbox"
              defaultChecked
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">Active</span>
          </label>
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Quest'}
      </Button>
    </form>
  )
}
