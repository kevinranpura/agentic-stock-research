import os
import chromadb

from dotenv import load_dotenv
from langchain_google_genai import GoogleGenerativeAIEmbeddings


load_dotenv()


embeddings = GoogleGenerativeAIEmbeddings(
    model="models/gemini-embedding-001",
    google_api_key=os.getenv("GEMINI_API_KEY1")
)


client = chromadb.PersistentClient(
    path="./chroma_db"
)


collection = client.get_collection(
    name="stock_rules"
)


def get_trading_context(query):

    query_embedding = embeddings.embed_query(
        query
    )


    results = collection.query(
        query_embeddings=[
            query_embedding
        ],
        n_results=3
    )


    context = "\n\n".join(
        results["documents"][0]
    )


    return context



if __name__ == "__main__":

    print("Retriever running")

    context = get_trading_context(
        "When should we recommend BUY?"
    )


    print(context)