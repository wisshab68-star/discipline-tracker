'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

function getSignupErrorMessage(error: { message: string }): string {
  if (
    error.message.includes('already registered') ||
    error.message.includes('already exists') ||
    error.message.includes('User already registered')
  ) {
    return 'Cet email est déjà utilisé'
  }
  return error.message
}

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    if (password !== confirmPassword) {
      setMessage('Les mots de passe ne correspondent pas')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setMessage(getSignupErrorMessage(error))
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="page-center">
      <div className="auth-card">
        <h1 className="title">Inscription</h1>
        <p className="subtitle">
          Crée ton compte Discipline Tracker
        </p>

        <form onSubmit={handleSignup} className="stack">
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
              minLength={6}
              className="input input-lg"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Confirmer le mot de passe</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="input input-lg"
            />
          </div>
          <Button type="submit" className="btn-full" disabled={loading}>
            {loading ? 'Création...' : 'Créer mon compte'}
          </Button>
          {message && <p className="error-msg">{message}</p>}
        </form>

        <p className="subtitle" style={{ textAlign: 'center' }}>
          Déjà un compte ?{' '}
          <Link href="/login" className="link-accent">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}
