const StockCard = ({ stock }) => {
  const getActionColor = (action) => {
    switch (action) {
      case 'BUY':
        return 'from-green-500 to-green-600'
      case 'SELL':
        return 'from-red-500 to-red-600'
      case 'HOLD':
        return 'from-yellow-500 to-yellow-600'
      default:
        return 'from-slate-500 to-slate-600'
    }
  }

  const getActionBorderColor = (action) => {
    switch (action) {
      case 'BUY':
        return 'border-green-500/30'
      case 'SELL':
        return 'border-red-500/30'
      case 'HOLD':
        return 'border-yellow-500/30'
      default:
        return 'border-slate-500/30'
    }
  }

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-green-400'
    if (confidence >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className={`bg-gradient-to-br from-dark-800/50 to-dark-900/50 border ${getActionBorderColor(stock.action)} rounded-2xl p-6 backdrop-blur-sm hover:border-opacity-50 transition-all hover:shadow-lg`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white font-mono mb-1">{stock.ticker}</h3>
          <div className={`inline-block px-3 py-1 bg-gradient-to-r ${getActionColor(stock.action)} rounded-lg text-white text-sm font-bold shadow-lg`}>
            {stock.action}
          </div>
        </div>
        <div className="text-right">
          <p className="text-slate-400 text-sm mb-1">Confidence</p>
          <div className="flex items-center gap-2">
            <div className="relative w-16 h-16">
              <svg className="transform -rotate-90 w-16 h-16">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  className="text-slate-700"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray={`${(stock.confidence / 100) * 176} 176`}
                  className={getConfidenceColor(stock.confidence)}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-lg font-bold ${getConfidenceColor(stock.confidence)}`}>
                  {stock.confidence}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-dark-700/30 rounded-lg border border-slate-700/30">
          <p className="text-slate-400 text-xs mb-1">Target Price</p>
          <p className="text-2xl font-bold text-white">₹{stock.targetPrice.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-dark-700/30 rounded-lg border border-slate-700/30">
          <p className="text-slate-400 text-xs mb-1">Action</p>
          <p className="text-2xl font-bold text-white">{stock.action}</p>
        </div>
      </div>

      {/* Reason */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-4 h-4 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h4 className="font-semibold text-white text-sm">Reason</h4>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed pl-6">{stock.reason}</p>
      </div>

      {/* Risk */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h4 className="font-semibold text-white text-sm">Risk</h4>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed pl-6">{stock.risk}</p>
      </div>
    </div>
  )
}

export default StockCard
