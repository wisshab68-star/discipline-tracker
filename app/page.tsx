'use client'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Inter,system-ui,sans-serif;background:#0A0A0A;color:#fff;-webkit-font-smoothing:antialiased}
.nav-a:hover{color:#fff!important}
.cta-w:hover{opacity:0.9!important;transform:translateY(-1px)!important}
.cta-ghost:hover{background:rgba(255,255,255,0.07)!important}
.feat-card:hover{border-color:#2A2A2A!important;background:#141414!important}
.price-card:hover{box-shadow:0 0 0 1px #333!important}
.price-cta:hover{opacity:0.88!important;transform:translateY(-1px)!important}
.faq summary{cursor:pointer;list-style:none}
.faq summary::-webkit-details-marker{display:none}
.faq[open] .faq-ico{transform:rotate(45deg)}
.faq-body{color:#666;font-size:0.9375rem;line-height:1.7;padding:0 0 1.375rem}
.sess-row:hover{background:rgba(255,255,255,0.02)!important}
`
const SCORES = [45,52,48,61,58,72,69,78,74,83]
const PTS = SCORES.map((v,i) => [i*(600/9), 140 - v*1.3].map(n=>Math.round(n)).join(',')).join(' ')
const FAQS = [
  {q:"Fonctionne-t-il avec mon broker ?",a:"Oui. Discipline Tracker est independant de votre broker. Vous saisissez vos trades manuellement pendant la session, ce qui renforce la prise de conscience de chaque decision."},
  {q:"Comment le score est-il calcule ?",a:"Le score (0-100) est calcule en temps reel en fonction du respect de votre plan, de votre etat emotionnel au pre-trade, du respect des niveaux SL/TP et du nombre d'alertes generees."},
  {q:"Mes donnees sont-elles securisees ?",a:"Toutes vos donnees sont chiffrees et stockees sur Supabase (PostgreSQL). Elles ne sont jamais partagees avec des tiers."},
  {q:"Puis-je l'utiliser sur mobile ?",a:"Le dashboard est optimise pour desktop. Une version mobile est en cours de developpement."},
  {q:"Comment fonctionne le FOMO Lock ?",a:"Quand une alerte CRITICAL est detectee (etat FOMO ou FRUSTRATED), un verrou de 5 minutes s'active pour vous empecher d'ouvrir de nouveaux trades dans un etat reactif."},
]

export default function LandingPage() {
  const [scoreDisplay, setScoreDisplay] = useState(0)
  const chartRef  = useRef<SVGPolylineElement>(null)
  const sectRefs  = useRef<(HTMLElement|null)[]>([])

  // Score counter 0→78
  useEffect(() => {
    const target = 78; let cur = 0
    const interval = setInterval(() => {
      cur = Math.min(cur + 2, target)
      setScoreDisplay(cur)
      if (cur >= target) clearInterval(interval)
    }, 25)
    return () => clearInterval(interval)
  }, [])

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in')
          if (e.target === chartRef.current) {
            chartRef.current?.classList.add('play')
          }
        }
      })
    }, { threshold: 0.15 })
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el))
    if (chartRef.current) observer.observe(chartRef.current)
    return () => observer.disconnect()
  }, [])

  const R = 44, CIRC = 2 * Math.PI * R
  const ringDash = CIRC * 0.78

  return (
    <>
      <style>{CSS}</style>
      <div style={{ background: '#0A0A0A', minHeight: '100vh' }}>

        {/* NAVBAR */}
        <header style={{ position: 'sticky', top: 0, background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', borderBottom: '1px solid #1A1A1A', zIndex: 100 }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem', height: '60px', display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.625rem', flexShrink: 0 }}>
              <div style={{ width: '32px', height: '32px', background: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem', color: '#0A0A0A' }}>DT</div>
              <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.9375rem', letterSpacing: '-0.01em' }}>Discipline Tracker</span>
            </Link>
            <nav style={{ display: 'flex', gap: '0.125rem', flex: 1 }}>
              {[['#features','Features'],['#pricing','Pricing'],['#faq','FAQ']].map(([href,label]) => (
                <a key={href} href={href} className="nav-a" style={{ textDecoration: 'none', color: '#555', fontSize: '0.875rem', padding: '0.375rem 0.75rem', borderRadius: '6px', transition: 'color 0.15s' }}>{label}</a>
              ))}
            </nav>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link href="/login" className="nav-a" style={{ textDecoration: 'none', color: '#777', fontSize: '0.875rem', fontWeight: 500, transition: 'color 0.15s' }}>Connexion</Link>
              <Link href="/signup" className="cta-w" style={{ textDecoration: 'none', background: '#fff', color: '#0A0A0A', fontWeight: 600, fontSize: '0.875rem', padding: '0.5rem 1.25rem', borderRadius: '8px', transition: 'all 0.15s', display: 'inline-block' }}>Commencer</Link>
            </div>
          </div>
        </header>

        {/* HERO */}
        <section style={{ maxWidth: '860px', margin: '0 auto', padding: '7rem 1.5rem 5rem', textAlign: 'center', backgroundImage: 'radial-gradient(#1A1A1A 1px, transparent 1px)', backgroundSize: '28px 28px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#111', border: '1px solid #1F1F1F', borderRadius: '100px', padding: '0.3rem 1rem', marginBottom: '2rem', fontSize: '0.8125rem', color: '#666' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}></span>
            Maintenant disponible en beta
          </div>
          <h1 style={{ fontSize: 'clamp(2.25rem,5vw,3.75rem)', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.03em', color: '#fff', marginBottom: '1.5rem' }}>
            Tradez avec discipline.<br/><span style={{ color: '#444' }}>Pas avec vos emotions.</span>
          </h1>
          <p style={{ fontSize: '1.1875rem', color: '#555', lineHeight: 1.65, maxWidth: '540px', margin: '0 auto 2.5rem', fontWeight: 400 }}>
            Score en temps reel, FOMO lockout, pre-trade checklist — tout pour trader comme un pro.
          </p>
          <div style={{ display: 'flex', gap: '0.875rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '4rem' }}>
            <Link href="/signup" className="cta-w" style={{ textDecoration: 'none', background: '#fff', color: '#0A0A0A', fontWeight: 700, fontSize: '1rem', padding: '0.875rem 2rem', borderRadius: '10px', transition: 'all 0.15s', display: 'inline-block' }}>Commencer gratuitement</Link>
            <a href="#features" className="cta-ghost" style={{ textDecoration: 'none', background: 'transparent', color: '#777', fontWeight: 500, fontSize: '1rem', padding: '0.875rem 2rem', borderRadius: '10px', border: '1px solid #1F1F1F', transition: 'background 0.15s', display: 'inline-block' }}>Voir les features</a>
          </div>

          {/* Animated score widget */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div className="animate-float" style={{ background: '#111', border: '1px solid #1F1F1F', borderRadius: '20px', padding: '1.75rem 2.25rem', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}>
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r={R} fill="none" stroke="#1F1F1F" strokeWidth="7"/>
                <circle cx="50" cy="50" r={R} fill="none" stroke="#fff" strokeWidth="7" className="ring-anim"
                  strokeLinecap="round" transform="rotate(-90 50 50)"/>
                <text x="50" y="56" textAnchor="middle" fill="#fff" fontSize="22" fontWeight="800" fontFamily="Inter,sans-serif">{scoreDisplay}</text>
              </svg>
              <p style={{ color: '#555', fontSize: '0.8125rem', margin: 0 }}>Score de discipline</p>
              <div style={{ display: 'flex', gap: '0.375rem' }}>
                {['CALM','PLAN OK','4 trades'].map(t => (
                  <span key={t} style={{ background: '#1A1A1A', border: '1px solid #222', borderRadius: '5px', padding: '0.175rem 0.5rem', fontSize: '0.68rem', color: '#555' }}>{t}</span>
                ))}
              </div>
            </div>
            {/* +12 pts floating badge */}
            <div style={{ animation: 'ptsAppear 4s ease-in-out 1.5s infinite', background: '#111', border: '1px solid #1F1F1F', borderRadius: '12px', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'center', opacity: 0 }}>
              <span style={{ color: '#22c55e', fontSize: '1.25rem' }}>+</span>
              <div>
                <p style={{ color: '#fff', fontSize: '0.875rem', fontWeight: 600, margin: 0 }}>+12 pts</p>
                <p style={{ color: '#555', fontSize: '0.75rem', margin: 0 }}>Plan respecte</p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" style={{ maxWidth: '1100px', margin: '0 auto', padding: '5rem 1.5rem' }}>
          <div className="fade-up" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ color: '#444', fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Features</p>
            <h2 style={{ fontSize: 'clamp(1.75rem,3.5vw,2.5rem)', fontWeight: 700, letterSpacing: '-0.025em', color: '#fff' }}>Tout ce dont vous avez besoin</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '1px', background: '#1A1A1A', borderRadius: '16px', overflow: 'hidden', border: '1px solid #1A1A1A' }}>
            {[
              { icon: <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="14" stroke="#333" strokeWidth="2.5"/><circle cx="20" cy="20" r="14" stroke="url(#sg)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="66 22" transform="rotate(-90 20 20)"/><defs><linearGradient id="sg" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#fff"/><stop offset="1" stopColor="#555"/></linearGradient></defs><text x="20" y="24" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="700" fontFamily="Inter,sans-serif">78</text></svg>, title:'Score en temps reel', desc:"Chaque decision evaluee instantanement. Score 0-100 par session." },
              { icon: <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><rect x="8" y="18" width="24" height="16" rx="3" stroke="#555" strokeWidth="2"/><path d="M13 18v-5a7 7 0 0114 0v5" stroke="#fff" strokeWidth="2" strokeLinecap="round"/><circle cx="20" cy="26" r="2.5" fill="#888"/></svg>, title:'FOMO Lockout', desc:"Detection auto des etats FOMO/FRUSTRATED. Verrou 5 minutes." },
              { icon: <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><rect x="9" y="8" width="22" height="26" rx="3" stroke="#555" strokeWidth="2"/><path d="M16 5h8a1.5 1.5 0 010 3h-8a1.5 1.5 0 010-3z" stroke="#fff" strokeWidth="1.5"/><path d="M14 20l4 4 8-8" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>, title:'Pre-trade Checklist', desc:"Plan, emotion, lot size — valides avant chaque trade obligatoirement." },
              { icon: <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><path d="M20 7a10 10 0 0110 10v6l2.5 3.5h-25L10 23V17A10 10 0 0120 7z" stroke="#555" strokeWidth="2" strokeLinejoin="round"/><path d="M17 30a3 3 0 006 0" stroke="#fff" strokeWidth="2"/><circle cx="27" cy="11" r="4" fill="#FF4D6A"/></svg>, title:'Alertes comportementales', desc:"Alertes CRITICAL, WARNING, INFO calibrees pour vous proteger." },
              { icon: <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><rect x="6" y="26" width="6" height="8" rx="1.5" fill="#333"/><rect x="17" y="20" width="6" height="14" rx="1.5" fill="#555"/><rect x="28" y="13" width="6" height="21" rx="1.5" fill="#fff"/><path d="M6 26L17 20L28 13" stroke="#888" strokeWidth="1.5" strokeLinecap="round"/></svg>, title:'Historique & analyses', desc:"Progresssion sur 7, 30 ou 90 jours. Identifiez vos patterns." },
              { icon: <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="11" stroke="#333" strokeWidth="2"/><path d="M15 20s2-4 5-4 5 4 5 4" stroke="#555" strokeWidth="2" strokeLinecap="round"/><circle cx="15" cy="17" r="1.5" fill="#888"/><circle cx="25" cy="17" r="1.5" fill="#888"/><path d="M20 8V5M12 11l-2-2M28 11l2-2" stroke="#444" strokeWidth="1.5" strokeLinecap="round"/></svg>, title:'Coach IA (bientot)', desc:"Analyse votre journal et donne des recommandations personnalisees." },
            ].map((f, i) => (
              <div key={i} className={'feat-card fade-up fade-up-d' + (i % 3 + 1)} style={{ background: '#0D0D0D', padding: '2rem', transition: 'all 0.2s' }}>
                <div style={{ marginBottom: '1.25rem' }}>{f.icon}</div>
                <h3 style={{ color: '#fff', fontWeight: 600, fontSize: '1rem', marginBottom: '0.5rem', letterSpacing: '-0.01em' }}>{f.title}</h3>
                <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ANIMATED CHART SECTION */}
        <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '4rem 1.5rem' }}>
          <div className="fade-up" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p style={{ color: '#444', fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Performance</p>
            <h2 style={{ fontSize: 'clamp(1.75rem,3.5vw,2.5rem)', fontWeight: 700, letterSpacing: '-0.025em', color: '#fff' }}>Votre discipline, visualisee en temps reel</h2>
          </div>
          <div className="fade-up" style={{ background: '#111', border: '1px solid #1A1A1A', borderRadius: '16px', padding: '2rem', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.9375rem', margin: '0 0 0.25rem' }}>Score de discipline — 10 dernieres sessions</p>
                <p style={{ color: '#444', fontSize: '0.8125rem', margin: 0 }}>Tendance haussiere +38 pts</p>
              </div>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8125rem' }}>
                <span style={{ color: '#FF4D6A' }}>● Debutant</span>
                <span style={{ color: '#FFB800' }}>● Progressif</span>
                <span style={{ color: '#00C48C' }}>● Expert</span>
              </div>
            </div>
            <svg width="100%" viewBox="0 0 600 140" preserveAspectRatio="xMidYMid meet" style={{ overflow: 'visible' }}>
              <defs>
                <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FF4D6A"/>
                  <stop offset="50%" stopColor="#FFB800"/>
                  <stop offset="100%" stopColor="#00C48C"/>
                </linearGradient>
                <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00C48C" stopOpacity="0.15"/>
                  <stop offset="100%" stopColor="#00C48C" stopOpacity="0"/>
                </linearGradient>
              </defs>
              {[25,50,75,100].map(v => (
                <line key={v} x1="0" y1={140-v*1.3} x2="600" y2={140-v*1.3} stroke="#1A1A1A" strokeWidth="1"/>
              ))}
              {[25,50,75,100].map(v => (
                <text key={v} x="0" y={140-v*1.3-4} fill="#333" fontSize="9" fontFamily="Inter,sans-serif">{v}</text>
              ))}
              <polyline points={PTS + ' 600,140 0,140'} fill="url(#area-grad)" stroke="none"/>
              <polyline ref={chartRef} className="chart-line-anim" points={PTS} fill="none" stroke="url(#line-grad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              {SCORES.map((v,i) => (
                <circle key={i} cx={Math.round(i*(600/9))} cy={Math.round(140-v*1.3)} r="4"
                  fill={v>=75?'#00C48C':v>=50?'#FFB800':'#FF4D6A'} stroke="#111" strokeWidth="2"
                  style={{ opacity: 0, animation: 'fadeInUp 0.3s ease ' + (0.2+i*0.15) + 's forwards' }}/>
              ))}
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem' }}>
              {SCORES.map((_,i) => (
                <span key={i} style={{ color: '#333', fontSize: '0.7rem', fontFamily: 'monospace' }}>S{i+1}</span>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section style={{ maxWidth: '680px', margin: '0 auto', padding: '4rem 1.5rem' }}>
          <div className="fade-up" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p style={{ color: '#444', fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Comment ca marche</p>
            <h2 style={{ fontSize: 'clamp(1.75rem,3.5vw,2.5rem)', fontWeight: 700, letterSpacing: '-0.025em', color: '#fff' }}>Simple. Efficace. Immediat.</h2>
          </div>
          {[
            {n:'01',title:'Ouvrez une session',desc:"Demarrez votre journee de trading. Le timer et le score s'initialisent automatiquement."},
            {n:'02',title:'Validez chaque trade',desc:"Completez le checklist pre-trade en 3 etapes : plan, emotion, lot size. Obligatoire."},
            {n:'03',title:'Analysez et progressez',desc:"Score final, historique, patterns comportementaux — tout pour progresser durablement."},
          ].map((s,i) => (
            <div key={i} className={'fade-up fade-up-d' + (i+1)} style={{ display: 'flex', gap: '1.5rem', padding: '2rem 0', borderBottom: i<2 ? '1px solid #1A1A1A' : 'none', alignItems: 'flex-start' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', fontWeight: 700, color: '#2A2A2A', letterSpacing: '0.05em', flexShrink: 0, marginTop: '0.3rem', minWidth: '24px' }}>{s.n}</div>
              <div>
                <h3 style={{ color: '#fff', fontWeight: 600, fontSize: '1.0625rem', marginBottom: '0.5rem', letterSpacing: '-0.01em' }}>{s.title}</h3>
                <p style={{ color: '#555', fontSize: '0.9375rem', lineHeight: 1.65 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </section>

        {/* PRICING */}
        <section id="pricing" style={{ maxWidth: '1000px', margin: '0 auto', padding: '5rem 1.5rem' }}>
          <div className="fade-up" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ color: '#444', fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Pricing</p>
            <h2 style={{ fontSize: 'clamp(1.75rem,3.5vw,2.5rem)', fontWeight: 700, letterSpacing: '-0.025em', color: '#fff' }}>Simple et transparent</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(270px,1fr))', gap: '1rem', maxWidth: '860px', margin: '0 auto' }}>
            {[
              {name:'Free',price:'Gratuit',sub:'',desc:'Pour decouvrir',features:['5 sessions / mois','Score de discipline','Historique 7 jours','Pre-trade checklist'],cta:'Commencer gratuitement',href:'/signup',hi:false},
              {name:'Pro',price:'19',sub:'EUR/mois',desc:'Pour les traders serieux',features:['Sessions illimitees','Score en temps reel','Historique illimite','FOMO Lockout','Alertes avancees','Export CSV'],cta:'Commencer Pro',href:'/signup',hi:true},
              {name:'Equipe',price:'49',sub:'EUR/mois',desc:'Pour les prop firms',features:['Tout Pro inclus','10 traders','Dashboard equipe','Support prioritaire'],cta:'Nous contacter',href:'/signup',hi:false},
            ].map((plan,i) => (
              <div key={i} className={'price-card fade-up fade-up-d' + (i+1)} style={{ background: plan.hi?'#fff':'#111', border: '1px solid '+(plan.hi?'transparent':'#1A1A1A'), borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', transition: 'box-shadow 0.2s', position: 'relative' }}>
                {plan.hi && <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#0A0A0A', border: '1px solid #1F1F1F', borderRadius: '100px', padding: '0.2rem 0.875rem', fontSize: '0.72rem', fontWeight: 600, color: '#777', whiteSpace: 'nowrap' }}>Recommande</div>}
                <div>
                  <p style={{ color: plan.hi?'#888':'#555', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{plan.name}</p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '0.375rem' }}>
                    <span style={{ fontSize: '2.25rem', fontWeight: 800, color: plan.hi?'#0A0A0A':'#fff', letterSpacing: '-0.03em', lineHeight: 1 }}>{plan.price}</span>
                    {plan.sub && <span style={{ color: plan.hi?'#aaa':'#444', fontSize: '0.875rem' }}>{plan.sub}</span>}
                  </div>
                  <p style={{ color: plan.hi?'#888':'#444', fontSize: '0.875rem' }}>{plan.desc}</p>
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {plan.features.map((feat,j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', color: plan.hi?'#444':'#666', fontSize: '0.875rem' }}>
                      <span style={{ color: plan.hi?'#0A0A0A':'#fff', fontWeight: 600, fontSize: '0.75rem', flexShrink: 0 }}>+</span>{feat}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} className="price-cta" style={{ textDecoration: 'none', background: plan.hi?'#0A0A0A':'#fff', color: plan.hi?'#fff':'#0A0A0A', fontWeight: 600, fontSize: '0.9375rem', padding: '0.75rem', borderRadius: '8px', textAlign: 'center', transition: 'all 0.15s', display: 'block', border: plan.hi?'none':'1px solid #E0E0E0' }}>{plan.cta}</Link>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" style={{ maxWidth: '660px', margin: '0 auto', padding: '4rem 1.5rem' }}>
          <div className="fade-up" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p style={{ color: '#444', fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>FAQ</p>
            <h2 style={{ fontSize: 'clamp(1.75rem,3.5vw,2.5rem)', fontWeight: 700, letterSpacing: '-0.025em', color: '#fff' }}>Questions frequentes</h2>
          </div>
          <div className="fade-up">
            {FAQS.map((faq,i) => (
              <details key={i} className="faq" style={{ borderBottom: '1px solid #1A1A1A' }}>
                <summary style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 0', gap: '1rem' }}>
                  <span style={{ color: '#E0E0E0', fontSize: '0.9375rem', fontWeight: 500 }}>{faq.q}</span>
                  <span className="faq-ico" style={{ color: '#444', fontSize: '1.125rem', flexShrink: 0, transition: 'transform 0.2s', display: 'inline-block', fontWeight: 300 }}>+</span>
                </summary>
                <p className="faq-body">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA — dark */}
        <section style={{ maxWidth: '720px', margin: '0 auto', padding: '3rem 1.5rem 2rem' }}>
          <div className="fade-up" style={{ background: '#111', border: '1px solid #1A1A1A', borderRadius: '20px', padding: '3.5rem 2rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: 'clamp(1.75rem,3.5vw,2.25rem)', fontWeight: 700, letterSpacing: '-0.025em', color: '#fff', marginBottom: '1rem' }}>Pret a trader avec discipline ?</h2>
            <p style={{ color: '#555', fontSize: '1rem', marginBottom: '2rem', lineHeight: 1.65 }}>Rejoignez les traders qui ont ameliore leur discipline avec Discipline Tracker.</p>
            <Link href="/signup" className="cta-w" style={{ textDecoration: 'none', background: '#fff', color: '#0A0A0A', fontWeight: 700, fontSize: '1rem', padding: '0.875rem 2.5rem', borderRadius: '10px', transition: 'all 0.15s', display: 'inline-block' }}>Commencer gratuitement</Link>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ borderTop: '1px solid #1A1A1A', padding: '3rem 1.5rem 2rem', marginTop: '2rem' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '2rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}>
                <div style={{ width: '28px', height: '28px', background: '#fff', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.7rem', color: '#0A0A0A' }}>DT</div>
                <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.875rem' }}>Discipline Tracker</span>
              </div>
              <p style={{ color: '#444', fontSize: '0.8125rem', lineHeight: 1.6 }}>Le journal de trading qui vous rend meilleur.</p>
            </div>
            <div>
              <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.8125rem', marginBottom: '0.875rem' }}>Produit</p>
              {['Features','Pricing','Changelog','Roadmap'].map(l => <p key={l} style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: '#444', fontSize: '0.8125rem', textDecoration: 'none' }}>{l}</a></p>)}
            </div>
            <div>
              <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.8125rem', marginBottom: '0.875rem' }}>Ressources</p>
              {['Documentation','Blog','Support','FAQ'].map(l => <p key={l} style={{ marginBottom: '0.5rem' }}><a href="#faq" style={{ color: '#444', fontSize: '0.8125rem', textDecoration: 'none' }}>{l}</a></p>)}
            </div>
            <div>
              <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.8125rem', marginBottom: '0.875rem' }}>Legal</p>
              {['Confidentialite','CGU','Cookies'].map(l => <p key={l} style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: '#444', fontSize: '0.8125rem', textDecoration: 'none' }}>{l}</a></p>)}
            </div>
          </div>
          <div style={{ maxWidth: '1100px', margin: '2rem auto 0', paddingTop: '1.5rem', borderTop: '1px solid #1A1A1A', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <p style={{ color: '#333', fontSize: '0.8125rem' }}>2025 Discipline Tracker. Tous droits reserves.</p>
            <p style={{ color: '#333', fontSize: '0.8125rem' }}>Fait pour les traders serieux.</p>
          </div>
        </footer>

      </div>
    </>
  )
}
