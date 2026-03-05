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
    <div className="page-center">
      <div className="auth-card">
        <h1 className="title">Connexion</h1>
        <p className="subtitle">
          Discipline Tracker — Mesure ta discipline de trading
        </p>

        <form onSubmit={handleLogin} className="stack">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.com"
              required
              className="input input-lg"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="input input-lg"
            />
          </div>
          <Button type="submit" className="btn-full" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>
          {message && <p className="error-msg">{message}</p>}
        </form>

        <p className="subtitle" style={{ textAlign: 'center' }}>
          Pas encore de compte ?{' '}
          <Link href="/signup" className="link-accent">
            S&apos;inscrire
          </Link>
        </p>
      </div>
    </div>
  )
}
