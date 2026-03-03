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
    <Card className="border-border bg-[#1E1E2E]">
      <CardHeader>
        <h3 className="font-sans font-semibold">Dernières sessions</h3>
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune session</p>
        ) : (
          <ul className="space-y-2">
            {sessions.map((s) => {
              const color: ScoreColor =
                s.avg_score >= 75 ? 'GREEN' : s.avg_score >= 50 ? 'YELLOW' : 'RED'
              return (
                <li key={s.session_id}>
                  <Link
                    href={`/session/${s.session_id}`}
                    className="flex items-center justify-between rounded-lg border border-border bg-[#16213E] px-4 py-3 transition-colors hover:bg-[#1E1E2E]"
                  >
                    <div>
                      <p className="font-medium">
                        {new Date(s.started_at).toLocaleDateString()} —{' '}
                        {s.total_trades} trades
                      </p>
                      <p className="text-xs text-muted-foreground">
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
