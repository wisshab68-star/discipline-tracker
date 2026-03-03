'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface DataPoint {
  session: string
  score: number
  date: string
}

interface ScoreChartProps {
  data: DataPoint[]
}

export function ScoreChart({ data }: ScoreChartProps) {
  return (
    <Card className="border-border bg-[#1E1E2E]">
      <CardHeader>
        <h3 className="font-sans font-semibold">Évolution du score</h3>
        <p className="text-xs text-muted-foreground">
          30 dernières sessions
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="session"
                stroke="var(--text-muted)"
                fontSize={12}
              />
              <YAxis
                stroke="var(--text-muted)"
                fontSize={12}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E1E2E',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'var(--text)' }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#27AE60"
                strokeWidth={2}
                dot={{ fill: '#27AE60', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
