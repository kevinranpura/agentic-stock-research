async def input_guardrail_node(state):

    query = state["query"].lower()

    allowed_words = [
        "recommend",
        "recommendation",
        "suggest",
        "best stock",
        "which stock",
        "buy",
        "sell",
        "pick",
        "opportunity",
        "invest",
        "nse",
        "trading",
        "investment",
    ]

    valid = any(
        word in query
        for word in allowed_words
    )

    if not valid:
        return {
            "is_valid_query": False,
            "error_message": "This assistant only provides NSE stock recommendations."
        }

    return {
        "is_valid_query": True,
        "error_message": ""
    }


async def output_guardrail_node(state):

    recommendation = state["recommendation"]

    unsafe_words = [
        "guaranteed",
        "100%",
        "risk free",
        "sure profit",
        "no loss"
    ]

    for stock in recommendation.recommendations:
        # action validation
        if stock.action not in ["BUY","SELL","HOLD"]:
            return {
                "is_safe_output": False,
                "output_warning": f"Invalid action generated for {stock.ticker}"}
        
        # text validation
        text = (stock.reason + stock.risk).lower()
        if any(word in text for word in unsafe_words):
            return {
                "is_safe_output": False,
                "output_warning":"Unsafe financial claim detected"
            }

    return {
        "is_safe_output": True,
        "output_warning": ""
    }