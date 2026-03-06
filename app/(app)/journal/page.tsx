'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Session } from '@/lib/types'

const scoreColor = (s: number) => s >= 75 ? '#00D4AA' : s >= 50 ? '#FFB800' : '#FF4D6A'
const scoreBg    = (s: number) => s >= 75 ? 'rgba(0,212,170,0.1)' : s >= 50 ? 'rgba(255,184,0,0.1)' : 'rgba(255,77,106,0.1)'

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}
function fmtDur(start: string, end: string | null) {
  const ms = (end ? new Date(end) : new Date()).getTime() - new Date(start).getTime()
  const h = Math.floor(ms / 3600000); const m = Math.floor((ms % 3600000) / 60000)
  return h > 0 ? h + 'h' + m + 'm' : m + 'min'
}

interface Analysis { analysis: string; score: number }

const CSS = `
.sess-card:hover{border-color:#2A2A2A!important;background:#161616!important}
.sess-card.selected{border-color:#00D4AA!important}
.analyse-btn:hover:not(:disabled){background:#00BF96!important;transform:translateY(-1px)!important}
.analyse-btn:disabled{opacity:0.5;cursor:not-allowed}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.fade-in{animation:fadeIn 0.5s ease forwards}
`

export default function JournalPage() {
  const supabase = createClient()
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Session | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<Analysis | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('sessions').select('*').eq('user_id', user.id).order('started_at', { ascending: false }).limit(20)
        if (data) setSessions(data as Session[])
      }
      setLoading(false)
    }
    load()
  }, [supabase])

  const analyze = async () => {
    if (!selected || analyzing) return
    setAnalyzing(true)
    setError('')
    setResult(null)
    try {
      const { data: trades } = await supabase.from('trades').select('*').eq('session_id', selected.session_id)
      const { data: alerts } = await supabase.from('alerts').select('*').eq('session_id', selected.session_id)
      const res = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session: selected, trades: trades ?? [], alerts: alerts ?? [] }),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d.error || 'Erreur serveur')
      }
      const data: Analysis = await res.json()
      setResult(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur inconnue')
    } finally {
      setAnalyzing(false)
    }
  }

  if (loading) return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#888', fontFamily: 'Inter,system-ui,sans-serif' }}>Chargement...</p>
    </div>
  )

  return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh', padding: '2rem', fontFamily: 'Inter,system-ui,sans-serif', color: '#fff' }}>
      <style>{CSS}</style>

      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.25rem', letterSpacing: '-0.025em' }}>Journal IA</h1>
          <p style={{ color: '#888', fontSize: '0.875rem', margin: 0 }}>Analyse coaching de vos sessions par Claude AI</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: result ? '360px 1fr' : '1fr', gap: '1.5rem' }}>

          {/* SESSION LIST */}
          <div>
            <p style={{ color: '#888', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Selectionnez une session</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: result ? '600px' : '500px', overflowY: 'auto' }}>
              {sessions.length === 0 ? (
                <div style={{ background: '#111', border: '1px solid #1F1F1F', borderRadius: '12px', padding: '3rem 1.5rem', textAlign: 'center' }}>
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ margin: '0 auto 1rem' }}>
                    <rect x="8" y="10" width="32" height="36" rx="4" stroke="#2A2A2A" strokeWidth="2"/>
                    <path d="M16 26h16M16 32h10" stroke="#333" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <p style={{ color: '#666', fontSize: '0.9375rem', margin: 0 }}>Aucune session a analyser</p>
                  <a href="/session" style={{ color: '#00D4AA', fontSize: '0.875rem', marginTop: '0.75rem', display: 'inline-block' }}>Demarrer une session</a>
                </div>
              ) : sessions.map(s => {
                const isSelected = selected?.session_id === s.session_id
                const sc = scoreColor(Math.round(s.avg_score))
                return (
                  <button key={s.session_id} className={'sess-card' + (isSelected ? ' selected' : '')} onClick={() => { setSelected(s); setResult(null); setError('') }}
                    style={{ background: '#111', border: '1px solid ' + (isSelected ? '#00D4AA' : '#1F1F1F'), borderRadius: '12px', padding: '1rem 1.25rem', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                    <div>
                      <p style={{ color: '#E5E5E5', fontSize: '0.875rem', fontWeight: 500, margin: '0 0 0.25rem' }}>{fmtDate(s.started_at)}</p>
                      <p style={{ color: '#666', fontSize: '0.8125rem', margin: 0 }}>{s.total_trades} trades · {fmtDur(s.started_at, s.ended_at)}</p>
                    </div>
                    <div style={{ background: scoreBg(s.avg_score), borderRadius: '8px', padding: '0.25rem 0.625rem', fontFamily: 'ui-monospace,monospace', fontSize: '0.9375rem', fontWeight: 700, color: sc, flexShrink: 0 }}>
                      {Math.round(s.avg_score)}
                    </div>
                  </button>
                )
              })}
            </div>

            {selected && (
              <button className="analyse-btn" onClick={analyze} disabled={analyzing}
                style={{ marginTop: '1rem', width: '100%', background: '#00D4AA', color: '#0A0A0A', border: 'none', borderRadius: '10px', padding: '0.875rem', fontSize: '0.9375rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                {analyzing ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 18 18" style={{ animation: 'spin 1s linear infinite' }}>
                      <circle cx="9" cy="9" r="7" fill="none" stroke="#0A0A0A" strokeWidth="2" strokeDasharray="30 14" strokeLinecap="round"/>
                    </svg>
                    Analyse en cours...
                  </>
                ) : 'Analyser ma session'}
              </button>
            )}

            {error && (
              <div style={{ marginTop: '0.75rem', background: 'rgba(255,77,106,0.08)', border: '1px solid rgba(255,77,106,0.2)', borderRadius: '8px', padding: '0.75rem 1rem' }}>
                <p style={{ color: '#FF4D6A', fontSize: '0.8125rem', margin: 0 }}>{error}</p>
              </div>
            )}
          </div>

          {/* ANALYSIS RESULT */}
          {result && (
            <div className="fade-in" style={{ background: '#111', border: '1px solid #1F1F1F', borderRadius: '16px', padding: '2rem', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid #1F1F1F' }}>
                <div style={{ width: '48px', height: '48px', background: 'rgba(0,212,170,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 3L14.5 8.5L20.5 9.5L16 14L17 20L12 17L7 20L8 14L3.5 9.5L9.5 8.5L12 3Z" stroke="#00D4AA" strokeWidth="1.5" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 0.125rem' }}>Analyse coaching</h2>
                  <p style={{ color: '#666', fontSize: '0.8125rem', margin: 0 }}>Session du {selected ? fmtDate(selected.started_at) : ''} — Score {result.score}/100</p>
                </div>
              </div>
              <div style={{ color: '#CCC', fontSize: '0.9375rem', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
                {result.analysis.split('\n\n').map((para, i) => (
                  <p key={i} style={{ margin: '0 0 1rem', color: i === 0 ? '#fff' : '#BBB' }}>{para}</p>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
