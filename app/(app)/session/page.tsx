'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useSession } from '@/hooks/useSession'
import { useDisciplineScore } from '@/hooks/useDisciplineScore'
import { useAlerts } from '@/hooks/useAlerts'
import { useSessionStore } from '@/store/sessionStore'
import type { TradeSide } from '@/lib/types'

const scoreColor = (s: number) => s >= 75 ? '#00D4AA' : s >= 50 ? '#EAB308' : '#FF4D6A'
const scoreGlow  = (s: number) => s >= 75 ? 'rgba(0,212,170,0.25)' : s >= 50 ? 'rgba(234,179,8,0.25)' : 'rgba(255,77,106,0.25)'
const scoreBg    = (s: number) => s >= 75 ? 'rgba(0,212,170,0.12)' : s >= 50 ? 'rgba(234,179,8,0.12)' : 'rgba(255,77,106,0.12)'
const scoreMsg   = (s: number) => s >= 75 ? '🔥 Excellent ! Tu trades avec discipline' : s >= 50 ? '⚠️ Attention, reste concentré' : '🛑 Stop. Fais une pause de 15 minutes'

const EMOTION_LABELS: Record<string, string> = {
  CALM: '😌 Calme', STRESSED: '😰 Stressé', FRUSTRATED: '😤 Frustré', FOMO: '🤑 FOMO',
}
const EMOTION_EMOJI: Record<string, string> = {
  CALM: '😌', STRESSED: '😰', FRUSTRATED: '😤', FOMO: '🤑',
}

function playBeep() {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain); gain.connect(ctx.destination)
    osc.frequency.value = 880
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6)
    osc.start(); osc.stop(ctx.currentTime + 0.6)
  } catch { /* browser may block */ }
}

const CSS =
  '@keyframes glow-pulse{0%,100%{opacity:0.6;transform:scale(1)}50%{opacity:1;transform:scale(1.18)}}' +
  '@keyframes slide-down{from{opacity:0;transform:translateY(-14px)}to{opacity:1;transform:translateY(0)}}' +
  '@keyframes trade-in{from{opacity:0;transform:translateX(-14px)}to{opacity:1;transform:translateX(0)}}' +
  '@keyframes crit-pulse{0%,100%{background:rgba(255,77,106,0.12)}50%{background:rgba(255,77,106,0.24)}}' +
  '@keyframes toast-in{from{opacity:0;transform:translateX(110%)}to{opacity:1;transform:translateX(0)}}' +
  '@keyframes fomo-blink{0%,100%{opacity:1}50%{opacity:0.55}}' +
  '.emo-btn:hover{border-color:#6366F1!important;background:rgba(99,102,241,0.1)!important}' +
  '.side-btn:hover{opacity:0.82!important}' +
  '.trade-new-btn:hover{opacity:0.88!important;transform:scale(1.015)!important}'

function ScoreRing({ score, size = 200 }: { score: number; size?: number }) {
  const R    = Math.round(size * 0.35)
  const CIRC = Math.round(2 * Math.PI * R)
  const dash = Math.round((score / 100) * CIRC)
  const col  = scoreColor(score)
  const cx   = size / 2
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: size, height: size, margin: '0 auto' }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: scoreGlow(score), filter: 'blur(28px)', animation: 'glow-pulse 2.5s ease-in-out infinite' }}/>
      <svg width={size} height={size} viewBox={'0 0 ' + size + ' ' + size} style={{ position: 'relative', zIndex: 1 }}>
        <circle cx={cx} cy={cx} r={R} fill="none" stroke="#1E2028" strokeWidth="10"/>
        <circle cx={cx} cy={cx} r={R} fill="none" stroke={col} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={dash + ' ' + (CIRC - dash)}
          transform={'rotate(-90 ' + cx + ' ' + cx + ')'}
          style={{ transition: 'stroke-dasharray 0.8s ease, stroke 0.5s ease' }}/>
        <text x={cx} y={cx - 6} textAnchor="middle" fill={col} fontSize={Math.round(size * 0.21)} fontWeight="800" fontFamily="ui-monospace,monospace">{score}</text>
        <text x={cx} y={cx + 18} textAnchor="middle" fill="#8B8FA8" fontSize={Math.round(size * 0.09)}>/100</text>
      </svg>
    </div>
  )
}

