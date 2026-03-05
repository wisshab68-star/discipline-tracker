'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ColorBadge } from '@/components/ui/ColorBadge'
import type { Session } from '@/lib/types'
import type { ScoreColor } from '@/lib/types'

interface SessionWithLink extends Session {
  scoreColor?: ScoreColor
}

interface SessionListProps {
  sessions: SessionWithLink[]
}

export function SessionList({ sessions }: SessionListProps) {
  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold">Dernières sessions</h3>
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <p className="text-sm subtitle">Aucune session</p>
        ) : (
          <ul className="stack stack-sm">
            {sessions.map((s) => {
              const color: ScoreColor =
                s.avg_score >= 75 ? 'GREEN' : s.avg_score >= 50 ? 'YELLOW' : 'RED'
              return (
                <li key={s.session_id}>
                  <Link
                    href={`/session/${s.session_id}`}
                    className="trade-item"
                    style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                  >
                    <div>
                      <p className="font-medium">
                        {new Date(s.started_at).toLocaleDateString()} —{' '}
                        {s.total_trades} trades
                      </p>
                      <p className="text-xs subtitle">
                        {new Date(s.started_at).toLocaleTimeString()}
                      </p>
                    </div>
                    <ColorBadge color={color}>
                      {Math.round(s.avg_score)}
                    </ColorBadge>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
