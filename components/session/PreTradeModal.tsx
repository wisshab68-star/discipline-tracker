'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { EmotionSelector } from './EmotionSelector'
import { FomoCountdown } from './FomoCountdown'
import type { EmotionalState } from '@/lib/types'

interface PreTradeModalProps {
  open: boolean
  onClose: () => void
  onComplete: (data: {
    plan_respected: boolean
    setup_identified: boolean
    emotional_state: EmotionalState
  }) => void
}

export function PreTradeModal({ open, onClose, onComplete }: PreTradeModalProps) {
  const [step, setStep] = useState(1)
  const [planRespected, setPlanRespected] = useState<boolean | null>(null)
  const [setupIdentified, setSetupIdentified] = useState<boolean | null>(null)
  const [emotionalState, setEmotionalState] = useState<EmotionalState | null>(null)
  const [showFomoCountdown, setShowFomoCountdown] = useState(false)

  const handlePlanRespected = (v: boolean) => {
    setPlanRespected(v)
    setStep(2)
  }

  const handleSetupIdentified = (v: boolean) => {
    setSetupIdentified(v)
    setStep(3)
  }

  const handleEmotionSelect = (state: EmotionalState) => {
    setEmotionalState(state)
    if (state === 'FOMO') {
      setShowFomoCountdown(true)
    } else {
      submit()
    }
  }

  const submit = () => {
    if (planRespected === null || setupIdentified === null || emotionalState === null) return
    onComplete({
      plan_respected: planRespected,
      setup_identified: setupIdentified,
      emotional_state: emotionalState,
    })
    reset()
    onClose()
  }

  const handleFomoComplete = () => {
    setShowFomoCountdown(false)
    submit()
  }

  const handleFomoCancel = () => {
    setShowFomoCountdown(false)
    setEmotionalState(null)
  }

  const reset = () => {
    setStep(1)
    setPlanRespected(null)
    setSetupIdentified(null)
    setEmotionalState(null)
    setShowFomoCountdown(false)
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-[420px] border-border bg-[#1E1E2E] backdrop-blur">
        <DialogHeader>
          <DialogTitle className="font-sans text-white">
            Checklist pré-trade
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            ⚡ Checklist rapide — prend 5 secondes
          </p>
          <Progress value={(step / 3) * 100} className="h-1" />
        </DialogHeader>

        {showFomoCountdown ? (
          <FomoCountdown onComplete={handleFomoComplete} onCancel={handleFomoCancel} />
        ) : (
          <div className="space-y-6">
            {step === 1 && (
              <div>
                <p className="mb-4 text-sm font-medium">Ton plan est-il respecté ?</p>
                <div className="flex gap-2">
                  <Button
                    variant={planRespected === true ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => handlePlanRespected(true)}
                  >
                    ✅ OUI
                  </Button>
                  <Button
                    variant={planRespected === false ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => handlePlanRespected(false)}
                  >
                    ❌ NON
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <p className="mb-4 text-sm font-medium">Setup clairement identifié ?</p>
                <div className="flex gap-2">
                  <Button
                    variant={setupIdentified === true ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => handleSetupIdentified(true)}
                  >
                    ✅ OUI
                  </Button>
                  <Button
                    variant={setupIdentified === false ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => handleSetupIdentified(false)}
                  >
                    ❌ NON
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <p className="mb-4 text-sm font-medium">État émotionnel ?</p>
                <EmotionSelector value={emotionalState} onChange={handleEmotionSelect} />
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
