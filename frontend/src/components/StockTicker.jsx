import { useEffect, useState } from 'react'

const StockTicker = () => {
  const [offset, setOffset] = useState(0)

  // Mock stock data for the ticker
  const stocks = [
    { symbol: 'RELIANCE', change: '+1.2%', positive: true },
    { symbol: 'TCS', change: '-0.8%', positive: false },
    { symbol: 'INFY', change: '+2.1%', positive: true },
    { symbol: 'HDFCBANK', change: '+0.5%', positive: true },
    { symbol: 'ICICIBANK', change: '-0.3%', positive: false },
    { symbol: 'WIPRO', change: '-1.2%', positive: false },
    { symbol: 'AXISBANK', change: '+1.8%', positive: true },
    { symbol: 'SBIN', change: '+0.7%', positive: true },
    { symbol: 'BAJFINANCE', change: '-1.5%', positive: false },
    { symbol: 'MARUTI', change: '+2.3%', positive: true },
    { symbol: 'BHARTIARTL', change: '+1.1%', positive: true },
    { symbol: 'ITC', change: '+0.6%', positive: true },
    { symbol: 'HDFCBANK', change: '+1.5%', positive: true },
    { symbol: 'JCICBANK', change: '-0.9%', positive: false },
    { symbol: 'WIPROFIN', change: '+1.7%', positive: true },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prev) => prev - 1)
    }, 30)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-dark-900 border-b border-slate-800/50 overflow-hidden">
      <div 
        className="flex gap-8 py-2"
        style={{
          transform: `translateX(${offset}px)`,
          width: 'max-content',
        }}
      >
        {[...stocks, ...stocks, ...stocks].map((stock, index) => (
          <div key={index} className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-sm font-semibold text-slate-300">{stock.symbol}</span>
            <span className={`text-sm font-medium ${stock.positive ? 'text-green-400' : 'text-red-400'}`}>
              {stock.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StockTicker
