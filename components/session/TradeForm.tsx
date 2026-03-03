'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { TradeSide } from '@/lib/types'

interface TradeFormProps {
  onSubmit: (data: {
    symbol: string
    side: TradeSide
    lot_size: number
    open_price: number
    stop_loss: number | null
    take_profit: number | null
  }) => void
  onCancel: () => void
}

export function TradeForm({ onSubmit, onCancel }: TradeFormProps) {
  const [symbol, setSymbol] = useState('')
  const [side, setSide] = useState<TradeSide>('LONG')
  const [lotSize, setLotSize] = useState('0.01')
  const [openPrice, setOpenPrice] = useState('')
  const [stopLoss, setStopLoss] = useState('')
  const [takeProfit, setTakeProfit] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      symbol: symbol.trim() || 'N/A',
      side,
      lot_size: parseFloat(lotSize) || 0.01,
      open_price: parseFloat(openPrice) || 0,
      stop_loss: stopLoss ? parseFloat(stopLoss) : null,
      take_profit: takeProfit ? parseFloat(takeProfit) : null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-xs text-muted-foreground">Symbole</label>
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="EUR/USD"
          className="w-full rounded-lg border border-border bg-[#16213E] px-3 py-2 text-sm text-white placeholder:text-muted-foreground focus:border-accent focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted-foreground">Direction</label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={side === 'LONG' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSide('LONG')}
          >
            LONG
          </Button>
          <Button
            type="button"
            variant={side === 'SHORT' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSide('SHORT')}
          >
            SHORT
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">Lot size</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={lotSize}
            onChange={(e) => setLotSize(e.target.value)}
            className="w-full rounded-lg border border-border bg-[#16213E] px-3 py-2 text-sm text-white focus:border-accent focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">Prix ouverture</label>
          <input
            type="number"
            step="0.00001"
            value={openPrice}
            onChange={(e) => setOpenPrice(e.target.value)}
            required
            className="w-full rounded-lg border border-border bg-[#16213E] px-3 py-2 text-sm text-white focus:border-accent focus:outline-none"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">Stop Loss (opt.)</label>
          <input
            type="number"
            step="0.00001"
            value={stopLoss}
            onChange={(e) => setStopLoss(e.target.value)}
            className="w-full rounded-lg border border-border bg-[#16213E] px-3 py-2 text-sm text-white focus:border-accent focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">Take Profit (opt.)</label>
          <input
            type="number"
            step="0.00001"
            value={takeProfit}
            onChange={(e) => setTakeProfit(e.target.value)}
            className="w-full rounded-lg border border-border bg-[#16213E] px-3 py-2 text-sm text-white focus:border-accent focus:outline-none"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="submit" className="flex-1">Enregistrer</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
      </div>
    </form>
  )
}
