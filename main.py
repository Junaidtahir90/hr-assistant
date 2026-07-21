from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS

from langchain_ollama import ChatOllama
from langchain_ollama import OllamaEmbeddings

from langchain_core.prompts import ChatPromptTemplate

import os

# =====================================================
# FASTAPI INIT
# =====================================================

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================
# LOAD DOCUMENTS
# =====================================================

print("Loading HR documents...")

all_docs = []

DATA_FOLDER = "data"

for file in os.listdir(DATA_FOLDER):

    if file.endswith(".pdf"):

        print(f"Reading: {file}")

        loader = PyPDFLoader(f"{DATA_FOLDER}/{file}")

        documents = loader.load()

        all_docs.extend(documents)

print(f"Total documents loaded: {len(all_docs)}")

# =====================================================
# SPLIT DOCUMENTS
# =====================================================

splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50,
    separators=["\n\n\d+\.", "\n\n", "\n", " "],  # try to break on numbered sections first
)

docs = splitter.split_documents(all_docs)

print(f"Total chunks created: {len(docs)}")

# =====================================================
# OLLAMA EMBEDDINGS (FULLY LOCAL)
# =====================================================

embeddings = OllamaEmbeddings(
    # model="llama3"
     model="nomic-embed-text"
)

print("Embeddings ready")

# =====================================================
# CREATE FAISS VECTOR DB
# =====================================================

vectorstore = FAISS.from_documents(
    docs,
    embeddings
)

# retriever = vectorstore.as_retriever(
#     search_kwargs={"k": 6}
# )
retriever = vectorstore.as_retriever(
     search_type="similarity_score_threshold",
    search_kwargs={"k": 3, "score_threshold": 0.5}
)
print("FAISS index ready!")

# =====================================================
# LOAD OLLAMA MODEL
# =====================================================

llm = ChatOllama(
    #model="llama3.2",
    model="llama3.2:1b",
    temperature=0,
    num_predict=256,   # cap output tokens
    num_ctx=2048,       # don't over-allocate context
)

print("LLM ready!")

# =====================================================
# PROMPT TEMPLATE
# =====================================================

prompt = ChatPromptTemplate.from_template("""
You are an HR assistant.

Answer ONLY using the provided HR policy context.

Only include information that directly answers the question.
Do NOT include unrelated policy sections, even if they appear in the context below.
If the context contains multiple sections but only one is relevant to the question, use only that one and ignore the rest.

If the answer spans multiple sections that are ALL directly relevant to the question, combine them into a single complete answer. Do not omit bullet points from the relevant section(s).

If the information is not present in the context, respond exactly:
"I could not find this information in the HR documents."

Context:
{context}

Question:
{question}

Answer:
""")

# =====================================================
# REQUEST MODEL
# =====================================================

class ChatRequest(BaseModel):
    message: str

# =====================================================
# CHAT ENDPOINT
# =====================================================

@app.post("/chat")
def chat(req: ChatRequest):

    try:

        question = req.message

        # ---------------------------------------------
        # SEARCH RELEVANT DOCUMENTS
        # ---------------------------------------------

        relevant_docs = retriever.invoke(question)

        # ---------------------------------------------
        # BUILD CONTEXT
        # ---------------------------------------------

        context = "\n\n".join(
            [doc.page_content for doc in relevant_docs]
        )

        # ---------------------------------------------
        # CREATE FINAL PROMPT
        # ---------------------------------------------

        final_prompt = prompt.format(
            context=context,
            question=question
        )

        # ---------------------------------------------
        # ASK OLLAMA
        # ---------------------------------------------

        response = llm.invoke(final_prompt)

        # ---------------------------------------------
        # RETURN RESPONSE
        # ---------------------------------------------

        return {
            "success": True,
            "question": question,
            "reply": response.content,
            "sources": [
                {
                    "page": doc.metadata.get("page", 0)
                }
                for doc in relevant_docs
            ]
        }

    except Exception as ex:

        return {
            "success": False,
            "error": str(ex)
        }