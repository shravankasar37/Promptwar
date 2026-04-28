# VoteSmart '26 - Smart Election Assistant (Promptwar Hackathon)

An interactive, agentic AI assistant built for the **Google Developer Hackathon: Promptwar**. VoteSmart transforms the standard voter experience into a sleek, Fintech-style "Command Center" that fact-checks misinformation, translates complex legal jargon, and provides highly localized election data.

## 🏆 Challenge Vertical Chosen
**Voter Education & Election Assistant**

---

## 🧠 Core Prompting Logic & Agentic Architecture
Our application utilizes a highly advanced, multi-step prompt orchestration layer built around the **Gemini 2.5 Flash** model. We engineered strict guardrails and tool-calling proxies to ensure 100% non-partisan reliability.

### 1. The "Non-Partisan Official" System Persona (`src/prompts/election-guardrails.md`)
To prevent hallucination and political bias, the system prompt strictly enforces the following rules:
- **Information Containment:** The LLM is forbidden from using its internal training data to answer specific local questions. It *must* rely solely on the injected Vector Context.
- **Citation Requirement:** Every response must include a source badge (e.g., `[Source: Texas Secretary of State]`).
- **Strict Neutrality:** If a user requests a political endorsement, the model is hardcoded to refuse and redirect the conversation to factual data.

### 2. Multi-Step Intent Routing & Tool Calling (`src/app/api/chat/route.ts`)
Before the user's prompt reaches Gemini, our backend acts as an Agentic Router to detect intent:
- **"Candidate Duel" (Comparison):** If the user asks to compare candidates, the router triggers a mock Google Civic API tool to fetch structured JSON data for both candidates, dynamically injecting their stances into the prompt.
- **"Jargon-to-Plain-English":** If the user asks to "simplify", the prompt is dynamically augmented with: *"Explain this ballot measure at an 8th-grade reading level using simple analogies."*
- **"Registration Pre-Fill":** The AI detects form requests and instantly pulls the official state `.pdf` URLs into the Evidence Sidebar.

### 3. Dynamic RAG (Retrieval-Augmented Generation) & Evidence UI
The UI features a unique **3-Column Architecture**. As Gemini processes the prompt, our backend simultaneously extracts the URLs of the cited sources and populates the **Right-Hand Evidence Sidebar** with clickable, verified "Source Cards" for ultimate transparency.

### 4. Zero-Downtime System Failover
In an election context, a broken API is dangerous. If the Gemini API key fails or rate-limits, our custom error boundary catches the exception and gracefully falls back to a deterministic, local RAG retrieval—ensuring the user *always* gets the verified data they need.

---

## ✨ Features
- **Command Center Dashboard:** A premium, glassmorphic UI utilizing "Neutral Authority" design tokens.
- **Agentic Quick Actions:** 1-click buttons to trigger complex multi-step prompts (e.g., side-by-side policy duels).
- **Interactive 3D Ballot Box:** Built with `Three.js` and `React-Three-Fiber` for visual engagement.
- **Accessibility Auto-Read:** Built-in Text-to-Speech (TTS) that dynamically reads the AI's output and intelligently cancels audio if the user navigates away.
- **Native Multilingual Prompting:** A UI dropdown that silently injects language requirements (e.g., Spanish, Tagalog) into the core prompt, enforcing localized translation directly from the LLM.

## 💻 Tech Stack
- **Frontend**: Next.js 15 (App Router), Tailwind CSS v4, React-Three-Fiber, Lucide Icons.
- **AI Backend**: Google Gemini 2.5 Flash (`@google/genai`), Node.js, File System Prompting.
- **Hosting**: Google Cloud Run / Firebase Web Frameworks.

## 🚀 Running Locally
```bash
npm install
npm run dev
```

---
*Built for the 2026 Google Promptwar Hackathon.*
