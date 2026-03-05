import Link from 'next/link'

const FEATURES = [
  { icon: '🎯', title: 'Score en temps réel', desc: "Un score 0-100 calculé après chaque trade. Identifie instantanément tes erreurs comportementales." },
  { icon: '⚡', title: 'Alertes comportementales', desc: "Revenge trading, oversizing, FOMO détectés instantanément avant qu'ils détruisent ton capital." },
  { icon: '📊', title: 'Analytics avancés', desc: 'Corrélation discipline/performance sur 30 jours. Comprends pourquoi tu perds vraiment.' },
]

const STEPS = [
  { num: '01', title: 'Lance ta session', desc: 'Démarre en un clic. Ton tracker est prêt immédiatement.' },
  { num: '02', title: 'Checklist pré-trade', desc: '5 questions en 5 secondes avant chaque trade.' },
  { num: '03', title: 'Score & alertes', desc: 'Reçois ton score et tes alertes en temps réel.' },
]

const FREE_FEATURES = ['Sessions illimitées', 'Score en temps réel', 'Alertes de base', "7 jours d'historique"]
const PRO_FEATURES  = ['Tout du plan Free', 'Analytics 30 jours', 'Alertes avancées (FOMO, Revenge)', 'Export PDF', 'Support prioritaire']
const RING_DASH = 321
const RING_GAP  = 119

const CSS = '@keyframes pulse-glow{0%,100%{filter:drop-shadow(0 0 8px rgba(234,179,8,.35))}50%{filter:drop-shadow(0 0 22px rgba(234,179,8,.75))}}' +
  '@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}' +
  '@keyframes badge-pulse{0%,100%{box-shadow:0 0 0 0 rgba(255,77,106,.4)}50%{box-shadow:0 0 0 8px rgba(255,77,106,0)}}' +
  '.lp-nav-link:hover{color:#fff!important}.lp-btn-demo:hover{background:rgba(255,255,255,.08)!important}' +
  '.lp-feature-card:hover{border-color:#6366F1!important;transform:translateY(-4px)}' +
  '.lp-footer-link:hover{color:#E5E7EB!important}.lp-pricing-free:hover,.lp-pricing-pro:hover{transform:translateY(-3px)}' +
  '@media(max-width:768px){.lp-hero-grid,.lp-social-bar,.lp-footer-inner{flex-direction:column!important}' +
  '.lp-hero-title{font-size:2.5rem!important}.lp-nav-links{display:none!important}' +
  '.lp-features-grid,.lp-steps-grid,.lp-pricing-grid{grid-template-columns:1fr!important}.lp-cta-box{padding:2.5rem 1.5rem!important}}'

