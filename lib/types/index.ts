// Types partagés Discipline Tracker

export type EmotionalState = 'CALM' | 'STRESSED' | 'FRUSTRATED' | 'FOMO'

export type ScoreColor = 'GREEN' | 'YELLOW' | 'RED'

export type TradeSide = 'LONG' | 'SHORT'

export type TradeStatus = 'open' | 'closed'

export type SessionStatus = 'active' | 'ended'

export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO'

export type AlertType =
  | 'REVENGE_TRADING'
  | 'OVERSIZING'
  | 'OVERTRADING'
  | 'LOW_SCORE'
  | 'FOMO_DETECTED'
  | 'LONG_SESSION'

export interface Session {
  session_id: string
  user_id: string
  started_at: string
  ended_at: string | null
  broker: string | null
  status: SessionStatus
  total_trades: number
  avg_score: number
}

export interface Trade {
  trade_id: string
  session_id: string
  user_id: string
  symbol: string
  side: TradeSide
  lot_size: number
  open_price: number
  close_price: number | null
  stop_loss: number | null
  take_profit: number | null
  pnl: number | null
  status: TradeStatus
  opened_at: string
  closed_at: string | null
}

export interface Checklist {
  checklist_id: string
  trade_id: string
  user_id: string
  plan_respected: boolean
  setup_identified: boolean
  emotional_state: EmotionalState
  created_at: string
}

export interface DisciplineScore {
  score_id: string
  session_id: string
  trade_id: string | null
  user_id: string
  plan_score: number
  risk_score: number
  emotion_score: number
  post_loss_score: number
  total_score: number
  color: ScoreColor
  computed_at: string
}

export interface Alert {
  alert_id: string
  session_id: string
  user_id: string
  alert_type: AlertType
  severity: AlertSeverity
  message: string
  acknowledged: boolean
  triggered_at: string
}

export interface Baseline {
  baseline_id: string
  user_id: string
  avg_lot_size: number
  avg_trades_day: number
  avg_win_rate: number
  sessions_count: number
  computed_at: string
}
