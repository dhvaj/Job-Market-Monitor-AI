import { GoogleGenAI, Type } from "@google/genai";
import { Job, AnalysisResult } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please set it in the environment.");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeJobMatch = async (
  job: Job, 
  userSkills: string
): Promise<AnalysisResult> => {
  const ai = getClient();
  
  const prompt = `
    You are an expert Career Coach and Recruiter. 
    Analyze the following Job Description against the Candidate's Skills.
    
    Candidate Skills: ${userSkills}
    
    Job Title: ${job.title}
    Job Description: ${job.description}
    
    Task:
    1. Assign a "Match Rating" from 0 to 10 (10 being a perfect match).
    2. Provide a short "Reasoning" explaining the rating.
    3. Determine if this is a "Key Match" (Rating >= 8).
    
    Return the response in JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            rating: { type: Type.NUMBER, description: "Score from 0 to 10" },
            reasoning: { type: Type.STRING, description: "Concise explanation of the score" },
            keyMatch: { type: Type.BOOLEAN, description: "True if rating is 8 or higher" },
          },
          required: ["rating", "reasoning", "keyMatch"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from Gemini");

    const result = JSON.parse(text);
    
    return {
      jobId: job.id,
      rating: result.rating,
      reasoning: result.reasoning,
      keyMatch: result.keyMatch
    };
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Fallback in case of error
    return {
      jobId: job.id,
      rating: 0,
      reasoning: "Analysis failed due to API error.",
      keyMatch: false
    };
  }
};