export default function HomePage() {
  const ringDash = RING_DASH + ' ' + RING_GAP
  return (
    <>
      <style>{CSS}</style>
      <div style={{ background: '#0D0D0D', minHeight: '100vh', fontFamily: 'Inter, system-ui, -apple-system, sans-serif', color: '#fff', overflowX: 'hidden', backgroundImage: 'radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.06) 0%, transparent 60%)' }}>

        {/* NAVBAR */}
        <nav style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid #1E2028', background: 'rgba(10,11,15,0.85)', backdropFilter: 'blur(14px)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
              <div style={{ width: '34px', height: '34px', background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px', flexShrink: 0 }}>📈</div>
              <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#fff', whiteSpace: 'nowrap' }}>Discipline Tracker</span>
            </Link>
            <div className="lp-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              {[['Fonctionnalités','#features'],['Tarifs','#pricing'],['Blog','#']].map(([label,href]) => (
                <a key={label} href={href} className="lp-nav-link" style={{ color: '#9CA3AF', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 500, transition: 'color 0.15s' }}>{label}</a>
              ))}
            </div>
            <Link href="/signup" style={{ textDecoration: 'none' }}>
              <button style={{ background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.5rem 1.25rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                Commencer gratuitement
              </button>
            </Link>
          </div>
        </nav>

        {/* HERO */}
        <section style={{ padding: '6rem 1.5rem 5rem', maxWidth: '1200px', margin: '0 auto' }}>
          <div className="lp-hero-grid" style={{ display: 'flex', alignItems: 'center', gap: '5rem' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.28)', borderRadius: '100px', padding: '0.25rem 0.875rem', marginBottom: '1.75rem' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#6366F1', display: 'inline-block', flexShrink: 0 }} />
                <span style={{ fontSize: '0.75rem', color: '#A5B4FC', fontWeight: 600 }}>+1 200 traders font confiance</span>
              </div>
              <h1 className="lp-hero-title" style={{ fontSize: '3.75rem', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.03em', margin: '0 0 1.5rem' }}>
                Arrête de perdre<br />
                <span style={{ background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>par émotion.</span>
              </h1>
              <p style={{ fontSize: '1.125rem', color: '#9CA3AF', lineHeight: 1.75, margin: '0 0 2.5rem', maxWidth: '480px' }}>
                Discipline Tracker mesure ta discipline comportementale en temps réel. Pas ton P&L —{' '}
                <strong style={{ color: '#E5E7EB', fontWeight: 600 }}>ta psychologie.</strong>
              </p>
              <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap' }}>
                <Link href="/signup" style={{ textDecoration: 'none' }}>
                  <button style={{ background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', color: '#fff', border: 'none', borderRadius: '10px', padding: '0.875rem 2rem', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 0 32px rgba(99,102,241,0.38)' }}>Essayer gratuitement →</button>
                </Link>
                <Link href="/dashboard" style={{ textDecoration: 'none' }}>
                  <button className="lp-btn-demo" style={{ background: 'rgba(255,255,255,0.04)', color: '#E5E7EB', border: '1px solid #1E2028', borderRadius: '10px', padding: '0.875rem 2rem', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.15s' }}>Voir la démo</button>
                </Link>
              </div>
            </div>
            <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', animation: 'float 4s ease-in-out infinite' }}>
              <div style={{ position: 'absolute', top: '-18px', right: '-20px', background: 'rgba(255,77,106,0.12)', border: '1px solid rgba(255,77,106,0.38)', borderRadius: '10px', padding: '0.45rem 0.875rem', fontSize: '0.775rem', fontWeight: 700, color: '#FF4D6A', whiteSpace: 'nowrap', zIndex: 10, backdropFilter: 'blur(8px)', animation: 'badge-pulse 2s ease-in-out infinite' }}>
                ⚠️ Revenge Trading détecté
              </div>
              <div style={{ background: '#12141A', border: '1px solid #1E2028', borderRadius: '20px', padding: '2rem 2.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', boxShadow: '0 0 60px rgba(99,102,241,0.1),0 24px 48px rgba(0,0,0,0.4)' }}>
                <p style={{ fontSize: '0.7rem', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Score Discipline</p>
                <div style={{ animation: 'pulse-glow 2.5s ease-in-out infinite' }}>
                  <svg width="186" height="186" viewBox="0 0 186 186">
                    <circle cx="93" cy="93" r="70" fill="none" stroke="#1E2028" strokeWidth="13" />
                    <circle cx="93" cy="93" r="70" fill="none" stroke="#EAB308" strokeWidth="13" strokeLinecap="round" strokeDasharray={ringDash} transform="rotate(-90 93 93)" />
                    <text x="93" y="87" textAnchor="middle" fill="#EAB308" fontSize="38" fontWeight="700" fontFamily="ui-monospace,monospace">73</text>
                    <text x="93" y="108" textAnchor="middle" fill="#6B7280" fontSize="13">/100</text>
                  </svg>
                </div>
                <div style={{ display: 'flex', gap: '1.25rem', width: '100%' }}>
                  {[{label:'Plan',val:80,color:'#00D4AA'},{label:'Risk',val:65,color:'#EAB308'},{label:'Émotion',val:74,color:'#EAB308'}].map(s => (
                    <div key={s.label} style={{ flex: 1, textAlign: 'center' }}>
                      <div style={{ fontSize: '0.68rem', color: '#6B7280', marginBottom: '4px', fontWeight: 500 }}>{s.label}</div>
                      <div style={{ fontSize: '1.0625rem', fontWeight: 700, color: s.color, fontFamily: 'ui-monospace,monospace' }}>{s.val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SOCIAL PROOF */}
        <div className="lp-social-bar" style={{ borderTop: '1px solid #1E2028', borderBottom: '1px solid #1E2028', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>Rejoint par <strong style={{ color: '#E5E7EB' }}>+1 200 traders actifs</strong></span>
          <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
            {['MT4','MT5','TradingView','Binance'].map(p => (
              <span key={p} style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#374151', letterSpacing: '0.06em' }}>{p}</span>
            ))}
          </div>
        </div>

        {/* FEATURES */}
        <section id="features" style={{ padding: '7rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ display: 'inline-block', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '100px', padding: '0.25rem 1rem', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#A5B4FC', fontWeight: 600 }}>Fonctionnalités</span>
            </div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.025em', margin: '0 0 1rem' }}>
              Tout ce qu&apos;il faut pour<br />
              <span style={{ background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>trader avec discipline</span>
            </h2>
            <p style={{ color: '#6B7280', fontSize: '1.0625rem', margin: 0 }}>Conçu par des traders, pour des traders qui veulent progresser vraiment.</p>
          </div>
          <div className="lp-features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem' }}>
            {FEATURES.map(f => (
              <div key={f.title} className="lp-feature-card" style={{ background: '#12141A', border: '1px solid #1E2028', borderRadius: '18px', padding: '2.25rem', transition: 'border-color 0.2s,transform 0.2s' }}>
                <div style={{ fontSize: '2.25rem', marginBottom: '1.125rem' }}>{f.icon}</div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 0.75rem' }}>{f.title}</h3>
                <p style={{ color: '#6B7280', fontSize: '0.9rem', lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section style={{ padding: '5rem 1.5rem 7rem', background: 'rgba(18,20,26,0.6)', borderTop: '1px solid #1E2028', borderBottom: '1px solid #1E2028' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.025em', margin: '0 0 1rem' }}>Comment ca marche</h2>
              <p style={{ color: '#6B7280', fontSize: '1.0625rem', margin: 0 }}>Operationnel en 30 secondes. Aucune integration requise.</p>
            </div>
            <div className="lp-steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '2rem' }}>
              {STEPS.map((s,i) => (
                <div key={s.num} style={{ textAlign: 'center', position: 'relative' }}>
                  {i < STEPS.length-1 && <div style={{ position: 'absolute', top: '1.25rem', left: '65%', right: '-35%', height: '1px', background: 'linear-gradient(to right,#1E2028,transparent)' }} />}
                  <div style={{ fontFamily: 'ui-monospace,monospace', fontSize: '3rem', fontWeight: 800, color: '#1E2028', marginBottom: '0.625rem', lineHeight: 1 }}>{s.num}</div>
                  <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, margin: '0 0 0.5rem' }}>{s.title}</h3>
                  <p style={{ color: '#6B7280', fontSize: '0.875rem', lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" style={{ padding: '7rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ display: 'inline-block', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '100px', padding: '0.25rem 1rem', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#A5B4FC', fontWeight: 600 }}>Tarifs</span>
            </div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.025em', margin: '0 0 1rem' }}>Simple et transparent</h2>
            <p style={{ color: '#6B7280', fontSize: '1.0625rem', margin: 0 }}>Commence gratuitement. Passe au Pro quand tu es pret.</p>
          </div>
          <div className="lp-pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1.5rem', maxWidth: '760px', margin: '0 auto' }}>
            <div className="lp-pricing-free" style={{ background: '#12141A', border: '1px solid #1E2028', borderRadius: '20px', padding: '2.5rem', transition: 'transform 0.2s' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.75rem' }}>Free</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                  <span style={{ fontSize: '3rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>0</span>
                  <span style={{ fontSize: '1.25rem', color: '#6B7280', fontWeight: 600 }}>€</span>
                </div>
                <p style={{ color: '#6B7280', fontSize: '0.875rem', margin: '0.5rem 0 0' }}>30 jours d&apos;essai</p>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {FREE_FEATURES.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.9rem', color: '#D1D5DB' }}>
                    <span style={{ color: '#00D4AA', fontWeight: 700, flexShrink: 0 }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" style={{ textDecoration: 'none', display: 'block' }}>
                <button style={{ width: '100%', background: 'transparent', color: '#E5E7EB', border: '1px solid #374151', borderRadius: '10px', padding: '0.875rem', fontSize: '0.9375rem', fontWeight: 600, cursor: 'pointer' }}>Commencer gratuitement</button>
              </Link>
            </div>
            <div className="lp-pricing-pro" style={{ background: 'linear-gradient(145deg,#13143A,#0D0E2A)', border: '1px solid rgba(99,102,241,0.5)', borderRadius: '20px', padding: '2.5rem', position: 'relative', transition: 'transform 0.2s', boxShadow: '0 0 40px rgba(99,102,241,0.15)' }}>
              <div style={{ position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', borderRadius: '100px', padding: '0.2rem 1rem', fontSize: '0.7rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', letterSpacing: '0.05em' }}>POPULAIRE</div>
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#A5B4FC', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.75rem' }}>Pro</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                  <span style={{ fontSize: '3rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>15</span>
                  <span style={{ fontSize: '1.25rem', color: '#A5B4FC', fontWeight: 600 }}>€</span>
                  <span style={{ fontSize: '0.875rem', color: '#6B7280', marginLeft: '0.25rem' }}>/mois</span>
                </div>
                <p style={{ color: '#6B7280', fontSize: '0.875rem', margin: '0.5rem 0 0' }}>Tout inclus</p>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {PRO_FEATURES.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.9rem', color: '#D1D5DB' }}>
                    <span style={{ color: '#A5B4FC', fontWeight: 700, flexShrink: 0 }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" style={{ textDecoration: 'none', display: 'block' }}>
                <button style={{ width: '100%', background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', color: '#fff', border: 'none', borderRadius: '10px', padding: '0.875rem', fontSize: '0.9375rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 0 24px rgba(99,102,241,0.4)' }}>Commencer avec Pro</button>
              </Link>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section style={{ padding: '7rem 1.5rem', background: 'rgba(18,20,26,0.6)', borderTop: '1px solid #1E2028' }}>
          <div className="lp-cta-box" style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center', background: 'linear-gradient(145deg,#13143A,#0D0E2A)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '24px', padding: '5rem 3rem', boxShadow: '0 0 80px rgba(99,102,241,0.12)' }}>
            <h2 style={{ fontSize: '2.75rem', fontWeight: 800, letterSpacing: '-0.025em', margin: '0 0 1.25rem', lineHeight: 1.1 }}>
              Pret a trader<br />
              <span style={{ background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>avec discipline ?</span>
            </h2>
            <p style={{ color: '#9CA3AF', fontSize: '1.0625rem', margin: '0 0 2.5rem', lineHeight: 1.7 }}>
              Rejoins +1 200 traders qui ont deja transforme leur psychologie de trading.<br />
              <strong style={{ color: '#E5E7EB' }}>Gratuit pendant 30 jours. Aucune carte requise.</strong>
            </p>
            <Link href="/signup" style={{ textDecoration: 'none' }}>
              <button style={{ background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', color: '#fff', border: 'none', borderRadius: '12px', padding: '1rem 2.5rem', fontSize: '1.0625rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 0 40px rgba(99,102,241,0.45)' }}>
                Commencer maintenant — c&apos;est gratuit →
              </button>
            </Link>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ borderTop: '1px solid #1E2028', padding: '3rem 1.5rem' }}>
          <div className="lp-footer-inner" style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
              <div style={{ width: '30px', height: '30px', background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', flexShrink: 0 }}>📈</div>
              <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#fff' }}>Discipline Tracker</span>
            </Link>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              {[['Fonctionnalites','#features'],['Tarifs','#pricing'],['Confidentialite','#'],['CGU','#']].map(([label,href]) => (
                <a key={label} href={href} className="lp-footer-link" style={{ color: '#6B7280', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.15s' }}>{label}</a>
              ))}
            </div>
            <p style={{ color: '#374151', fontSize: '0.8125rem', margin: 0 }}>Made with ❤️ for traders</p>
          </div>
        </footer>

      </div>
    </>
  )
}
