import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// Initialize the client. In a real environment, set GEMINI_API_KEY in .env.local
const ai = new GoogleGenAI(process.env.GEMINI_API_KEY ? { apiKey: process.env.GEMINI_API_KEY } : {});

// Mock database to simulate vector search (Pinecone/Weaviate replacement for demo without keys)
const MOCK_VECTOR_DB = [
  {
    content: "Texas requires that voters show a valid photo ID at the polling location. Acceptable forms include Texas Driver License, Texas Election Identification Certificate, Texas Personal Identification Card, US Military ID, US Citizenship Certificate, or US Passport. Source: [Texas Secretary of State - VoteTexas.gov](https://www.votetexas.gov/mobile/id-faq.htm)",
    keywords: ["photo id", "texas", "voting identification", "voter id"]
  },
  {
    content: "Early voting in Texas begins 17 days before Election Day and ends 4 days before Election Day. You may vote at any early voting location in your county of registration. Source: [Texas Secretary of State](https://www.votetexas.gov/)",
    keywords: ["early voting", "when to vote", "dates", "texas"]
  },
  {
    content: "Proposition A seeks to authorize the issuance of $7.1 billion in bonds to fund the construction and operation of a light rail system, an underground transit tunnel, and expanded bus services in the Austin area. Often referred to as 'Project Connect'. Source: [Ballotpedia - Austin Prop A](https://ballotpedia.org/)",
    keywords: ["proposition a", "austin", "project connect", "transit", "bonds"]
  }
];

// Simple retrieval function mapping to the mock vector database
function retrieveRelevantContext(query: string) {
  const q = query.toLowerCase();
  
  // Find matches
  const matches = MOCK_VECTOR_DB.filter(doc => 
    doc.keywords.some(kw => q.includes(kw))
  );

  if (matches.length > 0) {
    return matches.map(m => m.content).join("\n\n");
  }
  return "No specific local laws were found for this query in the vector database.";
}

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ reply: 'Please provide a message.' }, { status: 400 });
    }

    // Step 1: RAG Retrieval
    const context = retrieveRelevantContext(message);

    // Step 2: Fallback logic if no API key is provided for the demo
    if (!process.env.GEMINI_API_KEY) {
      console.warn("No GEMINI_API_KEY found. Falling back to simple heuristic responses.");
      
      let replyText = `**[DEMO MODE: No API Key]**\n\nI searched the official databases for your query: "${message}".\n\n`;
      replyText += `**Fact Check Results:**\n${context !== "No specific local laws were found for this query in the vector database." ? context : "Could not verify this claim based on the mock data. Try asking about 'Photo ID in Texas' or 'Proposition A'."}`;
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return NextResponse.json({ reply: replyText });
    }

    // Step 3: Call Gemini API directly via fetch to avoid SDK model name mismatches
    const prompt = `
      You are the VoteSmart Myth-Buster AI. Your job is to strictly fact-check user claims regarding elections using ONLY the provided verified context.
      User Query: "${message}"

      Vector Database Context:
      """
      ${context}
      """

      Rules for Reliability & Safety (CRITICAL):
      1. ONLY answer based on the Context provided. 
      2. Citation Requirement: ALWAYS cite the exact source mentioned in the context using a badge format (e.g., [Source: Texas Secretary of State](https://www.votetexas.gov/)).
      3. Non-Partisan Filter: NEVER recommend a candidate or party. You must only explain HOW to vote, not WHO to vote for. If the user asks for a political opinion, you must respond exactly with: "I am a non-partisan assistant. I can provide candidate bios and records, but I cannot offer opinions."
      4. Human-In-The-Loop: If you are unsure about a local law change or the context doesn't provide the answer, DO NOT GUESS. Tell the user exactly this: "I cannot verify that local law based on my current data. Please contact your local Board of Elections directly."
      5. Format the answer cleanly using markdown. If a claim is demonstrably false based on the context, state it clearly.
    `;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API Error:", errText);
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I could not generate a response. Please check if your API key has quota.";

    return NextResponse.json({ reply: replyText });
  } catch (error: any) {
    console.error('Error generating AI response:', error);
    return NextResponse.json(
      { reply: 'Error checking claim. Please ensure API keys are configured correctly or try again later.' },
      { status: 500 }
    );
  }
}
