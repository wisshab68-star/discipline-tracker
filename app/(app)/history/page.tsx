'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { SessionList } from '@/components/dashboard/SessionList'
import type { Session } from '@/lib/types'

export default function HistoryPage() {
  const router = useRouter()
  const supabase = createClient()
  const [userId, setUserId] = useState<string | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.replace('/login')
      else setUserId(data.user.id)
    })
  }, [supabase, router])

  useEffect(() => {
    if (!userId) return

    supabase
      .from('sessions')
      .select('*')
      .eq('user_id', userId)
      .order('started_at', { ascending: false })
      .then(({ data }) => {
        if (data) setSessions(data as Session[])
        setLoading(false)
      })
  }, [userId, supabase])

  if (!userId || loading) {
    return (
      <div className="page-center">
        <p className="subtitle">Chargement...</p>
      </div>
    )
  }

  return (
    <div className="page-full">
      <div className="container-sm stack stack-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="title">Historique des sessions</h1>
          <Link href="/dashboard">
            <Button variant="outline">Dashboard</Button>
          </Link>
        </div>

        <SessionList sessions={sessions} />
      </div>
    </div>
  )
}
