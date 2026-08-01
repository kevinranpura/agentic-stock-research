import { useState } from 'react'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import AgentPipeline from './components/AgentPipeline'
import Results from './components/Results'
import StockTicker from './components/StockTicker'
import { analyzeStockStreaming } from './services/api'

function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [currentAgent, setCurrentAgent] = useState(null)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)

  const handleAnalyze = async (query) => {
    setIsAnalyzing(true)
    setError(null)
    setResults(null)
    setCurrentAgent(null)

    try {
      await analyzeStockStreaming(query, (data) => {
        if (data.type === 'agent_start') {
          setCurrentAgent(data.agent)
        } else if (data.type === 'agent_complete') {
          // Agent completed, will move to next automatically
        } else if (data.type === 'complete') {
          // Final results received
          if (data.success) {
            setResults(data.data)
          }
        } else if (data.type === 'error') {
          setError(data.error)
        }
      })
    } catch (err) {
      setError(err.message || 'Failed to analyze stocks. Please try again.')
    } finally {
      setIsAnalyzing(false)
      setCurrentAgent(null)
    }
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <StockTicker />
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <SearchBar 
          onAnalyze={handleAnalyze} 
          isAnalyzing={isAnalyzing}
        />

        {error && (
          <div className="mt-8 p-6 bg-red-900/20 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-center">{error}</p>
          </div>
        )}

        {isAnalyzing && currentAgent && (
          <AgentPipeline currentAgent={currentAgent} />
        )}

        {results && !isAnalyzing && (
          <Results data={results} />
        )}

        {!isAnalyzing && !results && !error && (
          <div className="mt-16 text-center">
            <div className="inline-block p-8 rounded-2xl bg-gradient-to-br from-primary-500/10 to-primary-600/5 border border-primary-500/20">
              <svg className="w-16 h-16 mx-auto mb-4 text-primary-500 animate-pulse-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <p className="text-slate-400 text-lg">
                Ask anything about NSE stocks
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
