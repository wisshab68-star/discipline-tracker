'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import type { Session, Alert, AlertSeverity, AlertType } from '@/lib/types'

const scoreColor = (s: number) => s >= 75 ? '#00C48C' : s >= 50 ? '#FFB800' : '#FF4D6A'
const scoreBg    = (s: number) => s >= 75 ? 'rgba(0,196,140,0.12)' : s >= 50 ? 'rgba(255,184,0,0.12)' : 'rgba(255,77,106,0.12)'

const ALERT_ICONS: Record<AlertType, string> = {
  REVENGE_TRADING: '🔴', OVERSIZING: '📊', OVERTRADING: '⚡',
  LOW_SCORE: '⬇️', FOMO_DETECTED: '😰', LONG_SESSION: '⏰',
}
const SEV_COLORS: Record<AlertSeverity, string> = { CRITICAL: '#FF4D6A', WARNING: '#FFB800', INFO: '#6366F1' }
const ALERT_LABELS: Record<AlertType, string> = {
  REVENGE_TRADING: 'Revenge Trading', OVERSIZING: 'Oversizing',
  OVERTRADING: 'Overtrading', LOW_SCORE: 'Score bas',
  FOMO_DETECTED: 'FOMO', LONG_SESSION: 'Session longue',
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
}
function fmtDur(start: string, end: string | null) {
  const ms = (end ? new Date(end) : new Date()).getTime() - new Date(start).getTime()
  const h = Math.floor(ms / 3600000); const m = Math.floor((ms % 3600000) / 60000)
  return h > 0 ? h + 'h' + (m > 0 ? m + 'm' : '') : m + 'min'
}
function getGreeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Bonjour' : h < 18 ? 'Bon après-midi' : 'Bonsoir'
}
function fmtFullDate() {
  return new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}
function ChartTip({ active, payload }: { active?: boolean; payload?: Array<{ value: number; payload: { date: string } }> }) {
  if (!active || !payload?.length) return null
  const val = payload[0].value; const date = payload[0].payload.date
  return (
    <div style={{ background: '#111111', border: '1px solid #252525', borderRadius: '10px', padding: '0.625rem 0.875rem' }}>
      <p style={{ color: '#8B8FA8', fontSize: '0.75rem', margin: '0 0 0.25rem' }}>{date}</p>
      <p style={{ color: scoreColor(val), fontSize: '1.125rem', fontWeight: 700, margin: 0, fontFamily: 'ui-monospace,monospace' }}>{val}<span style={{ color: '#8B8FA8', fontSize: '0.75rem', fontWeight: 400 }}>/100</span></p>
    </div>
  )
}
const CSS = '.stat-c{transition:all 0.2s}.stat-c:hover{border-color:#6366F1!important;transform:translateY(-1px)}.sess-r:hover{background:rgba(255,255,255,0.025)!important}.tab-b:hover{color:#fff!important}'

