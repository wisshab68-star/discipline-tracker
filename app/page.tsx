'use client'
import Link from 'next/link'
import { useState } from 'react'

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Inter,system-ui,sans-serif;background:#0A0A0A;color:#fff;-webkit-font-smoothing:antialiased}
.nav-link:hover{color:#fff!important}
.cta-btn:hover{opacity:0.92!important;transform:translateY(-1px)!important}
.cta-outline:hover{background:rgba(255,255,255,0.06)!important}
.feature-card:hover{border-color:#2A2A2A!important;background:#141414!important}
.price-card:hover{border-color:#2A2A2A!important}
.faq-item summary{cursor:pointer;list-style:none}
.faq-item summary::-webkit-details-marker{display:none}
.faq-item[open] summary .faq-arrow{transform:rotate(180deg)}
.faq-item[open] .faq-body{display:block}
.faq-body{display:none;color:#888;font-size:0.9375rem;line-height:1.7;padding:0 0 1.25rem 0}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes pulse-ring{0%{box-shadow:0 0 0 0 rgba(255,255,255,0.12)}70%{box-shadow:0 0 0 18px rgba(255,255,255,0)}100%{box-shadow:0 0 0 0 rgba(255,255,255,0)}}
.float-anim{animation:float 4s ease-in-out infinite}
`

const FAQS = [
  { q: "Est-ce que Discipline Tracker fonctionne avec mon broker ?", a: "Oui. Discipline Tracker est independant de votre broker. Vous saisissez vos trades manuellement pendant la session, ce qui renforce la prise de conscience de chaque decision." },
  { q: "Comment le score de discipline est-il calcule ?", a: "Le score (0-100) est calcule en temps reel en fonction du respect de votre plan, de votre etat emotionnel au pre-trade, du respect des niveaux SL/TP, et du nombre d'alertes generees." },
  { q: "Mes donnees sont-elles securisees ?", a: "Toutes vos donnees sont chiffrees et stockees sur Supabase (infrastructure PostgreSQL). Elles ne sont jamais partagees avec des tiers." },
  { q: "Puis-je utiliser Discipline Tracker sur mobile ?", a: "Le dashboard est optimise pour desktop. Une version mobile est en cours de developpement et sera disponible prochainement." },
  { q: "Comment fonctionne le mode FOMO Lock ?", a: "Quand une alerte CRITICAL est detectee (etat emotionnel FOMO ou FRUSTRATED), un verrou de 5 minutes s'active automatiquement pour vous empecher d'ouvrir de nouveaux trades dans un etat reactif." },
]

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number|null>(null)

  const R = 44, CIRC = 2 * Math.PI * R, dash = CIRC * 0.78

  return (
    <>
      <style>{CSS}</style>
      <div style={{ background: '#0A0A0A', minHeight: '100vh', backgroundImage: 'radial-gradient(#1A1A1A 1px, transparent 1px)', backgroundSize: '32px 32px' }}>

        {/* NAVBAR */}
        <header style={{ position: 'sticky', top: 0, background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderBottom: '1px solid #1A1A1A', zIndex: 100 }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem', height: '60px', display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <div style={{ width: '32px', height: '32px', background: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem', color: '#0A0A0A' }}>DT</div>
              <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.9375rem', letterSpacing: '-0.01em' }}>Discipline Tracker</span>
            </Link>
            <nav style={{ display: 'flex', gap: '0.25rem', flex: 1 }}>
              <a href="#features" className="nav-link" style={{ textDecoration: 'none', color: '#666', fontSize: '0.875rem', padding: '0.375rem 0.75rem', borderRadius: '6px', transition: 'color 0.15s' }}>Features</a>
              <a href="#pricing" className="nav-link" style={{ textDecoration: 'none', color: '#666', fontSize: '0.875rem', padding: '0.375rem 0.75rem', borderRadius: '6px', transition: 'color 0.15s' }}>Pricing</a>
              <a href="#faq" className="nav-link" style={{ textDecoration: 'none', color: '#666', fontSize: '0.875rem', padding: '0.375rem 0.75rem', borderRadius: '6px', transition: 'color 0.15s' }}>FAQ</a>
            </nav>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link href="/login" className="nav-link" style={{ textDecoration: 'none', color: '#888', fontSize: '0.875rem', fontWeight: 500, transition: 'color 0.15s' }}>Connexion</Link>
              <Link href="/signup" className="cta-btn" style={{ textDecoration: 'none', background: '#fff', color: '#0A0A0A', fontWeight: 600, fontSize: '0.875rem', padding: '0.5rem 1.25rem', borderRadius: '8px', transition: 'opacity 0.15s,transform 0.15s', display: 'inline-block' }}>Commencer</Link>
            </div>
          </div>
        </header>

        {/* HERO */}
        <section style={{ maxWidth: '860px', margin: '0 auto', padding: '7rem 1.5rem 5rem', textAlign: 'center', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#111111', border: '1px solid #1F1F1F', borderRadius: '100px', padding: '0.375rem 1rem', marginBottom: '2rem', fontSize: '0.8125rem', color: '#888' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse-ring 2s ease-out infinite' }}></span>
            Maintenant disponible en beta
          </div>
          <h1 style={{ fontSize: 'clamp(2.25rem,5vw,3.75rem)', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.03em', color: '#fff', marginBottom: '1.5rem' }}>
            Tradez avec discipline.<br />
            <span style={{ color: '#555' }}>Pas avec vos emotions.</span>
          </h1>
          <p style={{ fontSize: '1.1875rem', color: '#666', lineHeight: 1.65, maxWidth: '560px', margin: '0 auto 2.5rem', fontWeight: 400 }}>
            Discipline Tracker score chaque session en temps reel. Pre-trade checklist, FOMO lockout, alertes comportementales — tout pour trader comme un pro.
          </p>
          <div style={{ display: 'flex', gap: '0.875rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/signup" className="cta-btn" style={{ textDecoration: 'none', background: '#fff', color: '#0A0A0A', fontWeight: 700, fontSize: '1rem', padding: '0.875rem 2rem', borderRadius: '10px', transition: 'opacity 0.15s,transform 0.15s', display: 'inline-block' }}>
              Commencer gratuitement
            </Link>
            <a href="#features" className="cta-outline" style={{ textDecoration: 'none', background: 'transparent', color: '#888', fontWeight: 500, fontSize: '1rem', padding: '0.875rem 2rem', borderRadius: '10px', border: '1px solid #1F1F1F', transition: 'background 0.15s', display: 'inline-block' }}>
              Voir les features
            </a>
          </div>

          {/* Score ring demo */}
          <div className="float-anim" style={{ marginTop: '4rem', display: 'flex', justifyContent: 'center' }}>
            <div style={{ background: '#111111', border: '1px solid #1F1F1F', borderRadius: '20px', padding: '2rem 2.5rem', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r={R} fill="none" stroke="#1F1F1F" strokeWidth="8" />
                <circle cx="50" cy="50" r={R} fill="none" stroke="#fff" strokeWidth="8"
                  strokeDasharray={dash + ' ' + (CIRC - dash)}
                  strokeDashoffset={CIRC * 0.25} strokeLinecap="round"
                  transform="rotate(-90 50 50)" />
                <text x="50" y="54" textAnchor="middle" fill="#fff" fontSize="20" fontWeight="800" fontFamily="Inter,sans-serif">78</text>
              </svg>
              <p style={{ color: '#888', fontSize: '0.8125rem' }}>Score de discipline live</p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['CALM','PLAN OK','3 trades'].map(t => (
                  <span key={t} style={{ background: '#1A1A1A', border: '1px solid #1F1F1F', borderRadius: '6px', padding: '0.2rem 0.6rem', fontSize: '0.7rem', color: '#666' }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" style={{ maxWidth: '1100px', margin: '0 auto', padding: '5rem 1.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ color: '#555', fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Features</p>
            <h2 style={{ fontSize: 'clamp(1.75rem,3.5vw,2.5rem)', fontWeight: 700, letterSpacing: '-0.02em', color: '#fff' }}>Tout ce dont vous avez besoin</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '1px', background: '#1F1F1F', borderRadius: '16px', overflow: 'hidden', border: '1px solid #1F1F1F' }}>
            {[
              { icon: '🎯', title: 'Score en temps reel', desc: 'Chaque decision est evaluee instantanement. Le score 0-100 reflete votre niveau de discipline sur toute la session.' },
              { icon: '🔒', title: 'FOMO Lockout', desc: 'Detecte automatiquement les etats FOMO ou FRUSTRATED et verrouille les nouveaux trades pendant 5 minutes.' },
              { icon: '📋', title: 'Pre-trade Checklist', desc: 'Validez votre plan, votre etat emotionnel et votre taille de position avant chaque trade. Pas de raccourci possible.' },
              { icon: '🔔', title: 'Alertes comportementales', desc: 'Alertes CRITICAL, WARNING et INFO calibrees pour vous avertir sans vous distraire au mauvais moment.' },
              { icon: '📊', title: 'Historique & analyses', desc: 'Visualisez votre progression sur 7, 30 ou 90 jours. Identifiez vos patterns comportementaux recurrents.' },
              { icon: '🤖', title: 'Coach IA (bientot)', desc: 'Un coach personnel qui analyse votre journal de trading et vous donne des recommandations personnalisees.' },
            ].map((f, i) => (
              <div key={i} className="feature-card" style={{ background: '#0E0E0E', padding: '2rem', transition: 'background 0.2s,border-color 0.2s' }}>
                <div style={{ fontSize: '1.625rem', marginBottom: '1rem' }}>{f.icon}</div>
                <h3 style={{ color: '#fff', fontWeight: 600, fontSize: '1rem', marginBottom: '0.625rem', letterSpacing: '-0.01em' }}>{f.title}</h3>
                <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section style={{ maxWidth: '760px', margin: '0 auto', padding: '5rem 1.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ color: '#555', fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Comment ca marche</p>
            <h2 style={{ fontSize: 'clamp(1.75rem,3.5vw,2.5rem)', fontWeight: 700, letterSpacing: '-0.02em', color: '#fff' }}>Simple. Efficace. Immediat.</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {[
              { n: '01', title: 'Ouvrez une session', desc: 'Demarrez votre journee de trading avec une session. Le timer et le score s\'initialisent automatiquement.' },
              { n: '02', title: 'Validez chaque trade', desc: 'Avant d\'ouvrir une position, completez le checklist pre-trade en 3 etapes. Etat emotionnel, plan, lot size.' },
              { n: '03', title: 'Analysez et progressez', desc: 'A la fin de la session, consultez votre score final et votre historique pour identifier vos axes d\'amelioration.' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: '1.5rem', padding: '2rem 0', borderBottom: i < 2 ? '1px solid #1A1A1A' : 'none', alignItems: 'flex-start' }}>
                <div style={{ fontFamily: 'Inter,monospace', fontSize: '0.75rem', fontWeight: 700, color: '#333', letterSpacing: '0.05em', flexShrink: 0, marginTop: '0.25rem', minWidth: '24px' }}>{s.n}</div>
                <div>
                  <h3 style={{ color: '#fff', fontWeight: 600, fontSize: '1.0625rem', marginBottom: '0.5rem', letterSpacing: '-0.01em' }}>{s.title}</h3>
                  <p style={{ color: '#666', fontSize: '0.9375rem', lineHeight: 1.65 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" style={{ maxWidth: '1100px', margin: '0 auto', padding: '5rem 1.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ color: '#555', fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Pricing</p>
            <h2 style={{ fontSize: 'clamp(1.75rem,3.5vw,2.5rem)', fontWeight: 700, letterSpacing: '-0.02em', color: '#fff' }}>Simple et transparent</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1rem', maxWidth: '860px', margin: '0 auto' }}>
            {[
              { name: 'Free', price: '0', period: '/mois', desc: 'Pour decouvrir', features: ['5 sessions / mois', 'Score de discipline', 'Historique 7 jours', 'Pre-trade checklist'], cta: 'Commencer gratuitement', href: '/signup', highlight: false },
              { name: 'Pro', price: '19', period: '/mois', desc: 'Pour les traders serieux', features: ['Sessions illimitees', 'Score en temps reel', 'Historique illimite', 'FOMO Lockout', 'Alertes avancees', 'Export CSV'], cta: 'Commencer Pro', href: '/signup', highlight: true },
              { name: 'Equipe', price: '49', period: '/mois', desc: 'Pour les prop firms', features: ['Tout Pro', 'Jusqu\'a 10 traders', 'Dashboard equipe', 'Support prioritaire'], cta: 'Contacter', href: '/signup', highlight: false },
            ].map((plan, i) => (
              <div key={i} className="price-card" style={{ background: plan.highlight ? '#fff' : '#111111', border: '1px solid ' + (plan.highlight ? 'transparent' : '#1F1F1F'), borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', transition: 'border-color 0.2s', position: 'relative' }}>
                {plan.highlight && <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#0A0A0A', border: '1px solid #1F1F1F', borderRadius: '100px', padding: '0.2rem 0.875rem', fontSize: '0.75rem', fontWeight: 600, color: '#888', whiteSpace: 'nowrap' }}>Recommande</div>}
                <div>
                  <p style={{ color: plan.highlight ? '#888' : '#666', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem' }}>{plan.name}</p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '0.375rem' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: 800, color: plan.highlight ? '#0A0A0A' : '#fff', letterSpacing: '-0.03em' }}>{plan.price === '0' ? 'Gratuit' : plan.price + 'EUR'}</span>
                    {plan.price !== '0' && <span style={{ color: plan.highlight ? '#999' : '#555', fontSize: '0.875rem' }}>{plan.period}</span>}
                  </div>
                  <p style={{ color: plan.highlight ? '#999' : '#555', fontSize: '0.875rem' }}>{plan.desc}</p>
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {plan.features.map((feat, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', color: plan.highlight ? '#333' : '#888', fontSize: '0.9rem' }}>
                      <span style={{ color: plan.highlight ? '#0A0A0A' : '#fff', fontSize: '0.75rem', flexShrink: 0 }}>+</span>
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} className="cta-btn" style={{ textDecoration: 'none', background: plan.highlight ? '#0A0A0A' : '#fff', color: plan.highlight ? '#fff' : '#0A0A0A', fontWeight: 600, fontSize: '0.9375rem', padding: '0.75rem', borderRadius: '8px', textAlign: 'center', transition: 'opacity 0.15s,transform 0.15s', display: 'block', border: plan.highlight ? 'none' : '1px solid #E5E5E5' }}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" style={{ maxWidth: '680px', margin: '0 auto', padding: '5rem 1.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ color: '#555', fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>FAQ</p>
            <h2 style={{ fontSize: 'clamp(1.75rem,3.5vw,2.5rem)', fontWeight: 700, letterSpacing: '-0.02em', color: '#fff' }}>Questions frequentes</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {FAQS.map((faq, i) => (
              <details key={i} className="faq-item" style={{ borderBottom: '1px solid #1A1A1A' }}>
                <summary style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 0', gap: '1rem' }}>
                  <span style={{ color: '#E5E5E5', fontSize: '0.9375rem', fontWeight: 500, letterSpacing: '-0.01em' }}>{faq.q}</span>
                  <span className="faq-arrow" style={{ color: '#555', fontSize: '1rem', flexShrink: 0, transition: 'transform 0.2s', display: 'inline-block' }}>+</span>
                </summary>
                <p className="faq-body" style={{ color: '#666', fontSize: '0.9375rem', lineHeight: 1.7, paddingBottom: '1.25rem' }}>{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA BANNER */}
        <section style={{ maxWidth: '760px', margin: '0 auto', padding: '3rem 1.5rem 6rem' }}>
          <div style={{ background: '#111111', border: '1px solid #1F1F1F', borderRadius: '20px', padding: '3.5rem 2rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: 'clamp(1.75rem,3.5vw,2.25rem)', fontWeight: 700, letterSpacing: '-0.025em', color: '#fff', marginBottom: '1rem' }}>Pret a trader avec discipline ?</h2>
            <p style={{ color: '#666', fontSize: '1rem', marginBottom: '2rem', lineHeight: 1.65 }}>Rejoignez les traders qui ont ameliore leur win rate en trackant leur discipline.</p>
            <Link href="/signup" className="cta-btn" style={{ textDecoration: 'none', background: '#fff', color: '#0A0A0A', fontWeight: 700, fontSize: '1rem', padding: '0.875rem 2.5rem', borderRadius: '10px', transition: 'opacity 0.15s,transform 0.15s', display: 'inline-block' }}>
              Commencer gratuitement
            </Link>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ borderTop: '1px solid #1A1A1A', padding: '3rem 1.5rem' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '2rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.875rem' }}>
                <div style={{ width: '28px', height: '28px', background: '#fff', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.7rem', color: '#0A0A0A' }}>DT</div>
                <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>Discipline Tracker</span>
              </div>
              <p style={{ color: '#555', fontSize: '0.875rem', lineHeight: 1.6 }}>Le journal de trading qui vous rend meilleur.</p>
            </div>
            <div>
              <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.875rem', marginBottom: '1rem' }}>Produit</p>
              {['Features', 'Pricing', 'Changelog', 'Roadmap'].map(l => <p key={l} style={{ marginBottom: '0.625rem' }}><a href="#" style={{ color: '#555', fontSize: '0.875rem', textDecoration: 'none' }}>{l}</a></p>)}
            </div>
            <div>
              <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.875rem', marginBottom: '1rem' }}>Ressources</p>
              {['Documentation', 'Blog', 'Support', 'FAQ'].map(l => <p key={l} style={{ marginBottom: '0.625rem' }}><a href="#faq" style={{ color: '#555', fontSize: '0.875rem', textDecoration: 'none' }}>{l}</a></p>)}
            </div>
            <div>
              <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.875rem', marginBottom: '1rem' }}>Legal</p>
              {['Confidentialite', 'CGU', 'Cookies'].map(l => <p key={l} style={{ marginBottom: '0.625rem' }}><a href="#" style={{ color: '#555', fontSize: '0.875rem', textDecoration: 'none' }}>{l}</a></p>)}
            </div>
          </div>
          <div style={{ maxWidth: '1100px', margin: '2.5rem auto 0', paddingTop: '2rem', borderTop: '1px solid #1A1A1A', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <p style={{ color: '#444', fontSize: '0.8125rem' }}>2025 Discipline Tracker. Tous droits reserves.</p>
            <p style={{ color: '#444', fontSize: '0.8125rem' }}>Fait pour les traders serieux.</p>
          </div>
        </footer>

      </div>
    </>
  )
}
