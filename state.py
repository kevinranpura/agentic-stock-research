from typing import TypedDict
from schemas import StockFinderOutput

class StockResearchState(TypedDict):
    query: str

    stock_candidates: StockFinderOutput
    market_data: str
    news_summary: str
    recommendation: str