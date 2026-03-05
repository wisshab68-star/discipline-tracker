'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import type { Session, Alert, AlertSeverity, AlertType } from '@/lib/types'

const scoreColor = (s: number) => s >= 75 ? '#00D4AA' : s >= 50 ? '#EAB308' : '#FF4D6A'
const scoreBg   = (s: number) => s >= 75 ? 'rgba(0,212,170,0.12)' : s >= 50 ? 'rgba(234,179,8,0.12)' : 'rgba(255,77,106,0.12)'

const ALERT_ICONS: Record<AlertType, string> = {
  REVENGE_TRADING: '🔴', OVERSIZING: '📊', OVERTRADING: '⚡',
  LOW_SCORE: '⬇️', FOMO_DETECTED: '😰', LONG_SESSION: '⏰',
}
const SEV_COLORS: Record<AlertSeverity, string> = {
  CRITICAL: '#FF4D6A', WARNING: '#EAB308', INFO: '#6366F1',
}
const SEV_BG: Record<AlertSeverity, string> = {
  CRITICAL: 'rgba(255,77,106,0.12)', WARNING: 'rgba(234,179,8,0.12)', INFO: 'rgba(99,102,241,0.12)',
}
const ALERT_LABELS: Record<AlertType, string> = {
  REVENGE_TRADING: 'Revenge Trading', OVERSIZING: 'Oversizing',
  OVERTRADING: 'Overtrading', LOW_SCORE: 'Score bas',
  FOMO_DETECTED: 'FOMO', LONG_SESSION: 'Session longue',
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
}
function fmtDuration(start: string, end: string | null) {
  const ms = (end ? new Date(end) : new Date()).getTime() - new Date(start).getTime()
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  return h > 0 ? h + 'h' + (m > 0 ? m + 'm' : '') : m + 'min'
}

function ChartTooltip({ active, payload }: { active?: boolean; payload?: Array<{ value: number; payload: { date: string } }> }) {
  if (!active || !payload?.length) return null
  const val = payload[0].value
  const date = payload[0].payload.date
  return (
    <div style={{ background: '#1A1C25', border: '1px solid #2A2D3A', borderRadius: '10px', padding: '0.625rem 0.875rem' }}>
      <p style={{ color: '#8B8FA8', fontSize: '0.75rem', margin: '0 0 0.25rem' }}>{date}</p>
      <p style={{ color: scoreColor(val), fontSize: '1.125rem', fontWeight: 700, margin: 0, fontFamily: 'ui-monospace,monospace' }}>
        {val}<span style={{ color: '#8B8FA8', fontSize: '0.75rem', fontWeight: 400 }}>/100</span>
      </p>
    </div>
  )
}

const CSS =
  '@keyframes fab-pulse{0%,100%{box-shadow:0 0 0 0 rgba(99,102,241,0.5)}70%{box-shadow:0 0 0 14px rgba(99,102,241,0)}}' +
  '.stat-card{transition:all 0.2s!important}.stat-card:hover{border-color:#6366F1!important;transform:translateY(-2px)!important}' +
  '.sess-row:hover{background:rgba(255,255,255,0.03)!important}' +
  '.alert-row:hover{background:rgba(255,255,255,0.03)!important}' +
  '.fab-btn{transition:transform 0.2s,box-shadow 0.2s!important}.fab-btn:hover{transform:scale(1.05)!important;box-shadow:0 0 40px rgba(99,102,241,0.65)!important}'

