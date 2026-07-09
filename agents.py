import os

from langchain.chat_models import init_chat_model
from langchain_mcp_adapters.client import MultiServerMCPClient
from langgraph.prebuilt import create_react_agent
from schemas import StockFinderOutput, MarketDataOutput, NewsOutput, RecommendationOutput


async def create_agents():

    client = MultiServerMCPClient(
        {
            "bright_data": {
                "command": "npx",
                "args": ["@brightdata/mcp"],
                "env": {
                    "API_TOKEN": os.getenv("BRIGHT_DATA_API_TOKEN")
                },
                "transport": "stdio",
            },
        }
    )
    tools = await client.get_tools()
    model = init_chat_model(model="google_genai:gemini-2.5-flash", api_key = os.getenv("GEMINI_API_KEY1"))

    stock_finder_agent = create_react_agent(model, tools, prompt=""" You are an equity research analyst for the Indian stock market (NSE). Select promising NSE-listed stocks for short-term trading based on recent performance, market sentiment, news, and momentum. Rules:
    - Avoid penny and illiquid stocks.
    - Prefer web search over webpage scraping.
    - Scrape only if necessary and extract only relevant facts.
    - Never return raw webpage content or copied text.
    Output:
    - Company Name
    - NSE Ticker
    - 1-2 line reason for selection. 
    Do not include markdown. Do not include explanations.""", response_format=StockFinderOutput, name = "stock_finder_agent")

    market_data_agent = create_react_agent(model, tools, prompt="""You are a market data analyst for NSE-listed stocks. For each provided ticker, collect:
    - Current Price (INR)
    - Previous Close
    - Day Change (%)
    - Today's Volume
    - Trend (Bullish/Bearish/Sideways)
    - Volume Spike (if any)
    Rules:
    - Use search first.
    - Scrape only when necessary.
    - Never scrape more than one webpage per stock.
    - If information is unavailable, return "Not Available".
    - Never return raw webpage content.
    Output one structured summary per stock only.
    Do not include reasoning. Do not include markdown. Do not include explanations.""", response_format=MarketDataOutput, name = "market_data_agent")

    news_analyst_agent = create_react_agent(model, tools, prompt="""You are a financial news analyst. For each provided NSE stock:
    - Find important news from the last 3-5 days and summarize it in 3-5 lines.
    - Summarize the key event.
    - Classify sentiment as Positive, Neutral, or Negative.
    - Explain its likely short-term market impact.
    Rules:
    - Prefer trusted financial sources.
    - Never copy articles.
    - Summarize each news item in 1-2 sentences.
    - Mention only the source name.
    Output one section per stock.""", response_format=NewsOutput, name = "news_analyst_agent")

    price_recommender_agent = create_react_agent(model, tools, prompt="""You are a short-term trading advisor for NSE stocks. Using the provided market data and news:
    For each stock, provide:
    - Recommendation (BUY / SELL / HOLD)
    - Target Price (INR)
    - Confidence (0-100%)
    - 2-3 reasons supporting the recommendation
    - Key risks
    Do not use external tools.
    Return only the final recommendation.""", response_format=RecommendationOutput , name = "price_recommender_agent")


    return {
      "stock_finder": stock_finder_agent,
      "market_data": market_data_agent,
      "news_analyst": news_analyst_agent,
      "recommender": price_recommender_agent,
    }