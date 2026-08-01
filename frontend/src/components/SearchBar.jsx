import { useState } from 'react'

const SearchBar = ({ onAnalyze, isAnalyzing }) => {
  const [query, setQuery] = useState('')

  const suggestedQueries = [
    'Recommend good NSE stocks',
    'Best NSE stocks to buy today',
    'Which NSE stocks should I invest in?'
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
    <div className="mt-12 mb-8">
      <div className="text-center mb-8">
        <h2 className="text-5xl font-bold mb-4">
          <span className="text-white">NSE Stock Intelligence</span>
        </h2>
        <h3 className="text-3xl font-bold mb-6">
          <span className="text-gradient">Powered by LangGraph</span>
        </h3>
        <p className="text-slate-400 text-lg max-w-3xl mx-auto">
          Ask anything about NSE stocks. Agents research, gather market data, analyse news, and
          produce confident trading recommendations.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Recommend good NSE stocks for short-term trading"
            disabled={isAnalyzing}
            className="w-full pl-12 pr-32 py-4 bg-dark-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
          
          <button
            type="submit"
            disabled={!query.trim() || isAnalyzing}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-medium hover:from-primary-600 hover:to-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-primary-500/25"
          >
            {isAnalyzing ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analysing
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Analyze
              </>
            )}
          </button>
        </div>
      </form>

      {!isAnalyzing && (
        <div className="max-w-3xl mx-auto flex flex-wrap gap-3 justify-center">
          {suggestedQueries.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-4 py-2 bg-dark-800/50 hover:bg-dark-700/50 border border-slate-700/50 hover:border-slate-600/50 rounded-lg text-sm text-slate-300 hover:text-white transition-all"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchBar
