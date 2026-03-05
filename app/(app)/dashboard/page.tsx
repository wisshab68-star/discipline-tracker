'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { StatsCards } from '@/components/dashboard/StatsCards'
import { ScoreChart } from '@/components/dashboard/ScoreChart'
import { SessionList } from '@/components/dashboard/SessionList'
import { AlertHistory } from '@/components/dashboard/AlertHistory'
import type { Session, Alert } from '@/lib/types'

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [userId, setUserId] = useState<string | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.replace('/login')
      else setUserId(data.user.id)
    })
  }, [supabase, router])

  useEffect(() => {
    if (!userId) return

    const load = async () => {
      const { data: sess } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', userId)
        .order('started_at', { ascending: false })
        .limit(30)

      const { data: al } = await supabase
        .from('alerts')
        .select('*')
        .eq('user_id', userId)
        .order('triggered_at', { ascending: false })
        .limit(20)

      if (sess) setSessions(sess as Session[])
      if (al) setAlerts(al as Alert[])

      setLoading(false)
    }

    load()
  }, [userId, supabase])

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const sessions30d = sessions.filter((s) => new Date(s.started_at) >= thirtyDaysAgo)
  const avgScore30d =
    sessions30d.length > 0
      ? sessions30d.reduce((a, s) => a + s.avg_score, 0) / sessions30d.length
      : 0
  const bestScore =
    sessions.length > 0 ? Math.max(...sessions.map((s) => s.avg_score)) : 0

  const chartData = sessions
    .slice(0, 30)
    .reverse()
    .map((s, i) => ({
      session: `S${i + 1}`,
      score: Math.round(s.avg_score),
      date: s.started_at,
    }))

  if (!userId || loading) {
    return (
      <div className="page-center">
        <p className="subtitle">Chargement...</p>
      </div>
    )
  }

  return (
    <div className="page-full">
      <div className="container stack stack-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="title">Dashboard</h1>
          <div className="flex gap-2">
            <Link href="/session">
              <Button>Nouvelle session</Button>
            </Link>
            <Link href="/history">
              <Button variant="outline">Historique</Button>
            </Link>
          </div>
        </div>

        <StatsCards
          avgScore30d={avgScore30d}
          totalSessions={sessions.length}
          bestScore={bestScore}
          alertsAvoided={0}
        />

        <ScoreChart data={chartData} />

        <div className="grid-chart">
          <SessionList sessions={sessions.slice(0, 10)} />
          <AlertHistory alerts={alerts} />
        </div>
      </div>
    </div>
  )
}
