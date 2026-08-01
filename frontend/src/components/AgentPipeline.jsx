const AgentPipeline = ({ currentAgent }) => {
  const agents = [
    {
      id: 'input_guardrail',
      name: 'Validating your query',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'stock_finder',
      name: 'Scanning NSE for candidates',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    {
      id: 'market_data',
      name: 'Fetching live market data',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    },
    {
      id: 'news_analyst',
      name: 'Analysing news & sentiment',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      )
    },
    {
      id: 'recommender',
      name: 'Generating trading recommendations',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    }
  ]

  const getCurrentIndex = () => {
    return agents.findIndex(agent => agent.id === currentAgent)
  }

  const currentIndex = getCurrentIndex()

  return (
    <div className="mt-12 mb-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-dark-800/50 to-dark-900/50 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">AGENT PIPELINE</h3>
              <p className="text-sm text-slate-400">6 specialised AI agents working in sequence</p>
            </div>
          </div>

          <div className="space-y-4">
            {agents.map((agent, index) => {
              const isActive = index === currentIndex
              const isCompleted = index < currentIndex
              const isPending = index > currentIndex

              return (
                <div
                  key={agent.id}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-primary-500/10 border border-primary-500/30'
                      : isCompleted
                      ? 'bg-green-500/5 border border-green-500/20'
                      : 'bg-dark-800/30 border border-slate-700/30'
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                      isActive
                        ? 'bg-primary-500/20 text-primary-400 animate-pulse'
                        : isCompleted
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-slate-700/20 text-slate-500'
                    }`}
                  >
                    {isCompleted ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      agent.icon
                    )}
                  </div>

                  <div className="flex-1">
                    <p
                      className={`font-medium transition-all ${
                        isActive
                          ? 'text-white'
                          : isCompleted
                          ? 'text-green-300'
                          : 'text-slate-400'
                      }`}
                    >
                      {agent.name}
                    </p>
                  </div>

                  <div>
                    {isActive && (
                      <span className="px-3 py-1 bg-primary-500/20 text-primary-400 text-xs font-semibold rounded-full uppercase">
                        Running
                      </span>
                    )}
                    {isCompleted && (
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full uppercase">
                        Done
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-700/30">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">
                Progress: {currentIndex + 1} / {agents.length}
              </span>
              <div className="flex-1 mx-4 h-2 bg-dark-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500"
                  style={{ width: `${((currentIndex + 1) / agents.length) * 100}%` }}
                />
              </div>
              <span className="text-slate-400">
                {Math.round(((currentIndex + 1) / agents.length) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AgentPipeline
