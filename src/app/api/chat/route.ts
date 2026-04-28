import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { fetchCandidateComparison, getRegistrationGuidance } from '@/lib/civic-api';

// Vector Database Mock
const MOCK_VECTOR_DB = [
  {
    id: "tx-id-law",
    content: "Texas requires that voters show a valid photo ID at the polling location. Acceptable forms include Texas Driver License, Texas Election Identification Certificate, Texas Personal Identification Card, US Military ID, US Citizenship Certificate, or US Passport.",
    title: "Voter ID Requirements",
    url: "https://www.votetexas.gov/mobile/id-faq.htm",
    type: "verified" as const,
    keywords: ["photo id", "texas", "voting identification", "voter id"]
  },
  {
    id: "tx-early-voting",
    content: "Early voting in Texas begins 17 days before Election Day and ends 4 days before Election Day. You may vote at any early voting location in your county of registration.",
    title: "Texas Early Voting",
    url: "https://www.votetexas.gov/",
    type: "verified" as const,
    keywords: ["early voting", "when to vote", "dates", "texas"]
  },
  {
    id: "prop-a-austin",
    content: "Proposition A seeks to authorize the issuance of $7.1 billion in bonds to fund the construction and operation of a light rail system, an underground transit tunnel, and expanded bus services in the Austin area. Often referred to as 'Project Connect'.",
    title: "Austin Proposition A (Project Connect)",
    url: "https://ballotpedia.org/Austin,_Texas,_Proposition_A,_Project_Connect_Property_Tax_Increase_(November_2020)",
    type: "verified" as const,
    keywords: ["proposition a", "austin", "project connect", "transit", "bonds"]
  }
];

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  let context = "";
  let extractedSources: any[] = [];
  
  try {
    const { message } = await req.json();
    if (!message) return NextResponse.json({ reply: 'Please provide a message.' }, { status: 400 });

    const q = message.toLowerCase();

    // ---------------------------------------------------------
    // AGENTIC TOOL ROUTING (Intent Detection)
    // ---------------------------------------------------------
    
    // Tool 1: Candidate Duel
    if (q.includes("compare candidate") || q.includes("side-by-side")) {
      const comparison = await fetchCandidateComparison("candidate_a", "candidate_b");
      context = `Candidate A (Jane Smith - Dem): ${comparison.candidate1?.techPolicy} | ${comparison.candidate1?.environmentalPolicy}\nCandidate B (John Doe - Rep): ${comparison.candidate2?.techPolicy} | ${comparison.candidate2?.environmentalPolicy}`;
      extractedSources.push({ id: "cand_a", title: "Jane Smith Profile", url: comparison.candidate1?.sourceUrl, type: "verified", snippet: comparison.candidate1?.bio });
      extractedSources.push({ id: "cand_b", title: "John Doe Profile", url: comparison.candidate2?.sourceUrl, type: "verified", snippet: comparison.candidate2?.bio });
    }
    // Tool 2: Registration Pre-fill Guidance
    else if (q.includes("pre-fill") || q.includes("registration form")) {
      const guidance = await getRegistrationGuidance("TX");
      context = `Registration Guidance: ${guidance.instructions}\nOfficial PDF Link: ${guidance.pdfUrl}`;
      extractedSources.push({ id: "tx-reg", title: "Official TX Registration Form", url: guidance.pdfUrl, type: "verified", snippet: guidance.instructions });
    }
    // Tool 3: Jargon Simplifier
    else if (q.includes("high school") || q.includes("simplify")) {
      context = "The user is requesting a highly simplified, 8th-grade level explanation of a ballot measure or election process. Use analogies and avoid legal jargon.";
      // Also grab regular vector data for the actual topic
      const matches = MOCK_VECTOR_DB.filter(doc => doc.keywords.some(kw => q.includes(kw)));
      if (matches.length > 0) {
        context += `\nTopic Data: ${matches.map(m => m.content).join("\n")}`;
        extractedSources = [...extractedSources, ...matches.map(m => ({ id: m.id, title: m.title, url: m.url, type: m.type, snippet: m.content.substring(0, 100) + "..." }))];
      }
    }
    // Default: Vector Search
    else {
      const matches = MOCK_VECTOR_DB.filter(doc => doc.keywords.some(kw => q.includes(kw)));
      if (matches.length > 0) {
        context = matches.map(m => m.content).join("\n\n");
        extractedSources = [...extractedSources, ...matches.map(m => ({ id: m.id, title: m.title, url: m.url, type: m.type, snippet: m.content.substring(0, 100) + "..." }))];
      } else {
        context = "No specific local laws were found for this query in the vector database.";
      }
    }

    // ---------------------------------------------------------
    // SYSTEM PROMPT CONSTRUCTION
    // ---------------------------------------------------------
    let systemPrompt = "You are the VoteSmart Myth-Buster AI.";
    try {
      const promptPath = path.join(process.cwd(), 'src/prompts/election-guardrails.md');
      systemPrompt = fs.readFileSync(promptPath, 'utf8');
    } catch (e) {
      console.warn("Could not read election-guardrails.md. Using fallback prompt.");
    }

    const finalPrompt = `
      ${systemPrompt}
      
      User Query: "${message}"

      Vector Database/Tool Context:
      """
      ${context}
      """
    `;

    // ---------------------------------------------------------
    // FALLBACK OVERRIDE (For Hackathon Demo missing keys)
    // ---------------------------------------------------------
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ 
        reply: `**[SYSTEM FAILOVER]** Active API Key not found. Displaying raw data:\n\n${context}`,
        sources: extractedSources 
      });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: finalPrompt }] }]
      })
    });

    if (!response.ok) {
      return NextResponse.json({ 
        reply: `**[SYSTEM FAILOVER]** The AI API key provided lacks permissions. Switching to local safety protocols:\n\n${context}`,
        sources: extractedSources
      });
    }

    const data = await response.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I could not generate a response.";

    return NextResponse.json({ reply: replyText, sources: extractedSources });

  } catch (error: any) {
    console.error('Network Error generating AI response:', error);
    return NextResponse.json({ 
      reply: `**[SYSTEM FAILOVER]** Network error contacting AI. Switching to localized RAG:\n\n${context}`,
      sources: extractedSources
    });
  }
}
