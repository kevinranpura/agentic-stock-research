const Header = () => {
  return (
    <header className="border-b border-line bg-surface-950/90 backdrop-blur-sm sticky top-[33px] z-50">
      <div className="container mx-auto px-6 py-4 max-w-6xl">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-[30px]">
            <h1 className="font-display text-lg text-ink tracking-tight">
              StockSage - AI Stock Recommendation Platform
            </h1>
            <span className="font-mono text-[10px] text-[#6b7280] uppercase tracking-[0.2em]">
              NSE · Multi Agent System
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-up opacity-75 animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-up" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">
              Live
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
