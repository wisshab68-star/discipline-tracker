'use client'

import type { ScoreColor } from '@/lib/types'

interface ColorBadgeProps {
  color: ScoreColor
  children: React.ReactNode
  className?: string
}

const COLOR_CLASSES: Record<ScoreColor, string> = {
  GREEN: 'badge badge-green',
  YELLOW: 'badge badge-yellow',
  RED: 'badge badge-red',
}

export function ColorBadge({ color, children, className }: ColorBadgeProps) {
  return (
    <span className={`${COLOR_CLASSES[color]} ${className || ''}`}>
      {children}
    </span>
  )
}
