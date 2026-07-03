import streamlit as st
import asyncio

from main import run_agent


st.set_page_config(
    page_title="AI Stock Research Agent",
    page_icon="📈",
    layout="wide"
)


st.title("📈 Agentic AI Stock Research System")

st.write(
    "Multi-agent NSE stock analysis using LangGraph + MCP + LLM"
)


query = st.text_input(
    "Enter your stock query",
    placeholder="Recommend good NSE stocks"
)


if st.button("Analyze"):

    if not query:
        st.warning("Please enter a query")

    else:

        with st.spinner("AI agents are researching..."):

            result = asyncio.run(
                run_agent(query)
            )


        if not result["is_valid_query"]:

            st.error(
                result["error_message"]
            )


        else:

            recommendations = (
                result["recommendation"]
                .recommendations
            )


            for stock in recommendations:

                with st.container():

                    st.subheader(
                        stock.ticker
                    )


                    col1, col2, col3 = st.columns(3)


                    with col1:
                        st.metric(
                            "Action",
                            stock.action
                        )


                    with col2:
                        st.metric(
                            "Target Price",
                            f"₹{stock.target_price}"
                        )


                    with col3:
                        st.metric(
                            "Confidence",
                            f"{stock.confidence}%"
                        )


                    st.write(
                        "**Reason:**",
                        stock.reason
                    )


                    st.write(
                        "**Risk:**",
                        stock.risk
                    )


                    st.divider()