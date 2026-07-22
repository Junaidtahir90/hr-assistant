# Simple HR RAG System (Local)

A lightweight Retrieval-Augmented Generation (RAG) application built using **FastAPI**, **LangChain**, **FAISS**, and **Ollama**. The application allows users to ask questions about HR policies stored in PDF documents and receive context-aware responses generated entirely on a local machine.

---

# Features

- Local LLM inference using Ollama
- PDF document ingestion
- Automatic text chunking
- Semantic search using FAISS
- Local embedding generation
- REST API built with FastAPI
- No external APIs required
- Fully offline inference

---

# Tech Stack

| Technology | Purpose |
|------------|---------|
| Python 3.14 | Backend |
| FastAPI | REST API |
| LangChain | RAG Pipeline |
| Ollama | Local LLM & Embeddings |
| FAISS | Vector Database |
| PyPDF | PDF Parsing |
| Pydantic | Request Validation |

---

# Project Structure

```
simple-hr-rag-system/
│
├── data/
│   └── sample_hr_policy.pdf
│
├── main.py
├── requirements.txt
└── README.md
```

---

# RAG Pipeline

```
PDF Documents
      │
      ▼
PyPDFLoader
      │
      ▼
RecursiveCharacterTextSplitter
      │
      ▼
Ollama Embeddings
(nomic-embed-text)
      │
      ▼
FAISS Vector Store
      │
      ▼
Retriever
      │
      ▼
Prompt Template
      │
      ▼
Llama 3.2 (Ollama)
      │
      ▼
FastAPI Response
```

---

# Installation

## Clone Repository

```bash
git clone <repository-url>

cd simple-hr-rag-system
```

---

## Create Virtual Environment

Windows

```bash
python -m venv .venv

.venv\Scripts\activate
```

Linux / macOS

```bash
python3 -m venv .venv

source .venv/bin/activate
```

---

## Install Dependencies

```bash
python -m pip install -r requirements.txt
```

---

# Install Ollama

Download

https://ollama.com/download

Verify

```bash
ollama --version
```

---

# Download Required Models

Embedding Model

```bash
ollama pull nomic-embed-text
```

LLM

```bash
ollama pull llama3.2:1b
```

Verify

```bash
ollama list
```

Expected

```
nomic-embed-text
llama3.2:1b
```

---

# Run API

```bash
uvicorn main:app --reload
```

Swagger

```
http://localhost:8000/docs
```

---

# API

POST

```
/chat
```

Request

```json
{
    "message":"What is the leave policy?"
}
```

Response

```json
{
    "success": true,
    "question":"What is the leave policy?",
    "reply":"Annual Leave: 14 days/year...",
    "sources":[
        {
            "page":0
        }
    ]
}
```

---

# Embedding Model

```
nomic-embed-text
```

Reason

- Optimized for semantic search
- Fast
- Small memory footprint
- Better retrieval quality than using chat models

---

# LLM

```
llama3.2:1b
```

Configuration

```python
temperature=0
num_predict=256
num_ctx=2048
```

Reason

- Fast local inference
- Lower RAM usage
- Deterministic responses

---

# Retriever Configuration

```python
retriever = vectorstore.as_retriever(
    search_type="similarity_score_threshold",
    search_kwargs={
        "k":3,
        "score_threshold":0.5
    }
)
```

---

# Prompt Engineering

Prompt instructions include:

- Answer only from supplied context
- Ignore unrelated sections
- Combine multiple relevant chunks
- Return fallback message if answer is unavailable

This significantly reduced hallucinations.

---

# Challenges Faced & Solutions

## 1. Python Not Installed

Error

```
python is not recognized
```

Solution

- Installed Python
- Added Python to PATH

---

## 2. pip Not Found

Error

```
pip is not recognized
```

Solution

```
python -m pip
```

was used instead of

```
pip
```

---

## 3. Missing Packages

Errors

```
ModuleNotFoundError
```

Examples

```
langchain_ollama
```

```
pypdf
```

Solution

```
python -m pip install <package>
```

---

## 4. Ollama Connection Error

```
Failed to connect to Ollama
```

Cause

Ollama server not running.

Solution

Install Ollama and ensure the service is running.

---

## 5. Model Not Found

Error

```
model "llama3" not found
```

Cause

Installed model

```
llama3.2
```

Code expected

```
llama3
```

Solution

Updated

```python
model="llama3.2"
```

---

## 6. Incorrect Embedding Model

Initially

```python
OllamaEmbeddings(
    model="llama3"
)
```

Issue

Llama is a chat model, not an embedding model.

Solution

```python
model="nomic-embed-text"
```

---

## 7. Partial Answers

Issue

Questions like

```
Leave Policy
```

returned incomplete responses.

Cause

Small chunk size and limited retrieval.

Solution

- Improved prompt
- Added semantic retrieval
- Tuned retriever
- Experimented with chunk sizes

---

## 8. Irrelevant Context Retrieved

Issue

Responses sometimes contained unrelated policies.

Solution

Updated prompt:

- Only answer from relevant context
- Ignore unrelated sections
- Merge only relevant chunks

---

## 9. Chunking Strategy

Initially

```python
chunk_size=500
chunk_overlap=50
```

Later improved with section-aware separators.

```python
separators=[
"\n\n\d+\.",
"\n\n",
"\n",
" "
]
```

---

## 10. Performance Optimization

Applied

- llama3.2:1b
- num_predict=256
- num_ctx=2048
- similarity_score_threshold retriever
- Local embeddings
- Local FAISS search

These changes improved response speed while maintaining good answer quality.

---

# Future Improvements

- Persist FAISS index to disk
- Incremental document indexing
- Multi-PDF support
- Conversation memory
- Metadata filtering
- Hybrid Search (BM25 + FAISS)
- Cross-Encoder Re-ranking
- Streaming responses
- Authentication
- Docker support
- Unit tests
- CI/CD pipeline
- Azure/AWS deployment

---

# Lessons Learned

This project provided practical experience with:

- Retrieval-Augmented Generation (RAG)
- Vector databases
- Embedding models
- Local LLM deployment
- Prompt engineering
- Semantic search
- LangChain integration
- FastAPI development
- Troubleshooting Python environments
- Ollama model management
- Performance tuning for local AI applications

---

# License

This project is intended for educational and demonstration purposes.

