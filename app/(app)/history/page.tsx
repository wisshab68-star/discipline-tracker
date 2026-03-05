'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { SessionList } from '@/components/dashboard/SessionList'
import type { Session } from '@/lib/types'

export default function HistoryPage() {
  const supabase = createClient()
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const { data } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('started_at', { ascending: false })

      if (data) setSessions(data as Session[])
      setLoading(false)
    }

    load()
  }, [supabase])

  if (loading) {
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
