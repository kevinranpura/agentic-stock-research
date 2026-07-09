import os
import chromadb

from dotenv import load_dotenv
from langchain_google_genai import GoogleGenerativeAIEmbeddings


load_dotenv()


def create_chunks(text, size=500, overlap=100):
    chunks = []
    start = 0

    while start < len(text):
        chunk = text[start:start + size]

        if len(chunk.strip()) > 50:
            chunks.append(chunk)

        start += size - overlap

    return chunks


def create_vector_db():

    texts = []
    metadata = []

    for file in os.listdir("knowledge_base"):

        if file.endswith(".md"):

            path = os.path.join(
                "knowledge_base",
                file
            )

            with open(path, "r", encoding="utf-8") as f:
                chunks = create_chunks(f.read())


            for chunk in chunks:

                texts.append(chunk)

                metadata.append(
                    {
                        "source": file
                    }
                )


    print("Chunks:", len(texts))


    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/gemini-embedding-001",
        google_api_key=os.getenv("GEMINI_API_KEY1")
    )


    print("Creating embeddings")

    vectors = embeddings.embed_documents(
        texts
    )


    print("Creating chroma client")

    client = chromadb.PersistentClient(
        path="./chroma_db"
    )


    try:
        client.delete_collection(
            "stock_rules"
        )
    except:
        pass


    collection = client.create_collection(
        name="stock_rules",
        metadata={
            "hnsw:space": "cosine"
        }
    )


    print("Saving vectors")

    collection.upsert(
        ids=[
            f"chunk_{i}"
            for i in range(len(texts))
        ],
        documents=texts,
        embeddings=vectors,
        metadatas=metadata
    )


    print("Vector DB created")


if __name__ == "__main__":
    create_vector_db()