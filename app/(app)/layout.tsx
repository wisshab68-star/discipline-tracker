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

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border bg-[#0F0F1A]/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <nav className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className={`font-sans font-medium ${pathname === '/dashboard' ? 'text-accent' : 'text-muted-foreground hover:text-[var(--text)]'}`}
            >
              Dashboard
            </Link>
            <Link
              href="/session"
              className={`font-sans font-medium ${pathname === '/session' ? 'text-accent' : 'text-muted-foreground hover:text-[var(--text)]'}`}
            >
              Session
            </Link>
            <Link
              href="/history"
              className={`font-sans font-medium ${pathname.startsWith('/history') || (pathname.startsWith('/session/') && pathname !== '/session') ? 'text-accent' : 'text-muted-foreground hover:text-[var(--text)]'}`}
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
