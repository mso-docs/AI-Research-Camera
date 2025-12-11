# Deployment Guide

This guide covers deploying your AI Research Camera application securely.

## Prerequisites

- [ ] Gemini API key from https://aistudio.google.com/app/apikey
- [ ] Git repository
- [ ] Node.js 20+ installed locally

## Quick Start (Local Development)

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env and add your API key
# API_KEY=your_actual_gemini_api_key_here

# Start backend server
npm run dev
```

Backend will run on `http://localhost:8080`

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file (optional for development)
cp .env.example .env.local

# VITE_API_URL defaults to http://localhost:8080

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

### 3. Test the Application

1. Open http://localhost:3000
2. Upload an image
3. Select analysis mode and audience
4. Click "Analyze"
5. Verify results appear

## Production Deployment

### Option 1: Deploy to Google Cloud Run (Recommended)

#### Backend Deployment

```bash
cd backend

# Build and deploy
gcloud run deploy ai-research-camera-backend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars API_KEY=your_gemini_api_key_here

# Note the backend URL from output
# Example: https://ai-research-camera-backend-xxx.run.app
```

#### Frontend Deployment (to Netlify)

```bash
cd frontend

# Install Netlify CLI
npm install -g netlify-cli

# Build with production backend URL
VITE_API_URL=https://your-backend-url.run.app npm run build

# Deploy
netlify deploy --prod --dir=dist
```

### Option 2: Deploy to Heroku

#### Backend

```bash
cd backend

# Create Heroku app
heroku create your-app-name-backend

# Set environment variables
heroku config:set API_KEY=your_gemini_api_key_here

# Deploy
git subtree push --prefix backend heroku main

# Note your backend URL
# Example: https://your-app-name-backend.herokuapp.com
```

#### Frontend (to Vercel)

```bash
cd frontend

# Install Vercel CLI
npm install -g vercel

# Set environment variable
vercel env add VITE_API_URL production
# Enter: https://your-app-name-backend.herokuapp.com

# Deploy
vercel --prod
```

### Option 3: Deploy to Railway

#### Backend

1. Go to https://railway.app
2. Create new project from GitHub repo
3. Select `backend` directory as root
4. Add environment variable:
   - `API_KEY`: your_gemini_api_key_here
5. Deploy

#### Frontend

1. Create another Railway project
2. Select `frontend` directory as root
3. Add build command: `npm run build`
4. Add start command: `npx serve -s dist -p $PORT`
5. Add environment variable:
   - `VITE_API_URL`: your_backend_railway_url
6. Deploy

## Environment Variables Reference

### Backend Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `API_KEY` | Yes | Gemini API key | `AIza...` |
| `PORT` | No | Server port | `8080` (default) |
| `NODE_ENV` | No | Environment | `production` |

### Frontend Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_API_URL` | No | Backend API URL | `http://localhost:8080` (default) |

## CORS Configuration

For production, update `backend/server.js` to restrict CORS:

```javascript
const allowedOrigins = [
  'https://your-frontend-domain.com',
  'https://your-frontend-domain.netlify.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));
```

## Custom Domain Setup

### Backend (Cloud Run)

```bash
gcloud run domain-mappings create \
  --service ai-research-camera-backend \
  --domain api.yourdomain.com \
  --region us-central1
```

### Frontend (Netlify)

1. Go to Netlify dashboard
2. Site settings > Domain management
3. Add custom domain
4. Update DNS records as instructed

## Monitoring & Logging

### Backend Logs (Cloud Run)

```bash
gcloud run logs read ai-research-camera-backend --limit 50
```

### Backend Logs (Heroku)

```bash
heroku logs --tail -a your-app-name-backend
```

## Scaling

### Cloud Run

Automatically scales based on traffic. Configure limits:

```bash
gcloud run services update ai-research-camera-backend \
  --max-instances 10 \
  --min-instances 0 \
  --concurrency 80
```

### Cost Optimization

- Set `--min-instances 0` to scale to zero when idle
- Use caching headers for static assets
- Implement rate limiting on backend

## Security Checklist

Before going live:

- [ ] API keys stored in environment variables only
- [ ] CORS configured to allow only your frontend domain
- [ ] `.env` files are in `.gitignore`
- [ ] No API keys in git history
- [ ] Source maps disabled in production (`sourcemap: false`)
- [ ] HTTPS enabled for both frontend and backend
- [ ] Rate limiting implemented (optional but recommended)

## Troubleshooting

### Frontend can't reach backend

1. Check `VITE_API_URL` is set correctly
2. Verify backend is running: `curl https://your-backend-url/health`
3. Check CORS configuration allows your frontend domain
4. Check browser console for errors

### API Key errors

1. Verify `API_KEY` environment variable is set in backend
2. Check API key is valid at https://aistudio.google.com/app/apikey
3. Ensure no extra spaces in environment variable
4. Check API quota hasn't been exceeded

### Build failures

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Production Architecture

```
Internet
   │
   ├─> Frontend (Static Hosting: Netlify/Vercel)
   │   └─> Serves: HTML, CSS, JS (No API keys)
   │
   └─> Backend (Cloud Run/Heroku)
       ├─> Environment: API_KEY=***
       ├─> CORS: Restricts to frontend domain
       └─> Gemini API: Secure API calls
```

## Support

- Documentation: See [SECURITY.md](SECURITY.md)
- Issues: Create a GitHub issue
- API Docs: https://ai.google.dev/gemini-api/docs
