# Discipline Tracker

Application SaaS pour mesurer la **discipline comportementale** des traders (forex, crypto, futures). L'app se concentre sur le respect du plan, la gestion du risque et la stabilité émotionnelle — pas sur le P&L.

## Stack

- **Framework** : Next.js 14 (App Router)
- **Langage** : TypeScript strict
- **Styles** : Tailwind CSS v3
- **Composants** : shadcn/ui
- **Auth** : Supabase Auth (email + mot de passe)
- **Database** : Supabase (PostgreSQL)
- **Déploiement** : Vercel

## Configuration

1. **Variables d'environnement**

Copiez `.env.local` et remplissez vos clés Supabase :

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx
```

2. **Base de données**

Appliquez la migration Supabase :

```bash
supabase db push
# ou exécutez manuellement le contenu de supabase/migrations/001_init.sql
```

3. **shadcn/ui** (optionnel — les composants de base sont déjà inclus)

```bash
npx shadcn-ui@latest init
```

## Démarrage

```bash
npm install
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

## Déploiement Vercel

1. `npx vercel`
2. Ajoutez `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` dans les variables d'environnement du projet Vercel.

## Structure

- `/dashboard` — Analytics, score moyen, évolution, sessions, alertes
- `/session` — Session de trading active, checklist pré-trade, liste des trades
- `/history` — Historique des sessions
- `/session/[id]` — Détail d'une session passée
