import StockCard from './StockCard'
import DataSection from './DataSection'

const Results = ({ data }) => {
  const { recommendations, stockCandidates, marketData, news } = data

  return (
    <div className="mt-16 space-y-10">
      {/* Main Recommendations */}
      <div>
        <div className="mb-6 pb-3 border-b border-line">
          <h2 className="font-display text-2xl text-ink">Recommendations</h2>
          <p className="text-xs text-ink-faint mt-1">Confidence-scored calls</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {recommendations &&
            recommendations.map((stock, index) => (
              <StockCard key={index} stock={stock} />
            ))}
        </div>
      </div>

      {/* Detailed Analysis Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {stockCandidates && stockCandidates.length > 0 && (
          <DataSection title="Stock Candidates">
            <div className="space-y-3">
              {stockCandidates.map((stock, index) => (
                <div key={index} className="p-3 bg-surface-850 rounded-lg border border-line">
                  <div className="flex items-start justify-between mb-1.5">
                    <h4 className="font-medium text-ink text-sm">{stock.company}</h4>
                  </div>
                  <p className="font-mono text-xs text-accent mb-2">{stock.ticker}</p>
                  <p className="text-sm text-ink-muted leading-relaxed">{stock.reason}</p>
                </div>
              ))}
            </div>
          </DataSection>
        )}

        {marketData && marketData.length > 0 && (
          <DataSection title="Market Data">
            <div className="space-y-3">
              {marketData.map((stock, index) => (
                <div key={index} className="p-3 bg-surface-850 rounded-lg border border-line">
                  <h4 className="font-mono text-sm text-ink mb-3">{stock.ticker}</h4>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-ink-faint text-xs">Price</span>
                      <span className="font-mono text-ink tabular-nums">
                        {stock.currentPrice ? `₹${stock.currentPrice.toFixed(2)}` : 'N/A'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-ink-faint text-xs">Prev Close</span>
                      <span className="font-mono text-ink-muted tabular-nums">
                        {stock.previousClose ? `₹${stock.previousClose.toFixed(2)}` : 'N/A'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-ink-faint text-xs">Change</span>
                      <span
                        className={`font-mono tabular-nums ${
                          stock.changePercent > 0
                            ? 'text-up'
                            : stock.changePercent < 0
                            ? 'text-down'
                            : 'text-ink-muted'
                        }`}
                      >
                        {stock.changePercent
                          ? `${stock.changePercent > 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%`
                          : 'N/A'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-ink-faint text-xs">Volume</span>
                      <span className="font-mono text-ink-muted tabular-nums">
                        {stock.volume ? stock.volume.toLocaleString() : 'N/A'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-ink-faint text-xs">Trend</span>
                      <span
                        className={
                          stock.trend === 'Bullish'
                            ? 'text-up'
                            : stock.trend === 'Bearish'
                            ? 'text-down'
                            : 'text-ink-muted'
                        }
                      >
                        {stock.trend}
                      </span>
                    </div>

                    {stock.volumeSpike && (
                      <div className="pt-2 mt-1 border-t border-line">
                        <span className="text-xs text-accent">Volume spike detected</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </DataSection>
        )}

        {news && news.length > 0 && (
          <DataSection title="News & Sentiment">
            <div className="space-y-3">
              {news.map((item, index) => (
                <div key={index} className="p-3 bg-surface-850 rounded-lg border border-line">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-mono text-sm text-ink">{item.ticker}</h4>
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-full border ${
                        item.sentiment === 'Positive'
                          ? 'text-up border-up/30'
                          : item.sentiment === 'Negative'
                          ? 'text-down border-down/30'
                          : 'text-ink-muted border-line'
                      }`}
                    >
                      {item.sentiment}
                    </span>
                  </div>
                  <p className="text-sm text-ink-muted mb-2 leading-relaxed">{item.summary}</p>
                  <p className="text-xs text-ink-faint italic">{item.impact}</p>
                </div>
              ))}
            </div>
          </DataSection>
        )}
      </div>
    </div>
  )
}

export default Results
