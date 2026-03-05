'use client'

import { useEffect } from 'react'
import type { AlertResult } from '@/lib/engine/alertEngine'

interface AlertBannerProps {
  alert: AlertResult
  onDismiss?: () => void
  autoDismissSeconds?: number
}

const SEVERITY_STYLES = {
  CRITICAL: { className: 'alert alert-critical', icon: '⚠️' },
  WARNING: { className: 'alert alert-warning', icon: '⚡' },
  INFO: { className: 'alert alert-info', icon: 'ℹ️' },
}

export function AlertBanner({
  alert,
  onDismiss,
  autoDismissSeconds = 10,
}: AlertBannerProps) {
  const config = SEVERITY_STYLES[alert.severity]
  const isInfo = alert.severity === 'INFO'

  useEffect(() => {
    if (isInfo && onDismiss && autoDismissSeconds > 0) {
      const t = setTimeout(onDismiss, autoDismissSeconds * 1000)
      return () => clearTimeout(t)
    }
  }, [isInfo, onDismiss, autoDismissSeconds])

  return (
    <div className={config.className}>
      <div className="flex items-center gap-2">
        <span>{config.icon}</span>
        <span>{alert.message}</span>
      </div>
    </div>
  )
}
