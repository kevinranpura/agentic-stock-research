# 📈 Agentic AI Stock Research System

An intelligent NSE stock analysis platform powered by **LangGraph**, **FastAPI**, and **React**. This multi-agent system researches stocks, gathers market data, analyzes news sentiment, and generates confident trading recommendations.

![NSE Stock Intelligence](https://img.shields.io/badge/NSE-Stock%20Intelligence-blue)
![Python](https://img.shields.io/badge/Python-3.11+-green)
![React](https://img.shields.io/badge/React-18.3-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-teal)
![LangGraph](https://img.shields.io/badge/LangGraph-AI%20Agents-purple)

## 🌟 Features

- **Multi-Agent Pipeline**: 6 specialized AI agents working in sequence
  - Input Guardrail: Validates user queries
  - Stock Finder: Scans NSE for promising candidates
  - Market Data Agent: Fetches live market data
  - News Analyst: Analyzes recent news and sentiment
  - Price Recommender: Generates trading recommendations
  - Output Guardrail: Ensures safe financial advice

- **Real-time Analysis**: Live market data integration via MCP tools
- **RAG-Enhanced**: Uses vector database for trading framework and risk policies
- **Modern UI**: Beautiful dark-themed React interface with Tailwind CSS
- **Safety First**: Built-in guardrails to prevent unsafe financial claims

## 🏗️ Architecture

```
agentic-stock-research/
├── backend/                 # FastAPI backend
│   ├── main.py             # FastAPI server with REST endpoints
│   ├── agents.py           # LangGraph agent definitions
│   ├── graph.py            # Agent workflow graph
│   ├── state.py            # State management
│   ├── schemas.py          # Pydantic models
│   ├── guardrails.py       # Input/output validation
│   ├── rag/                # RAG retrieval system
│   │   ├── retriever.py
│   │   └── create_vector_db.py
│   └── knowledge_base/     # Trading rules & risk policies
│       ├── recommendation_framework.md
│       └── risk_policy.md
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Header.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── AgentPipeline.jsx
│   │   │   ├── Results.jsx
│   │   │   ├── StockCard.jsx
│   │   │   ├── StockTicker.jsx
│   │   │   └── DataSection.jsx
│   │   ├── services/      # API integration
│   │   │   └── api.js
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   └── vite.config.js
│
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites

- **Python 3.11+**
- **Node.js 18+** and npm
- **API Keys**:
  - Google Gemini API key
  - Bright Data API token (for MCP web scraping)

### Quick Start (Using Scripts)

The easiest way to get started is using the provided startup scripts:

**Windows**:
```bash
# Terminal 1 - Start Backend
start-backend.bat

# Terminal 2 - Start Frontend
start-frontend.bat
```

**macOS/Linux**:
```bash
# Terminal 1 - Start Backend
chmod +x start-backend.sh
./start-backend.sh

# Terminal 2 - Start Frontend
chmod +x start-frontend.sh
./start-frontend.sh
```

The scripts will automatically:
- Create virtual environment (backend)
- Install dependencies
- Create .env files from templates
- Start the servers

### Manual Setup

If you prefer manual setup, follow these steps:

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment**:
   ```bash
   # Windows
   python -m venv .venv
   .venv\Scripts\activate

   # macOS/Linux
   python -m venv .venv
   source .venv/bin/activate
   ```

3. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**:
   ```bash
   # Copy the example file
   cp .env.example .env

   # Edit .env and add your API keys:
   # GEMINI_API_KEY1=your_gemini_api_key_here
   # BRIGHT_DATA_API_TOKEN=your_bright_data_token_here
   ```

5. **Initialize vector database** (first time only):
   ```bash
   python rag/create_vector_db.py
   ```

6. **Start the FastAPI server**:
   ```bash
   python main.py
   ```

   The backend will be available at: `http://localhost:8000`

   API Documentation: `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to frontend directory** (in a new terminal):
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables** (optional):
   ```bash
   # Copy the example file
   cp .env.example .env

   # Default API URL is http://localhost:8000
   # Edit .env if you need to change it:
   # VITE_API_URL=http://localhost:8000
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

   The frontend will be available at: `http://localhost:5173`

## 🎯 Usage

1. **Open your browser** and navigate to `http://localhost:5173`

2. **Enter a query** in the search bar, such as:
   - "Recommend good NSE stocks"
   - "Best NSE stocks to buy today"
   - "Which NSE stocks should I invest in?"

3. **Watch the agent pipeline** execute in real-time:
   - Input validation
   - Stock candidate selection
   - Market data fetching
   - News sentiment analysis
   - Recommendation generation

4. **Review the results**:
   - Trading recommendations with BUY/SELL/HOLD actions
   - Target prices and confidence scores
   - Detailed reasoning and risk analysis
   - Supporting market data and news summaries

## 📡 API Endpoints

### `POST /api/analyze`

Analyzes NSE stocks based on user query.

**Request Body**:
```json
{
  "query": "Recommend good NSE stocks"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "ticker": "RELIANCE",
        "action": "BUY",
        "targetPrice": 2850.50,
        "confidence": 85,
        "reason": "Strong quarterly results with positive momentum",
        "risk": "Global crude oil price volatility"
      }
    ],
    "stockCandidates": [...],
    "marketData": [...],
    "news": [...]
  }
}
```

### `GET /health`

Health check endpoint.

**Response**:
```json
{
  "status": "healthy"
}
```

## 🛠️ Technology Stack

### Backend
- **FastAPI**: Modern Python web framework
- **LangGraph**: Agent workflow orchestration
- **LangChain**: LLM integration and tools
- **Google Gemini**: AI model for analysis
- **ChromaDB**: Vector database for RAG
- **MCP Tools**: Web scraping via Bright Data

### Frontend
- **React 18**: UI library
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API calls

## 📦 Build for Production

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

The production build will be in `frontend/dist/`

## 🔒 Safety & Compliance

- **Input Guardrails**: Validates queries are stock-related
- **Output Guardrails**: Prevents unsafe financial claims
- **Risk Disclosure**: Every recommendation includes risk analysis
- **No Guarantees**: System avoids phrases like "guaranteed returns" or "risk-free"

## 🤝 Contributing

This is a demonstration project. Contributions are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## ⚠️ Disclaimer

**This application is for educational and research purposes only.**

The stock recommendations provided by this system should not be considered as financial advice. Always:
- Conduct your own research
- Consult with a qualified financial advisor
- Understand the risks involved in stock trading
- Never invest more than you can afford to lose

## 📝 License

This project is provided as-is for educational purposes.

## 🐛 Troubleshooting

### Backend Issues

**Issue**: `ModuleNotFoundError`
- **Solution**: Ensure virtual environment is activated and dependencies are installed:
  ```bash
  pip install -r requirements.txt
  ```

**Issue**: Vector database not found
- **Solution**: Initialize the vector database:
  ```bash
  python rag/create_vector_db.py
  ```

**Issue**: API key errors
- **Solution**: Check that `.env` file exists with valid API keys

### Frontend Issues

**Issue**: `npm install` fails
- **Solution**: Delete `node_modules` and `package-lock.json`, then retry:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

**Issue**: Cannot connect to backend
- **Solution**: Ensure backend is running on port 8000 and CORS is enabled

**Issue**: Build errors
- **Solution**: Clear Vite cache:
  ```bash
  rm -rf .vite
  npm run build
  ```

## 📧 Support

For issues and questions, please open an issue in the repository.

---

**Built with ❤️ using LangGraph, FastAPI, and React**
