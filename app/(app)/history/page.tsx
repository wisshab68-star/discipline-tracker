'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Session } from '@/lib/types'

const scoreColor = (s: number) => s >= 75 ? '#00C48C' : s >= 50 ? '#FFB800' : '#FF4D6A'
const scoreBg    = (s: number) => s >= 75 ? 'rgba(0,196,140,0.12)' : s >= 50 ? 'rgba(255,184,0,0.12)' : 'rgba(255,77,106,0.12)'

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}
function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}
function fmtDur(start: string, end: string | null) {
  const ms = (end ? new Date(end) : new Date()).getTime() - new Date(start).getTime()
  const h = Math.floor(ms / 3600000); const m = Math.floor((ms % 3600000) / 60000)
  return h > 0 ? h + 'h' + m + 'm' : m + 'min'
}

const CSS =
  '.row-h:hover{background:rgba(255,255,255,0.02)!important}' +
  '.fil-b:hover{border-color:#6366F1!important;color:#A5B4FC!important}'

export default function HistoryPage() {
  const supabase = createClient()
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading,  setLoading]  = useState(true)
  const [filter,   setFilter]   = useState<'all'|'green'|'yellow'|'red'>('all')

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
      const { data } = await supabase.from('sessions').select('*').eq('user_id', user.id).order('started_at', { ascending: false })
      if (data) setSessions(data as Session[])
      setLoading(false)
    }
    load()
  }, [supabase])

  const filtered = sessions.filter(s => {
    if (filter === 'green')  return s.avg_score >= 75
    if (filter === 'yellow') return s.avg_score >= 50 && s.avg_score < 75
    if (filter === 'red')    return s.avg_score < 50
    return true
  })

  const avgScore    = sessions.length > 0 ? Math.round(sessions.reduce((a, s) => a + s.avg_score, 0) / sessions.length) : 0
  const best        = sessions.length > 0 ? Math.round(Math.max(...sessions.map(s => s.avg_score))) : 0
  const totalTrades = sessions.reduce((a, s) => a + s.total_trades, 0)
  const ago30 = new Date(); ago30.setDate(ago30.getDate() - 30)
  const sess30 = sessions.filter(s => new Date(s.started_at) >= ago30).length

  if (loading) return (
    <div style={{ background: '#0D0D0D', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#8B8FA8', fontFamily: 'Inter,system-ui,sans-serif' }}>Chargement...</p>
    </div>
  )

  return (
    <div style={{ background: '#0D0D0D', minHeight: '100vh', padding: '2rem 2rem 4rem', fontFamily: 'Inter,system-ui,sans-serif', color: '#fff' }}>
      <style>{CSS}</style>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.25rem', letterSpacing: '-0.025em' }}>Historique des sessions</h1>
        <p style={{ color: '#8B8FA8', fontSize: '0.875rem', margin: 0 }}>{sessions.length} sessions enregistrées</p>
      </div>

      {/* SUMMARY STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { icon: '📋', label: 'Sessions totales', val: String(sessions.length), sub: sess30 + ' ce mois', col: '#6366F1' },
          { icon: '🎯', label: 'Score moyen', val: String(avgScore),     sub: '/ 100 pts',       col: scoreColor(avgScore) },
          { icon: '🏆', label: 'Meilleur score',   val: String(best),        sub: 'record perso',    col: '#00C48C' },
          { icon: '📈', label: 'Trades total',      val: String(totalTrades), sub: 'toutes sessions', col: '#8B8FA8' },
        ].map(c => (
          <div key={c.label} style={{ background: '#1A1A1A', border: '1px solid #252525', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
            <div style={{ width: '32px', height: '32px', background: c.col + '1A', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', marginBottom: '0.75rem' }}>{c.icon}</div>
            <p style={{ color: '#8B8FA8', fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.25rem' }}>{c.label}</p>
            <p style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.125rem', fontFamily: 'ui-monospace,monospace', color: c.col, lineHeight: 1 }}>{c.val}</p>
            <p style={{ color: '#8B8FA8', fontSize: '0.75rem', margin: 0 }}>{c.sub}</p>
          </div>
        ))}
      </div>

      {/* FILTERS */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <span style={{ color: '#8B8FA8', fontSize: '0.8125rem', fontWeight: 600 }}>Filtrer :</span>
        {([
          { key: 'all',    label: 'Toutes' },
          { key: 'green',  label: '🟢 Excellent (≥75)' },
          { key: 'yellow', label: '🟡 Correct (50-75)' },
          { key: 'red',    label: '🔴 À améliorer (<50)' },
        ] as { key: 'all'|'green'|'yellow'|'red'; label: string }[]).map(f => (
          <button key={f.key} className="fil-b" onClick={() => setFilter(f.key)}
            style={{ background: filter === f.key ? '#1A1A1A' : 'transparent', border: '1px solid ' + (filter === f.key ? '#6366F1' : '#252525'), borderRadius: '8px', padding: '0.375rem 0.875rem', color: filter === f.key ? '#A5B4FC' : '#8B8FA8', fontSize: '0.8125rem', fontWeight: filter === f.key ? 600 : 400, cursor: 'pointer', transition: 'all 0.15s' }}>
            {f.label}
          </button>
        ))}
        <span style={{ color: '#8B8FA8', fontSize: '0.8125rem', marginLeft: 'auto' }}>{filtered.length} résultats</span>
      </div>

      {/* TABLE */}
      <div style={{ background: '#1A1A1A', border: '1px solid #252525', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', padding: '0.75rem 1.25rem', borderBottom: '1px solid #252525', background: '#141414' }}>
          {['Date', 'Durée', 'Trades', 'Score moyen', 'Statut'].map(h => (
            <p key={h} style={{ color: '#8B8FA8', fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>{h}</p>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.75rem' }}>📋</span>
            <p style={{ color: '#8B8FA8', fontSize: '0.9rem', margin: 0 }}>Aucune session trouvée</p>
          </div>
        ) : filtered.map((s, idx) => (
          <Link key={s.session_id} href={'/session/' + s.session_id} style={{ textDecoration: 'none' }}>
            <div className="row-h" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', padding: '0.875rem 1.25rem', borderBottom: idx < filtered.length - 1 ? '1px solid #141414' : 'none', transition: 'background 0.15s', alignItems: 'center' }}>
              <div>
                <p style={{ color: '#E5E7EB', fontSize: '0.875rem', fontWeight: 500, margin: '0 0 0.125rem' }}>{fmtDate(s.started_at)}</p>
                <p style={{ color: '#8B8FA8', fontSize: '0.75rem', margin: 0 }}>{fmtTime(s.started_at)}</p>
              </div>
              <p style={{ color: '#8B8FA8', fontSize: '0.875rem', margin: 0 }}>{fmtDur(s.started_at, s.ended_at)}</p>
              <p style={{ color: '#E5E7EB', fontSize: '0.875rem', fontWeight: 600, margin: 0, fontFamily: 'ui-monospace,monospace' }}>{s.total_trades}</p>
              <div style={{ background: scoreBg(s.avg_score), border: '1px solid ' + scoreColor(s.avg_score) + '55', borderRadius: '8px', padding: '0.25rem 0.625rem', fontSize: '0.875rem', fontWeight: 700, color: scoreColor(s.avg_score), fontFamily: 'ui-monospace,monospace', display: 'inline-block', width: 'fit-content' }}>
                {Math.round(s.avg_score)}
              </div>
              <span style={{ background: s.status === 'active' ? 'rgba(0,212,170,0.12)' : 'rgba(139,143,168,0.1)', color: s.status === 'active' ? '#00D4AA' : '#8B8FA8', borderRadius: '100px', padding: '0.2rem 0.625rem', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.03em', display: 'inline-block', width: 'fit-content' }}>
                {s.status === 'active' ? '● ACTIVE' : '✓ Terminée'}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
