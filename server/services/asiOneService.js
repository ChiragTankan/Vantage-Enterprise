import axios from "axios";
import { ASI_ONE_API_KEY } from "../config/env.js";

export async function queryASI(systemInstruction, prompt) {
  try {
    const response = await axios.post(
      "https://api.asi1.ai/v1/chat/completions",
      {
        model: "asi1-mini",
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${ASI_ONE_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 30000
      }
    );

    return response.data;
  } catch (error) {
    console.error("ASI One API error:", error.response?.data || error.message);
    throw error;
  }
}
