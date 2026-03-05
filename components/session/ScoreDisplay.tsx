'use client'

import { motion } from 'framer-motion'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { ColorBadge } from '@/components/ui/ColorBadge'
import type { ScoreColor } from '@/lib/types'

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
      className="score-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="score-inner">
        <ProgressRing
          value={score}
          size={160}
          strokeWidth={10}
          color={color === 'GREEN' ? '#22c55e' : color === 'YELLOW' ? '#eab308' : '#ef4444'}
        />
        <div className="score-center">
          <span className="score-value">
            {score}
          </span>
          <span className="score-label">
            DISCIPLINE
          </span>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-2" style={{ marginTop: '1.5rem' }}>
        <span className="score-label">Plan 40%</span>
        <ColorBadge color="GREEN">{Math.round(planScore)}</ColorBadge>
        <span className="score-label">Risque 20%</span>
        <ColorBadge color="GREEN">{Math.round(riskScore)}</ColorBadge>
        <span className="score-label">Émotion 20%</span>
        <ColorBadge color="GREEN">{Math.round(emotionScore)}</ColorBadge>
        <span className="score-label">Post-perte 20%</span>
        <ColorBadge color="GREEN">{Math.round(postLossScore)}</ColorBadge>
      </div>
    </motion.div>
  )
}
