# Vantage Enterprise

Strategic intelligence workspace with a React frontend and secure Node.js backend proxy for ASI One.

## Environment setup

1. Copy `.env.example` to `.env`.
2. Set your ASI One key in `.env`:

```env
ASI_ONE_API_KEY=PASTE_MY_ASI_ONE_KEY_HERE
TELEMETRY_KEY=disable_if_not_used
```

Telemetry is optional. If `TELEMETRY_KEY` is not set (or left as `disable_if_not_used`), telemetry is safely disabled.

## Run locally

```bash
rm -rf node_modules
npm install
npm run dev
```

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8787`

All model requests are sent through `/api/chat` on the backend so the ASI One API key is never exposed to the frontend.
