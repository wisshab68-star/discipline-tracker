'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const NAV = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/session',   label: 'Session' },
  { href: '/history',   label: 'Historique' },
  { href: '/journal',   label: 'Journal IA' },
]

const CSS = `
.nav-link:hover{color:#fff!important;background:rgba(255,255,255,0.06)!important}
.logout-btn:hover{background:rgba(255,255,255,0.08)!important;color:#fff!important}
`

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router   = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setEmail(data.user.email)
    })
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut(); router.replace('/login')
  }

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    if (href === '/session')   return pathname === '/session' || pathname.startsWith('/session/')
    return pathname.startsWith(href)
  }

  const letter = email ? email[0].toUpperCase() : 'T'

  return (
    <>
      <style>{CSS}</style>
      <div style={{ minHeight: '100vh', background: '#0A0A0A', fontFamily: 'Inter,system-ui,sans-serif', color: '#fff' }}>

        <header style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '60px', background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderBottom: '1px solid #1F1F1F', zIndex: 100, display: 'flex', alignItems: 'center', padding: '0 1.5rem', gap: '2rem' }}>

          <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.625rem', flexShrink: 0 }}>
            <div style={{ width: '32px', height: '32px', background: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem', color: '#0A0A0A', flexShrink: 0 }}>DT</div>
            <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.9375rem', letterSpacing: '-0.01em' }}>Discipline Tracker</span>
          </Link>

          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flex: 1, justifyContent: 'center' }}>
            {NAV.map(item => {
              const active = isActive(item.href)
              return (
                <Link key={item.href} href={item.href} className="nav-link" style={{ textDecoration: 'none', padding: '0.375rem 0.875rem', borderRadius: '8px', color: active ? '#fff' : '#666', fontWeight: active ? 500 : 400, fontSize: '0.875rem', background: active ? 'rgba(255,255,255,0.08)' : 'transparent', transition: 'color 0.15s,background 0.15s' }}>
                  {item.label}
                </Link>
              )
            })}
            
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0, position: 'relative' }}>
            <span style={{ color: '#555', fontSize: '0.8125rem', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{email || ''}</span>
            <button onClick={() => setMenuOpen(o => !o)} style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#1F1F1F', border: '1px solid #2A2A2A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8125rem', fontWeight: 700, color: '#fff', cursor: 'pointer' }}>{letter}</button>
            {menuOpen && (
              <div style={{ position: 'absolute', top: '42px', right: 0, background: '#111111', border: '1px solid #1F1F1F', borderRadius: '10px', padding: '0.375rem', minWidth: '160px', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
                <button onClick={handleLogout} className="logout-btn" style={{ width: '100%', background: 'transparent', border: 'none', borderRadius: '6px', padding: '0.5rem 0.75rem', color: '#888', fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                  Deconnexion
                </button>
              </div>
            )}
          </div>
        </header>

        <main style={{ paddingTop: '60px', minHeight: '100vh' }}>
          {children}
        </main>
      </div>
    </>
  )
}
