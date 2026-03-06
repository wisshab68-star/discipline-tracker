import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { session, trades = [], alerts = [] } = body

    if (!session) {
      return NextResponse.json({ error: 'Session data required' }, { status: 400 })
    }

    const scoreLabel = session.avg_score >= 75 ? 'Excellent' : session.avg_score >= 50 ? 'Correct' : 'A ameliorer'
    const critAlerts = alerts.filter((a: { severity: string }) => a.severity === 'CRITICAL').length
    const warnAlerts = alerts.filter((a: { severity: string }) => a.severity === 'WARNING').length

    const tradesSummary = trades.length > 0
      ? trades.slice(0, 10).map((t: { symbol: string; side: string; open_price: number; sl_price: number; tp_price: number }) =>
          `- ${t.symbol} ${t.side} | Prix: ${t.open_price} | SL: ${t.sl_price ?? 'non defini'} | TP: ${t.tp_price ?? 'non defini'}`
        ).join('\n')
      : 'Aucun trade enregistre'

    const alertsSummary = alerts.length > 0
      ? alerts.slice(0, 8).map((a: { alert_type: string; severity: string; message?: string }) =>
          `- [${a.severity}] ${a.alert_type}${a.message ? ': ' + a.message : ''}`
        ).join('\n')
      : 'Aucune alerte'

    const prompt = `Tu es un coach de trading professionnel et bienveillant. Analyse cette session de trading et fournis un retour coaching personnalise en francais.

## Donnees de session
- Score de discipline: ${Math.round(session.avg_score)}/100 (${scoreLabel})
- Nombre de trades: ${session.total_trades}
- Alertes critiques: ${critAlerts}
- Alertes warning: ${warnAlerts}

## Trades de la session
${tradesSummary}

## Alertes declenchees
${alertsSummary}

## Instructions
Redige une analyse coaching de 3 a 5 paragraphes courts avec:
1. Une evaluation directe du score et de la discipline globale (sois honnete mais bienveillant)
2. Les points forts identifies dans cette session
3. Les axes d'amelioration prioritaires (1 ou 2 max, concrets et actionnables)
4. Un conseil specifique pour la prochaine session
5. Une phrase de motivation finale adaptee au score

Ton: professionnel, direct, comme un mentor qui connait bien le trader. Pas de bullet points excessifs — ecris de facon fluide. Utilise le tutoiement.`

    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      thinking: { type: 'adaptive' },
      messages: [{ role: 'user', content: prompt }],
    })

    const text = response.content.find(b => b.type === 'text')?.text ?? ''
    return NextResponse.json({ analysis: text, score: Math.round(session.avg_score) })

  } catch (err) {
    console.error('[journal/route] error:', err)
    if (err instanceof Anthropic.AuthenticationError) {
      return NextResponse.json({ error: 'Cle API invalide — verifie ANTHROPIC_API_KEY' }, { status: 401 })
    }
    if (err instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ error: 'Limite API atteinte — reessaie dans quelques instants' }, { status: 429 })
    }
    return NextResponse.json({ error: 'Erreur lors de la generation' }, { status: 500 })
  }
}
