'use client'

import { useEffect } from 'react'
import { cn } from '@/lib/utils'
import type { AlertResult } from '@/lib/engine/alertEngine'

interface AlertBannerProps {
  alert: AlertResult
  onDismiss?: () => void
  autoDismissSeconds?: number
}

const SEVERITY_STYLES = {
  CRITICAL: {
    className: 'bg-red-900 border-l-4 border-red-500 animate-pulse',
    icon: '⚠️',
  },
  WARNING: {
    className: 'bg-yellow-900 border-l-4 border-yellow-400',
    icon: '⚡',
  },
  INFO: {
    className: 'bg-blue-900 border-l-4 border-blue-400',
    icon: 'ℹ️',
  },
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
    <div
      className={cn(
        'rounded-r-lg px-4 py-3 text-sm text-white',
        config.className
      )}
    >
      <div className="flex items-center gap-2">
        <span>{config.icon}</span>
        <span>{alert.message}</span>
      </div>
    </div>
  )
}
