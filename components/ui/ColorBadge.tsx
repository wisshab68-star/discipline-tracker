'use client'

import { cn } from '@/lib/utils'
import type { ScoreColor } from '@/lib/types'

interface ColorBadgeProps {
  color: ScoreColor
  children: React.ReactNode
  className?: string
}

const COLOR_STYLES: Record<ScoreColor, string> = {
  GREEN: 'bg-green/20 text-green border-green/40',
  YELLOW: 'bg-yellow/20 text-yellow border-yellow/40',
  RED: 'bg-red/20 text-red border-red/40',
}

export function ColorBadge({ color, children, className }: ColorBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium',
        COLOR_STYLES[color],
        className
      )}
    >
      {children}
    </span>
  )
}
