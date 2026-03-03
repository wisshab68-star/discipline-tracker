import type { EmotionalState } from '@/lib/types'
import type { TradeData, BaselineData } from './disciplineScore'

export type AlertType =
  | 'REVENGE_TRADING'
  | 'OVERSIZING'
  | 'OVERTRADING'
  | 'LOW_SCORE'
  | 'FOMO_DETECTED'
  | 'LONG_SESSION'

export interface AlertResult {
  type: AlertType
  severity: 'CRITICAL' | 'WARNING' | 'INFO'
  message: string
}

export function detectAlerts(params: {
  recentTrades: TradeData[]
  currentLotSize: number
  baseline: BaselineData
  currentScore: number
  sessionStartedAt: string
  emotionalState: EmotionalState
  tradesLast30min: number
}): AlertResult[] {
  const alerts: AlertResult[] = []

  // 1. Revenge Trading — 3 pertes consécutives
  const losses = countConsecutiveLosses(params.recentTrades)
  if (losses >= 3) alerts.push({
    type: 'REVENGE_TRADING',
    severity: 'CRITICAL',
    message: `⚠️ ${losses} pertes consécutives détectées. Risque élevé de revenge trading. Pause recommandée.`
  })

  // 2. Oversizing — lot +30% vs baseline
  const avgLot = params.baseline.avg_lot_size || 0.01
  const lotRatio = params.currentLotSize / avgLot
  if (lotRatio > 1.30) alerts.push({
    type: 'OVERSIZING',
    severity: 'WARNING',
    message: `Taille de position ${Math.round((lotRatio - 1) * 100)}% au-dessus de votre moyenne. Revenez à votre sizing habituel.`
  })

  // 3. Overtrading — +5 trades en 30 minutes
  if (params.tradesLast30min >= 5) alerts.push({
    type: 'OVERTRADING',
    severity: 'WARNING',
    message: `${params.tradesLast30min} trades en 30 minutes. Ralentissez.`
  })

  // 4. Score faible
  if (params.currentScore < 50) alerts.push({
    type: 'LOW_SCORE',
    severity: 'INFO',
    message: `Score discipline : ${params.currentScore}/100. Une pause vous aiderait à vous recentrer.`
  })

  // 5. Session longue — +4h
  const sessionHours = (Date.now() - new Date(params.sessionStartedAt).getTime()) / 3600000
  if (sessionHours > 4) alerts.push({
    type: 'LONG_SESSION',
    severity: 'INFO',
    message: `${Math.round(sessionHours)}h de session. La fatigue cognitive augmente les erreurs.`
  })

  // 6. FOMO détecté
  if (params.emotionalState === 'FOMO') alerts.push({
    type: 'FOMO_DETECTED',
    severity: 'WARNING',
    message: '⚠️ État FOMO détecté. Attendez 5 minutes avant de prendre un nouveau trade.'
  })

  return alerts
}

function countConsecutiveLosses(trades: TradeData[]): number {
  let count = 0
  for (let i = trades.length - 1; i >= 0; i--) {
    if (trades[i].status === 'closed' && (trades[i].pnl ?? 0) < 0) count++
    else break
  }
  return count
}
