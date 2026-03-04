import type { EmotionalState, ScoreColor } from '@/lib/types'

export interface ChecklistData {
  plan_respected: boolean
  setup_identified: boolean
  emotional_state: EmotionalState
  created_at: string
}

export interface TradeData {
  lot_size: number
  stop_loss: number | null
  pnl: number | null
  opened_at: string
  status: 'open' | 'closed'
}

export interface BaselineData {
  avg_lot_size: number
  avg_win_rate: number
}

export interface ScoreComponents {
  plan_score: number       // 0-40
  risk_score: number       // 0-20
  emotion_score: number    // 0-20
  post_loss_score: number  // 0-20
  total_score: number      // 0-100
  color: ScoreColor
}

export function calculateDisciplineScore(
  checklist: ChecklistData,
  trade: TradeData,
  recentTrades: TradeData[],
  baseline: BaselineData
): ScoreComponents {
  // COMPOSANT 1 — Respect du plan (40 pts max)
  let planRaw = 0
  if (checklist.plan_respected)   planRaw += 24
  if (checklist.setup_identified) planRaw += 16
  const plan_score = planRaw

  // COMPOSANT 2 — Gestion du risque (20 pts max)
  let riskRaw = 100
  const baselineLot = baseline.avg_lot_size || 0.01
  const lotDeviation = Math.abs(trade.lot_size - baselineLot) / baselineLot
  if (lotDeviation > 0.30) riskRaw -= 40
  if (lotDeviation > 0.60) riskRaw -= 30
  if (!trade.stop_loss || trade.stop_loss === 0) riskRaw -= 30
  const risk_score = Math.max(0, Math.min(100, riskRaw)) * 0.20

  // COMPOSANT 3 — Stabilité émotionnelle (20 pts max)
  const emotionMap: Record<EmotionalState, number> = {
    CALM: 100, STRESSED: 60, FRUSTRATED: 30, FOMO: 10
  }
  let emotionRaw = emotionMap[checklist.emotional_state]
  if (checklist.emotional_state === 'FOMO') {
    const delta = (new Date(trade.opened_at).getTime() - new Date(checklist.created_at).getTime()) / 1000
    if (delta < 60) emotionRaw = Math.max(0, emotionRaw - 20)
  }
  const emotion_score = emotionRaw * 0.20

  // COMPOSANT 4 — Comportement post-perte (20 pts max)
  let postLossRaw = 100
  const closedTrades = recentTrades.filter(t => t.status === 'closed' && t.pnl !== null)
  let consecutiveLosses = 0
  for (let i = closedTrades.length - 1; i >= 0; i--) {
    if ((closedTrades[i].pnl ?? 0) < 0) consecutiveLosses++
    else break
  }
  if (consecutiveLosses === 1) postLossRaw -= 10
  if (consecutiveLosses === 2) postLossRaw -= 30
  if (consecutiveLosses >= 3)  postLossRaw -= 60

  // Détection escalade lot size après perte
  if (closedTrades.length >= 2) {
    const lastLossIndex = [...closedTrades].reverse().findIndex(t => (t.pnl ?? 0) < 0)
    const lastLoss = lastLossIndex >= 0 ? closedTrades[closedTrades.length - 1 - lastLossIndex] : null
    if (lastLoss && trade.lot_size > lastLoss.lot_size * 1.15) postLossRaw -= 20
  }
  const post_loss_score = Math.max(0, Math.min(100, postLossRaw)) * 0.20

  const total_score = Math.round(plan_score + risk_score + emotion_score + post_loss_score)
  const color: ScoreColor = total_score >= 75 ? 'GREEN' : total_score >= 50 ? 'YELLOW' : 'RED'

  return {
    plan_score,
    risk_score,
    emotion_score,
    post_loss_score,
    total_score: Math.min(100, total_score),
    color
  }
}
