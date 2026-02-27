# Vantage Enterprise

Strategic intelligence workspace with a React frontend and secure Node.js backend proxy for ASI One.

---

## Environment Setup

1. Copy `.env.example` to `.env`
2. Set your ASI One API key:

```env
ASI_ONE_API_KEY=PASTE_YOUR_ASI_ONE_API_KEY_HERE
TELEMETRY_KEY=disable_if_not_used
```

### Telemetry

Telemetry is optional.

- If `TELEMETRY_KEY` is not set  
- Or left as `disable_if_not_used`  

Telemetry will be automatically disabled without errors.

---

## Run Locally

```bash
rm -rf node_modules
npm install
npm run dev
```

### Local URLs

- Frontend → http://localhost:3000  
- Backend API → http://localhost:8787  

All model requests are routed through:

```
/api/chat
```

This ensures the **ASI One API key is never exposed to the frontend**.

---

## API Routes

### POST `/api/chat`

Handles all ASI One model requests securely through the backend proxy.

### GET `/api/health`

Health check endpoint for deployment monitoring.

---

## Vercel Deployment

If deploying to Vercel:

1. Go to **Project Settings → Environment Variables**
2. Add:

```
ASI_ONE_API_KEY=your_real_key
TELEMETRY_KEY=optional_key_or_leave_blank
```

The deployed app will use serverless routes:

- `/api/chat`
- `/api/health`

---

## Security Notes

- `.env` is included in `.gitignore`
- API keys are never exposed to frontend
- All external model calls go through backend proxy
- Telemetry safely disables if not configured

---

## Architecture Overview

Frontend (React)  
⬇  
Backend Proxy (Node.js)  
⬇  
Fetch.ai ASI One API  

---

## Production Checklist

- [ ] `.env` configured
- [ ] No hardcoded API keys
- [ ] `.env` added to `.gitignore`
- [ ] Build runs without telemetry error
- [ ] `/api/health` returns OK

---

Vantage Enterprise – Secure Strategic Intelligence Workspace