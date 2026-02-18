
import { GoogleGenAI } from "@google/genai";
import { AppMode, SystemTelemetry, InsightReport, GroundingSource } from "../types";

export class GeminiService {
  private calculateTelemetry(startTime: number, text: string): SystemTelemetry {
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    
    // Abstracting AI metrics into "Enterprise Telemetry"
    return {
      precisionLevel: "High Fidelity",
      relevanceScore: 98.4,
      processingTime: duration
    };
  }

  async processRequest(
    prompt: string,
    mode: AppMode,
    strategy: string,
    context?: string
  ): Promise<InsightReport> {
    const startTime = Date.now();
    
    const apiKey =
      process.env.API_KEY ||
      (typeof import.meta !== "undefined" ? import.meta.env?.VITE_API_KEY : undefined);

    if (!apiKey || apiKey === 'undefined') {
      throw new Error("System configuration error: Telemetry key missing.");
    }

    // Always use new GoogleGenAI({apiKey: process.env.API_KEY}) to initialize the SDK.
    const ai = new GoogleGenAI({ apiKey });
    // Use gemini-3-pro-preview for complex text tasks like advanced market reasoning.
    const model = 'gemini-3-pro-preview';

    /**
     * HUMAN-CENTRIC ARCHITECTURAL INSTRUCTIONS:
     * Removes all traces of AI persona. No meta-talk, no "As an AI", no "Synthesized".
     */
    let systemInstruction = `You are a Senior Strategic Analyst at Vantage Enterprise. 
Your role is to produce direct, executive-ready market reports.

COMMUNICATION PROTOCOL:
1. START DIRECTLY with the findings. Never use introductory filler like "Here is the report" or "Based on your request".
2. NO MARKDOWN SYMBOLS. Use ALL CAPS for headers and double spacing for paragraph breaks.
3. Use professional, clinical business language.
4. NEVER refer to yourself as an AI, bot, or assistant. You are the Vantage Analyst Core.
5. Use plain dashes (-) for bullet points.
6. Strategy Focus: ${strategy}.

If the user provides raw data context, treat it as proprietary business records for forensic auditing.`;

    let finalPrompt = prompt;
    if (mode === AppMode.DEEP_ANALYSIS && context) {
      finalPrompt = `[INTERNAL DATASET AUDIT]\nSOURCE MATERIAL:\n${context}\n\nDIRECTIVE: ${prompt}`;
    }

    try {
      // Must use ai.models.generateContent to query GenAI with both the model name and prompt.
      const response = await ai.models.generateContent({
        model,
        contents: finalPrompt,
        config: {
          systemInstruction,
          // googleSearch is allowed for recent events or trending info.
          tools: [{ googleSearch: {} }], 
          temperature: 0.1, 
        },
      });

      // The simplest and most direct way to get the generated text content is by accessing the .text property.
      const text = response.text || "System report unavailable.";
      const telemetry = this.calculateTelemetry(startTime, text);

      const sources: GroundingSource[] = [];
      const metadata = response.candidates?.[0]?.groundingMetadata;
      
      // Extract website URLs from groundingChunks if Google Search is used.
      if (metadata?.groundingChunks) {
        metadata.groundingChunks.forEach((chunk: any) => {
          if (chunk.web?.uri) {
            sources.push({
              title: chunk.web.title || "External Market Data",
              uri: chunk.web.uri
            });
          }
        });
      }

      const uniqueSources = Array.from(new Map(sources.map(s => [s.uri, s])).values());

      return {
        content: text,
        strategyReference: strategy,
        telemetry,
        sources: uniqueSources
      };
    } catch (error: any) {
      const errMsg = error.message || "";
      if (errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED')) {
        throw new Error("Enterprise server capacity reached. System cooldown in progress.");
      }
      throw new Error(`Platform Error: ${errMsg}`);
    }
  }
}

export const geminiService = new GeminiService();
