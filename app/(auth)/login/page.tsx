'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [magicLink, setMagicLink] = useState(false)
  const supabase = createClient()

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signInWithOtp({ email })

    if (error) {
      setMessage(error.message)
    } else {
      setMagicLink(true)
      setMessage('Lien magique envoyé ! Vérifiez votre boîte mail.')
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-[#1E1E2E] p-8">
        <h1 className="font-sans text-2xl font-bold">Connexion</h1>
        <p className="text-sm text-muted-foreground">
          Discipline Tracker — Mesure ta discipline de trading
        </p>

        {magicLink ? (
          <p className="rounded-lg bg-green/20 p-4 text-sm text-green">
            {message}
          </p>
        ) : (
          <form onSubmit={handleMagicLink} className="space-y-4">
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
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Envoi...' : 'Recevoir le lien magique'}
            </Button>
            {message && (
              <p className="text-sm text-red">{message}</p>
            )}
          </form>
        )}

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
