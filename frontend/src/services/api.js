import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 300000, // 5 minutes timeout for long agent execution
})

export const analyzeStockStreaming = async (query, onProgress) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    })

    if (!response.ok) {
      throw new Error('Failed to connect to backend')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { value, done } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n')

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = JSON.parse(line.slice(6))
          onProgress(data)

          if (data.type === 'complete') {
            return data
          } else if (data.type === 'error') {
            throw new Error(data.error)
          }
        }
      }
    }
  } catch (error) {
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error('No response from server. Please check if the backend is running.')
    }
    throw error
  }
}

export const analyzeStock = async (query) => {
  try {
    const response = await apiClient.post('/api/analyze', { query })
    return response.data
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.detail || 'Analysis failed')
    } else if (error.request) {
      throw new Error('No response from server. Please check if the backend is running.')
    } else {
      throw new Error('Request failed: ' + error.message)
    }
  }
}

export const checkHealth = async () => {
  try {
    const response = await apiClient.get('/health')
    return response.data
  } catch (error) {
    throw new Error('Backend health check failed')
  }
}
