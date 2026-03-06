export interface CoachMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface CoachConversation {
  id: string
  user_id: string
  title: string
  messages: CoachMessage[]
  context_sessions: number
  created_at: string
  updated_at: string
}

export interface CoachDailyUsage {
  id: string
  user_id: string
  date: string
  message_count: number
}

export interface SessionSummary {
  session_id: string
  started_at: string
  ended_at: string | null
  total_trades: number
  avg_score: number
  status: string
}

export interface CoachContext {
  sessions: SessionSummary[]
  patterns: string[]
  currentScore: number | null
  totalSessions: number
  streakDays: number
}

export type UserPlan = 'free' | 'pro' | 'team'
export const FREE_DAILY_LIMIT = 3
