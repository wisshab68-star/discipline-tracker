'use client'
import { useState, useRef, useEffect } from 'react'

const CSS = `.chat-input-wrap{display:flex;align-items:flex-end;gap:0.5rem;background:#111;border:1px solid #1F1F1F;border-radius:14px;padding:0.5rem 0.5rem 0.5rem 1rem;transition:border-color 0.2s}.chat-input-wrap:focus-within{border-color:#2A2A2A}.chat-input-wrap.disabled{opacity:0.5;pointer-events:none}.chat-textarea{flex:1;background:transparent;border:none;color:#E5E5E5;font-size:0.875rem;line-height:1.5;resize:none;outline:none;max-height:120px;padding:0.25rem 0;font-family:inherit}.chat-textarea::placeholder{color:#444}.chat-send-btn{width:36px;height:36px;border-radius:10px;border:none;background:#10B981;color:#000;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.15s}.chat-send-btn:hover{background:#0D9668;transform:scale(1.05)}.chat-send-btn:disabled{background:#1F1F1F;color:#444;cursor:not-allowed;transform:none}.chat-stop-btn{width:36px;height:36px;border-radius:10px;border:1px solid #333;background:#1A1A1A;color:#EF4444;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.15s}.chat-stop-btn:hover{background:rgba(239,68,68,0.1);border-color:#EF4444}`

interface Props { onSend: (msg: string) => void; onStop: () => void; isStreaming: boolean; disabled?: boolean }

export function ChatInput({ onSend, onStop, isStreaming, disabled }: Props) {
  const [value, setValue] = useState('')
  const ref = useRef<HTMLTextAreaElement>(null)
  useEffect(() => { const t = ref.current; if (t) { t.style.height = 'auto'; t.style.height = Math.min(t.scrollHeight, 120) + 'px' } }, [value])
  const send = () => { if (!value.trim() || isStreaming || disabled) return; onSend(value); setValue(''); if (ref.current) ref.current.style.height = 'auto' }
  return (
    <><style>{CSS}</style>
    <div className={`chat-input-wrap ${disabled ? 'disabled' : ''}`}>
      <textarea ref={ref} className="chat-textarea" placeholder={disabled ? 'Limite atteinte...' : 'Parle a DISKO...'} value={value} onChange={e => setValue(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }} rows={1} disabled={disabled} maxLength={2000} />
      {isStreaming ? (
        <button className="chat-stop-btn" onClick={onStop}><svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="2" y="2" width="10" height="10" rx="1.5" /></svg></button>
      ) : (
        <button className="chat-send-btn" onClick={send} disabled={!value.trim() || disabled}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg></button>
      )}
    </div></>
  )
}
