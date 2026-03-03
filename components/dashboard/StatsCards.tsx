'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface StatsCardsProps {
  avgScore30d: number
  totalSessions: number
  bestScore: number
  alertsAvoided?: number
}

export function StatsCards({
  avgScore30d,
  totalSessions,
  bestScore,
  alertsAvoided = 0,
}: StatsCardsProps) {
  const cards = [
    {
      title: 'Score moyen 30j',
      value: Math.round(avgScore30d),
      suffix: '/100',
      color: 'text-green',
    },
    {
      title: 'Sessions totales',
      value: totalSessions,
      suffix: '',
      color: 'text-[var(--text)]',
    },
    {
      title: 'Meilleur score',
      value: Math.round(bestScore),
      suffix: '/100',
      color: 'text-green',
    },
    {
      title: 'Alertes évitées',
      value: alertsAvoided,
      suffix: '',
      color: 'text-yellow',
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <Card key={c.title} className="border-border bg-[#1E1E2E]">
          <CardHeader className="pb-2">
            <p className="text-xs text-muted-foreground">{c.title}</p>
          </CardHeader>
          <CardContent>
            <p className={`font-mono text-2xl font-bold ${c.color}`}>
              {c.value}
              {c.suffix}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
