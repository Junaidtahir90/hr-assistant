# HR Assistant Frontend

> A modern React application that provides an intuitive chat interface for querying HR policies using a Retrieval-Augmented Generation (RAG) backend.

The frontend communicates with a FastAPI backend to deliver context-aware answers sourced from HR policy documents. Built with React, TypeScript, Vite, Material UI, and Axios.

---

## Features

- Modern chat interface
- Real-time communication with FastAPI
- Suggested HR topics
- Source-aware AI responses
- Responsive layout
- TypeScript support
- Material UI components
- Axios API integration

---

## Technology Stack

| Technology | Purpose |
|------------|---------|
| React 19 | UI Library |
| TypeScript | Type Safety |
| Vite | Build Tool |
| Material UI | UI Components |
| Axios | API Client |
| React Router | Routing |

---

## Screenshots

### Home Screen

> Add `docs/images/home.png`

### Sample Conversation

> Add `docs/images/chat.png`

---

## Project Structure

```text
src/
├── api/
├── assets/
├── components/
├── pages/
├── types/
├── App.tsx
└── main.tsx
```

---

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Application:

```
http://localhost:5173
```

---

## Backend Configuration

Update the API base URL if required.

Example:

```ts
const API_URL = "http://localhost:8000";
```

Ensure the FastAPI backend is running before starting the frontend.

---

## Build

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

## Available Scripts

```bash
npm run dev
```

Starts the development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run preview
```

Serves the production build locally.

```bash
npm run lint
```

Runs Oxlint.

---

## Future Improvements

- Markdown rendering
- Conversation history
- Authentication
- Streaming responses
- Dark mode
- Mobile optimization
- Document source citations
- File upload support

---

## License

Educational and demonstration purposes.
