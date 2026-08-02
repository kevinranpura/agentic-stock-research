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
    <div className="min-h-screen bg-surface-950">
      <StockTicker />
      <Header />

      <main className="container mx-auto px-6 py-4 max-w-6xl">
        <SearchBar onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />

        {error && (
          <div className="mt-8 p-5 bg-down/5 border border-down/30 rounded-md">
            <p className="font-mono text-sm text-down">{error}</p>
          </div>
        )}

        {isAnalyzing && currentAgent && <AgentPipeline currentAgent={currentAgent} />}

        {results && !isAnalyzing && <Results data={results} />}

        {!isAnalyzing && !results && !error && (
          <div className="mt-24 mb-12 flex flex-col items-center text-center">
            <div className="w-px h-12 bg-line mb-6" />
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-ink-faint">
              Awaiting query
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
