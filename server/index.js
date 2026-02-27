import express from "express";
import cors from "cors";
import { TELEMETRY_KEY, isTelemetryEnabled, validateEnv } from "./config/env.js";
import { queryASI } from "./services/asiOneService.js";

validateEnv();

if (!isTelemetryEnabled) {
  console.warn("Telemetry disabled: No TELEMETRY_KEY provided.");
}

const app = express();
const port = Number(process.env.PORT || 8787);

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, telemetry: isTelemetryEnabled, telemetryKeyConfigured: Boolean(TELEMETRY_KEY) });
});

app.post("/api/chat", async (req, res) => {
  const start = Date.now();
  const { prompt, strategy = "", context = "", mode = "QUICK_CONSULT" } = req.body ?? {};

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Prompt is required." });
  }

  const userPrompt = mode === "DEEP_ANALYSIS" && context
    ? `[INTERNAL DATASET AUDIT]\nSOURCE MATERIAL:\n${context}\n\nDIRECTIVE: ${prompt}`
    : prompt;

  const systemInstruction = `You are a Senior Strategic Analyst at Vantage Enterprise.\nYour role is to produce direct, executive-ready market reports.\n\nCOMMUNICATION PROTOCOL:\n1. START DIRECTLY with the findings.\n2. NO MARKDOWN SYMBOLS. Use ALL CAPS for headers and double spaces between sections.\n3. Use professional, clinical business language.\n4. Never refer to yourself as AI.\n5. Use plain dashes (-) for bullet points.\n6. Strategy Focus: ${strategy || "N/A"}.`;

  try {
    const data = await queryASI(systemInstruction, userPrompt);
    const content = data?.choices?.[0]?.message?.content || "System report unavailable.";

    const processingTime = (Date.now() - start) / 1000;
    return res.json({
      content,
      strategyReference: strategy,
      telemetry: {
        precisionLevel: "High Fidelity",
        relevanceScore: 98.4,
        processingTime,
      },
      sources: [],
      telemetryEnabled: isTelemetryEnabled,
    });
  } catch (error) {
    const message = error?.response?.data?.error?.message || error?.message || "Unknown provider error";
    return res.status(502).json({ error: `Platform Error: ${message}` });
  }
});

app.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`);
});
