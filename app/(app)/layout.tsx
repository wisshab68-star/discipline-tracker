'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const NAV = [
  { href: '/dashboard', icon: '📊', label: 'Dashboard' },
  { href: '/session',   icon: '▶️',  label: 'Session active' },
  { href: '/history',   icon: '📈', label: 'Historique' },
  { href: null, icon: '🤖', label: 'Coach IA',   badge: 'Bientôt' },
  { href: null, icon: '⚙️', label: 'Paramètres', badge: 'Bientôt' },
]

const CSS = '.nav-i:hover{background:rgba(255,255,255,0.04)!important}.out-btn:hover{color:#fff!important;border-color:#374151!important}'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router   = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setEmail(data.user.email)
    })
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut(); router.replace('/login')
  }

  const isActive = (href: string | null) => {
    if (!href) return false
    if (href === '/dashboard') return pathname === '/dashboard'
    if (href === '/session')   return pathname === '/session' || pathname.startsWith('/session/')
    return pathname.startsWith(href)
  }

  const letter = email ? email[0].toUpperCase() : 'T'

  return (
    <>
      <style>{CSS}</style>
      <div style={{ display: 'flex', minHeight: '100vh', background: '#0D0D0D', fontFamily: 'Inter,system-ui,sans-serif', color: '#fff' }}>

        {/* SIDEBAR */}
        <aside style={{ position: 'fixed', left: 0, top: 0, bottom: 0, width: '240px', background: '#141414', borderRight: '1px solid #1E1E1E', display: 'flex', flexDirection: 'column', zIndex: 50 }}>

          {/* Logo */}
          <div style={{ padding: '1.75rem 1.5rem 1.25rem', borderBottom: '1px solid #1E1E1E' }}>
            <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.875rem', color: '#fff', flexShrink: 0, boxShadow: '0 0 20px rgba(99,102,241,0.5)' }}>DT</div>
              <div>
                <p style={{ color: '#fff', fontWeight: 700, fontSize: '0.9375rem', margin: 0, lineHeight: 1.2 }}>Discipline</p>
                <p style={{ color: '#8B8FA8', fontSize: '0.75rem', margin: 0, lineHeight: 1.2 }}>Tracker</p>
              </div>
            </Link>
          </div>

          {/* Nav items */}
          <nav style={{ flex: 1, padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', overflowY: 'auto' }}>
            {NAV.map(item => {
              const active = isActive(item.href)
              const inner = (
                <div className="nav-i" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.875rem', borderRadius: '10px', background: active ? 'rgba(99,102,241,0.15)' : 'transparent', borderLeft: '2px solid ' + (active ? '#6366F1' : 'transparent'), cursor: item.href ? 'pointer' : 'not-allowed', opacity: !item.href ? 0.45 : 1, transition: 'background 0.15s' }}>
                  <span style={{ fontSize: '1.0625rem', flexShrink: 0, lineHeight: 1 }}>{item.icon}</span>
                  <span style={{ color: active ? '#A5B4FC' : '#8B8FA8', fontSize: '0.875rem', fontWeight: active ? 600 : 500, flex: 1 }}>{item.label}</span>
                  {item.badge && <span style={{ background: 'rgba(99,102,241,0.18)', color: '#A5B4FC', borderRadius: '100px', padding: '0.1rem 0.5rem', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.03em', flexShrink: 0 }}>{item.badge}</span>}
                </div>
              )
              return (
                <div key={item.label}>
                  {item.href ? <Link href={item.href} style={{ textDecoration: 'none' }}>{inner}</Link> : inner}
                </div>
              )
            })}
          </nav>

          {/* User + logout */}
          <div style={{ padding: '0.875rem 0.75rem', borderTop: '1px solid #1E1E1E' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.5rem 0.875rem', marginBottom: '0.5rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 700, color: '#fff', flexShrink: 0 }}>{letter}</div>
              <div style={{ minWidth: 0 }}>
                <p style={{ color: '#E5E7EB', fontSize: '0.8125rem', fontWeight: 600, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Trader</p>
                <p style={{ color: '#8B8FA8', fontSize: '0.7rem', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{email || '—'}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="out-btn" style={{ width: '100%', background: 'transparent', border: '1px solid #252525', borderRadius: '8px', padding: '0.5rem', color: '#8B8FA8', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem', transition: 'all 0.15s' }}>
              🚪 Déconnexion
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main style={{ marginLeft: '240px', flex: 1, minHeight: '100vh' }}>
          {children}
        </main>
      </div>
    </>
  )
}
