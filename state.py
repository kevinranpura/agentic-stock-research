from typing import TypedDict
from schemas import StockFinderOutput, MarketDataOutput, NewsOutput, RecommendationOutput

class StockResearchState(TypedDict):
    query: str

    is_valid_query: bool
    error_message: str

    stock_candidates: StockFinderOutput
    market_data: MarketDataOutput
    news_summary: NewsOutput
    recommendation: RecommendationOutput

    is_safe_output: bool
    output_warning: str