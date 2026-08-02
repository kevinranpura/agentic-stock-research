const StockTicker = () => {
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
    { symbol: 'LT', change: '+0.9%', positive: true },
    { symbol: 'SUNPHARMA', change: '-0.4%', positive: false },
    { symbol: 'TITAN', change: '+1.7%', positive: true },
  ];
  // Render the list twice back-to-back and animate a translateX(-50%) loop.
  // Since both halves are identical, the moment the first half scrolls
  // fully offscreen the second half is in the exact same visual position —
  // so the animation can repeat forever with no visible seam or JS state.
  const track = [...stocks, ...stocks]

  return (
    <div className="bg-surface-950 border-b border-line overflow-hidden sticky top-0 z-50">
      <div className="flex gap-10 py-2 font-mono w-max animate-marquee">
        {track.map((stock, index) => (
          <div key={index} className="flex items-center gap-2 whitespace-nowrap text-xs">
            <span className="text-[#9ca3af] tracking-[0.1em]">{stock.symbol}</span>
            <span className={stock.positive ? 'text-up' : 'text-down'}>
              {stock.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StockTicker
