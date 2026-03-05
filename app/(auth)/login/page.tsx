'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setError(error.message)
      } else {
        setSent(true)
      }
    } catch {
      setError('Une erreur inattendue est survenue. Réessaie.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="page-center">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <h1 className="title">Vérifie ton email</h1>
          <p className="subtitle">
            Un lien de connexion a été envoyé à{' '}
            <strong style={{ color: 'var(--text)' }}>{email}</strong>.
            Clique dessus pour accéder à ton compte.
          </p>
          <button
            onClick={() => { setSent(false); setEmail('') }}
            className="btn btn-ghost btn-full"
            style={{ marginTop: '0.5rem' }}
          >
            Utiliser un autre email
          </button>
        </div>
      </div>
    )
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
          <Button type="submit" className="btn-full" disabled={loading}>
            {loading ? 'Envoi en cours...' : 'Recevoir le lien de connexion'}
          </Button>
          {error && <p className="error-msg">{error}</p>}
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
