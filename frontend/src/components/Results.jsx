import StockCard from './StockCard'
import DataSection from './DataSection'

const Results = ({ data }) => {
  const { recommendations, stockCandidates, marketData, news } = data

  return (
    <div className="mt-12 space-y-8">
      {/* Main Recommendations */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Trading Recommendations</h2>
            <p className="text-slate-400 text-sm">AI-powered analysis with confidence scores</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {recommendations && recommendations.map((stock, index) => (
            <StockCard key={index} stock={stock} />
          ))}
        </div>
      </div>

      {/* Detailed Analysis Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stock Candidates */}
        {stockCandidates && stockCandidates.length > 0 && (
          <DataSection
            title="Stock Candidates"
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          >
            <div className="space-y-3">
              {stockCandidates.map((stock, index) => (
                <div key={index} className="p-3 bg-dark-800/50 rounded-lg border border-slate-700/30">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-white">{stock.company}</h4>
                      <p className="text-xs text-primary-400 font-mono">{stock.ticker}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400">{stock.reason}</p>
                </div>
              ))}
            </div>
          </DataSection>
        )}

        {/* Market Data */}
        {marketData && marketData.length > 0 && (
          <DataSection
            title="Market Data"
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
          >
            <div className="space-y-3">
              {marketData.map((stock, index) => (
                <div key={index} className="p-3 bg-dark-800/50 rounded-lg border border-slate-700/30">
                  <h4 className="font-semibold text-white mb-3 font-mono">{stock.ticker}</h4>
                  <div className="space-y-1.5 text-sm">
                    {/* Current Price */}
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Current Price:</span>
                      <span className="text-white font-semibold">
                        {stock.currentPrice ? `₹${stock.currentPrice.toFixed(2)}` : 'N/A'}
                      </span>
                    </div>
                    
                    {/* Previous Close */}
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Prev Close:</span>
                      <span className="text-slate-300 font-medium">
                        {stock.previousClose ? `₹${stock.previousClose.toFixed(2)}` : 'N/A'}
                      </span>
                    </div>
                    
                    {/* Day Change */}
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Day Change:</span>
                      <span className={`font-semibold ${
                        stock.changePercent > 0 ? 'text-green-400' : 
                        stock.changePercent < 0 ? 'text-red-400' : 
                        'text-slate-400'
                      }`}>
                        {stock.changePercent ? `${stock.changePercent > 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%` : 'N/A'}
                      </span>
                    </div>
                    
                    {/* Volume */}
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Volume:</span>
                      <span className="text-slate-300 font-medium">
                        {stock.volume ? stock.volume.toLocaleString() : 'N/A'}
                      </span>
                    </div>
                    
                    {/* Trend */}
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Trend:</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        stock.trend === 'Bullish' ? 'bg-green-500/20 text-green-400' :
                        stock.trend === 'Bearish' ? 'bg-red-500/20 text-red-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>
                        {stock.trend}
                      </span>
                    </div>
                    
                    {/* Volume Spike */}
                    {stock.volumeSpike && (
                      <div className="pt-2 mt-1 border-t border-slate-700/30">
                        <div className="flex items-center gap-1.5">
                          <span className="text-yellow-400">⚡</span>
                          <span className="text-xs text-yellow-400 font-medium">Volume Spike Detected</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </DataSection>
        )}

        {/* News & Sentiment */}
        {news && news.length > 0 && (
          <DataSection
            title="News & Sentiment"
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            }
          >
            <div className="space-y-3">
              {news.map((item, index) => (
                <div key={index} className="p-3 bg-dark-800/50 rounded-lg border border-slate-700/30">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-white font-mono">{item.ticker}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      item.sentiment === 'Positive' ? 'bg-green-500/20 text-green-400' :
                      item.sentiment === 'Negative' ? 'bg-red-500/20 text-red-400' :
                      'bg-slate-500/20 text-slate-400'
                    }`}>
                      {item.sentiment}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 mb-2">{item.summary}</p>
                  <p className="text-xs text-slate-500 italic">{item.impact}</p>
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
