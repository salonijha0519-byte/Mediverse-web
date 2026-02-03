
import { GoogleGenAI, Type } from "@google/genai";
import { HealthAnalysis } from "../types";

// Helper function to analyze medical reports using Gemini
export const analyzeReport = async (fileData: string, mimeType: string): Promise<HealthAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Analyze this medical report. Extract key health metrics (like glucose, blood pressure, etc.), summarize the findings, and note any critical observations. Return the results strictly in JSON format. Do not include markdown formatting in your response.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        { inlineData: { data: fileData, mimeType } },
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          metrics: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                value: { type: Type.STRING },
                unit: { type: Type.STRING },
                timestamp: { type: Type.STRING }
              }
            }
          },
          recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          criticalLevel: { 
            type: Type.STRING, 
            description: "Low, Medium, or High"
          }
        },
        required: ["summary", "metrics", "criticalLevel"]
      }
    }
  });

  try {
    const text = response.text || "{}";
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (e) {
    console.error("JSON Parse error:", e);
    return {
      summary: "Error parsing medical report analysis.",
      metrics: [],
      recommendations: ["Please try re-uploading the document."],
      criticalLevel: "Low"
    };
  }
};

// Helper function to chat with AI using Gemini
export const chatWithAI = async (message: string, history: { role: 'user' | 'model', text: string }[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Format history for the SDK
  const formattedHistory = history.map(h => ({
    role: h.role,
    parts: [{ text: h.text }]
  }));

  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    history: formattedHistory,
    config: {
      systemInstruction: "You are Mediverse Assistant, a helpful AI medical companion. You provide information based on common medical knowledge and the user's uploaded reports. Always include a disclaimer that you are an AI and the user should consult a real doctor for professional diagnosis.",
    }
  });

  const response = await chat.sendMessage({ message });
  return response.text;
};