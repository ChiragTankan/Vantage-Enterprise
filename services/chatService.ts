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

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Executive Platform Failure.");
    }

    return data;
  }
}

export const chatService = new ChatService();
