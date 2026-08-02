const StockCard = ({ stock }) => {
  const actionStyles = {
    BUY: 'text-up border-up/40 bg-up/5',
    SELL: 'text-down border-down/40 bg-down/5',
    HOLD: 'text-accent border-accent/40 bg-accent/5',
  }

  const confidenceColor =
    stock.confidence >= 80 ? 'bg-up' : stock.confidence >= 60 ? 'bg-accent' : 'bg-down'

  return (
    <div className="border border-line rounded-md bg-surface-900 p-6 hover:border-ink-faint/50 transition-colors">
      <div className="flex items-start justify-between mb-6 pb-5 border-b border-line">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint mb-1">
            Ticker
          </p>
          <h3 className="font-display text-3xl text-ink">{stock.ticker}</h3>
        </div>
        <span
          className={`font-mono text-xs uppercase tracking-widest px-2.5 py-1 rounded-sm border ${
            actionStyles[stock.action] || 'text-ink-muted border-line bg-surface-800'
          }`}
        >
          {stock.action}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint mb-1.5">
            Target
          </p>
          <p className="font-mono text-xl text-ink tabular-nums">
            ₹{stock.targetPrice.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint mb-1.5">
            Confidence
          </p>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1 bg-line rounded-full overflow-hidden">
              <div
                className={`h-full ${confidenceColor}`}
                style={{ width: `${stock.confidence}%` }}
              />
            </div>
            <span className="font-mono text-sm text-ink tabular-nums">{stock.confidence}</span>
          </div>
        </div>
      </div>

      <div className="mb-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint mb-1.5">
          Reason
        </p>
        <p className="text-sm text-ink-muted leading-relaxed">{stock.reason}</p>
      </div>

      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint mb-1.5">
          Risk
        </p>
        <p className="text-sm text-ink-muted leading-relaxed">{stock.risk}</p>
      </div>
    </div>
  )
}

export default StockCard
