'use client'

import { ColorBadge } from '@/components/ui/ColorBadge'
import type { Trade } from '@/lib/types'
import type { ScoreColor } from '@/lib/types'

interface TradeWithScore extends Trade {
  scoreColor?: ScoreColor
  totalScore?: number
}

interface TradeListProps {
  trades: TradeWithScore[]
  checklists: Record<string, { emotional_state: string }>
}

export function TradeList({ trades, checklists }: TradeListProps) {
  if (trades.length === 0) {
    return (
      <div className="trade-empty">
        Aucun trade pour cette session
      </div>
    )
  }

  return (
    <div className="stack stack-sm">
      {trades.map((trade) => {
        const checklist = checklists[trade.trade_id]
        const pnl = trade.pnl
        const pnlClass = pnl === null ? '' : pnl >= 0 ? 'text-green' : 'text-red'

        return (
          <div key={trade.trade_id} className="trade-item">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono font-medium">{trade.symbol}</span>
                <ColorBadge color={trade.side === 'LONG' ? 'GREEN' : 'RED'}>
                  {trade.side}
                </ColorBadge>
                {trade.scoreColor && (
                  <ColorBadge color={trade.scoreColor}>
                    {trade.totalScore ?? '-'}
                  </ColorBadge>
                )}
              </div>
              <div className="text-xs subtitle">
                {trade.lot_size} lots · {new Date(trade.opened_at).toLocaleTimeString()}
                {checklist && ` · ${checklist.emotional_state}`}
              </div>
            </div>
            <div className={`font-mono font-bold text-sm ${pnlClass}`}>
              {pnl !== null ? (pnl >= 0 ? `+${pnl.toFixed(2)}` : pnl.toFixed(2)) : '—'}
            </div>
          </div>
        )
      })}
    </div>
  )
}
