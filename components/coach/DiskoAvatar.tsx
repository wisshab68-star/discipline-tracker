'use client'

interface DiskoAvatarProps { size?: number; pulse?: boolean }

export function DiskoAvatar({ size = 32, pulse = false }: DiskoAvatarProps) {
  const s = size * 0.55
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, animation: pulse ? 'diskoPulse 2s infinite' : 'none' }}>
      <style>{`@keyframes diskoPulse{0%{box-shadow:0 0 0 0 rgba(16,185,129,0.35)}70%{box-shadow:0 0 0 8px rgba(16,185,129,0)}100%{box-shadow:0 0 0 0 rgba(16,185,129,0)}}`}</style>
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
        <rect x="4" y="6" width="16" height="14" rx="3" fill="#000" opacity="0.3" />
        <circle cx="9" cy="12" r="2" fill="#fff" /><circle cx="15" cy="12" r="2" fill="#fff" />
        <circle cx="9.5" cy="11.8" r="0.8" fill="#000" /><circle cx="15.5" cy="11.8" r="0.8" fill="#000" />
        <path d="M9 16.5C9 16.5 10.5 18 12 18C13.5 18 15 16.5 15 16.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="12" y1="6" x2="12" y2="3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="2" r="1.5" fill="#fff" />
      </svg>
    </div>
  )
}
