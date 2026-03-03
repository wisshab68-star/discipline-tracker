'use client'

import { cn } from '@/lib/utils'
import type { EmotionalState } from '@/lib/types'

const EMOTIONS: { state: EmotionalState; label: string; emoji: string; color: string }[] = [
  { state: 'CALM', label: 'Calme', emoji: '😌', color: 'bg-green/20 border-green hover:bg-green/30' },
  { state: 'STRESSED', label: 'Stressé', emoji: '😰', color: 'bg-yellow/20 border-yellow hover:bg-yellow/30' },
  { state: 'FRUSTRATED', label: 'Frustré', emoji: '😤', color: 'bg-orange-500/20 border-orange-500 hover:bg-orange-500/30' },
  { state: 'FOMO', label: 'FOMO', emoji: '😱', color: 'bg-red/20 border-red hover:bg-red/30' },
]

interface EmotionSelectorProps {
  value: EmotionalState | null
  onChange: (state: EmotionalState) => void
}

export function EmotionSelector({ value, onChange }: EmotionSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {EMOTIONS.map((e) => (
        <button
          key={e.state}
          type="button"
          onClick={() => onChange(e.state)}
          className={cn(
            'flex flex-col items-center gap-1 rounded-lg border-2 p-4 transition-colors',
            e.color,
            value === e.state && 'ring-2 ring-white ring-offset-2 ring-offset-[#1E1E2E]'
          )}
        >
          <span className="text-2xl">{e.emoji}</span>
          <span className="text-sm font-medium">{e.label}</span>
        </button>
      ))}
    </div>
  )
}
