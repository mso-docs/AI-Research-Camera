# AI Research Camera 🔬

A research-grade image analysis tool powered by Google's **Gemini 3 Pro** model. This application allows users to upload images, select specific analysis modes and target audiences, and receive structured, expert insights ranging from simple explanations to academic research comparisons.

## Demo Link Coming Soon! Stay Tuned!

## ✨ Features

- **📸 Multimodal Analysis**: Upload a single image for deep analysis or **Compare** two images side-by-side to find differences and similarities.
- **🧠 Intelligent Modes**:
  - **Explain It**: Clear, direct answers about what is in the image.
  - **Research View**: Academic tone with technical specifications and detailed bullet points.
  - **Teach Me**: Educational format with "Key Takeaways" and a "Pop Quiz".
- **👥 Adaptive Audience**: Tailors the complexity of the response for:
  - 5-Year-Olds
  - High School Students
  - Undergraduates
  - Industry Experts
- **🌗 Dark Mode**: Fully responsive dark/light theme toggle.
- **💾 History & Auth**: Mock authentication system that saves analysis history to the browser's local storage.
- **🔒 Secure Architecture**: API keys are securely managed on a backend server, ensuring no credentials are exposed to the client.

---

## 🏗 Architecture

This project uses a **Split Architecture** to ensure security and scalability:

### 1. Frontend (Static Client)
- **Tech Stack**: React, Vite, Tailwind CSS, Lucide React.
- **Deployment**: Optimized for static hosting (e.g., **GitHub Pages**, Vercel, Netlify).
- **Security**: Contains **NO** API keys. It sends images to the backend via HTTP POST.

### 2. Backend (Serverless API)
- **Tech Stack**: Node.js, Express, Multer (file handling), @google/genai SDK.
- **Deployment**: Optimized for containerized serverless hosting (e.g., **Google Cloud Run**).
- **Security**: Stores the `API_KEY` in environment variables. Handles CORS to allow requests only from your frontend.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+)
- A Google Cloud Project with the Gemini API enabled.
- An API Key from [Google AI Studio](https://aistudio.google.com/).

### 1. Backend Setup
The backend must be running for the app to work.

```bash
cd backend

# Install dependencies
npm install

# Configure Environment
# Create a .env file based on the example
cp .env.example .env

# Open .env and paste your GEMINI_API_KEY
# API_KEY=AIzaSy...

# Run the server (Defaults to port 8080)
npm start
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run the development server
# By default, it connects to http://localhost:8080 defined in services/api.ts
npm run dev
```

---

## 📦 Deployment Guide

### Deploying Backend to Google Cloud Run

1.  **Containerize**: Build the Docker image using the provided `Dockerfile`.
    ```bash
    gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/ai-camera-backend
    ```
2.  **Deploy**:
    ```bash
    gcloud run deploy ai-camera-backend \
      --image gcr.io/YOUR_PROJECT_ID/ai-camera-backend \
      --platform managed \
      --region us-central1 \
      --allow-unauthenticated \
      --set-env-vars API_KEY=YOUR_ACTUAL_API_KEY
    ```
3.  **Copy URL**: Note the Service URL (e.g., `https://ai-camera-backend-xyz.a.run.app`).

### Deploying Frontend to GitHub Pages

1.  **Configure URL**:
    In your local environment or build pipeline, set the `VITE_API_URL` environment variable to your Cloud Run URL.
    
    *Or update `frontend/src/services/api.ts` directly if not using env vars during build.*

2.  **Update Base Path**:
    Open `frontend/vite.config.ts` and set the `base` property to your repository name:
    ```ts
    base: '/your-repo-name/',
    ```

3.  **Build & Deploy**:
    ```bash
    npm run build
    # Upload the contents of the /dist folder to your gh-pages branch
    ```

---

## 🛡️ Security

**This project has been audited and secured against API key exposure.**

### Key Security Features

- ✅ **No API keys in frontend code** - API keys stay securely on the backend
- ✅ **Environment file protection** - All `.env*` files excluded via `.gitignore`
- ✅ **Secure architecture** - Frontend calls backend, backend calls Gemini API
- ✅ **Build verification** - No secrets exposed in compiled JavaScript

### Important Security Documents

- 📋 [SECURITY.md](SECURITY.md) - Comprehensive security guide and best practices
- 🚀 [DEPLOYMENT.md](DEPLOYMENT.md) - Secure deployment instructions
- 📊 [SECURITY_AUDIT_SUMMARY.md](SECURITY_AUDIT_SUMMARY.md) - Latest security audit results

### Quick Security Checklist

- [ ] Use `backend/.env` for API keys (never commit this file)
- [ ] Use `frontend/` directory for production (not root `App.tsx`)
- [ ] Set `VITE_API_URL` environment variable in frontend deployments
- [ ] Configure CORS to allow only your frontend domain in production
- [ ] Verify no API keys in built files: `grep -r "AIza" frontend/dist/`

**For detailed security information, see [SECURITY.md](SECURITY.md)**

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
