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
    <div className="rounded-lg bg-red-900/80 p-6 text-white">
      <p className="mb-4 font-semibold">
        ⚠️ FOMO détecté — attends 5 minutes avant de trader
      </p>
      <div className="mb-4 font-mono text-3xl font-bold">
        {minutes}:{seconds.toString().padStart(2, '0')}
      </div>
      <Progress value={progress} className="mb-4 h-2" />
      <Button
        variant="outline"
        size="sm"
        onClick={onCancel}
        className="border-white/50 text-white hover:bg-white/10"
      >
        J&apos;ai changé d&apos;état émotionnel
      </Button>
    </div>
  )
}
