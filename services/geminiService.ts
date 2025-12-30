import { GoogleGenAI } from "@google/genai";
import { GibsLayer, ViewState } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateScienceResponse = async (
  prompt: string,
  context: {
    date: string;
    layer: GibsLayer;
    overlays: GibsLayer[];
    viewState?: ViewState | null;
  }
) => {
  try {
    const model = 'gemini-2.5-flash';
    
    // Construct location string if available
    let locationInfo = "Global View";
    if (context.viewState) {
      locationInfo = `Lat: ${context.viewState.lat.toFixed(2)}, Lng: ${context.viewState.lng.toFixed(2)}, Zoom Level: ${context.viewState.zoom}`;
    }

    const systemInstruction = `
      You are an expert NASA Earth Scientist and Geospatial Analyst.
      You are assisting a user exploring satellite imagery using the NASA GIBS (Global Imagery Browse Services) API.
      
      Current User Context:
      - Viewing Date: ${context.date}
      - Camera Location: ${locationInfo}
      - Base Layer: ${context.layer.name} (${context.layer.description})
      - Active Overlays: ${context.overlays.map(o => o.name).join(', ') || 'None'}

      Your goal is to explain scientific phenomena, describe what the selected satellite layers show, 
      and help the user interpret the satellite imagery. 
      
      If the user provides a location context (lat/lng), try to identify the region (country, ocean, or specific landmark) and tailor your explanation to that geography.
      If the user asks about specific features (like "what is that white swirl"), use the date and location to infer the event (e.g., Hurricane Ian, Maui Fires, etc.) if it matches historical records.
      
      Keep answers concise, engaging, and scientifically accurate. Use Markdown.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the satellite network (AI Error). Please check your API key.";
  }
};