import { AppMode, InsightReport } from "../types";

export class ChatService {
  async processRequest(
    prompt: string,
    mode: AppMode,
    strategy: string,
    context?: string
  ): Promise<InsightReport> {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt,
        mode,
        strategy,
        context
      })
    });

    // Read raw response safely
    const rawBody = await response.text();

    let data: any = {};

    if (rawBody) {
      try {
        data = JSON.parse(rawBody);
      } catch {
        throw new Error(
          `Invalid API response (${response.status}). Please verify backend deployment and /api/chat route.`
        );
      }
    }

    // Handle non-200 responses safely
    if (!response.ok) {
      throw new Error(
        data?.error || `Request failed with status ${response.status}.`
      );
    }

    return data as InsightReport;
  }
}

export const chatService = new ChatService();