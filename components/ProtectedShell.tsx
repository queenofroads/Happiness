import React from 'react'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

interface ProtectedShellProps {
  children: React.ReactNode
}

export async function ProtectedShell({ children }: ProtectedShellProps) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login')
  }

  const isAdmin = session.user.isAdmin

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <Link href="/dashboard" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-transparent hover:border-gray-300">
                Dashboard
              </Link>
              <Link href="/events" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-transparent hover:border-gray-300">
                Events
              </Link>
              <Link href="/quests" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-transparent hover:border-gray-300">
                Quests
              </Link>
              <Link href="/leaderboard" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-transparent hover:border-gray-300">
                Leaderboard
              </Link>
              <Link href="/learning" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-transparent hover:border-gray-300">
                Learning
              </Link>
              {isAdmin && (
                <>
                  <Link href="/admin/events" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-blue-600 border-b-2 border-transparent hover:border-blue-300">
                    Admin Events
                  </Link>
                  <Link href="/admin/quests" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-blue-600 border-b-2 border-transparent hover:border-blue-300">
                    Admin Quests
                  </Link>
                  <Link href="/admin/attendance" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-blue-600 border-b-2 border-transparent hover:border-blue-300">
                    Attendance
                  </Link>
                </>
              )}
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-700">{session.user.email}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          Prototype for demonstration. All trademarks belong to their owners.
        </div>
      </footer>
    </div>
  )
}
