'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardHeader } from '@/components/ui/card'
import { TradeList } from '@/components/session/TradeList'
import { ColorBadge } from '@/components/ui/ColorBadge'
import type { Session, Trade, DisciplineScore } from '@/lib/types'

export default function SessionDetailPage() {
  const router = useRouter()
  const params = useParams()
  const sessionId = params.id as string
  const supabase = createClient()
  const [userId, setUserId] = useState<string | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [trades, setTrades] = useState<Trade[]>([])
  const [scores, setScores] = useState<Record<string, DisciplineScore>>({})
  const [checklists, setChecklists] = useState<Record<string, { emotional_state: string }>>({})
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
        .eq('session_id', sessionId)
        .single()

      const { data: t } = await supabase
        .from('trades')
        .select('*')
        .eq('session_id', sessionId)
        .order('opened_at', { ascending: true })

      const { data: sc } = await supabase
        .from('discipline_scores')
        .select('*')
        .eq('session_id', sessionId)

      const { data: ch } = await supabase
        .from('checklists')
        .select('trade_id, emotional_state')
        .in('trade_id', (t ?? []).map((x) => x.trade_id))

      if (sess) setSession(sess as Session)
      if (t) setTrades(t as Trade[])
      if (sc) {
        const byTrade: Record<string, DisciplineScore> = {}
        for (const s of sc as DisciplineScore[]) {
          if (s.trade_id) byTrade[s.trade_id] = s
        }
        setScores(byTrade)
      }
      if (ch) {
        const byTrade: Record<string, { emotional_state: string }> = {}
        for (const c of ch as { trade_id: string; emotional_state: string }[]) {
          byTrade[c.trade_id] = { emotional_state: c.emotional_state }
        }
        setChecklists(byTrade)
      }
      setLoading(false)
    }

    load()
  }, [userId, sessionId, supabase])

  const tradesWithScores = trades.map((t) => ({
    ...t,
    scoreColor: scores[t.trade_id]?.color,
    totalScore: scores[t.trade_id]?.total_score,
  }))

  if (!userId || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Session introuvable</p>
        <Link href="/history">
          <Button>Retour historique</Button>
        </Link>
      </div>
    )
  }

  const color =
    session.avg_score >= 75 ? 'GREEN' : session.avg_score >= 50 ? 'YELLOW' : 'RED'

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/history">
            <Button variant="outline">← Retour</Button>
          </Link>
        </div>

        <Card className="border-border bg-[#1E1E2E]">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="font-sans text-2xl font-bold">
                  Session du {new Date(session.started_at).toLocaleDateString()}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {new Date(session.started_at).toLocaleTimeString()} —{' '}
                  {session.total_trades} trades
                </p>
              </div>
              <ColorBadge color={color}>
                Score moyen : {Math.round(session.avg_score)}
              </ColorBadge>
            </div>
          </CardHeader>
        </Card>

        <TradeList trades={tradesWithScores} checklists={checklists} />
      </div>
    </div>
  )
}
