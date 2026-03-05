import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="page-center">
      <div className="container-sm stack stack-xl" style={{ textAlign: 'center' }}>
        <h1 className="title title-lg">
          Discipline Tracker
        </h1>
        <p className="subtitle-lg">
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
