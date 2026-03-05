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
    <Card>
      <CardHeader>
        <h3 className="font-semibold">Dernières alertes</h3>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <p className="text-sm subtitle">Aucune alerte récente</p>
        ) : (
          <ul className="stack stack-sm">
            {alerts.slice(0, 10).map((a) => (
              <li key={a.alert_id} className="alert-item">
                <span>{SEVERITY_ICONS[a.severity] ?? '•'}</span>
                <div>
                  <p>{a.message}</p>
                  <p className="text-xs subtitle">
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
