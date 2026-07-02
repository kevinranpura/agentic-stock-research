import os
import asyncio
from dotenv import load_dotenv
from agents import create_agents
from graph import build_graph
from langchain_mcp_adapters.client import MultiServerMCPClient
from langgraph.prebuilt import create_react_agent
from langchain.chat_models import init_chat_model
from langgraph_supervisor import create_supervisor

load_dotenv()

from langchain_core.messages import convert_to_messages


# def pretty_print_message(message, indent=False):
#     pretty_message = message.pretty_repr(html=True)
#     if not indent:
#         print(pretty_message)
#         return

#     indented = "\n".join("\t" + c for c in pretty_message.split("\n"))
#     print(indented)


# def pretty_print_messages(update, last_message=False):
#     is_subgraph = False
#     if isinstance(update, tuple):
#         ns, update = update
#         # skip parent graph updates in the printouts
#         if len(ns) == 0:
#             return

#         graph_id = ns[-1].split(":")[0]
#         print(f"Update from subgraph {graph_id}:")
#         print("\n")
#         is_subgraph = True

#     for node_name, node_update in update.items():
#         update_label = f"Update from node {node_name}:"
#         if is_subgraph:
#             update_label = "\t" + update_label

#         print(update_label)
#         print("\n")

#         messages = convert_to_messages(node_update["messages"])
#         if last_message:
#             messages = messages[-1:]

#         for m in messages:
#             pretty_print_message(m, indent=is_subgraph)
#         print("\n")

# async def run_agent(query):

#     client = MultiServerMCPClient(
#         {
#             "bright_data": {
#                 "command": "npx",
#                 "args": ["@brightdata/mcp"],
#                 "env": {
#                     "API_TOKEN": os.getenv("BRIGHT_DATA_API_TOKEN")
#                 },
#                 "transport": "stdio",
#             },
#         }
#     )
#     tools = await client.get_tools()
#     model = init_chat_model(model="groq:llama-3.1-8b-instant", api_key = os.getenv("GROQ_API_KEY"))

#     stock_finder_agent = create_react_agent(model, tools, prompt=""" You are a stock research analyst specializing in the Indian Stock Market (NSE). Your task is to select 2 promising, actively traided NSE-listed stocks for short term trading (buy/sell) based on recent performance, news buzz,volume or technical strength.
#     Avoid penny stocks and illiquid companies.
#     Output should include stock names, tickers, and brief reasoning for each choice.
#     Respond in structured plain text format.
#     Use web search only to identify relevant stocks.
#     Do NOT scrape or return full webpage content.
#     If you use webpage scraping, extract only the relevant facts needed for your analysis.
#     Summarize all findings in under 150 words.
#     Never include raw markdown, HTML, or copied article text.""", name = "stock_finder_agent")

#     market_data_agent = create_react_agent(model, tools, prompt="""You are a market data analyst for Indian stocks listed on the NSE.

#     Your input is one or more NSE stock tickers.

#     Your job is to gather ONLY the essential market information required for short-term trading.

#     For each stock, provide:
#     - Current market price (INR)
#     - Previous closing price (INR)
#     - Today's trading volume (if available)
#     - Percentage change from previous close
#     - One-line description of the recent price trend (Bullish / Bearish / Sideways)
#     - Mention any unusual price movement or volume spike, if clearly reported.

#     IMPORTANT TOOL RULES:
#     - You ONLY have access to the provided MCP tools.
#     - Use search_engine first.
#     - Use scrape_as_markdown ONLY if search results are insufficient.
#     - Scrape AT MOST one webpage per stock.
#     - Never perform repeated searches for the same stock.
#     - Never invent or call tools that are not provided.
#     - If any data is unavailable, write "Not Available" instead of searching again.

#     OUTPUT RULES:
#     - Do NOT return raw webpage content.
#     - Do NOT return markdown copied from websites.
#     - Do NOT copy article text.
#     - Extract only the required facts.
#     - Keep each stock summary under 80 words.
#     - Return only the final structured summary.

#     Output format:

