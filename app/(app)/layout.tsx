'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/login')
  }

  const isActive = (path: string) => {
    if (path === '/dashboard') return pathname === '/dashboard'
    if (path === '/session') return pathname === '/session'
    return pathname.startsWith('/history') || (pathname.startsWith('/session/') && pathname !== '/session')
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <header className="header">
        <div className="header-inner">
          <nav className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className={`nav-link ${isActive('/dashboard') ? 'nav-link-active' : ''}`}
            >
              Dashboard
            </Link>
            <Link
              href="/session"
              className={`nav-link ${isActive('/session') ? 'nav-link-active' : ''}`}
            >
              Session
            </Link>
            <Link
              href="/history"
              className={`nav-link ${isActive('/history') ? 'nav-link-active' : ''}`}
            >
              Historique
            </Link>
          </nav>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Déconnexion
          </Button>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
