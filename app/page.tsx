'use client'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const SCORES = [45,52,48,61,58,72,69,78,74,83]
const PTS = SCORES.map((v,i) => [Math.round(i*(560/9)+20), Math.round(130-v*1.2)].join(',')).join(' ')

const FAQS = [
  {q:"Fonctionne-t-il avec mon broker ?",a:"Oui. Discipline Tracker est independant de votre broker. Vous saisissez vos trades manuellement, ce qui renforce la prise de conscience de chaque decision."},
  {q:"Comment le score est-il calcule ?",a:"Le score (0-100) est calcule en temps reel : respect du plan, etat emotionnel pre-trade, niveaux SL/TP, et alertes comportementales."},
  {q:"Mes donnees sont-elles securisees ?",a:"Toutes vos donnees sont chiffrees et stockees sur Supabase (PostgreSQL). Elles ne sont jamais partagees avec des tiers."},
  {q:"Comment fonctionne le FOMO Lock ?",a:"Quand une alerte CRITICAL est detectee (FOMO ou FRUSTRATED), un verrou de 5 minutes empeche l'ouverture de nouveaux trades."},
]

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.4, 0.25, 1] } } }
const stagger = { visible: { transition: { staggerChildren: 0.12 } } }

function Section({ children, className, style, id }: { children: React.ReactNode; className?: string; style?: React.CSSProperties; id?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.section ref={ref} id={id} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={stagger} className={className} style={style}>
      {children}
    </motion.section>
  )
}

