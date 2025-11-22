import { GoogleGenAI } from "@google/genai";
import { PatientData } from '../types';

const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key not found");
    return new GoogleGenAI({ apiKey });
};

export const getAIExplanation = async (patient: PatientData, riskScore: number): Promise<string> => {
  try {
    const ai = getClient();
    const model = "gemini-2.5-flash";
    
    const riskLabel = riskScore > 0.5 ? "High Risk" : "Low Risk";
    
    const prompt = `
      You are an expert cardiologist assistant explained complex data to patients.
      
      Patient Profile:
      - Age: ${patient.age}
      - Sex: ${patient.sex === 1 ? 'Male' : 'Female'}
      - Cholesterol: ${patient.chol} mg/dl
      - Blood Pressure: ${patient.trestbps} mm Hg
      - Chest Pain Type: ${patient.cp} (Scale 0-3)
      - Max Heart Rate: ${patient.thalach}
      
      The Machine Learning model predicted: ${riskLabel} (${(riskScore * 100).toFixed(1)}% probability).
      
      Please provide:
      1. A simplified explanation of why this risk score was given based on the factors above.
      2. Suggest 3 general lifestyle changes that positively impact heart health.
      3. A disclaimer that this is an educational AI demo and not a medical diagnosis.
      
      Keep it under 200 words. Use markdown for formatting.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "Could not generate explanation.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI Explanation unavailable. Please ensure API Key is configured.";
  }
};
