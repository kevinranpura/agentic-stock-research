from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel
import asyncio
import json
from typing import Optional

from agents import create_agents
from graph import build_graph

app = FastAPI(
    title="NSE Stock Research API",
    description="AI-powered stock analysis using LangGraph agents",
    version="1.0.0"
)

# CORS middleware to allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for debugging
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AnalysisRequest(BaseModel):
    query: str


class AnalysisResponse(BaseModel):
    success: bool
    data: Optional[dict] = None
    error: Optional[str] = None


@app.get("/")
async def root():
    return {
        "message": "NSE Stock Research API",
        "status": "running"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.get("/debug")
async def debug_info():
    """Debug endpoint to check system status"""
    return {
        "status": "running",
        "backend": "ok",
        "cors": "enabled",
        "endpoints": ["/", "/health", "/api/analyze"]
    }


@app.post("/api/test")
async def test_endpoint(request: AnalysisRequest):
    """Simple test endpoint to verify API connectivity"""
    return JSONResponse(content={
        "success": True,
        "message": f"Received query: {request.query}",
        "data": {
            "recommendations": [
                {
                    "ticker": "TEST",
                    "action": "BUY",
                    "targetPrice": 100.0,
                    "confidence": 85,
                    "reason": "Test reason",
                    "risk": "Test risk"
                }
            ],
            "stockCandidates": [],
            "marketData": [],
            "news": []
        }
    })


@app.post("/api/analyze/stream")
async def analyze_stock_stream(request: AnalysisRequest):
    """
    Streaming endpoint that sends real-time progress updates as each agent executes.
    """
    async def generate():
        try:
            if not request.query or not request.query.strip():
                yield f"data: {json.dumps({'type': 'error', 'error': 'Query cannot be empty'})}\n\n"
                return
            
            # Send initial status
            yield f"data: {json.dumps({'type': 'agent_start', 'agent': 'input_guardrail', 'message': 'Validating your query'})}\n\n"
            await asyncio.sleep(0.1)
            
            # Create agents and build graph
            agents = await create_agents()
            
            # Import necessary functions
            from guardrails import input_guardrail_node
            from rag.retriever import get_trading_context
            
            # Step 1: Input Guardrail
            print("Running Input Guardrail")
            state = {"query": request.query}
            guardrail_result = await input_guardrail_node(state)
            
            if not guardrail_result.get("is_valid_query", False):
                yield f"data: {json.dumps({'type': 'error', 'error': guardrail_result.get('error_message', 'Invalid query')})}\n\n"
                return
            
            yield f"data: {json.dumps({'type': 'agent_complete', 'agent': 'input_guardrail'})}\n\n"
            await asyncio.sleep(0.1)
            
            # Step 2: Stock Finder
            yield f"data: {json.dumps({'type': 'agent_start', 'agent': 'stock_finder', 'message': 'Scanning NSE for candidates'})}\n\n"
            await asyncio.sleep(0.1)
            
            print("Running Stock Finder Agent")
            stock_finder_result = await agents["stock_finder"].ainvoke({
                "messages": [{"role": "user", "content": request.query}]
            })
            stock_candidates = stock_finder_result["structured_response"]
            print("=" * 80)
            print("Agent1 output: ", stock_candidates)
            print("=" * 80)
            
            yield f"data: {json.dumps({'type': 'agent_complete', 'agent': 'stock_finder'})}\n\n"
            await asyncio.sleep(0.1)
            
            # Step 3: Market Data
            yield f"data: {json.dumps({'type': 'agent_start', 'agent': 'market_data', 'message': 'Fetching live market data'})}\n\n"
            await asyncio.sleep(0.1)
            
            print("Running Market Data Agent")
            tickers = [stock.ticker for stock in stock_candidates.stocks]
            market_prompt = f"""Get the latest market data for these NSE stocks: {", ".join(tickers)}
            For each provided ticker, collect: Current Price (INR), Previous Close, Day Change (%), Today's Volume, Trend (Bullish/Bearish/Sideways), Volume Spike (if any)"""
            
            market_result = await agents["market_data"].ainvoke({
                "messages": [{"role": "user", "content": market_prompt}]
            })
            market_data_obj = market_result["structured_response"]
            print("=" * 80)
            print("Agent2 output: ", market_data_obj)
            print("=" * 80)
            
            yield f"data: {json.dumps({'type': 'agent_complete', 'agent': 'market_data'})}\n\n"
            await asyncio.sleep(0.1)
            
            # Step 4: News Analyst
            yield f"data: {json.dumps({'type': 'agent_start', 'agent': 'news_analyst', 'message': 'Analysing news & sentiment'})}\n\n"
            await asyncio.sleep(0.1)
            
            print("Running News Analyst Agent")
            news_prompt = f"""Find the latest news for these NSE stocks: {", ".join(tickers)}
            For each provided NSE stock: Find important news from the last 3-5 days and summarize it in 3-5 lines, Classify sentiment as Positive, Neutral, or Negative, Explain its likely short-term market impact."""
            
            news_result = await agents["news_analyst"].ainvoke({
                "messages": [{"role": "user", "content": news_prompt}]
            })
            news_summary_obj = news_result["structured_response"]
            print("=" * 80)
            print("Agent3 output: ", news_summary_obj)
            print("=" * 80)
            
            yield f"data: {json.dumps({'type': 'agent_complete', 'agent': 'news_analyst'})}\n\n"
            await asyncio.sleep(0.1)
            
            # Step 5: Recommender
            yield f"data: {json.dumps({'type': 'agent_start', 'agent': 'recommender', 'message': 'Generating trading recommendations'})}\n\n"
            await asyncio.sleep(0.1)
            
            print("Running Price Recommender Agent")
            rag_context = get_trading_context("stock recommendation strategy, confidence rules and risk policy")
            print("RAG Context: ", rag_context)
            recommender_prompt = f"""You are given the following information.
            Trading Rules and Risk Framework: {rag_context}
            Market Data: {market_data_obj.stocks}
            News Summary: {news_summary_obj.stocks}
            Based on this information, generate the final recommendation."""
            
            recommender_result = await agents["recommender"].ainvoke({
                "messages": [{"role": "user", "content": recommender_prompt}]
            })
            recommendation_obj = recommender_result["structured_response"]
            print("=" * 80)
            print("Agent4 output: ", recommendation_obj)
            print("=" * 80)
            
            yield f"data: {json.dumps({'type': 'agent_complete', 'agent': 'recommender'})}\n\n"
            await asyncio.sleep(0.1)
            
            # Step 6: Output Guardrail
            yield f"data: {json.dumps({'type': 'agent_start', 'agent': 'output_guardrail', 'message': 'Validating recommendations'})}\n\n"
            await asyncio.sleep(0.1)
            
            from guardrails import output_guardrail_node
            safety_check = await output_guardrail_node({"recommendation": recommendation_obj})
            
            if not safety_check.get("is_safe_output", True):
                yield f"data: {json.dumps({'type': 'error', 'error': safety_check.get('output_warning', 'Unsafe output detected')})}\n\n"
                return
            
            yield f"data: {json.dumps({'type': 'agent_complete', 'agent': 'output_guardrail'})}\n\n"
            await asyncio.sleep(0.1)
            
            # Format final response
            recommendations = []
            for stock in recommendation_obj.recommendations:
                recommendations.append({
                    "ticker": stock.ticker,
                    "action": stock.action,
                    "targetPrice": float(stock.target_price),
                    "confidence": int(stock.confidence),
                    "reason": stock.reason,
                    "risk": stock.risk
                })
            
            stock_candidates_list = []
            for s in stock_candidates.stocks:
                stock_candidates_list.append({
                    "company": s.company,
                    "ticker": s.ticker,
                    "reason": s.reason
                })
            
            market_data_list = []
            for s in market_data_obj.stocks:
                market_data_list.append({
                    "ticker": s.ticker,
                    "currentPrice": float(s.current_price) if s.current_price else None,
                    "previousClose": float(s.previous_close) if s.previous_close else None,
                    "changePercent": float(s.change_percent) if s.change_percent else None,
                    "volume": int(s.volume) if s.volume else None,
                    "trend": s.trend,
                    "volumeSpike": bool(s.volume_spike)
                })
            
            news_list = []
            for s in news_summary_obj.stocks:
                news_list.append({
                    "ticker": s.ticker,
                    "sentiment": s.sentiment,
                    "summary": s.summary,
                    "impact": s.impact
                })
            
            final_data = {
                "type": "complete",
                "success": True,
                "data": {
                    "recommendations": recommendations,
                    "stockCandidates": stock_candidates_list,
                    "marketData": market_data_list,
                    "news": news_list
                }
            }
            
            print("=" * 80)
            print("Analysis Complete")
            print("=" * 80)
            
            yield f"data: {json.dumps(final_data)}\n\n"
            
        except Exception as e:
            error = str(e).lower()
            if (
                "429" in error
                or "resource_exhausted" in error
                or "quota" in error
                or "rate limit" in error
            ):
                message = "Daily AI request limit reached. Please try again later."
                
            elif "bright" in error:
                message = "Unable to retrieve live market data."

            else:
                message = "Something went wrong while analyzing the stocks."

            yield f"data: {json.dumps({'type': 'error', 'error': message})}\n\n"
    
    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )


