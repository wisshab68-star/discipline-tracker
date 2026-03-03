import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0F0F1A] p-4">
      <div className="max-w-2xl space-y-8 text-center">
        <h1 className="font-sans text-4xl font-bold text-[var(--text)]">
          Discipline Tracker
        </h1>
        <p className="text-lg text-muted-foreground">
          Mesure ta discipline comportementale de trading — pas ton P&L.
          <br />
          Reste aligné avec ton plan.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/login">
            <Button size="lg">Connexion</Button>
          </Link>
          <Link href="/signup">
            <Button variant="outline" size="lg">
              Inscription
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
