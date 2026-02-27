import { TELEMETRY_KEY, isTelemetryEnabled } from "../server/config/env.js";

export default async function handler(_req, res) {
  return res.status(200).json({
    ok: true,
    telemetry: isTelemetryEnabled,
    telemetryKeyConfigured: Boolean(TELEMETRY_KEY),
  });
}
