import { create } from 'zustand'
import type { Session, Trade, Checklist, DisciplineScore } from '@/lib/types'
import type { ScoreComponents } from '@/lib/engine/disciplineScore'
import type { AlertResult } from '@/lib/engine/alertEngine'

interface SessionState {
  currentSession: Session | null
  setCurrentSession: (session: Session | null) => void

  trades: Trade[]
  addTrade: (trade: Trade) => void
  updateTrade: (tradeId: string, updates: Partial<Trade>) => void
  setTrades: (trades: Trade[]) => void
  clearTrades: () => void

  checklists: Record<string, Checklist>
  setChecklist: (tradeId: string, checklist: Checklist) => void

  currentScore: ScoreComponents | null
  setCurrentScore: (score: ScoreComponents | null) => void

  scores: DisciplineScore[]
  addScore: (score: DisciplineScore) => void
  setScores: (scores: DisciplineScore[]) => void

  alerts: AlertResult[]
  setAlerts: (alerts: AlertResult[]) => void
  addAlert: (alert: AlertResult) => void
  clearAlerts: () => void

  preTradeModalOpen: boolean
  setPreTradeModalOpen: (open: boolean) => void

  fomoCountdownActive: boolean
  setFomoCountdownActive: (active: boolean) => void

  reset: () => void
}

const initialState = {
  currentSession: null,
  trades: [],
  checklists: {},
  currentScore: null,
  scores: [],
  alerts: [],
  preTradeModalOpen: false,
  fomoCountdownActive: false,
}

export const useSessionStore = create<SessionState>((set) => ({
  ...initialState,

  setCurrentSession: (session) => set({ currentSession: session }),

  addTrade: (trade) =>
    set((s) => ({ trades: [...s.trades, trade] })),
  updateTrade: (tradeId, updates) =>
    set((s) => ({
      trades: s.trades.map((t) =>
        t.trade_id === tradeId ? { ...t, ...updates } : t
      ),
    })),
  setTrades: (trades) => set({ trades }),
  clearTrades: () => set({ trades: [] }),

  setChecklist: (tradeId, checklist) =>
    set((s) => ({
      checklists: { ...s.checklists, [tradeId]: checklist },
    })),

  setCurrentScore: (score) => set({ currentScore: score }),
  addScore: (score) =>
    set((s) => ({ scores: [...s.scores, score] })),
  setScores: (scores) => set({ scores }),

  setAlerts: (alerts) => set({ alerts }),
  addAlert: (alert) =>
    set((s) => ({
      alerts: [...s.alerts.filter((a) => a.type !== alert.type), alert],
    })),
  clearAlerts: () => set({ alerts: [] }),

  setPreTradeModalOpen: (open) => set({ preTradeModalOpen: open }),
  setFomoCountdownActive: (active) => set({ fomoCountdownActive: active }),

  reset: () => set(initialState),
}))
