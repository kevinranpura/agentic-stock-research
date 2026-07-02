from pydantic import BaseModel

class StockCandidate(BaseModel):
    company: str
    ticker: str
    reason: str

class StockFinderOutput(BaseModel):
    stocks: list[StockCandidate]