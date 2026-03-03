'use client'

import { useEffect, useState } from 'react'

interface SessionHeaderProps {
  startedAt: string
  totalTrades: number
  avgScore: number
}

function formatDuration(start: Date): string {
  const now = new Date()
  const diff = Math.floor((now.getTime() - start.getTime()) / 1000)
  const h = Math.floor(diff / 3600)
  const m = Math.floor((diff % 3600) / 60)
  const s = diff % 60
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

export function SessionHeader({
  startedAt,
  totalTrades,
  avgScore,
}: SessionHeaderProps) {
  const [duration, setDuration] = useState('0s')

  useEffect(() => {
    const start = new Date(startedAt)
    const update = () => setDuration(formatDuration(start))
    update()
    const t = setInterval(update, 1000)
    return () => clearInterval(t)
  }, [startedAt])

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-[#1E1E2E] px-4 py-3">
      <div className="flex items-center gap-6">
        <div>
          <span className="text-xs text-muted-foreground">Durée</span>
          <p className="font-mono text-lg font-semibold">{duration}</p>
        </div>
        <div>
          <span className="text-xs text-muted-foreground">Trades</span>
          <p className="font-mono text-lg font-semibold">{totalTrades}</p>
        </div>
        <div>
          <span className="text-xs text-muted-foreground">Score moyen</span>
          <p className="font-mono text-lg font-semibold">{Math.round(avgScore)}</p>
        </div>
      </div>
    </div>
  )
}
