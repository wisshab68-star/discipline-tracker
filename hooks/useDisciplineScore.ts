'use client'

import { useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { calculateDisciplineScore } from '@/lib/engine/disciplineScore'
import type { ChecklistData, TradeData, BaselineData } from '@/lib/engine/disciplineScore'
import type { Checklist, Trade } from '@/lib/types'
import { useSessionStore } from '@/store/sessionStore'

export function useDisciplineScore() {
  const supabase = createClient()
  const { trades } = useSessionStore()

  const getBaseline = useCallback(async (userId: string): Promise<BaselineData> => {
    const { data } = await supabase
      .from('baselines')
      .select('avg_lot_size')
      .eq('user_id', userId)
      .order('computed_at', { ascending: false })
      .limit(1)
      .single()

    return {
      return {
        avg_lot_size: (data?.avg_lot_size as number) ?? 0.01,
        avg_trades_day: (data?.avg_trades_day as number) ?? 5,
        avg_win_rate: (data?.avg_win_rate as number) ?? 0.5,
      }
    }
  }, [supabase])

  const toTradeData = useCallback((t: Trade): TradeData => ({
    lot_size: t.lot_size,
    stop_loss: t.stop_loss,
    pnl: t.pnl,
    opened_at: t.opened_at,
    status: t.status,
  }), [])

  const calculate = useCallback(
    async (
      checklist: ChecklistData | Checklist,
      trade: TradeData | Trade,
      userId: string
    ) => {
      const baseline = await getBaseline(userId)
      const recentTrades = trades.map(toTradeData)
      const tradeData: TradeData = 'lot_size' in trade ? toTradeData(trade as Trade) : trade as TradeData
      const checklistData: ChecklistData = {
        plan_respected: checklist.plan_respected,
        setup_identified: checklist.setup_identified,
        emotional_state: checklist.emotional_state,
        created_at: checklist.created_at,
      }

      return calculateDisciplineScore(checklistData, tradeData, recentTrades, baseline)
    },
    [trades, getBaseline, toTradeData]
  )

  const persistScore = useCallback(
    async (
      sessionId: string,
      tradeId: string | null,
      userId: string,
      score: ReturnType<typeof calculateDisciplineScore>
    ) => {
      await supabase.from('discipline_scores').insert({
        session_id: sessionId,
        trade_id: tradeId,
        user_id: userId,
        plan_score: score.plan_score,
        risk_score: score.risk_score,
        emotion_score: score.emotion_score,
        post_loss_score: score.post_loss_score,
        total_score: score.total_score,
        color: score.color,
      })
    },
    [supabase]
  )

  return { calculate, persistScore, getBaseline }
}