export default function DashboardPage() {
  const supabase = createClient()
  const [sessions, setSessions] = useState<Session[]>([])
  const [alerts,   setAlerts]   = useState<Alert[]>([])
  const [loading,  setLoading]  = useState(true)
  const [period,   setPeriod]   = useState<7|30|90>(30)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
      const { data: sess } = await supabase.from('sessions').select('*').eq('user_id', user.id).order('started_at', { ascending: false }).limit(90)
      const { data: al }   = await supabase.from('alerts').select('*').eq('user_id', user.id).order('triggered_at', { ascending: false }).limit(20)
      if (sess) setSessions(sess as Session[])
      if (al)   setAlerts(al as Alert[])
      setLoading(false)
    }
    load()
  }, [supabase])

  const ago30  = new Date(); ago30.setDate(ago30.getDate() - 30)
  const sess30 = sessions.filter(s => new Date(s.started_at) >= ago30)
  const avg30  = sess30.length > 0 ? Math.round(sess30.reduce((a, s) => a + s.avg_score, 0) / sess30.length) : 0
  const best   = sessions.length > 0 ? Math.round(Math.max(...sessions.map(s => s.avg_score))) : 0
  const critN  = alerts.filter(a => a.severity === 'CRITICAL').length

  const sessionDates = new Set(sessions.map(s => s.started_at.substring(0, 10)))
  let streak = 0
  const sd = new Date()
  for (let i = 0; i < 365; i++) {
    const key = sd.toISOString().substring(0, 10)
    if (sessionDates.has(key)) { streak++; sd.setDate(sd.getDate() - 1) }
    else if (i === 0) sd.setDate(sd.getDate() - 1)
    else break
  }

  const cutoff   = new Date(); cutoff.setDate(cutoff.getDate() - period)
  const chartData = sessions.filter(s => new Date(s.started_at) >= cutoff).slice(0, period).reverse()
    .map((s, i) => ({ name: 'S' + (i + 1), score: Math.round(s.avg_score), date: fmtDate(s.started_at) }))

  const R = 28; const CIRC = Math.round(2 * Math.PI * R)
  const ringDash = Math.round((avg30 / 100) * CIRC)
  const avgC = scoreColor(avg30)

  if (loading) return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#8B8FA8', fontFamily: 'Inter,system-ui,sans-serif' }}>Chargement...</p>
    </div>
  )

  return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh', padding: '2rem 2rem 4rem', fontFamily: 'Inter,system-ui,sans-serif', color: '#fff' }}>
      <style>{CSS}</style>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.25rem', letterSpacing: '-0.025em' }}>{getGreeting()}, Trader 👋</h1>
        <p style={{ color: '#8B8FA8', fontSize: '0.875rem', margin: 0, textTransform: 'capitalize' }}>{fmtFullDate()}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>

        <div className="stat-c" style={{ background: '#111111', border: '1px solid #252525', borderRadius: '12px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'default', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
          <svg width="70" height="70" viewBox="0 0 70 70" style={{ flexShrink: 0 }}>
            <circle cx="35" cy="35" r={R} fill="none" stroke="#1F1F1F" strokeWidth="5"/>
            <circle cx="35" cy="35" r={R} fill="none" stroke={avgC} strokeWidth="5" strokeLinecap="round"
              strokeDasharray={ringDash + ' ' + (CIRC - ringDash)} transform="rotate(-90 35 35)"/>
            <text x="35" y="40" textAnchor="middle" fill={avgC} fontSize="13" fontWeight="700" fontFamily="ui-monospace,monospace">{avg30}</text>
          </svg>
          <div>
            <p style={{ color: '#8B8FA8', fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.375rem' }}>Score moyen 30j</p>
            <p style={{ fontSize: '1.875rem', fontWeight: 800, color: avgC, margin: 0, fontFamily: 'ui-monospace,monospace', lineHeight: 1 }}>{avg30}</p>
            <p style={{ color: '#8B8FA8', fontSize: '0.75rem', margin: '0.25rem 0 0' }}>/ 100 pts</p>
          </div>
        </div>

        <div className="stat-c" style={{ background: '#111111', border: '1px solid #252525', borderRadius: '12px', padding: '1.5rem', cursor: 'default', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
          <div style={{ width: '36px', height: '36px', background: 'rgba(99,102,241,0.12)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.125rem', marginBottom: '0.875rem' }}>📋</div>
          <p style={{ color: '#8B8FA8', fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.375rem' }}>Sessions</p>
          <p style={{ fontSize: '2.25rem', fontWeight: 800, margin: '0 0 0.25rem', fontFamily: 'ui-monospace,monospace', lineHeight: 1 }}>{sessions.length}</p>
          <p style={{ color: '#8B8FA8', fontSize: '0.8125rem', margin: 0 }}>{sess30.length} ce mois</p>
        </div>

        <div className="stat-c" style={{ background: '#111111', border: '1px solid #252525', borderRadius: '12px', padding: '1.5rem', cursor: 'default', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
          <div style={{ width: '36px', height: '36px', background: 'rgba(0,196,140,0.12)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.125rem', marginBottom: '0.875rem' }}>🏆</div>
          <p style={{ color: '#8B8FA8', fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.375rem' }}>Meilleur score</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <p style={{ fontSize: '2.25rem', fontWeight: 800, margin: 0, fontFamily: 'ui-monospace,monospace', color: '#00C48C', lineHeight: 1 }}>{best}</p>
            {best > 0 && <span style={{ background: 'rgba(0,196,140,0.12)', color: '#00C48C', borderRadius: '100px', padding: '0.15rem 0.5rem', fontSize: '0.6rem', fontWeight: 700, border: '1px solid rgba(0,196,140,0.25)' }}>🏆 Record</span>}
          </div>
          <p style={{ color: '#8B8FA8', fontSize: '0.8125rem', margin: 0 }}>Tous temps</p>
        </div>

        <div className="stat-c" style={{ background: '#111111', border: '1px solid #252525', borderRadius: '12px', padding: '1.5rem', cursor: 'default', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
          <div style={{ width: '36px', height: '36px', background: 'rgba(255,184,0,0.12)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.125rem', marginBottom: '0.875rem' }}>🔥</div>
          <p style={{ color: '#8B8FA8', fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.375rem' }}>Streak actuel</p>
          <p style={{ fontSize: '2.25rem', fontWeight: 800, margin: '0 0 0.625rem', fontFamily: 'ui-monospace,monospace', lineHeight: 1, color: streak > 0 ? '#FFB800' : '#fff' }}>{'🔥 ' + streak + 'j'}</p>
          <div style={{ background: '#1F1F1F', borderRadius: '100px', height: '4px', overflow: 'hidden' }}>
            <div style={{ background: 'linear-gradient(90deg,#FFB800,#FF6B00)', height: '100%', width: Math.min((streak / 7) * 100, 100) + '%', borderRadius: '100px' }}/>
          </div>
          <p style={{ color: '#8B8FA8', fontSize: '0.7rem', margin: '0.375rem 0 0' }}>Objectif : 7 jours</p>
        </div>
      </div>

      {/* CHART */}
      <div style={{ background: '#111111', border: '1px solid #252525', borderRadius: '12px', padding: '1.75rem', marginBottom: '1.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.0625rem', fontWeight: 700, margin: '0 0 0.25rem' }}>Évolution de ta discipline</h2>
            <p style={{ color: '#8B8FA8', fontSize: '0.8125rem', margin: 0 }}>Score moyen par session</p>
          </div>
          <div style={{ display: 'flex', gap: '0.25rem', background: '#0A0A0A', borderRadius: '8px', padding: '0.25rem' }}>
            {([7, 30, 90] as const).map(p => (
              <button key={p} className="tab-b" onClick={() => setPeriod(p)}
                style={{ background: period === p ? '#111111' : 'transparent', border: period === p ? '1px solid #252525' : '1px solid transparent', borderRadius: '6px', padding: '0.375rem 0.75rem', color: period === p ? '#fff' : '#8B8FA8', fontSize: '0.8125rem', fontWeight: period === p ? 600 : 400, cursor: 'pointer', transition: 'all 0.15s' }}>
                {p}j
              </button>
            ))}
          </div>
        </div>
        {chartData.length === 0 ? (
          <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '0.75rem' }}>
            <span style={{ fontSize: '2.5rem' }}>📊</span>
            <p style={{ color: '#8B8FA8', fontSize: '0.9rem', margin: 0 }}>Aucune donnée pour cette période</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366F1" stopOpacity={0.35}/>
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F1F1F" vertical={false}/>
              <XAxis dataKey="name" tick={{ fill: '#8B8FA8', fontSize: 11 }} axisLine={false} tickLine={false}/>
              <YAxis domain={[0, 100]} tick={{ fill: '#8B8FA8', fontSize: 11 }} axisLine={false} tickLine={false}/>
              <Tooltip content={<ChartTip/>}/>
              <Area type="monotone" dataKey="score" stroke="#6366F1" strokeWidth={2.5}
                fill="url(#grad)" dot={false} activeDot={{ r: 5, fill: '#6366F1', stroke: '#fff', strokeWidth: 2 }}/>
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* BOTTOM GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div style={{ background: '#111111', border: '1px solid #252525', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Sessions récentes</h2>
            <a href="/history" style={{ color: '#6366F1', fontSize: '0.8125rem', fontWeight: 600, textDecoration: 'none' }}>Tout voir →</a>
          </div>
          {sessions.length === 0 ? (
            <div style={{ padding: '2.5rem 0', textAlign: 'center' }}>
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.75rem' }}>📋</span>
              <p style={{ color: '#8B8FA8', fontSize: '0.875rem', margin: 0 }}>Aucune session pour l&apos;instant</p>
            </div>
          ) : sessions.slice(0, 8).map(s => (
            <a key={s.session_id} href={'/session/' + s.session_id} style={{ textDecoration: 'none' }}>
              <div className="sess-r" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.625rem 0.5rem', borderRadius: '8px', transition: 'background 0.15s' }}>
                <div>
                  <p style={{ color: '#E5E7EB', fontSize: '0.875rem', fontWeight: 500, margin: '0 0 0.125rem' }}>{fmtDate(s.started_at)}</p>
                  <p style={{ color: '#8B8FA8', fontSize: '0.75rem', margin: 0 }}>{s.total_trades} trades · {fmtDur(s.started_at, s.ended_at)}</p>
                </div>
                <div style={{ background: scoreBg(s.avg_score), border: '1px solid ' + scoreColor(s.avg_score) + '55', borderRadius: '8px', padding: '0.25rem 0.625rem', fontSize: '0.875rem', fontWeight: 700, color: scoreColor(s.avg_score), fontFamily: 'ui-monospace,monospace' }}>
                  {Math.round(s.avg_score)}
                </div>
              </div>
            </a>
          ))}
        </div>

        <div style={{ background: '#111111', border: '1px solid #252525', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Alertes récentes</h2>
            {critN > 0 && <span style={{ background: 'rgba(255,77,106,0.12)', color: '#FF4D6A', borderRadius: '100px', padding: '0.15rem 0.625rem', fontSize: '0.7rem', fontWeight: 700 }}>{critN} critiques</span>}
          </div>
          {alerts.length === 0 ? (
            <div style={{ padding: '2.5rem 0', textAlign: 'center' }}>
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.75rem' }}>✅</span>
              <p style={{ color: '#8B8FA8', fontSize: '0.875rem', margin: 0 }}>Aucune alerte. Beau travail !</p>
            </div>
          ) : alerts.slice(0, 8).map(a => (
            <div key={a.alert_id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.625rem', borderRadius: '8px', background: '#0A0A0A', borderLeft: '3px solid ' + SEV_COLORS[a.severity], marginBottom: '0.375rem' }}>
              <span style={{ fontSize: '1rem', flexShrink: 0 }}>{ALERT_ICONS[a.alert_type] ?? '⚠️'}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: '#E5E7EB', fontSize: '0.8125rem', fontWeight: 500, margin: '0 0 0.125rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ALERT_LABELS[a.alert_type] ?? a.alert_type}</p>
                <p style={{ color: '#8B8FA8', fontSize: '0.75rem', margin: 0 }}>{fmtDate(a.triggered_at)}</p>
              </div>
              <span style={{ color: SEV_COLORS[a.severity], fontSize: '0.65rem', fontWeight: 700, flexShrink: 0 }}>{a.severity}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