export default function LandingPage() {
  const [scoreDisplay, setScoreDisplay] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const chartRef = useRef<SVGPolylineElement>(null)
  const chartInView = useInView(useRef(null), { once: true })

  useEffect(() => {
    let cur = 0
    const t = setInterval(() => { cur = Math.min(cur + 2, 78); setScoreDisplay(cur); if (cur >= 78) clearInterval(t) }, 25)
    return () => clearInterval(t)
  }, [])

  const R = 44, CIRC = 2 * Math.PI * R

  return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh', fontFamily: "'Sora',system-ui,sans-serif", color: '#fff', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        .nav-a:hover{color:#fff!important}
        .cta-main:hover{background:#00BF96!important;transform:translateY(-2px)!important;box-shadow:0 8px 32px rgba(0,212,170,0.3)!important}
        .cta-ghost:hover{background:rgba(255,255,255,0.06)!important;border-color:#333!important}
        .feat-glass:hover{border-color:#333!important;background:rgba(255,255,255,0.04)!important;transform:translateY(-4px)!important}
        .price-card:hover{transform:translateY(-6px)!important;box-shadow:0 20px 60px rgba(0,0,0,0.5)!important}
        .faq-item summary{cursor:pointer;list-style:none}
        .faq-item summary::-webkit-details-marker{display:none}
        .faq-item[open] .faq-arrow{transform:rotate(45deg)}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes pulse-glow{0%,100%{box-shadow:0 0 20px rgba(0,212,170,0.15)}50%{box-shadow:0 0 40px rgba(0,212,170,0.3)}}
        @keyframes ring-draw{from{stroke-dashoffset:276}to{stroke-dashoffset:61}}
        @keyframes line-draw{from{stroke-dashoffset:900}to{stroke-dashoffset:0}}
        @keyframes pts-pop{0%,20%{opacity:0;transform:translateY(8px) scale(0.9)}35%,70%{opacity:1;transform:translateY(0) scale(1)}85%,100%{opacity:0;transform:translateY(-6px) scale(0.9)}}
        .ring-anim{stroke-dasharray:276;stroke-dashoffset:276;animation:ring-draw 2s cubic-bezier(.4,0,.2,1) 0.5s forwards}
        .chart-draw{stroke-dasharray:900;stroke-dashoffset:900;animation:line-draw 2.5s ease-out forwards}
        .video-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,10,10,0.85) 0%,rgba(10,10,10,0.95) 100%);z-index:1}
      `}</style>

      {/* NAVBAR */}
      <header style={{ position: 'sticky', top: 0, background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid #1A1A1A', zIndex: 100 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', height: '64px', display: 'flex', alignItems: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.625rem', flexShrink: 0 }}>
            <div style={{ width: '34px', height: '34px', background: '#00D4AA', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', color: '#0A0A0A' }}>DT</div>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.02em' }}>Discipline Tracker</span>
          </Link>
          <nav style={{ display: 'flex', gap: '0.25rem', flex: 1, justifyContent: 'center' }}>
            {[['#features','Features'],['#performance','Performance'],['#pricing','Pricing'],['#faq','FAQ']].map(([href,label]) => (
              <a key={href} href={href} className="nav-a" style={{ textDecoration: 'none', color: '#666', fontSize: '0.875rem', padding: '0.375rem 0.875rem', borderRadius: '8px', transition: 'color 0.2s', fontWeight: 400 }}>{label}</a>
            ))}
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link href="/login" className="nav-a" style={{ textDecoration: 'none', color: '#888', fontSize: '0.875rem', fontWeight: 500, transition: 'color 0.2s' }}>Connexion</Link>
            <Link href="/signup" className="cta-main" style={{ textDecoration: 'none', background: '#00D4AA', color: '#0A0A0A', fontWeight: 600, fontSize: '0.875rem', padding: '0.5rem 1.25rem', borderRadius: '10px', transition: 'all 0.2s', display: 'inline-block' }}>Commencer</Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section style={{ position: 'relative', minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <video autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, opacity: 0.15 }}
          src="https://videos.pexels.com/video-files/7579975/7579975-uhd_2560_1440_30fps.mp4"
          poster="" />
        <div className="video-overlay" />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '900px', padding: '4rem 2rem', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.2)', borderRadius: '100px', padding: '0.35rem 1rem', marginBottom: '2rem', fontSize: '0.8125rem', color: '#00D4AA' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00D4AA' }}></span>
            Beta disponible
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }}
            style={{ fontSize: 'clamp(2.5rem,5.5vw,4rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.04em', marginBottom: '1.5rem' }}>
            Tradez avec discipline.<br/><span style={{ color: '#444' }}>Pas avec vos emotions.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
            style={{ fontSize: '1.1875rem', color: '#666', lineHeight: 1.65, maxWidth: '560px', margin: '0 auto 2.5rem', fontWeight: 300 }}>
            Score en temps reel, FOMO lockout, pre-trade checklist, coaching IA — tout pour trader comme un professionnel.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.45 }}
            style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '4rem' }}>
            <Link href="/signup" className="cta-main" style={{ textDecoration: 'none', background: '#00D4AA', color: '#0A0A0A', fontWeight: 700, fontSize: '1.0625rem', padding: '1rem 2.25rem', borderRadius: '12px', transition: 'all 0.2s', display: 'inline-block', boxShadow: '0 4px 24px rgba(0,212,170,0.2)' }}>Commencer gratuitement</Link>
            <a href="#features" className="cta-ghost" style={{ textDecoration: 'none', color: '#888', fontWeight: 500, fontSize: '1.0625rem', padding: '1rem 2.25rem', borderRadius: '12px', border: '1px solid #222', transition: 'all 0.2s', display: 'inline-block' }}>Voir les features</a>
          </motion.div>
          {/* Score ring widget */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.6 }}
            style={{ display: 'flex', justifyContent: 'center', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ animation: 'float 4s ease-in-out infinite, pulse-glow 3s ease-in-out infinite', background: 'rgba(17,17,17,0.8)', backdropFilter: 'blur(20px)', border: '1px solid #1F1F1F', borderRadius: '24px', padding: '2rem 2.5rem', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <svg width="110" height="110" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r={R} fill="none" stroke="#1A1A1A" strokeWidth="7"/>
                <circle cx="50" cy="50" r={R} fill="none" stroke="url(#hero-ring-g)" strokeWidth="7" className="ring-anim" strokeLinecap="round" transform="rotate(-90 50 50)"/>
                <defs><linearGradient id="hero-ring-g" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#00D4AA"/><stop offset="1" stopColor="#6366F1"/></linearGradient></defs>
                <text x="50" y="56" textAnchor="middle" fill="#fff" fontSize="22" fontWeight="800" fontFamily="Sora,sans-serif">{scoreDisplay}</text>
              </svg>
              <p style={{ color: '#666', fontSize: '0.8125rem', fontWeight: 400, margin: 0 }}>Score de discipline</p>
              <div style={{ display: 'flex', gap: '0.375rem' }}>
                {['CALM','PLAN OK','4 trades'].map(t => (
                  <span key={t} style={{ background: 'rgba(0,212,170,0.06)', border: '1px solid rgba(0,212,170,0.15)', borderRadius: '6px', padding: '0.175rem 0.5rem', fontSize: '0.68rem', color: '#00D4AA' }}>{t}</span>
                ))}
              </div>
            </div>
            <div style={{ animation: 'pts-pop 5s ease-in-out 2s infinite', opacity: 0, background: 'rgba(17,17,17,0.9)', backdropFilter: 'blur(12px)', border: '1px solid #1F1F1F', borderRadius: '14px', padding: '0.875rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.625rem', alignSelf: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#00D4AA" strokeWidth="2.5" strokeLinecap="round"/></svg>
              <div>
                <p style={{ color: '#fff', fontSize: '0.9375rem', fontWeight: 600, margin: 0 }}>+12 pts</p>
                <p style={{ color: '#555', fontSize: '0.75rem', margin: 0 }}>Plan respecte</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <Section id="features" style={{ maxWidth: '1200px', margin: '0 auto', padding: '6rem 2rem' }}>
        <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <p style={{ color: '#00D4AA', fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Features</p>
          <h2 style={{ fontSize: 'clamp(1.875rem,3.5vw,2.75rem)', fontWeight: 700, letterSpacing: '-0.03em' }}>Tout ce dont vous avez besoin</h2>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: '1.25rem' }}>
          {[
            { icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="11" stroke="#1F1F1F" strokeWidth="2"/><circle cx="16" cy="16" r="11" stroke="url(#f1)" strokeWidth="2" strokeLinecap="round" strokeDasharray="52 18" transform="rotate(-90 16 16)"/><defs><linearGradient id="f1"><stop stopColor="#00D4AA"/><stop offset="1" stopColor="#6366F1"/></linearGradient></defs></svg>, title:'Score en temps reel', desc:"Chaque decision evaluee instantanement. Score 0-100 refletant votre discipline sur la session." },
            { icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="7" y="15" width="18" height="12" rx="2.5" stroke="#666" strokeWidth="1.8"/><path d="M11 15v-4a5 5 0 0110 0v4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/><circle cx="16" cy="21" r="2" fill="#00D4AA"/></svg>, title:'FOMO Lockout', desc:"Detection automatique des etats FOMO et FRUSTRATED. Verrou de 5 minutes sur les nouveaux trades." },
            { icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="8" y="6" width="16" height="20" rx="2" stroke="#666" strokeWidth="1.8"/><path d="M12 4h8v3a1 1 0 01-1 1h-6a1 1 0 01-1-1V4z" stroke="#fff" strokeWidth="1.5"/><path d="M11 16l3 3 6-6" stroke="#00D4AA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>, title:'Pre-trade Checklist', desc:"Plan, emotion, lot size — validation obligatoire en 3 etapes avant chaque trade." },
            { icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M16 6a8 8 0 018 8v5l2 3H6l2-3v-5a8 8 0 018-8z" stroke="#666" strokeWidth="1.8" strokeLinejoin="round"/><path d="M13 25a3 3 0 006 0" stroke="#fff" strokeWidth="1.8"/><circle cx="22" cy="9" r="3.5" fill="#FF4D6A"/></svg>, title:'Alertes comportementales', desc:"Alertes CRITICAL, WARNING et INFO calibrees pour vous proteger au bon moment." },
            { icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="5" y="20" width="5" height="7" rx="1" fill="#333"/><rect x="13" y="15" width="5" height="12" rx="1" fill="#666"/><rect x="21" y="9" width="5" height="18" rx="1" fill="#fff"/></svg>, title:'Historique & analyses', desc:"Visualisez votre progression sur 7, 30 ou 90 jours. Identifiez vos patterns." },
            { icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M16 5L18 10L23 11L19.5 14.5L20.5 19.5L16 17L11.5 19.5L12.5 14.5L9 11L14 10L16 5Z" stroke="#6366F1" strokeWidth="1.8" strokeLinejoin="round"/><path d="M8 24l3-2M24 24l-3-2M16 26v-3" stroke="#444" strokeWidth="1.5" strokeLinecap="round"/></svg>, title:'Coach IA', desc:"Journal IA avec analyse coaching personnalisee par Claude apres chaque session." },
          ].map((f, i) => (
            <motion.div key={i} variants={fadeUp} className="feat-glass"
              style={{ background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(12px)', border: '1px solid #1A1A1A', borderRadius: '16px', padding: '2rem', transition: 'all 0.3s', cursor: 'default' }}>
              <div style={{ marginBottom: '1.25rem', width: '48px', height: '48px', background: 'rgba(0,212,170,0.06)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{f.icon}</div>
              <h3 style={{ fontWeight: 600, fontSize: '1.0625rem', marginBottom: '0.5rem', letterSpacing: '-0.01em' }}>{f.title}</h3>
              <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: 1.65 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* PERFORMANCE CHART */}
      <Section id="performance" style={{ maxWidth: '1000px', margin: '0 auto', padding: '4rem 2rem 6rem' }}>
        <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <p style={{ color: '#6366F1', fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Performance</p>
          <h2 style={{ fontSize: 'clamp(1.875rem,3.5vw,2.75rem)', fontWeight: 700, letterSpacing: '-0.03em' }}>Votre discipline, visualisee en temps reel</h2>
        </motion.div>
        <motion.div variants={fadeUp} style={{ background: 'rgba(17,17,17,0.6)', backdropFilter: 'blur(16px)', border: '1px solid #1A1A1A', borderRadius: '20px', padding: '2.5rem', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <p style={{ color: '#fff', fontWeight: 600, fontSize: '1rem', margin: '0 0 0.25rem' }}>Score de discipline — 10 sessions</p>
              <p style={{ color: '#444', fontSize: '0.8125rem', margin: 0 }}>Tendance : +38 pts</p>
            </div>
            <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.8125rem' }}>
              <span style={{ color: '#FF4D6A', display: 'flex', alignItems: 'center', gap: '0.375rem' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FF4D6A', display: 'inline-block' }}></span> Debutant</span>
              <span style={{ color: '#FFB800', display: 'flex', alignItems: 'center', gap: '0.375rem' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FFB800', display: 'inline-block' }}></span> Progressif</span>
              <span style={{ color: '#00D4AA', display: 'flex', alignItems: 'center', gap: '0.375rem' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00D4AA', display: 'inline-block' }}></span> Expert</span>
            </div>
          </div>
          <svg width="100%" viewBox="0 0 600 150" preserveAspectRatio="xMidYMid meet" style={{ overflow: 'visible' }}>
            <defs>
              <linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#FF4D6A"/><stop offset="50%" stopColor="#FFB800"/><stop offset="100%" stopColor="#00D4AA"/></linearGradient>
              <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00D4AA" stopOpacity="0.1"/><stop offset="100%" stopColor="#00D4AA" stopOpacity="0"/></linearGradient>
            </defs>
            {[25,50,75,100].map(v => (<line key={v} x1="20" y1={130-v*1.2} x2="580" y2={130-v*1.2} stroke="#1A1A1A" strokeWidth="1"/>))}
            {[25,50,75,100].map(v => (<text key={v} x="6" y={130-v*1.2+4} fill="#333" fontSize="8" fontFamily="Sora,sans-serif">{v}</text>))}
            <polyline points={PTS + ' 580,140 20,140'} fill="url(#ag)" stroke="none"/>
            <polyline className="chart-draw" points={PTS} fill="none" stroke="url(#lg)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            {SCORES.map((v,i) => (
              <circle key={i} cx={Math.round(i*(560/9)+20)} cy={Math.round(130-v*1.2)} r="5"
                fill={v>=75?'#00D4AA':v>=50?'#FFB800':'#FF4D6A'} stroke="#111" strokeWidth="2.5"
                style={{ opacity: 0, animation: 'fadeInUp 0.4s ease ' + (0.3+i*0.18) + 's forwards' }}/>
            ))}
          </svg>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 20px 0' }}>
            {SCORES.map((_,i) => (<span key={i} style={{ color: '#333', fontSize: '0.7rem', fontFamily: 'monospace' }}>S{i+1}</span>))}
          </div>
        </motion.div>
      </Section>

      {/* HOW IT WORKS */}
      <Section style={{ maxWidth: '700px', margin: '0 auto', padding: '5rem 2rem' }}>
        <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ color: '#00D4AA', fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Comment ca marche</p>
          <h2 style={{ fontSize: 'clamp(1.875rem,3.5vw,2.75rem)', fontWeight: 700, letterSpacing: '-0.03em' }}>Simple. Efficace. Immediat.</h2>
        </motion.div>
        {[
          {n:'01', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 12h18M12 3v18" stroke="#00D4AA" strokeWidth="2" strokeLinecap="round"/></svg>, title:'Ouvrez une session', desc:"Demarrez votre journee de trading. Timer et score s'initialisent automatiquement."},
          {n:'02', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4" stroke="#00D4AA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="3" y="5" width="18" height="14" rx="3" stroke="#666" strokeWidth="1.5"/></svg>, title:'Validez chaque trade', desc:"Checklist pre-trade en 3 etapes : plan, emotion, lot size. Obligatoire."},
          {n:'03', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 20l5-5 4 4 9-11" stroke="#00D4AA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>, title:'Analysez et progressez', desc:"Score final, historique, coaching IA — tout pour progresser durablement."},
        ].map((s,i) => (
          <motion.div key={i} variants={fadeUp} style={{ display: 'flex', gap: '1.5rem', padding: '2rem 0', borderBottom: i < 2 ? '1px solid #1A1A1A' : 'none', alignItems: 'flex-start' }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{ width: '48px', height: '48px', background: 'rgba(0,212,170,0.06)', border: '1px solid rgba(0,212,170,0.15)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.icon}</div>
              {i < 2 && <div style={{ position: 'absolute', left: '50%', top: '56px', width: '1px', height: 'calc(100% - 8px)', background: 'linear-gradient(to bottom, rgba(0,212,170,0.3), transparent)' }}/>}
            </div>
            <div>
              <span style={{ color: '#333', fontSize: '0.75rem', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.05em' }}>{s.n}</span>
              <h3 style={{ color: '#fff', fontWeight: 600, fontSize: '1.125rem', margin: '0.25rem 0 0.5rem', letterSpacing: '-0.01em' }}>{s.title}</h3>
              <p style={{ color: '#666', fontSize: '0.9375rem', lineHeight: 1.65 }}>{s.desc}</p>
            </div>
          </motion.div>
        ))}
      </Section>

      {/* PRICING */}
      <Section id="pricing" style={{ maxWidth: '1100px', margin: '0 auto', padding: '5rem 2rem' }}>
        <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <p style={{ color: '#6366F1', fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Pricing</p>
          <h2 style={{ fontSize: 'clamp(1.875rem,3.5vw,2.75rem)', fontWeight: 700, letterSpacing: '-0.03em' }}>Simple et transparent</h2>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1.25rem', maxWidth: '920px', margin: '0 auto' }}>
          {[
            {name:'Free',price:'Gratuit',sub:'',desc:'Pour decouvrir',features:['5 sessions / mois','Score de discipline','Historique 7 jours','Pre-trade checklist'],cta:'Commencer',href:'/signup',hi:false},
            {name:'Pro',price:'19',sub:'/mois',desc:'Pour les traders serieux',features:['Sessions illimitees','Score temps reel','Historique illimite','FOMO Lockout','Journal IA','Export CSV'],cta:'Commencer Pro',href:'/signup',hi:true},
            {name:'Equipe',price:'49',sub:'/mois',desc:'Pour les prop firms',features:['Tout Pro inclus','10 traders','Dashboard equipe','Support prioritaire'],cta:'Nous contacter',href:'/signup',hi:false},
          ].map((plan,i) => (
            <motion.div key={i} variants={fadeUp} className="price-card"
              style={{ background: plan.hi ? 'linear-gradient(135deg,rgba(0,212,170,0.08),rgba(99,102,241,0.08))' : '#111', border: '1px solid ' + (plan.hi ? 'rgba(0,212,170,0.3)' : '#1A1A1A'), borderRadius: '20px', padding: '2.25rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', transition: 'all 0.3s', position: 'relative' }}>
              {plan.hi && <div style={{ position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)', background: '#00D4AA', borderRadius: '100px', padding: '0.25rem 1rem', fontSize: '0.72rem', fontWeight: 700, color: '#0A0A0A', whiteSpace: 'nowrap' }}>Recommande</div>}
              <div>
                <p style={{ color: '#888', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{plan.name}</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '0.375rem' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1 }}>{plan.price}{plan.sub ? 'EUR' : ''}</span>
                  {plan.sub && <span style={{ color: '#555', fontSize: '0.9rem' }}>{plan.sub}</span>}
                </div>
                <p style={{ color: '#555', fontSize: '0.875rem' }}>{plan.desc}</p>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                {plan.features.map((feat,j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', color: '#888', fontSize: '0.9rem' }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 8l3 3 5-5" stroke={plan.hi ? '#00D4AA' : '#666'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    {feat}
                  </li>
                ))}
              </ul>
              <Link href={plan.href} className={plan.hi ? 'cta-main' : 'cta-ghost'}
                style={{ textDecoration: 'none', background: plan.hi ? '#00D4AA' : 'transparent', color: plan.hi ? '#0A0A0A' : '#999', fontWeight: 600, fontSize: '0.9375rem', padding: '0.875rem', borderRadius: '10px', textAlign: 'center', transition: 'all 0.2s', display: 'block', border: plan.hi ? 'none' : '1px solid #222' }}>
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq" style={{ maxWidth: '680px', margin: '0 auto', padding: '5rem 2rem' }}>
        <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ color: '#00D4AA', fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>FAQ</p>
          <h2 style={{ fontSize: 'clamp(1.875rem,3.5vw,2.75rem)', fontWeight: 700, letterSpacing: '-0.03em' }}>Questions frequentes</h2>
        </motion.div>
        <motion.div variants={fadeUp}>
          {FAQS.map((faq,i) => (
            <details key={i} className="faq-item" style={{ borderBottom: '1px solid #1A1A1A' }}
              open={openFaq === i} onClick={(e) => { e.preventDefault(); setOpenFaq(openFaq === i ? null : i) }}>
              <summary style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.375rem 0', gap: '1rem' }}>
                <span style={{ color: '#E0E0E0', fontSize: '1rem', fontWeight: 500 }}>{faq.q}</span>
                <span className="faq-arrow" style={{ color: '#555', fontSize: '1.25rem', flexShrink: 0, transition: 'transform 0.25s', display: 'inline-block', fontWeight: 300 }}>+</span>
              </summary>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                    <p style={{ color: '#666', fontSize: '0.9375rem', lineHeight: 1.75, paddingBottom: '1.5rem', margin: 0 }}>{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </details>
          ))}
        </motion.div>
      </Section>

      {/* CTA */}
      <Section style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 2rem 5rem' }}>
        <motion.div variants={fadeUp} style={{ background: 'linear-gradient(135deg,rgba(0,212,170,0.06),rgba(99,102,241,0.06))', border: '1px solid rgba(0,212,170,0.15)', borderRadius: '24px', padding: '4rem 2.5rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(1.75rem,3.5vw,2.5rem)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '1rem' }}>Pret a trader avec discipline ?</h2>
          <p style={{ color: '#666', fontSize: '1.0625rem', marginBottom: '2rem', lineHeight: 1.65, maxWidth: '480px', margin: '0 auto 2rem' }}>Rejoignez les traders qui ont transforme leur approche.</p>
          <Link href="/signup" className="cta-main" style={{ textDecoration: 'none', background: '#00D4AA', color: '#0A0A0A', fontWeight: 700, fontSize: '1.0625rem', padding: '1rem 2.5rem', borderRadius: '12px', transition: 'all 0.2s', display: 'inline-block', boxShadow: '0 4px 24px rgba(0,212,170,0.2)' }}>Commencer gratuitement</Link>
        </motion.div>
      </Section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid #1A1A1A', padding: '3rem 2rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}>
              <div style={{ width: '28px', height: '28px', background: '#00D4AA', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.65rem', color: '#0A0A0A' }}>DT</div>
              <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.875rem' }}>Discipline Tracker</span>
            </div>
            <p style={{ color: '#444', fontSize: '0.8125rem', lineHeight: 1.6 }}>Le journal de trading qui vous rend meilleur.</p>
          </div>
          {[
            {title:'Produit',links:['Features','Pricing','Changelog']},
            {title:'Ressources',links:['Documentation','Blog','Support']},
            {title:'Legal',links:['Confidentialite','CGU','Cookies']},
          ].map(col => (
            <div key={col.title}>
              <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.8125rem', marginBottom: '0.875rem' }}>{col.title}</p>
              {col.links.map(l => <p key={l} style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: '#444', fontSize: '0.8125rem', textDecoration: 'none' }}>{l}</a></p>)}
            </div>
          ))}
        </div>
        <div style={{ maxWidth: '1200px', margin: '2.5rem auto 0', paddingTop: '1.5rem', borderTop: '1px solid #1A1A1A', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <p style={{ color: '#333', fontSize: '0.8125rem' }}>2025 Discipline Tracker.</p>
          <p style={{ color: '#333', fontSize: '0.8125rem' }}>Fait pour les traders serieux.</p>
        </div>
      </footer>

    </div>
  )
}
