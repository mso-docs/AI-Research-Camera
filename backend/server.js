require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { GoogleGenAI, Type } = require("@google/genai");

const app = express();
const port = process.env.PORT || 8080;

// --- CONFIGURATION ---

// 1. CORS Configuration
// In production, strictly allow only your GitHub Pages domain:
// const allowedOrigins = ['https://<YOUR-USERNAME>.github.io'];
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    // For development, allow localhost. For prod, uncomment strict check above.
    return callback(null, true); 
  }
};
app.use(cors(corsOptions));

// 2. File Upload Configuration (Multer)
// We use memoryStorage so we can access the file buffer directly without saving to disk.
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit matching frontend
});

// 3. Gemini Configuration
// SECURITY: The API key is read from the environment. Never hardcoded.
// Fixed to use process.env.API_KEY as per guidelines
if (!process.env.API_KEY) {
  console.error("CRITICAL: API_KEY is not set in environment variables.");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MODEL_NAME = "gemini-3-pro-preview"; // Or "gemini-1.5-pro" based on availability

// Schema for structured JSON output
const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    sections: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING },
        },
        required: ["title", "content"],
      },
    },
  },
  required: ["sections"],
};

// --- ROUTES ---

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

/**
 * POST /analyze
 * Expects multipart/form-data with:
 * - images: One or more image files
 * - mode: string
 * - audience: string
 */
app.post('/analyze', upload.array('images', 2), async (req, res) => {
  try {
    const files = req.files;
    const { mode, audience } = req.body;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No images uploaded.' });
    }

    // Convert Buffers to Gemini "Part" format
    const imageParts = files.map(file => ({
      inlineData: {
        data: file.buffer.toString('base64'),
        mimeType: file.mimetype
      }
    }));

    const isComparison = files.length > 1;

    // Construct the Prompt
    const prompt = `
      You are an advanced AI research assistant powered by Gemini 3 Pro.
      
      TASK: ${isComparison ? 'Compare and contrast the two provided images.' : 'Analyze the provided image.'}
      MODE: ${mode}
      AUDIENCE LEVEL: ${audience}

      INSTRUCTIONS:
      1. Identify the main subject(s) in the visual data with high precision.
      ${isComparison ? `
      2. Since two images are provided, your PRIMARY goal is comparison.
         - Identify similarities in structure, function, or context.
         - Identify differences, anomalies, or progression.
         - Reference "Image 1" and "Image 2" explicitly.
      ` : `
      2. Provide a structured response tailored EXACTLY to the selected Mode and Audience.
      `}
      
      MODE SPECIFICS:
      - 'Explain It': Focus on clear, direct explanations. What/How/Why?
      - 'Research View': Academic tone. Scientific names, technical specs, detailed bullets.
      - 'Teach Me': Educator tone. Include a "Key Takeaway" and a "Pop Quiz".

      OUTPUT FORMAT:
      Return JSON with a 'sections' array containing 'title' and 'content' (Markdown allowed).
    `;

    // Call Gemini API
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [...imageParts, { text: prompt }],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.4,
      },
    });

    // Send result back to Frontend
    const resultText = response.text;
    const resultJson = JSON.parse(resultText);
    
    res.json(resultJson);

  } catch (error) {
    console.error("Analysis Error:", error);
    
    if (error.toString().includes("429")) {
      return res.status(429).json({ error: "DEMO_QUOTA_EXCEEDED" });
    }

    res.status(500).json({ 
      error: "Analysis failed", 
      details: error.message 
    });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
  console.log(`Model: ${MODEL_NAME}`);
});