function SessionTimer({ startedAt }: { startedAt: string }) {
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    const tick = () => setElapsed(Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000))
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id)
  }, [startedAt])
  const h = Math.floor(elapsed / 3600)
  const m = Math.floor((elapsed % 3600) / 60)
  const s = elapsed % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    <span style={{ fontFamily: 'ui-monospace,monospace', fontSize: '1.375rem', fontWeight: 700, color: '#fff', letterSpacing: '0.05em' }}>
      {pad(h) + ':' + pad(m) + ':' + pad(s)}
    </span>
  )
}

export default function SessionPage() {
  const supabase = createClient()
  const [userId, setUserId] = useState<string | undefined>()

  // Checklist modal state
  const [checklistOpen, setChecklistOpen] = useState(false)
  const [step, setStep]                   = useState(1)
  const [planRespected, setPlanRespected] = useState<boolean | null>(null)
  const [emotion, setEmotion]             = useState<'CALM'|'STRESSED'|'FRUSTRATED'|'FOMO'>('CALM')
  const [lotSize, setLotSize]             = useState('')

  // Trade form state (shown after checklist)
  const [tradeFormOpen, setTradeFormOpen] = useState(false)
  const [symbol, setSymbol]               = useState('')
  const [side, setSide]                   = useState<TradeSide>('LONG')
  const [openPrice, setOpenPrice]         = useState('')
  const [stopLoss, setStopLoss]           = useState('')
  const [takeProfit, setTakeProfit]       = useState('')

  // FOMO lockout
  const [fomoUntil, setFomoUntil]         = useState<number | null>(null)
  const [fomoRemaining, setFomoRemaining] = useState(0)

  // End session modal
  const [showEndModal, setShowEndModal]   = useState(false)
  const [ending, setEnding]               = useState(false)

  // INFO toasts (auto-dismiss)
  const [toasts, setToasts]               = useState<{ id: number; message: string }[]>([])
  const toastIdRef                        = useRef(0)

  const { currentSession, trades, startSession } = useSession(userId)
  const { calculate, persistScore }              = useDisciplineScore()
  useAlerts()

  const {
    currentScore, setCurrentScore,
    addTrade, addScore, setChecklist,
    alerts, checklists, scores,
    setCurrentSession,
  } = useSessionStore()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id)
    })
  }, [supabase])

  useEffect(() => {
    if (userId && !currentSession) startSession().catch(() => {})
  }, [userId, currentSession, startSession])

  // FOMO countdown ticker
  useEffect(() => {
    if (!fomoUntil) return
    const id = setInterval(() => {
      const rem = Math.ceil((fomoUntil - Date.now()) / 1000)
      if (rem <= 0) { setFomoUntil(null); setFomoRemaining(0) }
      else setFomoRemaining(rem)
    }, 1000)
    return () => clearInterval(id)
  }, [fomoUntil])

  // Beep on new CRITICAL alerts
  const prevCritRef = useRef(0)
  useEffect(() => {
    const crits = alerts.filter(a => a.severity === 'CRITICAL').length
    if (crits > prevCritRef.current) playBeep()
    prevCritRef.current = crits
  }, [alerts])

  // Toast on new INFO alerts
  const prevInfoRef = useRef(0)
  useEffect(() => {
    const infos = alerts.filter(a => a.severity === 'INFO')
    if (infos.length > prevInfoRef.current) {
      const info = infos[infos.length - 1]
      const id = ++toastIdRef.current
      setToasts(t => [...t, { id, message: info.message }])
      setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 5000)
    }
    prevInfoRef.current = infos.length
  }, [alerts])

  // ── handlers ──────────────────────────────────────────────────────────────
  const openChecklist = () => {
    if (fomoUntil && Date.now() < fomoUntil) return
    setStep(1); setPlanRespected(null); setEmotion('CALM'); setLotSize('')
    setChecklistOpen(true)
  }

  const handleChecklistNext = () => {
    if (step === 2 && emotion === 'FOMO') {
      setFomoUntil(Date.now() + 5 * 60 * 1000)
      setFomoRemaining(300)
      setChecklistOpen(false)
      return
    }
    if (step < 3) { setStep(s => s + 1); return }
    setChecklistOpen(false)
    setSymbol(''); setSide('LONG'); setOpenPrice(''); setStopLoss(''); setTakeProfit('')
    setTradeFormOpen(true)
  }

  const handleTradeSubmit = async () => {
    if (!userId || !currentSession) return
    const lot   = parseFloat(lotSize)
    const price = parseFloat(openPrice)
    if (!symbol || isNaN(lot) || isNaN(price)) return

    const { data: trade, error } = await supabase
      .from('trades')
      .insert({
        session_id:  currentSession.session_id,
        user_id:     userId,
        symbol:      symbol.trim().toUpperCase(),
        side,
        lot_size:    lot,
        open_price:  price,
        stop_loss:   stopLoss   ? parseFloat(stopLoss)   : null,
        take_profit: takeProfit ? parseFloat(takeProfit) : null,
        status:      'open',
      })
      .select()
      .single()

    if (error || !trade) return
    addTrade(trade)

    const checklistData = {
      plan_respected:   planRespected ?? true,
      setup_identified: true,
      emotional_state:  emotion,
      created_at:       new Date().toISOString(),
    }

    const { data: cl } = await supabase
      .from('checklists')
      .insert({
        trade_id:         trade.trade_id,
        user_id:          userId,
        plan_respected:   checklistData.plan_respected,
        setup_identified: true,
        emotional_state:  emotion,
      })
      .select().single()

    if (cl) setChecklist(trade.trade_id, cl)

    const score = await calculate(checklistData, trade, userId)
    setCurrentScore(score)
    await persistScore(currentSession.session_id, trade.trade_id, userId, score)

    addScore({
      score_id: '', session_id: currentSession.session_id,
      trade_id: trade.trade_id, user_id: userId,
      plan_score: score.plan_score, risk_score: score.risk_score,
      emotion_score: score.emotion_score, post_loss_score: score.post_loss_score,
      total_score: score.total_score, color: score.color,
      computed_at: new Date().toISOString(),
    })

    const newAvg = ((currentSession.avg_score * trades.length) + score.total_score) / (trades.length + 1)
    await supabase.from('sessions')
      .update({ total_trades: trades.length + 1, avg_score: newAvg })
      .eq('session_id', currentSession.session_id)
    setCurrentSession({ ...currentSession, total_trades: trades.length + 1, avg_score: newAvg })
    setTradeFormOpen(false)
  }

  const handleEndSession = async () => {
    if (!currentSession || ending) return
    setEnding(true)
    await supabase.from('sessions')
      .update({ status: 'ended', ended_at: new Date().toISOString() })
      .eq('session_id', currentSession.session_id)
    window.location.href = '/dashboard'
  }

  // ── computed ───────────────────────────────────────────────────────────────
  const displayScore  = Math.round(currentScore?.total_score ?? 100)
  const scoresByTrade: Record<string, { total: number }> = {}
  for (const sc of scores) {
    if (sc.trade_id) scoresByTrade[sc.trade_id] = { total: sc.total_score }
  }
  const goodTrades = scores.filter(s => s.total_score >= 75).length
  const winRate    = scores.length > 0 ? Math.round((goodTrades / scores.length) * 100) : 0
  let streak = 0
  for (let i = scores.length - 1; i >= 0; i--) {
    if (scores[i].total_score >= 75) streak++; else break
  }
  const critAlerts = alerts.filter(a => a.severity === 'CRITICAL')
  const warnAlerts = alerts.filter(a => a.severity === 'WARNING')
  const fomoLocked = fomoUntil !== null && Date.now() < fomoUntil
  const startedAt  = currentSession?.started_at ?? new Date().toISOString()
  const finalScore = Math.round(currentSession?.avg_score ?? displayScore)

  return (
    <>
      <style>{CSS}</style>
      <div style={{ background: '#0A0A0A', minHeight: '100vh', fontFamily: 'Inter,system-ui,sans-serif', color: '#fff', paddingBottom: '2rem' }}>

        {/* CRITICAL ALERTS – dramatic full-width pulsing banners */}
        {critAlerts.map((a, i) => (
          <div key={i} style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '2px solid #FF4D6A', animation: 'crit-pulse 1.5s ease-in-out infinite' }}>
            <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>🚨</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 700, color: '#FF4D6A', margin: '0 0 0.125rem', fontSize: '0.9375rem' }}>ALERTE CRITIQUE</p>
              <p style={{ color: '#FCA5A5', fontSize: '0.875rem', margin: 0 }}>{a.message}</p>
            </div>
          </div>
        ))}

        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem' }}>

          {/* SESSION HEADER – live stats bar */}
          <div style={{ background: '#111111', border: '1px solid #1E2028', borderRadius: '20px', padding: '1.25rem 2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div>
              <p style={{ color: '#8B8FA8', fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 0.25rem' }}>Durée</p>
              <SessionTimer startedAt={startedAt} />
            </div>
            {[
              { label: 'Trades', val: String(trades.length), sub: 'cette session' },
              { label: 'Win rate', val: winRate + '%', sub: goodTrades + '/' + scores.length },
              { label: 'Streak', val: streak > 0 ? '🔥 ' + streak : '—', sub: streak > 0 ? 'disciplinés' : 'aucun' },
            ].map(st => (
              <div key={st.label}>
                <p style={{ color: '#8B8FA8', fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 0.25rem' }}>{st.label}</p>
                <p style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.125rem', fontFamily: 'ui-monospace,monospace' }}>{st.val}</p>
                <p style={{ color: '#8B8FA8', fontSize: '0.7rem', margin: 0 }}>{st.sub}</p>
              </div>
            ))}
            <button onClick={() => setShowEndModal(true)} style={{ background: 'rgba(255,77,106,0.12)', border: '1px solid rgba(255,77,106,0.35)', color: '#FF4D6A', borderRadius: '10px', padding: '0.625rem 1.25rem', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              ⏹ Terminer la session
            </button>
          </div>

          {/* MAIN LAYOUT: score left / trades right */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', alignItems: 'start' }}>

            {/* LEFT – Emotional score display */}
            <div style={{ background: '#111111', border: '1px solid #1E2028', borderRadius: '20px', padding: '2rem', textAlign: 'center', position: 'sticky', top: '1rem' }}>
              <ScoreRing score={displayScore} />
              <p style={{ color: scoreColor(displayScore), fontSize: '0.9375rem', fontWeight: 600, margin: '1.25rem 0 1.5rem', lineHeight: 1.5 }}>
                {scoreMsg(displayScore)}
              </p>
              {currentScore && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem' }}>
                  {[
                    { label: 'Plan',       val: currentScore.plan_score },
                    { label: 'Risk',       val: currentScore.risk_score },
                    { label: 'Émotion',    val: currentScore.emotion_score },
                    { label: 'Post-perte', val: currentScore.post_loss_score },
                  ].map(({ label, val }) => (
                    <div key={label} style={{ background: '#0A0A0A', borderRadius: '10px', padding: '0.75rem', border: '1px solid #1E2028', textAlign: 'left' }}>
                      <p style={{ color: '#8B8FA8', fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.25rem' }}>{label}</p>
                      <p style={{ color: scoreColor(val), fontSize: '1.125rem', fontWeight: 800, margin: 0, fontFamily: 'ui-monospace,monospace' }}>{Math.round(val)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT – Action area */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              {/* WARNING banners – slide in from top */}
              {warnAlerts.map((a, i) => (
                <div key={i} style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.3)', borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', animation: 'slide-down 0.3s ease' }}>
                  <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>⚠️</span>
                  <p style={{ color: '#FDE68A', fontSize: '0.875rem', margin: 0, lineHeight: 1.5 }}>{a.message}</p>
                </div>
              ))}

              {/* FOMO lockout screen OR new trade button */}
              {fomoLocked ? (
                <div style={{ background: 'rgba(99,102,241,0.08)', border: '2px solid rgba(99,102,241,0.3)', borderRadius: '20px', padding: '3rem 2rem', textAlign: 'center', animation: 'fomo-blink 2s ease-in-out infinite' }}>
                  <p style={{ fontSize: '3rem', margin: '0 0 0.75rem' }}>🤑</p>
                  <p style={{ color: '#A5B4FC', fontWeight: 700, fontSize: '1.125rem', margin: '0 0 0.5rem' }}>Détox FOMO en cours</p>
                  <p style={{ color: '#8B8FA8', fontSize: '0.9rem', margin: '0 0 1.5rem', lineHeight: 1.6 }}>Respire. Observe le marché sans toucher.</p>
                  <p style={{ fontFamily: 'ui-monospace,monospace', fontSize: '3rem', fontWeight: 800, color: '#6366F1', margin: 0, letterSpacing: '0.05em' }}>
                    {String(Math.floor(fomoRemaining / 60)).padStart(2, '0') + ':' + String(fomoRemaining % 60).padStart(2, '0')}
                  </p>
                </div>
              ) : (
                <button className="trade-new-btn" onClick={openChecklist} style={{ background: '#fff', color: '#0A0A0A', border: 'none', borderRadius: '16px', padding: '1.625rem 2rem', fontSize: '1.125rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', boxShadow: '0 4px 24px rgba(0,0,0,0.3)', transition: 'opacity 0.2s,transform 0.15s', width: '100%' }}>
                  <span style={{ fontSize: '1.375rem' }}>📋</span>
                  Nouveau Trade
                </button>
              )}

              {/* TRADE LIST */}
              <div style={{ background: '#111111', border: '1px solid #1E2028', borderRadius: '20px', padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Trades de la session</h3>
                  <span style={{ background: 'rgba(99,102,241,0.12)', color: '#A5B4FC', borderRadius: '100px', padding: '0.1rem 0.5rem', fontSize: '0.75rem', fontWeight: 700 }}>{trades.length}</span>
                </div>
                {trades.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                    <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.75rem' }}>📈</span>
                    <p style={{ color: '#8B8FA8', fontSize: '0.875rem', margin: 0 }}>Lance ton premier trade avec discipline</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                    {[...trades].reverse().map((t) => {
                      const sc  = scoresByTrade[t.trade_id]
                      const cl  = checklists[t.trade_id]
                      const col = sc ? scoreColor(sc.total) : '#8B8FA8'
                      return (
                        <div key={t.trade_id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem 1rem', background: '#0A0A0A', borderRadius: '12px', border: '1px solid #1E2028', borderLeft: '3px solid ' + col, animation: 'trade-in 0.3s ease' }}>
                          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0, flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: 800, fontSize: '0.9375rem', color: '#E5E7EB' }}>{t.symbol}</span>
                            <span style={{ background: t.side === 'LONG' ? 'rgba(0,212,170,0.12)' : 'rgba(255,77,106,0.12)', color: t.side === 'LONG' ? '#00D4AA' : '#FF4D6A', border: '1px solid ' + (t.side === 'LONG' ? 'rgba(0,212,170,0.3)' : 'rgba(255,77,106,0.3)'), borderRadius: '6px', padding: '0.1rem 0.5rem', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.06em', flexShrink: 0 }}>{t.side}</span>
                            <span style={{ color: '#8B8FA8', fontSize: '0.8125rem', flexShrink: 0 }}>x{t.lot_size}</span>
                            {cl && <span style={{ fontSize: '1.125rem', flexShrink: 0 }}>{EMOTION_EMOJI[cl.emotional_state] ?? ''}</span>}
                          </div>
                          {sc && (
                            <div style={{ background: scoreBg(sc.total), border: '1px solid ' + col + '55', borderRadius: '8px', padding: '0.25rem 0.625rem', fontSize: '0.875rem', fontWeight: 700, color: col, fontFamily: 'ui-monospace,monospace', flexShrink: 0 }}>
                              {Math.round(sc.total)}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* INFO TOASTS – bottom right, auto-dismiss 5s */}
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 100, display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-end', pointerEvents: 'none' }}>
          {toasts.map(toast => (
            <div key={toast.id} style={{ background: 'rgba(99,102,241,0.18)', border: '1px solid rgba(99,102,241,0.4)', borderRadius: '12px', padding: '0.875rem 1.125rem', maxWidth: '320px', animation: 'toast-in 0.3s ease', backdropFilter: 'blur(12px)', pointerEvents: 'auto' }}>
              <p style={{ color: '#A5B4FC', fontSize: '0.875rem', margin: 0, lineHeight: 1.5 }}>ℹ️ {toast.message}</p>
            </div>
          ))}
        </div>

        {/* PRE-TRADE CHECKLIST MODAL */}
        {checklistOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
            <div style={{ background: '#111111', border: '1px solid #2A2D3A', borderRadius: '24px', padding: '2.5rem', width: '100%', maxWidth: '480px' }}>

              {/* Step indicator */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                {[1, 2, 3].map((n, idx) => (
                  <div key={n} style={{ display: 'flex', alignItems: 'center', flex: idx < 2 ? 1 : 0 }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8125rem', fontWeight: 700, flexShrink: 0, background: step >= n ? 'linear-gradient(135deg,#6366F1,#8B5CF6)' : '#1F1F1F', color: step >= n ? '#fff' : '#8B8FA8', transition: 'all 0.3s' }}>{n}</div>
                    {idx < 2 && <div style={{ flex: 1, height: '2px', background: step > n ? '#6366F1' : '#1F1F1F', margin: '0 0.5rem', transition: 'background 0.3s' }}/>}
                  </div>
                ))}
              </div>

              {/* Step 1: As-tu un plan ? */}
              {step === 1 && (
                <div style={{ animation: 'slide-down 0.2s ease' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.5rem' }}>As-tu un plan clair ?</h3>
                  <p style={{ color: '#8B8FA8', fontSize: '0.875rem', margin: '0 0 1.5rem', lineHeight: 1.6 }}>Entrée, sortie et risque définis avant d&apos;entrer dans le trade ?</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    {([{ val: true, label: '✅ Oui', col: '#00D4AA' }, { val: false, label: '❌ Non', col: '#FF4D6A' }] as { val: boolean; label: string; col: string }[]).map(opt => (
                      <button key={String(opt.val)} onClick={() => setPlanRespected(opt.val)}
                        style={{ background: planRespected === opt.val ? (opt.val ? 'rgba(0,212,170,0.15)' : 'rgba(255,77,106,0.15)') : '#0A0A0A', border: '2px solid ' + (planRespected === opt.val ? opt.col : '#1F1F1F'), borderRadius: '12px', padding: '1.125rem', fontSize: '1.0625rem', fontWeight: 700, color: planRespected === opt.val ? opt.col : '#8B8FA8', cursor: 'pointer', transition: 'all 0.2s' }}>{opt.label}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: État émotionnel */}
              {step === 2 && (
                <div style={{ animation: 'slide-down 0.2s ease' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.5rem' }}>Quel est ton état émotionnel ?</h3>
                  <p style={{ color: '#8B8FA8', fontSize: '0.875rem', margin: '0 0 1.5rem', lineHeight: 1.6 }}>Sois honnête — ça impacte directement ton score discipline.</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    {(['CALM', 'STRESSED', 'FRUSTRATED', 'FOMO'] as const).map(e => (
                      <button key={e} className="emo-btn" onClick={() => setEmotion(e)}
                        style={{ background: emotion === e ? 'rgba(99,102,241,0.15)' : '#0A0A0A', border: '2px solid ' + (emotion === e ? '#6366F1' : '#1F1F1F'), borderRadius: '12px', padding: '0.9375rem', fontSize: '0.9375rem', fontWeight: 600, color: emotion === e ? '#A5B4FC' : '#8B8FA8', cursor: 'pointer', transition: 'all 0.15s' }}>{EMOTION_LABELS[e]}</button>
                    ))}
                  </div>
                  {emotion === 'FOMO' && (
                    <div style={{ marginTop: '1rem', background: 'rgba(255,77,106,0.08)', border: '1px solid rgba(255,77,106,0.3)', borderRadius: '10px', padding: '0.875rem', textAlign: 'center' }}>
                      <p style={{ color: '#FF4D6A', fontSize: '0.875rem', fontWeight: 600, margin: 0 }}>⚠️ Continuer va bloquer le trading pendant 5 minutes</p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Lot size */}
              {step === 3 && (
                <div style={{ animation: 'slide-down 0.2s ease' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.5rem' }}>Confirme ton lot size</h3>
                  <p style={{ color: '#8B8FA8', fontSize: '0.875rem', margin: '0 0 1.5rem', lineHeight: 1.6 }}>Respecte ton money management. Aucune exception.</p>
                  <input value={lotSize} onChange={e => setLotSize(e.target.value)} type="number" step="0.01" min="0.01" placeholder="0.10"
                    style={{ width: '100%', background: '#0A0A0A', border: '2px solid #1E2028', borderRadius: '12px', padding: '1.25rem', fontSize: '2.25rem', fontWeight: 700, color: '#fff', textAlign: 'center', outline: 'none', fontFamily: 'ui-monospace,monospace', boxSizing: 'border-box' }}/>
                  <p style={{ color: '#8B8FA8', fontSize: '0.8125rem', textAlign: 'center', margin: '0.5rem 0 0' }}>lots</p>
                </div>
              )}

              {/* Navigation */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem' }}>
                <button onClick={() => step > 1 ? setStep(s => s - 1) : setChecklistOpen(false)}
                  style={{ flex: 1, background: 'transparent', border: '1px solid #1E2028', borderRadius: '10px', padding: '0.875rem', color: '#8B8FA8', fontSize: '0.9375rem', fontWeight: 600, cursor: 'pointer' }}>
                  {step === 1 ? 'Annuler' : '← Retour'}
                </button>
                <button onClick={handleChecklistNext}
                  disabled={(step === 1 && planRespected === null) || (step === 3 && !lotSize)}
                  style={{ flex: 2, background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', border: 'none', borderRadius: '10px', padding: '0.875rem', color: '#fff', fontSize: '0.9375rem', fontWeight: 700, cursor: ((step === 1 && planRespected === null) || (step === 3 && !lotSize)) ? 'not-allowed' : 'pointer', opacity: ((step === 1 && planRespected === null) || (step === 3 && !lotSize)) ? 0.5 : 1 }}>
                  {step === 2 && emotion === 'FOMO' ? '🚫 Activer le blocage 5 min' : step === 3 ? '✓ Confirmer' : 'Suivant →'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TRADE FORM MODAL */}
        {tradeFormOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
            <div style={{ background: '#111111', border: '1px solid #2A2D3A', borderRadius: '24px', padding: '2.5rem', width: '100%', maxWidth: '480px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 1.5rem' }}>Détails du trade</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ color: '#8B8FA8', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.375rem' }}>Symbole</label>
                  <input value={symbol} onChange={e => setSymbol(e.target.value)} placeholder="EURUSD"
                    style={{ width: '100%', background: '#0A0A0A', border: '1px solid #1E2028', borderRadius: '10px', padding: '0.75rem 1rem', color: '#fff', fontSize: '1rem', fontWeight: 600, outline: 'none', boxSizing: 'border-box', textTransform: 'uppercase' }}/>
                </div>
                <div>
                  <label style={{ color: '#8B8FA8', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.375rem' }}>Direction</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    {(['LONG', 'SHORT'] as TradeSide[]).map(s => (
                      <button key={s} className="side-btn" onClick={() => setSide(s)}
                        style={{ background: side === s ? (s === 'LONG' ? 'rgba(0,212,170,0.15)' : 'rgba(255,77,106,0.15)') : '#0A0A0A', border: '2px solid ' + (side === s ? (s === 'LONG' ? '#00D4AA' : '#FF4D6A') : '#1F1F1F'), borderRadius: '10px', padding: '0.875rem', color: side === s ? (s === 'LONG' ? '#00D4AA' : '#FF4D6A') : '#8B8FA8', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}>
                        {s === 'LONG' ? '📈 LONG' : '📉 SHORT'}
                      </button>
                    ))}
                  </div>
                </div>
                {[
                  { label: "Prix d'entrée", val: openPrice, set: setOpenPrice, ph: '1.0850' },
                  { label: 'Stop Loss',     val: stopLoss,   set: setStopLoss,   ph: 'Optionnel' },
                  { label: 'Take Profit',   val: takeProfit, set: setTakeProfit, ph: 'Optionnel' },
                ].map(f => (
                  <div key={f.label}>
                    <label style={{ color: '#8B8FA8', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.375rem' }}>{f.label}</label>
                    <input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph} type="number" step="any"
                      style={{ width: '100%', background: '#0A0A0A', border: '1px solid #1E2028', borderRadius: '10px', padding: '0.75rem 1rem', color: '#fff', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }}/>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button onClick={() => setTradeFormOpen(false)} style={{ flex: 1, background: 'transparent', border: '1px solid #1E2028', borderRadius: '10px', padding: '0.875rem', color: '#8B8FA8', fontSize: '0.9375rem', fontWeight: 600, cursor: 'pointer' }}>Annuler</button>
                <button onClick={handleTradeSubmit} disabled={!symbol || !openPrice}
                  style={{ flex: 2, background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', border: 'none', borderRadius: '10px', padding: '0.875rem', color: '#fff', fontSize: '0.9375rem', fontWeight: 700, cursor: (!symbol || !openPrice) ? 'not-allowed' : 'pointer', opacity: (!symbol || !openPrice) ? 0.5 : 1 }}>
                  ✓ Enregistrer le trade
                </button>
              </div>
            </div>
          </div>
        )}

        {/* END SESSION MODAL */}
        {showEndModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
            <div style={{ background: '#111111', border: '1px solid #2A2D3A', borderRadius: '24px', padding: '3rem 2.5rem', width: '100%', maxWidth: '440px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.375rem' }}>Résumé de session</h3>
              <p style={{ color: '#8B8FA8', fontSize: '0.875rem', margin: '0 0 2rem' }}>Voici comment tu as tradé aujourd&apos;hui</p>

              <ScoreRing score={finalScore} size={160} />

              <p style={{ color: scoreColor(finalScore), fontWeight: 700, fontSize: '1rem', margin: '1.25rem 0 2rem', lineHeight: 1.5 }}>
                {scoreMsg(finalScore)}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem', marginBottom: '2rem' }}>
                {[
                  { label: 'Trades',      val: String(trades.length) },
                  { label: 'Win rate',    val: winRate + '%' },
                  { label: 'Score moyen', val: String(finalScore) },
                ].map(st => (
                  <div key={st.label} style={{ background: '#0A0A0A', borderRadius: '10px', padding: '0.875rem', border: '1px solid #1E2028' }}>
                    <p style={{ color: '#8B8FA8', fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.25rem' }}>{st.label}</p>
                    <p style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, fontFamily: 'ui-monospace,monospace' }}>{st.val}</p>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={() => setShowEndModal(false)} style={{ flex: 1, background: 'transparent', border: '1px solid #1E2028', borderRadius: '10px', padding: '0.875rem', color: '#8B8FA8', fontSize: '0.9375rem', fontWeight: 600, cursor: 'pointer' }}>Continuer</button>
                <button onClick={handleEndSession} disabled={ending}
                  style={{ flex: 2, background: 'rgba(255,77,106,0.12)', border: '2px solid rgba(255,77,106,0.4)', borderRadius: '10px', padding: '0.875rem', color: '#FF4D6A', fontSize: '0.9375rem', fontWeight: 700, cursor: ending ? 'not-allowed' : 'pointer', opacity: ending ? 0.6 : 1 }}>
                  {ending ? 'Fermeture...' : '⏹ Terminer la session'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  )
}
