'use client'

import { motion } from 'framer-motion'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { ColorBadge } from '@/components/ui/ColorBadge'
import type { ScoreColor } from '@/lib/types'

const COLOR_HEX: Record<ScoreColor, string> = {
  GREEN: '#27AE60',
  YELLOW: '#F39C12',
  RED: '#E74C3C',
}

interface ScoreDisplayProps {
  score: number
  color: ScoreColor
  planScore?: number
  riskScore?: number
  emotionScore?: number
  postLossScore?: number
}

export function ScoreDisplay({
  score,
  color,
  planScore = 0,
  riskScore = 0,
  emotionScore = 0,
  postLossScore = 0,
}: ScoreDisplayProps) {
  return (
    <motion.div
      className="rounded-2xl border border-border bg-[#1E1E2E] p-6 shadow-[0_0_30px_rgba(27,107,138,0.2)]"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative flex flex-col items-center">
        <ProgressRing
          value={score}
          size={160}
          strokeWidth={10}
          color={COLOR_HEX[color]}
          className="transition-colors duration-1000"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-5xl font-bold tracking-tight text-[var(--text)]">
            {score}
          </span>
          <span className="font-sans text-xs text-muted-foreground">
            DISCIPLINE
          </span>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <span className="text-xs text-muted-foreground">Plan 40%</span>
        <ColorBadge color="GREEN">{Math.round(planScore)}</ColorBadge>
        <span className="text-xs text-muted-foreground">Risque 20%</span>
        <ColorBadge color="GREEN">{Math.round(riskScore)}</ColorBadge>
        <span className="text-xs text-muted-foreground">Émotion 20%</span>
        <ColorBadge color="GREEN">{Math.round(emotionScore)}</ColorBadge>
        <span className="text-xs text-muted-foreground">Post-perte 20%</span>
        <ColorBadge color="GREEN">{Math.round(postLossScore)}</ColorBadge>
      </div>
    </motion.div>
  )
}
