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
    <form onSubmit={handleSubmit} className="stack">
      <div className="form-group">
        <label className="form-label">Symbole</label>
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="EUR/USD"
          className="input"
        />
      </div>
      <div className="form-group">
        <label className="form-label">Direction</label>
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
      <div className="grid-2">
        <div className="form-group">
          <label className="form-label">Lot size</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={lotSize}
            onChange={(e) => setLotSize(e.target.value)}
            className="input"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Prix ouverture</label>
          <input
            type="number"
            step="0.00001"
            value={openPrice}
            onChange={(e) => setOpenPrice(e.target.value)}
            required
            className="input"
          />
        </div>
      </div>
      <div className="grid-2">
        <div className="form-group">
          <label className="form-label">Stop Loss (opt.)</label>
          <input
            type="number"
            step="0.00001"
            value={stopLoss}
            onChange={(e) => setStopLoss(e.target.value)}
            className="input"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Take Profit (opt.)</label>
          <input
            type="number"
            step="0.00001"
            value={takeProfit}
            onChange={(e) => setTakeProfit(e.target.value)}
            className="input"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="submit" className="btn-flex-1">Enregistrer</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
      </div>
    </form>
  )
}
