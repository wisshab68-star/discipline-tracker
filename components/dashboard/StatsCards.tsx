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
      colorClass: 'text-green',
    },
    {
      title: 'Sessions totales',
      value: totalSessions,
      suffix: '',
      colorClass: '',
    },
    {
      title: 'Meilleur score',
      value: Math.round(bestScore),
      suffix: '/100',
      colorClass: 'text-green',
    },
    {
      title: 'Alertes évitées',
      value: alertsAvoided,
      suffix: '',
      colorClass: 'text-yellow',
    },
  ]

  return (
    <div className="grid-responsive">
      {cards.map((c) => (
        <Card key={c.title}>
          <CardHeader className="card-header-tight">
            <p className="text-xs subtitle">{c.title}</p>
          </CardHeader>
          <CardContent>
            <p className={`font-mono font-bold ${c.colorClass}`} style={{ fontSize: '1.5rem' }}>
              {c.value}
              {c.suffix}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
