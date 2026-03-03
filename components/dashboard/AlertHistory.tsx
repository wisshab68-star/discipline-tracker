'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import type { Alert } from '@/lib/types'

interface AlertHistoryProps {
  alerts: Alert[]
}

const SEVERITY_ICONS: Record<string, string> = {
  CRITICAL: '⚠️',
  WARNING: '⚡',
  INFO: 'ℹ️',
}

export function AlertHistory({ alerts }: AlertHistoryProps) {
  return (
    <Card className="border-border bg-[#1E1E2E]">
      <CardHeader>
        <h3 className="font-sans font-semibold">Dernières alertes</h3>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune alerte récente</p>
        ) : (
          <ul className="space-y-2">
            {alerts.slice(0, 10).map((a) => (
              <li
                key={a.alert_id}
                className="flex items-start gap-2 rounded-lg border border-border bg-[#16213E] px-3 py-2 text-sm"
              >
                <span>{SEVERITY_ICONS[a.severity] ?? '•'}</span>
                <div>
                  <p>{a.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(a.triggered_at).toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
