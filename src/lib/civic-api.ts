// Mock Google Civic Information API & Ballotpedia Wrapper

export interface CandidateProfile {
  id: string;
  name: string;
  party: string;
  role: string;
  bio: string;
  techPolicy: string;
  environmentalPolicy: string;
  sourceUrl: string;
}

export interface ElectionDeadline {
  state: string;
  registrationDeadline: string;
  earlyVotingStart: string;
  electionDay: string;
  mailInRequestDeadline: string;
}

// MOCK DATA: Candidate Duel 
const candidatesDb: Record<string, CandidateProfile> = {
  "candidate_a": {
    id: "candidate_a",
    name: "Jane Smith",
    party: "Democrat",
    role: "State Senate District 14",
    bio: "Former tech executive advocating for broadband expansion.",
    techPolicy: "Supports $500M state bond for rural fiber optics. Proposes strict AI regulation bill.",
    environmentalPolicy: "Carbon neutral grid target by 2035. Supports solar subsidies.",
    sourceUrl: "https://ballotpedia.org/Jane_Smith"
  },
  "candidate_b": {
    id: "candidate_b",
    name: "John Doe",
    party: "Republican",
    role: "State Senate District 14",
    bio: "Small business owner and 2-term city councilman.",
    techPolicy: "Prefers tax incentives for private ISPs to expand broadband. Opposes heavy AI regulation.",
    environmentalPolicy: "Focuses on deregulation to lower energy costs. Supports natural gas transition.",
    sourceUrl: "https://ballotpedia.org/John_Doe"
  }
};

// MOCK DATA: Election Calendars
const deadlinesDb: Record<string, ElectionDeadline> = {
  "TX": {
    state: "Texas",
    registrationDeadline: "October 5, 2026",
    earlyVotingStart: "October 19, 2026",
    electionDay: "November 3, 2026",
    mailInRequestDeadline: "October 23, 2026"
  }
};

/**
 * MOCK: Fetches two candidates for a side-by-side policy duel.
 */
export async function fetchCandidateComparison(candidateId1: string, candidateId2: string) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));
  return {
    candidate1: candidatesDb[candidateId1] || null,
    candidate2: candidatesDb[candidateId2] || null
  };
}

/**
 * MOCK: Fetches election deadlines for a given state.
 */
export async function fetchElectionDeadlines(stateCode: string) {
  await new Promise(resolve => setTimeout(resolve, 400));
  return deadlinesDb[stateCode.toUpperCase()] || null;
}

/**
 * MOCK: "Registration Pre-Fill" helper that returns the official PDF URL and guidance.
 */
export async function getRegistrationGuidance(stateCode: string) {
  if (stateCode.toUpperCase() === "TX") {
    return {
      pdfUrl: "https://www.sos.state.tx.us/elections/forms/vr-with-receipt.pdf",
      instructions: "In Texas, you must print out the Voter Registration Application, fill it out, and mail it to your county election office. Online registration is only available when renewing your Driver's License."
    };
  }
  return {
    pdfUrl: "https://www.eac.gov/voters/national-mail-voter-registration-form",
    instructions: "Please use the National Mail Voter Registration form."
  };
}
