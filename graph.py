from langgraph.graph import StateGraph, START, END
from guardrails import input_guardrail_node, output_guardrail_node
from state import StockResearchState
from rag.retriever import get_trading_context


def check_input(state):

    if state["is_valid_query"]:
        return "valid"

    return "invalid"


async def build_graph(agents):

  builder = StateGraph(StockResearchState)

  async def stock_finder_node(state: StockResearchState):
    print("Running Stock Finder Agent")
    result = await agents["stock_finder"].ainvoke(
      {
        "messages": [
          {
            "role": "user",
            "content": state["query"],
          }
        ]
      }
    )
    structured_output = result["structured_response"]
    print("=" * 80)
    print("Agent1 output: ", structured_output)
    print("=" * 80)
    return {
      "stock_candidates": structured_output
    }
  
  async def market_data_node(state: StockResearchState):
    print("Running Market Data Agent")
    tickers = [
      stock.ticker
      for stock in state["stock_candidates"].stocks
    ]
    prompt = f"""Get the latest market data for these NSE stocks:
    {", ".join(tickers)}
    For each provided ticker, collect:
    - Current Price (INR)
    - Previous Close
    - Day Change (%)
    - Today's Volume
    - Trend (Bullish/Bearish/Sideways)
    - Volume Spike (if any) """
    result = await agents["market_data"].ainvoke(
      {
        "messages": [
          {
            "role": "user",
            "content": prompt,
          }
        ]
      }
    )
    structured_output = result["structured_response"]
    print("=" * 80)
    print("Agent2 output: ", structured_output)
    print("=" * 80)
    return {
      "market_data": structured_output
    }
  
  async def news_analyst_node(state: StockResearchState):
    print("Running News Analyst Agent")
    tickers = [
      stock.ticker
      for stock in state["stock_candidates"].stocks
    ]
    prompt = f"""Find the latest news for these NSE stocks:
    {", ".join(tickers)}
    For each provided NSE stock:
    - Find important news from the last 3-5 days and summarize it in 3-5 lines.
    - Summarize the key event.
    - Classify sentiment as Positive, Neutral, or Negative.
    - Explain its likely short-term market impact. """
    result = await agents["news_analyst"].ainvoke(
      {
        "messages": [
          {
            "role": "user",
            "content": prompt,
          }
        ]
      }
    )
    structured_output = result["structured_response"]
    print("=" * 80)
    print("Agent3 output: ", structured_output)
    print("=" * 80)
    return {
      "news_summary": structured_output
    }
  
  async def price_recommendation_node(state: StockResearchState):
    print("Running Price Recommender Agent")
    rag_context = get_trading_context(
      "stock recommendation strategy, confidence rules and risk policy"
    )
    print("RAG Context: ", rag_context)
    prompt = f""" You are given the following information. 

    Trading Rules and Risk Framework: {rag_context}
    Market Data: {state["market_data"].stocks}
    News Summary: {state["news_summary"].stocks}

    Based on this information, generate the final recommendation. """
    result = await agents["recommender"].ainvoke(
      {
        "messages": [
          {
            "role": "user",
            "content": prompt,
          }
        ]
      }
    )
    structured_output = result["structured_response"]
    print("=" * 80)
    print("Agent4 output: ",structured_output)
    print("=" * 80)
    return {
      "recommendation": structured_output
    }


  builder.add_node(
      "input_guardrail",
      input_guardrail_node
  )
  builder.add_node(
      "stock_finder",
      stock_finder_node
  )
  builder.add_node(
      "market_data",
      market_data_node
  )
  builder.add_node(
      "news_analyst",
      news_analyst_node
  )
  builder.add_node(
      "recommender",
      price_recommendation_node
  )
  builder.add_node(
      "output_guardrail",
      output_guardrail_node
  )


  builder.add_edge(
      START,
      "input_guardrail"
  )
  builder.add_conditional_edges(
      "input_guardrail",
      check_input,
      {
         "valid":"stock_finder",
         "invalid":END
      }
  )
  builder.add_edge(
      "stock_finder",
      "market_data"
  )
  builder.add_edge(
      "market_data",
      "news_analyst"
  )
  builder.add_edge(
      "news_analyst",
      "recommender"
  )
  builder.add_edge(
      "recommender",
      "output_guardrail"
  )
  builder.add_edge(
      "output_guardrail",
      END
  )


  return builder.compile()