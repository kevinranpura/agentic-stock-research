from langgraph.graph import StateGraph, START, END

from state import StockResearchState


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
    return {
      "stock_candidates": structured_output
    }
  async def market_data_node(state: StockResearchState):
    print("Running Market Data Agent")
    print("=" * 80)
    print("INPUT TO MARKET DATA AGENT")
    print(state["stock_candidates"])
    print("=" * 80)
    result = await agents["market_data"].ainvoke(
      {
        "messages": [
          {
            "role": "user",
            "content": state["stock_candidates"],
          }
        ]
      }
    )
    output = result["messages"][-1].content
    print("=" * 80)
    print("OUTPUT FROM MARKET DATA AGENT")
    print(output)
    print("=" * 80)
    print("*" * 30)
    for message in result["messages"]:
      print(type(message).__name__)
      print(message)
      print("-" * 80)
    return {
      "market_data": result["messages"][-1].content
    }
  async def news_analyst_node(state: StockResearchState):
    print("Running News Analyst Agent")
    result = await agents["news_analyst"].ainvoke(
      {
        "messages": [
          {
            "role": "user",
            "content": state["stock_candidates"],
          }
        ]
      }
    )
    return {
      "news_summary": result["messages"][-1].content
    }
  async def price_recommendation_node(state: StockResearchState):
    print("Running Price Recommender Agent")
    prompt = f""" You are given the following information. 

    Market Data: {state["market_data"]}
    News Summary: {state["news_summary"]}

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
    return {
      "recommendation": result["messages"][-1].content
    }


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


  builder.add_edge(
      START,
      "stock_finder"
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
      END
  )


  return builder.compile()