# Security Guide

## Overview

This application uses a **secure backend architecture** to protect API keys and prevent exposure in the frontend build.

## Architecture

```
┌─────────────────┐      HTTP Request       ┌──────────────────┐      Gemini API      ┌─────────────┐
│                 │ ───────────────────────> │                  │ ──────────────────> │             │
│  Frontend (JS)  │                          │  Backend (Node)  │                      │  Gemini API │
│  No API Keys    │ <─────────────────────── │  API Key Secure  │ <────────────────── │             │
└─────────────────┘      JSON Response       └──────────────────┘      AI Response     └─────────────┘
```

## Security Best Practices

### ✅ DO

1. **Keep API keys in backend only**
   - Store in environment variables (`.env` files)
   - Never commit `.env` files to version control
   - Use `.env.example` files as templates

2. **Use the secure frontend implementation**
   - Location: `frontend/src/services/api.ts`
   - Makes HTTP requests to backend
   - No API keys in frontend code

3. **Protect environment files**
   - All `.env*` files are in `.gitignore`
   - Use `.env.example` as templates
   - Rotate API keys if accidentally exposed

4. **Secure deployment**
   - Backend: Use platform environment variables (Cloud Run, Heroku, etc.)
   - Frontend: Only set `VITE_API_URL` to point to backend
   - Never set API keys in frontend environment variables

### ❌ DON'T

1. **Never use the deprecated `services/geminiService.ts`**
   - This file is kept for reference only
   - It would expose API keys in the build
   - Will throw an error if called

2. **Never commit API keys**
   - Check `.gitignore` includes all `.env*` files
   - Use `git log` to verify no keys were committed
   - If keys were committed, rotate them immediately

3. **Never expose API keys in build config**
   - Don't use `define` in `vite.config.ts` for secrets
   - Don't use `VITE_` prefix for API keys
   - Frontend should only know backend URL

## File Structure

### Secure Files (Backend)
```
backend/
├── .env              # Contains API_KEY (NEVER commit)
├── .env.example      # Template (safe to commit)
└── server.js         # Backend with API key access
```

### Frontend Files
```
frontend/
├── .env.local        # Contains VITE_API_URL only
├── .env.example      # Template
└── src/services/api.ts  # Calls backend API
```

### Deprecated Files (Don't Use)
```
services/geminiService.ts  # DEPRECATED - Would expose keys
App.tsx (root)             # Uses deprecated service
```

## Environment Variables

### Backend (.env)
```bash
API_KEY=your_actual_gemini_api_key_here
PORT=8080
NODE_ENV=production
```

### Frontend (.env.local)
```bash
VITE_API_URL=https://your-backend-url.com
```

## Deployment Checklist

### Before Deployment

- [ ] Verify `.gitignore` includes all `.env*` files
- [ ] Confirm no API keys in git history
- [ ] Test that frontend uses `frontend/src/services/api.ts`
- [ ] Ensure backend validates `API_KEY` on startup

### Backend Deployment (e.g., Cloud Run)

1. Deploy backend with environment variable:
   ```bash
   gcloud run deploy --set-env-vars API_KEY=your_key_here
   ```

2. Note the backend URL (e.g., `https://backend-xxx.run.app`)

### Frontend Deployment (e.g., Netlify, Vercel)

1. Set environment variable:
   ```
   VITE_API_URL=https://your-backend-url.com
   ```

2. Build and deploy:
   ```bash
   cd frontend
   npm run build
   # Deploy the dist/ folder
   ```

### After Deployment

- [ ] Verify API key is NOT visible in browser DevTools
- [ ] Test that API calls work through backend
- [ ] Check backend logs for unauthorized access
- [ ] Set up CORS to only allow your frontend domain

## Verifying Security

### Check Built Frontend

After building, verify no API keys are exposed:

```bash
cd frontend
npm run build
grep -r "AIza" dist/  # Search for Google API key pattern
grep -r "API_KEY" dist/
```

**Expected result:** No matches found

### Check Network Requests

1. Open browser DevTools (F12)
2. Go to Network tab
3. Trigger an analysis
4. Verify:
   - Request goes to your backend URL
   - No `Authorization` headers visible
   - Response doesn't contain API keys

## Incident Response

### If API Key is Exposed

1. **Immediately rotate the key**
   - Go to https://aistudio.google.com/app/apikey
   - Delete the compromised key
   - Generate a new key

2. **Update environment variables**
   - Backend: Update `API_KEY` in production
   - Redeploy backend with new key

3. **Review git history**
   ```bash
   git log --all --full-history --source -- .env
   ```

4. **If committed to git**
   - Use `git-filter-repo` or BFG Repo-Cleaner
   - Force push cleaned history
   - Rotate all exposed keys

## Questions?

- Check: [frontend/src/services/api.ts](frontend/src/services/api.ts) for secure implementation
- Backend: [backend/server.js](backend/server.js) for API handling
- Issues: Create a GitHub issue for security concerns
