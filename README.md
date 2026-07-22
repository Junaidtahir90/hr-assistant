# HR Assistant RAG System

> A lightweight Retrieval-Augmented Generation (RAG) application that enables users to query HR policy documents using natural language. Built with **FastAPI**, **LangChain**, **FAISS**, and **Ollama**, the entire pipeline runs locally without relying on external AI services.

![Python](https://img.shields.io/badge/Python-3.x-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688)
![LangChain](https://img.shields.io/badge/LangChain-RAG-green)
![Ollama](https://img.shields.io/badge/Ollama-Local%20LLM-black)
![FAISS](https://img.shields.io/badge/FAISS-Vector%20Database-orange)

---

## Overview

This project demonstrates an end-to-end Retrieval-Augmented Generation (RAG) pipeline for answering questions from HR policy documents.

Instead of relying solely on a Large Language Model (LLM), the application retrieves the most relevant document sections using semantic search before generating a response. This approach improves response accuracy while minimizing hallucinations.

The solution is designed to run completely offline using locally hosted embedding and language models through Ollama.

---

## Features

- Fully local RAG pipeline
- PDF document ingestion
- Semantic search using FAISS
- Local embeddings with Ollama
- Local LLM inference
- FastAPI REST API
- Automatic OpenAPI (Swagger) documentation
- Source page references
- Support for multiple PDF documents
- No external AI APIs required

---

## Technology Stack

| Technology | Purpose |
|------------|---------|
| Python | Backend |
| FastAPI | REST API |
| LangChain | RAG Pipeline |
| Ollama | Local LLM & Embeddings |
| FAISS | Vector Database |
| PyPDF | PDF Processing |
| Pydantic | Request Validation |

---

## Architecture

```text
                    PDF Documents
                           │
                           ▼
                  PyPDF Document Loader
                           │
                           ▼
          RecursiveCharacterTextSplitter
                           │
                           ▼
      Ollama Embeddings (nomic-embed-text)
                           │
                           ▼
               FAISS Vector Database
                           │
             User Question (FastAPI API)
                           │
                           ▼
                Semantic Similarity Search
                           │
                           ▼
                 Prompt Construction
                           │
                           ▼
             Llama 3.2 (Ollama Local LLM)
                           │
                           ▼
                    JSON API Response
```

---

## Project Structure

```text
.
├── data/
│   └── Sample_Employee_Handbook_HR_Policies.pdf
├── main.py
├── requirements.txt
└── README.md
```

---

## Getting Started

### Prerequisites

- Python 3.x
- Ollama

### Clone Repository

```bash
git clone <repository-url>
cd hr-assistant-rag
```

### Create Virtual Environment

**Windows**

```bash
python -m venv .venv
.venv\Scripts\activate
```

**Linux/macOS**

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### Install Dependencies

```bash
python -m pip install -r requirements.txt
```

---

## Install Ollama

Download Ollama from:

https://ollama.com/download

Verify installation:

```bash
ollama --version
```

---

## Download Required Models

```bash
ollama pull nomic-embed-text

ollama pull llama3.2:1b
```

Verify:

```bash
ollama list
```

---

## Run the Application

```bash
uvicorn main:app --reload
```

Swagger UI

```
http://localhost:8000/docs
```

---

## API

### POST `/chat`

### Request

```json
{
  "message": "What is the leave policy?"
}
```

### Response

```json
{
  "success": true,
  "question": "What is the leave policy?",
  "reply": "Annual leave is...",
  "sources": [
    {
      "page": 12
    }
  ]
}
```

---

## Sample Questions

- What is the annual leave policy?
- What are the working hours?
- What is the break policy?
- What benefits are available?
- What is the remote work policy?
- What is the maternity leave policy?

---

## Design Highlights

- Uses semantic retrieval to provide context-aware answers.
- Generates embeddings locally using `nomic-embed-text`.
- Uses `llama3.2:1b` for lightweight local inference.
- Applies similarity threshold retrieval to reduce irrelevant context.
- Prompt design limits responses to retrieved document content to minimize hallucinations.

---

## Current Limitations

- FAISS index is rebuilt on application startup.
- No conversation memory.
- In-memory vector database.
- No authentication or authorization.
- Optimized for small to medium document collections.

---

## Future Enhancements

- Persistent FAISS index
- Incremental document indexing
- Conversation memory
- Metadata filtering
- Hybrid Search (BM25 + Vector Search)
- Cross-Encoder Re-ranking
- Streaming responses
- Docker support
- Unit and integration tests
- CI/CD pipeline
- Cloud deployment (Azure/AWS)

---

## Sample Document

The application automatically indexes all PDF files placed in the `data/` directory.

Current sample document:

```text
data/
└── Sample_Employee_Handbook_HR_Policies.pdf
```

---

## Screenshots

> Add screenshots of:
>
> - React UI
> - Swagger UI
> - Sample question and response
> - System architecture (optional)

---

## Demo

> Add your Loom demonstration link here.

---

## License

This project is intended for educational and demonstration purposes.
