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
    <div className="session-header">
      <div className="flex gap-6">
        <div>
          <span className="text-xs subtitle">Durée</span>
          <p className="font-mono font-semibold" style={{ fontSize: '1.125rem' }}>{duration}</p>
        </div>
        <div>
          <span className="text-xs subtitle">Trades</span>
          <p className="font-mono font-semibold" style={{ fontSize: '1.125rem' }}>{totalTrades}</p>
        </div>
        <div>
          <span className="text-xs subtitle">Score moyen</span>
          <p className="font-mono font-semibold" style={{ fontSize: '1.125rem' }}>{Math.round(avgScore)}</p>
        </div>
      </div>
    </div>
  )
}
