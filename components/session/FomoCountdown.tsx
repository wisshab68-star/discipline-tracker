'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

const COUNTDOWN_SECONDS = 5 * 60

interface FomoCountdownProps {
  onComplete: () => void
  onCancel: () => void
}

export function FomoCountdown({ onComplete, onCancel }: FomoCountdownProps) {
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS)

  useEffect(() => {
    if (secondsLeft <= 0) {
      onComplete()
      return
    }
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearInterval(timer)
  }, [secondsLeft, onComplete])

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const progress = ((COUNTDOWN_SECONDS - secondsLeft) / COUNTDOWN_SECONDS) * 100

  return (
    <div className="fomo-box">
      <p className="font-semibold" style={{ marginBottom: '1rem' }}>
        ⚠️ FOMO détecté — attends 5 minutes avant de trader
      </p>
      <div className="fomo-timer">
        {minutes}:{seconds.toString().padStart(2, '0')}
      </div>
      <Progress value={progress} className="progress-thin" style={{ marginBottom: '1rem' }} />
      <Button
        variant="outline"
        size="sm"
        onClick={onCancel}
        className="fomo-btn"
      >
        J&apos;ai changé d&apos;état émotionnel
      </Button>
    </div>
  )
}
