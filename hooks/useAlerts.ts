'use client'

import { useCallback, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { detectAlerts } from '@/lib/engine/alertEngine'
import type { TradeData, BaselineData } from '@/lib/engine/disciplineScore'
import { useSessionStore } from '@/store/sessionStore'
export function useAlerts() {
  const supabase = createClient()
  const {
    trades,
    currentSession,
    currentScore,
    setAlerts,
    checklists,
  } = useSessionStore()

  const runAlerts = useCallback(async () => {
    if (!currentSession) return

    const { data: userData } = await supabase.auth.getUser()
    const userId = userData.user?.id
    if (!userId) return

    const { data: baselineRow } = await supabase
      .from('baselines')
      .select('avg_lot_size')
      .eq('user_id', userId)
      .order('computed_at', { ascending: false })
      .limit(1)
      .single()

    const baseline: BaselineData = {
      avg_lot_size: (baselineRow?.avg_lot_size as number) ?? 0.01,
      avg_win_rate: 0.5,
    }

    const recentTrades: TradeData[] = trades.map((t) => ({
      lot_size: t.lot_size,
      stop_loss: t.stop_loss,
      pnl: t.pnl,
      opened_at: t.opened_at,
      status: t.status,
    }))

    const lastTrade = trades[trades.length - 1]
    const lastChecklist = lastTrade ? checklists[lastTrade.trade_id] : null

    const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000)
    const tradesLast30min = trades.filter(
      (t) => new Date(t.opened_at) >= thirtyMinAgo
    ).length

    const alerts = detectAlerts({
      recentTrades,
      currentLotSize: lastTrade?.lot_size ?? 0.01,
      baseline,
      currentScore: currentScore?.total_score ?? 100,
      sessionStartedAt: currentSession.started_at,
      emotionalState: lastChecklist?.emotional_state ?? 'CALM',
      tradesLast30min,
    })

    setAlerts(alerts)

    for (const alert of alerts) {
      if (alert.severity !== 'INFO') {
        await supabase.from('alerts').insert({
          session_id: currentSession.session_id,
          user_id: userId,
          alert_type: alert.type,
          severity: alert.severity,
          message: alert.message,
        })
      }
    }
  }, [
    currentSession,
    trades,
    currentScore,
    checklists,
    supabase,
    setAlerts,
  ])

  useEffect(() => {
    const interval = setInterval(runAlerts, 60000)
    runAlerts()
    return () => clearInterval(interval)
  }, [runAlerts])

  return { runAlerts }
}
