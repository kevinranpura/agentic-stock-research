const AgentPipeline = ({ currentAgent }) => {
  const agents = [
    { id: 'input_guardrail', name: 'Validating your query' },
    { id: 'stock_finder', name: 'Scanning NSE for candidates' },
    { id: 'market_data', name: 'Fetching live market data' },
    { id: 'news_analyst', name: 'Analysing news & sentiment' },
    { id: 'recommender', name: 'Generating trading recommendations' },
  ]

  const currentIndex = agents.findIndex((agent) => agent.id === currentAgent)
  const progress = ((currentIndex + 1) / agents.length) * 100

  return (
    <div className="mt-14 mb-14 max-w-2xl">
      <div className="flex items-baseline justify-between mb-8 pb-3 border-b border-line">
        <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-ink-muted">
          Agent Pipeline
        </h3>
        <span className="font-mono text-xs text-ink-faint tabular-nums">
          {currentIndex + 1} / {agents.length}
        </span>
      </div>

      <div className="relative pl-9">
        <div className="absolute left-[9px] top-1 bottom-1 w-px bg-line" />

        {agents.map((agent, index) => {
          const isActive = index === currentIndex
          const isCompleted = index < currentIndex

          return (
            <div key={agent.id} className="relative mb-7 last:mb-0">
              <div
                className={`absolute -left-9 top-0 w-[18px] h-[18px] rounded-full flex items-center justify-center border font-mono text-[9px] bg-surface-950 transition-colors ${
                  isActive
                    ? 'border-accent text-accent'
                    : isCompleted
                    ? 'border-up text-up'
                    : 'border-line text-ink-faint'
                }`}
              >
                {isCompleted ? '✓' : String(index).padStart(2, '0')}
              </div>

              <p
                className={`text-sm transition-colors ${
                  isActive ? 'text-ink' : isCompleted ? 'text-ink-muted' : 'text-ink-faint'
                }`}
              >
                {agent.name}
              </p>
              {isActive && (
                <p className="font-mono text-[10px] text-accent mt-1 uppercase tracking-wider">
                  Running
                </p>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-8">
        <div className="h-px bg-line relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-accent transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-end mt-2">
          <span className="font-mono text-[10px] text-ink-faint tabular-nums">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    </div>
  )
}

export default AgentPipeline
