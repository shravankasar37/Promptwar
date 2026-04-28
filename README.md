# Smart Election Assistant

An interactive AI assistant built for the Google Antigravity hackathon (Promptwar). This project helps users understand the election process, timelines, and steps in an interactive and easy-to-follow way.

## Challenge Vertical Chosen
**Voter Education & Election Assistant**

## Features & Approach
- **Localized Ballot Preview**: Uses IP geolocation (or mocked user coordinates) to show localized 2026 midterms information.
- **Deadline Navigator**: Interactive calendar showing registration and early voting windows.
- **Myth-Buster AI Engine**: Fact-checks election misinformation via a LangChain/RAG agent grounded in verified sources.
- **Multilingual Support**: Supports real-time translation using the Gemini API.

## Technical Architecure
- **Frontend**: Next.js (App Router), Tailwind CSS, Framer Motion
- **AI Brain**: Gemini 1.5 Pro/Flash integrated via `@google/genai`
- **RAG & Data**: Pinecone (Vector database) storing 2026 voter guides and data API connections to Google Civic Information API.

## How It Works
The application uses the Gemini 1.5 model as an orchestration layer. When a user queries about election dates or candidate stances, the Agent checks the location context, queries the appropriate RAG tools or APIs, and returns the grounded answer with a proper `.gov/.org` citation.

## Running Locally
```bash
npm run dev
```

Cloud Run / Firebase Hosting URL: [TBD - To be updated during deployment]
