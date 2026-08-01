# Backend API

FastAPI backend for the Agentic Stock Research System.

## Quick Start

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. **Initialize vector database** (first time):
   ```bash
   python rag/create_vector_db.py
   ```

4. **Run the server**:
   ```bash
   python main.py
   ```

   Or with uvicorn directly:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

## API Documentation

Once running, visit:
- Interactive docs: http://localhost:8000/docs
- Alternative docs: http://localhost:8000/redoc

## Environment Variables

Required environment variables in `.env`:

```env
GEMINI_API_KEY1=your_gemini_api_key
BRIGHT_DATA_API_TOKEN=your_bright_data_token
```

## Project Structure

```
backend/
├── main.py              # FastAPI application and endpoints
├── agents.py            # LangGraph agent definitions
├── graph.py             # Agent workflow graph
├── state.py             # State management
├── schemas.py           # Pydantic models
├── guardrails.py        # Input/output validation
├── rag/                 # RAG system
│   ├── retriever.py     # Vector search
│   └── create_vector_db.py  # Vector DB initialization
└── knowledge_base/      # Domain knowledge
    ├── recommendation_framework.md
    └── risk_policy.md
```

## Agent Pipeline

1. **Input Guardrail**: Validates query is stock-related
2. **Stock Finder**: Identifies 2 promising NSE stocks
3. **Market Data Agent**: Fetches current market data
4. **News Analyst**: Analyzes recent news and sentiment
5. **Price Recommender**: Generates trading recommendations
6. **Output Guardrail**: Ensures safe output

## Development

### Adding New Knowledge

Add markdown files to `knowledge_base/` and rebuild vector database:

```bash
python rag/create_vector_db.py
```

### Testing the API

```bash
# Test health endpoint
curl http://localhost:8000/health

# Test analysis endpoint
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"query": "Recommend good NSE stocks"}'
```

## Production Deployment

```bash
# Install production server
pip install gunicorn

# Run with gunicorn
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```
