'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

function getLoginErrorMessage(error: { message: string }): string {
  if (
    error.message.includes('Invalid login credentials') ||
    error.message.includes('invalid_credentials')
  ) {
    return 'Email ou mot de passe incorrect'
  }
  return error.message
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setMessage(getLoginErrorMessage(error))
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-[#1E1E2E] p-8">
        <h1 className="font-sans text-2xl font-bold">Connexion</h1>
        <p className="text-sm text-muted-foreground">
          Discipline Tracker — Mesure ta discipline de trading
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-muted-foreground">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.com"
              required
              className="w-full rounded-lg border border-border bg-[#16213E] px-4 py-3 text-white placeholder:text-muted-foreground focus:border-accent focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm text-muted-foreground">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full rounded-lg border border-border bg-[#16213E] px-4 py-3 text-white placeholder:text-muted-foreground focus:border-accent focus:outline-none"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>
          {message && (
            <p className="text-sm text-red">{message}</p>
          )}
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Pas encore de compte ?{' '}
          <Link href="/signup" className="text-accent hover:underline">
            S&apos;inscrire
          </Link>
        </p>
      </div>
    </div>
  )
}
