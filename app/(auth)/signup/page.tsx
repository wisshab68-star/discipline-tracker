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
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-[#1E1E2E] p-8">
        <h1 className="font-sans text-2xl font-bold">Inscription</h1>
        <p className="text-sm text-muted-foreground">
          Crée ton compte Discipline Tracker
        </p>

        <form onSubmit={handleSignup} className="space-y-4">
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
              minLength={6}
              className="w-full rounded-lg border border-border bg-[#16213E] px-4 py-3 text-white placeholder:text-muted-foreground focus:border-accent focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm text-muted-foreground">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="w-full rounded-lg border border-border bg-[#16213E] px-4 py-3 text-white placeholder:text-muted-foreground focus:border-accent focus:outline-none"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Création...' : 'Créer mon compte'}
          </Button>
          {message && (
            <p className="text-sm text-red">{message}</p>
          )}
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Déjà un compte ?{' '}
          <Link href="/login" className="text-accent hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}