export default function DashboardPage() {
  const supabase = createClient()
  const [sessions, setSessions] = useState<Session[]>([])
  const [alerts,   setAlerts]   = useState<Alert[]>([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
      const { data: sess } = await supabase.from('sessions').select('*').eq('user_id', user.id).order('started_at', { ascending: false }).limit(30)
      const { data: al }   = await supabase.from('alerts').select('*').eq('user_id', user.id).order('triggered_at', { ascending: false }).limit(20)
      if (sess) setSessions(sess as Session[])
      if (al)   setAlerts(al as Alert[])
      setLoading(false)
    }
    load()
  }, [supabase])

  const ago30     = new Date(); ago30.setDate(ago30.getDate() - 30)
  const sess30    = sessions.filter(s => new Date(s.started_at) >= ago30)
  const avg30     = sess30.length > 0 ? Math.round(sess30.reduce((a, s) => a + s.avg_score, 0) / sess30.length) : 0
  const best      = sessions.length > 0 ? Math.round(Math.max(...sessions.map(s => s.avg_score))) : 0
  const critAlerts = alerts.filter(a => a.severity === 'CRITICAL').length
  const avgC      = scoreColor(avg30)

  const chartData = sessions.slice(0, 30).reverse().map((s, i) => ({
    name: 'S' + (i + 1),
    score: Math.round(s.avg_score),
    date: fmtDate(s.started_at),
  }))

  const R        = 28
  const CIRC     = Math.round(2 * Math.PI * R)
  const ringDash = Math.round((avg30 / 100) * CIRC)

  if (loading) return (
    <div style={{ background: '#0A0B0F', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#8B8FA8', fontFamily: 'Inter,system-ui,sans-serif' }}>Chargement...</p>
    </div>
  )

  return (
    <>
      <style>{CSS}</style>
      <div style={{ background: '#0A0B0F', minHeight: '100vh', padding: '2rem 1.5rem 6rem', fontFamily: 'Inter,system-ui,sans-serif', color: '#fff' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

          {/* HEADER */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.025em', margin: 0 }}>Dashboard</h1>
              <p style={{ color: '#8B8FA8', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>Ton tableau de bord de discipline comportementale</p>
            </div>
            <Link href="/history" style={{ textDecoration: 'none' }}>
              <button style={{ background: 'transparent', border: '1px solid #1E2028', borderRadius: '8px', color: '#8B8FA8', padding: '0.5rem 1.125rem', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }}>Historique →</button>
            </Link>
          </div>

          {/* STATS BAR */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>

            {/* Card 1: Avg Score with ring */}
            <div className="stat-card" style={{ background: '#12141A', border: '1px solid #1E2028', borderRadius: '16px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'default' }}>
              <svg width="72" height="72" viewBox="0 0 72 72" style={{ flexShrink: 0 }}>
                <circle cx="36" cy="36" r={R} fill="none" stroke="#1E2028" strokeWidth="5"/>
                <circle cx="36" cy="36" r={R} fill="none" stroke={avgC} strokeWidth="5" strokeLinecap="round"
                  strokeDasharray={ringDash + ' ' + (CIRC - ringDash)} transform="rotate(-90 36 36)"/>
                <text x="36" y="40" textAnchor="middle" fill={avgC} fontSize="14" fontWeight="700" fontFamily="ui-monospace,monospace">{avg30}</text>
              </svg>
              <div>
                <p style={{ color: '#8B8FA8', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.375rem' }}>Score moyen 30j</p>
                <p style={{ fontSize: '1.75rem', fontWeight: 800, color: avgC, margin: 0, fontFamily: 'ui-monospace,monospace', lineHeight: 1 }}>{avg30}</p>
                <p style={{ color: '#8B8FA8', fontSize: '0.75rem', margin: '0.25rem 0 0' }}>/ 100 pts</p>
              </div>
            </div>

            {/* Card 2: Total Sessions */}
            <div className="stat-card" style={{ background: '#12141A', border: '1px solid #1E2028', borderRadius: '16px', padding: '1.5rem', cursor: 'default' }}>
              <div style={{ width: '36px', height: '36px', background: 'rgba(99,102,241,0.12)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.125rem', marginBottom: '1rem' }}>📋</div>
              <p style={{ color: '#8B8FA8', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.375rem' }}>Sessions totales</p>
              <p style={{ fontSize: '2.25rem', fontWeight: 800, margin: '0 0 0.25rem', fontFamily: 'ui-monospace,monospace', lineHeight: 1 }}>{sessions.length}</p>
              <p style={{ color: '#8B8FA8', fontSize: '0.8125rem', margin: 0 }}>{sess30.length} ce mois</p>
            </div>

            {/* Card 3: Best Score */}
            <div className="stat-card" style={{ background: '#12141A', border: '1px solid #1E2028', borderRadius: '16px', padding: '1.5rem', cursor: 'default' }}>
              <div style={{ width: '36px', height: '36px', background: 'rgba(0,212,170,0.12)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.125rem', marginBottom: '1rem' }}>🏆</div>
              <p style={{ color: '#8B8FA8', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.375rem' }}>Meilleur score</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <p style={{ fontSize: '2.25rem', fontWeight: 800, margin: 0, fontFamily: 'ui-monospace,monospace', color: '#00D4AA', lineHeight: 1 }}>{best}</p>
                {best > 0 && <span style={{ background: 'rgba(0,212,170,0.12)', border: '1px solid rgba(0,212,170,0.25)', color: '#00D4AA', borderRadius: '100px', padding: '0.15rem 0.5rem', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.04em' }}>RECORD</span>}
              </div>
              <p style={{ color: '#8B8FA8', fontSize: '0.8125rem', margin: 0 }}>Tous temps</p>
            </div>

            {/* Card 4: Critical Alerts */}
            <div className="stat-card" style={{ background: '#12141A', border: '1px solid #1E2028', borderRadius: '16px', padding: '1.5rem', cursor: 'default' }}>
              <div style={{ width: '36px', height: '36px', background: critAlerts > 0 ? 'rgba(255,77,106,0.12)' : 'rgba(0,212,170,0.12)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.125rem', marginBottom: '1rem' }}>🛡️</div>
              <p style={{ color: '#8B8FA8', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.375rem' }}>Alertes critiques</p>
              <p style={{ fontSize: '2.25rem', fontWeight: 800, margin: '0 0 0.25rem', fontFamily: 'ui-monospace,monospace', color: critAlerts > 0 ? '#FF4D6A' : '#00D4AA', lineHeight: 1 }}>{critAlerts}</p>
              <p style={{ color: '#8B8FA8', fontSize: '0.8125rem', margin: 0 }}>Ce mois-ci</p>
            </div>
          </div>

          {/* CHART */}
          <div style={{ background: '#12141A', border: '1px solid #1E2028', borderRadius: '20px', padding: '1.75rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 0.25rem' }}>Évolution de ta discipline</h2>
                <p style={{ color: '#8B8FA8', fontSize: '0.875rem', margin: 0 }}>30 dernières sessions</p>
              </div>
              <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                {[['#00D4AA','Excellent (75+)'],['#EAB308','Correct (50-75)'],['#FF4D6A','Faible (<50)']].map(([c,l]) => (
                  <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: '#8B8FA8' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: c, flexShrink: 0 }}/>
                    <span>{l}</span>
                  </div>
                ))}
              </div>
            </div>
            {chartData.length === 0 ? (
              <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '0.75rem' }}>
                <span style={{ fontSize: '2.5rem' }}>📊</span>
                <p style={{ color: '#8B8FA8', fontSize: '0.9rem', textAlign: 'center', margin: 0 }}>Lance ta première session pour voir ton évolution ici</p>
                <Link href="/session" style={{ textDecoration: 'none' }}>
                  <button style={{ background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.5rem 1.25rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem' }}>Démarrer →</button>
                </Link>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#6366F1" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E2028" vertical={false}/>
                  <XAxis dataKey="name" tick={{ fill: '#8B8FA8', fontSize: 11 }} axisLine={false} tickLine={false}/>
                  <YAxis domain={[0, 100]} tick={{ fill: '#8B8FA8', fontSize: 11 }} axisLine={false} tickLine={false}/>
                  <Tooltip content={<ChartTooltip/>}/>
                  <Area type="monotone" dataKey="score" stroke="#6366F1" strokeWidth={2.5}
                    fill="url(#scoreGrad)" dot={false}
                    activeDot={{ r: 5, fill: '#6366F1', stroke: '#fff', strokeWidth: 2 }}/>
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* BOTTOM GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

            {/* SESSIONS LIST */}
            <div style={{ background: '#12141A', border: '1px solid #1E2028', borderRadius: '20px', padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Sessions récentes</h2>
                <Link href="/history" style={{ color: '#6366F1', fontSize: '0.8125rem', fontWeight: 600, textDecoration: 'none' }}>Voir tout →</Link>
              </div>
              {sessions.length === 0 ? (
                <div style={{ padding: '3rem 0', textAlign: 'center' }}>
                  <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.75rem' }}>📋</span>
                  <p style={{ color: '#8B8FA8', fontSize: '0.875rem', margin: '0 0 1rem' }}>Aucune session pour l&apos;instant</p>
                  <Link href="/session" style={{ textDecoration: 'none' }}>
                    <button style={{ background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.5rem 1.25rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>Commencer →</button>
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  {sessions.slice(0, 8).map(s => (
                    <Link key={s.session_id} href={'/session/' + s.session_id} style={{ textDecoration: 'none' }}>
                      <div className="sess-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.625rem 0.75rem', borderRadius: '10px', cursor: 'pointer', transition: 'background 0.15s' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem', minWidth: 0 }}>
                          <span style={{ color: '#E5E7EB', fontSize: '0.875rem', fontWeight: 500 }}>{fmtDate(s.started_at)}</span>
                          <span style={{ color: '#8B8FA8', fontSize: '0.75rem' }}>{s.total_trades} trade{s.total_trades !== 1 ? 's' : ''} · {fmtDuration(s.started_at, s.ended_at)}</span>
                        </div>
                        <div style={{ background: scoreBg(s.avg_score), border: '1px solid ' + scoreColor(s.avg_score) + '55', borderRadius: '8px', padding: '0.25rem 0.625rem', fontSize: '0.875rem', fontWeight: 700, color: scoreColor(s.avg_score), fontFamily: 'ui-monospace,monospace', flexShrink: 0 }}>
                          {Math.round(s.avg_score)}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* ALERTS LIST */}
            <div style={{ background: '#12141A', border: '1px solid #1E2028', borderRadius: '20px', padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Alertes récentes</h2>
                {alerts.length > 0 && (
                  <span style={{ background: 'rgba(255,77,106,0.12)', color: '#FF4D6A', borderRadius: '100px', padding: '0.15rem 0.625rem', fontSize: '0.7rem', fontWeight: 700 }}>{alerts.length} alertes</span>
                )}
              </div>
              {alerts.length === 0 ? (
                <div style={{ padding: '3rem 0', textAlign: 'center' }}>
                  <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.75rem' }}>✅</span>
                  <p style={{ color: '#8B8FA8', fontSize: '0.875rem', margin: 0 }}>Aucune alerte. Continue comme ça !</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  {alerts.slice(0, 8).map(a => (
                    <div key={a.alert_id} className="alert-row" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.75rem', borderRadius: '10px', cursor: 'default', transition: 'background 0.15s' }}>
                      <span style={{ fontSize: '1.125rem', flexShrink: 0 }}>{ALERT_ICONS[a.alert_type] ?? '⚠️'}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ color: '#E5E7EB', fontSize: '0.875rem', fontWeight: 500, margin: '0 0 0.125rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ALERT_LABELS[a.alert_type] ?? a.alert_type}</p>
                        <p style={{ color: '#8B8FA8', fontSize: '0.75rem', margin: 0 }}>{fmtDate(a.triggered_at)}</p>
                      </div>
                      <span style={{ background: SEV_BG[a.severity], color: SEV_COLORS[a.severity], borderRadius: '100px', padding: '0.15rem 0.625rem', fontSize: '0.65rem', fontWeight: 700, flexShrink: 0, letterSpacing: '0.04em' }}>{a.severity}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* FLOATING ACTION BUTTON */}
        <Link href="/session" style={{ textDecoration: 'none', position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 50 }}>
          <button className="fab-btn" style={{ background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', color: '#fff', border: 'none', borderRadius: '100px', padding: '1rem 1.875rem', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 0 30px rgba(99,102,241,0.5)', animation: 'fab-pulse 2.5s ease-in-out infinite', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}>
            ▶ Nouvelle session
          </button>
        </Link>

      </div>
    </>
  )
}