#     Stock:
#     Current Price:
#     Previous Close:
#     Today's Volume:
#     Day Change:
#     Trend:
#     Volume Spike:""", name = "market_data_agent")

#     news_alanyst_agent = create_react_agent(model, tools, prompt="""You are a financial news analyst. Given the names or the tickers of Indian NSE listed stocks, your job is to-
#     - Search for the most recent news articles (past 3-5 days)
#     - Summarize key updates, announcements, and events for each stock
#     - Classify each piece of news as positive, negative or neutral
#     - Highlist how the news might affect short term stock price
                                            
#     Present your response in a clear, structured format - one section per stock.

#     Use bullet points where necessary. Keep it short, factual and analysis-oriented
#     Guidelines:
#     - Read only enough content to understand the event.
#     - Never return entire articles.
#     - Never copy article text.
#     - Never output scraped markdown.
#     - Summarize each news item in one or two sentences.
#     - Mention the source name only.""", name = "news_analyst_agent")

#     price_recommender_agent = create_react_agent(model, tools, prompt="""You are a trading stratefy advisor for the Indian Stock Market. You are given -
#     - Recent market data (current price, volume, trend, indicators)
#     - News summaries and sentiment for each stock
        
#     Based on this info, for each stock-
#     1. Recommend an action : Buy, Sell or Hold
#     2. Suggest a specific target price for entry or exit (INR)
#     3. Briefly explain the reason behind your recommendation.
        
#     Your goal is to provide practical. near-term trading advice for the next trading day.
        
#     Keep the response concise and clearly structured.""", name = "price_recommender_agent")


#     supervisor = create_supervisor(
#         model=model,
#         agents=[stock_finder_agent, market_data_agent, news_alanyst_agent, price_recommender_agent],
#         prompt=(
#             "You are a workflow orchestrator responsible for coordinating four agents.\n\n"

#             "IMPORTANT RULES:\n"
#             "1. You MUST NEVER answer the user's question yourself.\n"
#             "2. You MUST NEVER explain what you are going to do.\n"
#             "3. You MUST NEVER say things like 'Now let's...', 'Next...', or 'I will assign...'.\n"
#             "4. Your ONLY way of communicating with agents is by calling the transfer tools.\n"
#             "5. If an agent needs to perform work, immediately call its transfer tool.\n"
#             "6. Never ask the user for clarification or permission once the workflow has started.\n"
#             "7. Execute exactly one agent at a time.\n\n"

#             "Workflow:\n"
#             "Step 1 -> transfer_to_stock_finder_agent\n"
#             "Step 2 -> transfer_to_market_data_agent\n"
#             "Step 3 -> transfer_to_news_analyst_agent\n"
#             "Step 4 -> transfer_to_price_recommender_agent\n\n"

#             "Behavior:\n"
#             "- Start by calling transfer_to_stock_finder_agent.\n"
#             "- When stock_finder_agent returns, immediately call transfer_to_market_data_agent.\n"
#             "- When market_data_agent returns, immediately call transfer_to_news_analyst_agent.\n"
#             "- When news_analyst_agent returns, immediately call transfer_to_price_recommender_agent.\n"
#             "- Only after price_recommender_agent finishes should you answer the user.\n"
#             "- Your final response must contain ONLY the final recommendation generated by the price_recommender_agent.\n"
#             "- At every intermediate step, call a transfer tool instead of generating text."
#         ),
#         add_handoff_back_messages=True,
#         output_mode="full_history",
#     ).compile()

#     config = {
#       "recursion_limit": 10
#     }

#     async for chunk in supervisor.astream(
#     {
#             "messages": [
#                 {
#                     "role": "user",
#                     "content": query,
#                 }
#             ]
#         },
#         config=config
#     ):
#         pretty_print_messages(chunk, last_message=True)
#       # print("Chunk: ", chunk)    

#     final_message_history = chunk[ "supervisor"]["messages"]

async def run():

    agents = await create_agents()
    graph = await build_graph(agents)

    result = await graph.ainvoke(
        {
            "query":
            "Give me good stock recommendation from NSE"
        }
    )

    print(result)

if __name__ == "__main__":
    asyncio.run(run())