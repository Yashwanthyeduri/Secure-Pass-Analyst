
import { GoogleGenAI, Chat, Type } from "@google/genai";

export interface SecurityAnalysis {
  score: number;
  crackTimeEstimate: string;
  weaknesses: string[];
  suggestions: string[];
  verdict: "Weak" | "Moderate" | "Strong" | "Very Strong";
}

// Fix: Use gemini-3-pro-preview for complex analysis and implement Type-based responseSchema for JSON reliability.
export const analyzePasswordWithAI = async (password: string): Promise<SecurityAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Evaluate the following password for security strength: "${password}"
      
      Be strict in your evaluation. If it is common, short, or uses predictable patterns, rate it very low.`,
      config: {
        systemInstruction: "You are a Senior Information Security Analyst. Analyze password security and provide findings in a structured JSON format.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { 
              type: Type.NUMBER, 
              description: "Security score from 0-100."
            },
            crackTimeEstimate: { 
              type: Type.STRING, 
              description: "Estimated time to crack the password (e.g., 'Instant', '10 years')."
            },
            weaknesses: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "1-3 specific security weaknesses."
            },
            suggestions: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "1-3 specific recommendations for improvement."
            },
            verdict: { 
              type: Type.STRING, 
              description: "Security verdict: 'Weak', 'Moderate', 'Strong', or 'Very Strong'."
            }
          },
          required: ["score", "crackTimeEstimate", "weaknesses", "suggestions", "verdict"]
        }
      }
    });

    const text = response.text || "{}";
    return JSON.parse(text) as SecurityAnalysis;
  } catch (error: any) {
    console.error("AI Analysis failed:", error);
    if (error?.message?.includes("Requested entity was not found.")) {
       window.dispatchEvent(new CustomEvent('gemini-api-error'));
    }
    return {
      score: 0,
      crackTimeEstimate: "Unknown",
      weaknesses: ["Analysis Error"],
      suggestions: ["Check your API key or connection"],
      verdict: "Weak"
    };
  }
};

// Fix: Use gemini-3-flash-preview for general text tasks like security tips.
export const getSecurityTip = async (): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Give me one short, impactful, and less known fact about password security or a cybersecurity tip. Max 2 sentences."
    });
    return response.text || "Enable 2FA wherever possible.";
  } catch (e) {
    return "Always use a password manager to generate and store unique passwords.";
  }
};

// Fix: Use gemini-3-flash-preview for interactive chat sessions.
export const createSecurityChat = (): Chat => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  return ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: "You are a helpful, professional Information Security Analyst. Your goal is to educate users about cybersecurity, password strength, phishing, and digital safety. Provide concise, actionable advice. If asked about non-security topics, politely steer the conversation back to digital security.",
    }
  });
};
