'use client'
import type { CoachMessage } from '@/lib/types/coach'
import { DiskoAvatar } from './DiskoAvatar'

const CSS = `.chat-msg{display:flex;gap:0.75rem;padding:0.75rem 0;max-width:720px;margin:0 auto;animation:msgIn 0.25s ease-out}.chat-msg-user{flex-direction:row-reverse}.chat-msg-bubble{padding:0.75rem 1rem;border-radius:16px;font-size:0.875rem;line-height:1.65;max-width:85%;word-break:break-word}.chat-msg-user .chat-msg-bubble{background:#1A1A1A;color:#E5E5E5;border-bottom-right-radius:4px}.chat-msg-assistant .chat-msg-bubble{background:transparent;color:#D4D4D4;padding-left:0}.chat-msg-bubble p{margin:0 0 0.5rem}.chat-msg-bubble p:last-child{margin-bottom:0}.chat-msg-bubble strong{color:#fff}.streaming-cursor::after{content:"|";color:#10B981;animation:blink 0.8s infinite}@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}@keyframes msgIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`

interface Props { message: CoachMessage; isLast: boolean; isStreaming: boolean }

export function ChatMessage({ message, isStreaming }: Props) {
  const isUser = message.role === 'user'
  const renderContent = (text: string) => {
    if (!text) return null
    return text.split('\n').map((line, i) => {
      const processed = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      return <p key={i} dangerouslySetInnerHTML={{ __html: processed || '&nbsp;' }} />
    })
  }
  return (
    <><style>{CSS}</style>
    <div className={`chat-msg ${isUser ? 'chat-msg-user' : 'chat-msg-assistant'}`}>
      <div style={{ flexShrink: 0, marginTop: 2 }}>
        {isUser ? <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#1F1F1F', border: '1px solid #2A2A2A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: '#888' }}>T</div> : <DiskoAvatar size={28} />}
      </div>
      <div className={`chat-msg-bubble ${isStreaming ? 'streaming-cursor' : ''}`}>{renderContent(message.content)}</div>
    </div></>
  )
}
