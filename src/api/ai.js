import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

const extractTextFromResponse = async (response) => {
  if (!response) {
    return "";
  }

  if (typeof response.text === "function") {
    return await response.text();
  }

  if (typeof response.text === "string") {
    return response.text;
  }

  const root = response?.response ?? response;
  const parts = root?.candidates?.[0]?.content?.parts || [];
  return parts.map((part) => part.text || "").join("");
};

const parseJsonFromText = (value) => {
  if (!value) {
    return null;
  }

  if (typeof value === "object") {
    return value;
  }

  const withoutFences = String(value).replace(/```json|```/g, "").trim();
  const firstBrace = withoutFences.indexOf("{");
  const lastBrace = withoutFences.lastIndexOf("}");
  const jsonString =
    firstBrace !== -1 && lastBrace !== -1
      ? withoutFences.slice(firstBrace, lastBrace + 1)
      : withoutFences;
  return JSON.parse(jsonString);
};

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
    const response = await ai.models.generateContent({
      // model: "gemini-3-flash-preview",
      model: "gemini-3.1-flash-lite-preview",
      contents: prompt,
    });

    const text = await extractTextFromResponse(response);
    const parsed = parseJsonFromText(text);
    if (parsed && typeof parsed === "object") {
      return parsed;
    }

    return { error: "Failed to parse analysis JSON" };
    
  } catch (error) {
    console.error("AI Error:", error);
    return { error: "Failed to analyze contract" };
  }
}
