import { useState } from 'react'

const SearchBar = ({ onAnalyze, isAnalyzing }) => {
  const [query, setQuery] = useState('')

  const suggestedQueries = [
    'Recommend good NSE stocks',
    'Best NSE stocks to buy today',
    'Which NSE stocks should I invest in?',
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim() && !isAnalyzing) {
      onAnalyze(query)
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion)
    if (!isAnalyzing) {
      onAnalyze(suggestion)
    }
  }

  return (
    <div className="mt-16 mb-10 max-w-3xl">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent mb-4">
        NSE · AI Recommendations
      </p>
      <h2 className="font-display text-5xl md:text-6xl text-ink leading-[1.05] mb-5">
        Stock research,
        <br />
        run by agents.
      </h2>
      <p className="text-ink-muted text-base max-w-xl mb-10 leading-relaxed">
        Get AI-powered BUY, HOLD, or SELL recommendations for NSE stocks. Multiple AI agents analyze live market data, recent news, and trading signals to generate confidence-scored recommendations.
      </p>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="border border-line rounded-md bg-surface-900 focus-within:border-accent/60 transition-colors">
          <div className="flex items-center px-4">
            <span className="font-mono text-accent text-sm mr-3 select-none">›</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="recommend good NSE stocks for short-term trading"
              disabled={isAnalyzing}
              className="flex-1 bg-transparent py-4 font-mono text-sm text-ink placeholder-ink-faint focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!query.trim() || isAnalyzing}
              className="ml-3 shrink-0 px-4 py-2 border border-line hover:border-accent text-ink text-xs font-mono uppercase tracking-widest transition-colors disabled:opacity-40 disabled:hover:border-line rounded-sm"
            >
              {isAnalyzing ? 'Running…' : 'Run →'}
            </button>
          </div>
        </div>
      </form>

      {!isAnalyzing && (
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {suggestedQueries.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="font-mono text-xs text-ink-faint hover:text-accent transition-colors"
            >
              {suggestion} →
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchBar
