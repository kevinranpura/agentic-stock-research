from pydantic import BaseModel, Field
from typing import Annotated, Literal

class StockCandidate(BaseModel):
    company: str
    ticker: str
    reason: str
class StockFinderOutput(BaseModel):
    stocks: Annotated[
        list[StockCandidate],
        Field(min_length=2, max_length=2)
    ]

class StockMarketData(BaseModel):
    ticker: str
    current_price: float | None
    previous_close: float | None
    change_percent: float | None
    volume: int | None
    trend: Literal["Bullish","Bearish","Sideways"]
    volume_spike: bool
class MarketDataOutput(BaseModel):
    stocks: list[StockMarketData]

class StockNews(BaseModel):
    ticker: str = Field(description="NSE ticker symbol")
    sentiment: Literal["Positive","Neutral","Negative"]
    summary: str = Field(description="Important news summary in 2 sentences")
    impact: str = Field(description="Expected short term impact on stock price in 1 sentence")
class NewsOutput(BaseModel):
    stocks: list[StockNews] = Field(min_length=2,max_length=2)

class StockRecommendation(BaseModel):
    ticker: str
    action: Literal["BUY","SELL","HOLD"]
    target_price: float
    confidence: int = Field(ge=0, le=100, description="Confidence score from 0-100")
    reason: str = Field(max_length=200, description="Short reason for recommendation")
    risk: str = Field(max_length=150, description="Main investment risk")
class RecommendationOutput(BaseModel):
    recommendations: list[StockRecommendation] = Field(min_length=2, max_length=2)