@app.post("/api/analyze")
async def analyze_stock(request: AnalysisRequest):
    """
    Main endpoint to trigger stock analysis pipeline.
    Runs the LangGraph agent workflow and returns results.
    """
    try:
        if not request.query or not request.query.strip():
            return {
                "success": False,
                "error": "Query cannot be empty"
            }

        # Create agents and build graph
        agents = await create_agents()
        graph = await build_graph(agents)

        # Run the agent pipeline
        result = await graph.ainvoke({
            "query": request.query
        })

        print("=" * 80)
        print("GRAPH RESULT KEYS:", result.keys())
        print("=" * 80)

        # Check if query was valid
        if not result.get("is_valid_query", False):
            return {
                "success": False,
                "error": result.get("error_message", "Invalid query")
            }

        # Check output safety
        if not result.get("is_safe_output", True):
            return {
                "success": False,
                "error": result.get("output_warning", "Unsafe output detected")
            }

        # Format recommendations for frontend
        recommendations = []
        try:
            if result.get("recommendation"):
                recommendation_obj = result["recommendation"]
                if hasattr(recommendation_obj, 'recommendations'):
                    for stock in recommendation_obj.recommendations:
                        recommendations.append({
                            "ticker": stock.ticker,
                            "action": stock.action,
                            "targetPrice": float(stock.target_price),
                            "confidence": int(stock.confidence),
                            "reason": stock.reason,
                            "risk": stock.risk
                        })
        except Exception as e:
            print(f"Error formatting recommendations: {e}")

        # Format stock candidates
        stock_candidates = []
        try:
            if result.get("stock_candidates"):
                candidates_obj = result["stock_candidates"]
                if hasattr(candidates_obj, 'stocks'):
                    for s in candidates_obj.stocks:
                        stock_candidates.append({
                            "company": s.company,
                            "ticker": s.ticker,
                            "reason": s.reason
                        })
        except Exception as e:
            print(f"Error formatting stock candidates: {e}")

        # Format market data
        market_data = []
        try:
            if result.get("market_data"):
                market_obj = result["market_data"]
                if hasattr(market_obj, 'stocks'):
                    for s in market_obj.stocks:
                        market_data.append({
                            "ticker": s.ticker,
                            "currentPrice": float(s.current_price) if s.current_price else None,
                            "previousClose": float(s.previous_close) if s.previous_close else None,
                            "changePercent": float(s.change_percent) if s.change_percent else None,
                            "volume": int(s.volume) if s.volume else None,
                            "trend": s.trend,
                            "volumeSpike": bool(s.volume_spike)
                        })
        except Exception as e:
            print(f"Error formatting market data: {e}")

        # Format news
        news = []
        try:
            if result.get("news_summary"):
                news_obj = result["news_summary"]
                if hasattr(news_obj, 'stocks'):
                    for s in news_obj.stocks:
                        news.append({
                            "ticker": s.ticker,
                            "sentiment": s.sentiment,
                            "summary": s.summary,
                            "impact": s.impact
                        })
        except Exception as e:
            print(f"Error formatting news: {e}")

        response_data = {
            "success": True,
            "data": {
                "recommendations": recommendations,
                "stockCandidates": stock_candidates,
                "marketData": market_data,
                "news": news
            }
        }

        print("=" * 80)
        print("SENDING RESPONSE WITH:", len(recommendations), "recommendations")
        print("RESPONSE DATA:", response_data)
        print("=" * 80)

        return JSONResponse(content=response_data)

    except Exception as e:
        print("=" * 80)
        print(f"ERROR during analysis: {str(e)}")
        print(f"ERROR type: {type(e)}")
        import traceback
        traceback.print_exc()
        print("=" * 80)

        error = str(e).lower()

        # Gemini quota / rate limit
        if (
            "429" in error
            or "resource_exhausted" in error
            or "quota" in error
            or "rate limit" in error
        ):
            return JSONResponse(
                content={
                    "success": False,
                    "error": "Daily AI request limit reached. Please try again later."
                },
                status_code=429
            )

        # Bright Data
        if "bright" in error:
            return JSONResponse(
                content={
                    "success": False,
                    "error": "Unable to retrieve live market data at the moment."
                },
                status_code=503
            )

        # Generic error
        return JSONResponse(
            content={
                "success": False,
                "error": "Something went wrong while analyzing the stocks. Please try again."
            },
            status_code=500
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
