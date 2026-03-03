'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { ScoreDisplay } from '@/components/session/ScoreDisplay'
import { PreTradeModal } from '@/components/session/PreTradeModal'
import { TradeForm } from '@/components/session/TradeForm'
import { TradeList } from '@/components/session/TradeList'
import { SessionHeader } from '@/components/session/SessionHeader'
import { AlertBanner } from '@/components/session/AlertBanner'
import { useSession } from '@/hooks/useSession'
import { useDisciplineScore } from '@/hooks/useDisciplineScore'
import { useAlerts } from '@/hooks/useAlerts'
import { useSessionStore } from '@/store/sessionStore'
import type { TradeSide } from '@/lib/types'

export default function SessionPage() {
  const router = useRouter()
  const supabase = createClient()
  const [userId, setUserId] = useState<string | undefined>()
  const [showTradeForm, setShowTradeForm] = useState(false)

  const {
    currentSession,
    trades,
    startSession,
  } = useSession(userId)

  const { calculate, persistScore } = useDisciplineScore()
  useAlerts()

  const {
    currentScore,
    setCurrentScore,
    addTrade,
    addScore,
    setChecklist,
    setPreTradeModalOpen,
    preTradeModalOpen,
    alerts,
    checklists,
    scores,
    setCurrentSession,
  } = useSessionStore()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.replace('/login')
      else setUserId(data.user.id)
    })
  }, [supabase, router])

  useEffect(() => {
    if (userId && !currentSession) {
      startSession().catch(() => {})
    }
  }, [userId, currentSession, startSession])

  const handlePreTradeComplete = async (checklistData: {
    plan_respected: boolean
    setup_identified: boolean
    emotional_state: 'CALM' | 'STRESSED' | 'FRUSTRATED' | 'FOMO'
  }) => {
    setPreTradeModalOpen(false)
    setShowTradeForm(true)

    sessionStorage.setItem('pending_checklist', JSON.stringify({
      ...checklistData,
      created_at: new Date().toISOString(),
    }))
  }

  const handleTradeSubmit = async (tradeData: {
    symbol: string
    side: TradeSide
    lot_size: number
    open_price: number
    stop_loss: number | null
    take_profit: number | null
  }) => {
    if (!userId || !currentSession) return

    const { data: trade, error } = await supabase
      .from('trades')
      .insert({
        session_id: currentSession.session_id,
        user_id: userId,
        symbol: tradeData.symbol,
        side: tradeData.side,
        lot_size: tradeData.lot_size,
        open_price: tradeData.open_price,
        stop_loss: tradeData.stop_loss,
        take_profit: tradeData.take_profit,
        status: 'open',
      })
      .select()
      .single()

    if (error) return

    addTrade(trade)

    const pendingChecklist = sessionStorage.getItem('pending_checklist')
    const checklistData = pendingChecklist
      ? JSON.parse(pendingChecklist)
      : {
          plan_respected: true,
          setup_identified: true,
          emotional_state: 'CALM' as const,
          created_at: new Date().toISOString(),
        }
    sessionStorage.removeItem('pending_checklist')

    const { data: checklist } = await supabase
      .from('checklists')
      .insert({
        trade_id: trade.trade_id,
        user_id: userId,
        plan_respected: checklistData.plan_respected,
        setup_identified: checklistData.setup_identified,
        emotional_state: checklistData.emotional_state,
      })
      .select()
      .single()

    if (checklist) setChecklist(trade.trade_id, checklist)

    const score = await calculate(checklistData, trade, userId)
    setCurrentScore(score)
    await persistScore(currentSession.session_id, trade.trade_id, userId, score)
    addScore({
      score_id: '',
      session_id: currentSession.session_id,
      trade_id: trade.trade_id,
      user_id: userId,
      plan_score: score.plan_score,
      risk_score: score.risk_score,
      emotion_score: score.emotion_score,
      post_loss_score: score.post_loss_score,
      total_score: score.total_score,
      color: score.color,
      computed_at: new Date().toISOString(),
    })

    await supabase
      .from('sessions')
      .update({
        total_trades: trades.length + 1,
        avg_score: ((currentSession.avg_score * trades.length) + score.total_score) / (trades.length + 1),
      })
      .eq('session_id', currentSession.session_id)

    setCurrentSession({
      ...currentSession,
      total_trades: trades.length + 1,
      avg_score: ((currentSession.avg_score * trades.length) + score.total_score) / (trades.length + 1),
    })

    setShowTradeForm(false)
  }

  const scoresByTrade: Record<string, { color: 'GREEN' | 'YELLOW' | 'RED'; total_score: number }> = {}
  for (const s of scores) {
    if (s.trade_id) scoresByTrade[s.trade_id] = { color: s.color, total_score: s.total_score }
  }

  const tradesWithScores = trades.map((t) => {
    const sc = scoresByTrade[t.trade_id]
    return {
      ...t,
      scoreColor: sc?.color ?? currentScore?.color,
      totalScore: sc?.total_score ?? currentScore?.total_score,
    }
  })

  if (!userId) return null

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="mx-auto max-w-6xl">
        <SessionHeader
          startedAt={currentSession?.started_at ?? new Date().toISOString()}
          totalTrades={currentSession?.total_trades ?? 0}
          avgScore={currentSession?.avg_score ?? 100}
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_3fr]">
          <div className="space-y-4">
            <ScoreDisplay
              score={currentScore?.total_score ?? 100}
              color={currentScore?.color ?? 'GREEN'}
              planScore={currentScore?.plan_score}
              riskScore={currentScore?.risk_score}
              emotionScore={currentScore?.emotion_score}
              postLossScore={currentScore?.post_loss_score}
            />

            {alerts.length > 0 && (
              <div className="space-y-2">
                {alerts.map((a, i) => (
                  <AlertBanner key={i} alert={a} />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            {showTradeForm ? (
              <div className="rounded-xl border border-border bg-[#1E1E2E] p-6">
                <h3 className="mb-4 font-sans font-semibold">Nouveau trade</h3>
                <TradeForm
                  onSubmit={handleTradeSubmit}
                  onCancel={() => setShowTradeForm(false)}
                />
              </div>
            ) : (
              <Button
                size="lg"
                className="w-full py-6 text-lg"
                onClick={() => setPreTradeModalOpen(true)}
              >
                📋 Nouveau Trade
              </Button>
            )}

            <TradeList trades={tradesWithScores} checklists={checklists} />
          </div>
        </div>
      </div>

      <PreTradeModal
        open={preTradeModalOpen}
        onClose={() => setPreTradeModalOpen(false)}
        onComplete={handlePreTradeComplete}
      />
    </div>
  )
}
