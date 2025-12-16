import { GoogleGenAI, Chat } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface SecurityAnalysis {
  score: number;
  crackTimeEstimate: string;
  weaknesses: string[];
  suggestions: string[];
  verdict: "Weak" | "Moderate" | "Strong" | "Very Strong";
}

export const analyzePasswordWithAI = async (password: string): Promise<SecurityAnalysis> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are a Senior Information Security Analyst.
      Analyze the following password string for security strength.
      Password to analyze: "${password}"

      Provide a JSON response with the following structure:
      {
        "score": number (0-100),
        "crackTimeEstimate": string (e.g., "Instant", "3 days", "500 years"),
        "weaknesses": string[] (List of 1-3 specific weaknesses found, e.g., "Common dictionary word", "Too short"),
        "suggestions": string[] (List of 1-3 specific improvements, e.g., "Add special characters", "Use a passphrase"),
        "verdict": string ("Weak" | "Moderate" | "Strong" | "Very Strong")
      }
      
      BE STRICT. Do not output markdown code blocks, just the raw JSON.
      If the password is common or simple, rate it very low.`,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "{}";
    return JSON.parse(text) as SecurityAnalysis;
  } catch (error) {
    console.error("AI Analysis failed:", error);
    // Fallback if AI fails
    return {
      score: 0,
      crackTimeEstimate: "Unknown",
      weaknesses: ["AI Service Unavailable"],
      suggestions: ["Try a longer password with mixed characters"],
      verdict: "Weak"
    };
  }
};

export const getSecurityTip = async (): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Give me one short, impactful, and less known fact about password security or a cybersecurity tip. Max 2 sentences."
        });
        return response.text || "Enable 2FA wherever possible.";
    } catch (e) {
        return "Always use a password manager to generate and store unique passwords.";
    }
};

export const createSecurityChat = (): Chat => {
  return ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: "You are a helpful, professional Information Security Analyst. Your goal is to educate users about cybersecurity, password strength, phishing, and digital safety. Provide concise, actionable advice. If asked about non-security topics, politely steer the conversation back to digital security.",
    }
  });
};
