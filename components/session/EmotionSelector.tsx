'use client'

import type { EmotionalState } from '@/lib/types'

const EMOTIONS: { state: EmotionalState; label: string; emoji: string; colorClass: string }[] = [
  { state: 'CALM', label: 'Calme', emoji: '😌', colorClass: 'emotion-btn-calm' },
  { state: 'STRESSED', label: 'Stressé', emoji: '😰', colorClass: 'emotion-btn-stressed' },
  { state: 'FRUSTRATED', label: 'Frustré', emoji: '😤', colorClass: 'emotion-btn-frustrated' },
  { state: 'FOMO', label: 'FOMO', emoji: '😱', colorClass: 'emotion-btn-fomo' },
]

interface EmotionSelectorProps {
  value: EmotionalState | null
  onChange: (state: EmotionalState) => void
}

export function EmotionSelector({ value, onChange }: EmotionSelectorProps) {
  return (
    <div className="emotion-grid">
      {EMOTIONS.map((e) => (
        <button
          key={e.state}
          type="button"
          onClick={() => onChange(e.state)}
          className={`emotion-btn ${e.colorClass} ${value === e.state ? 'emotion-btn-selected' : ''}`}
        >
          <span style={{ fontSize: '1.5rem' }}>{e.emoji}</span>
          <span>{e.label}</span>
        </button>
      ))}
    </div>
  )
}
