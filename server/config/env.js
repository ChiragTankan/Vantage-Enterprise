import dotenv from "dotenv";

dotenv.config();

export const ASI_ONE_API_KEY = process.env.ASI_ONE_API_KEY;
export const TELEMETRY_KEY = process.env.TELEMETRY_KEY;
export const isTelemetryEnabled = Boolean(TELEMETRY_KEY && TELEMETRY_KEY !== "disable_if_not_used");

export function validateEnv() {
  if (!ASI_ONE_API_KEY || ASI_ONE_API_KEY === "PASTE_MY_ASI_ONE_KEY_HERE") {
    throw new Error("System configuration error: ASI One key missing.");
  }
}
