import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";
import { app } from "../firebase";

const ai = getAI(app, { backend: new GoogleAIBackend() });

const model = getGenerativeModel(ai, {
  model: "gemini-3-flash-preview",
});

const FUNCTIONS_BASE_URL = (import.meta.env.VITE_FUNCTIONS_URL || "https://us-central1-contractlens-tethered.cloudfunctions.net").replace(/\/$/, "");

// 🔥 Reusable function
export async function analyzeContract(contractText, sector = "General") {
  const prompt = `
You are a legal assistant AI specialized in simplifying and analyzing contracts for everyday users.

Your task is to:
1. Analyze the provided contract or terms of service.
2. Identify potential risks, unfair clauses, or manipulative language.
3. Explain the implications in simple, clear language.
4. Rate the overall risk level of the contract.
5. Tailor insights to the specified sector.

IMPORTANT RULES:
- Use simple English
- Be concise but informative
- Do NOT hallucinate
- Highlight anything harmful to the user
- If the sector is "General", use broad contract analysis without industry-specific assumptions.
- If the sector is specific, prioritize clauses, risks, and norms relevant to that sector.

OUTPUT FORMAT (STRICT JSON):

{
  "summary": "",
  "risk_level": "LOW | MEDIUM | HIGH",
  "key_concerns": [
    {
      "clause": "",
      "risk": "",
      "impact": "",
      "severity": "LOW | MEDIUM | HIGH"
    }
  ],
  "hidden_implications": [],
  "user_should_be_aware_of": [],
  "fairness_score": 1-10,
  "final_verdict": ""
}

Sector: ${sector}

Now analyze this contract:

${contractText}
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // 🔥 Try parsing JSON safely
    const cleaned = text.replace(/```json|```/g, "").trim();

    console.log("AI Raw Response:", text);
    console.log("AI Cleaned Response:", cleaned);
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("AI Error:", error);
    return { error: "Failed to analyze contract" };
  }
}

export async function suggestRecommendations(contractText, analysisResult, sector = "General") {
  const prompt = `
You are a legal assistant AI. The contract analysis is already completed.

Your task is to provide:
1. Practical recommendations for the user based on the analysis.
2. Safer or fairer alternatives the user can request or choose instead.

IMPORTANT RULES:
- Use simple English
- Be concise and actionable
- Do NOT hallucinate or invent clauses not supported by the analysis
- Keep recommendations realistic for the sector

OUTPUT FORMAT (STRICT JSON):
{
  "recommendations": [
    {
      "title": "",
      "why": ""
    }
  ],
  "alternatives": [
    {
      "option": "",
      "why": ""
    }
  ]
}

Sector: ${sector}

Contract (excerpt/summary for context):
${contractText}

Analysis JSON:
${JSON.stringify(analysisResult)}
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleaned = text.replace(/```json|```/g, "").trim();

    console.log("Recommendations Raw Response:", text);
    console.log("Recommendations Cleaned Response:", cleaned);
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Recommendations Error:", error);
    return { error: "Failed to generate recommendations" };
  }
}
