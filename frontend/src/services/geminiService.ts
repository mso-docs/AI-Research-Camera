import { AnalysisMode, AudienceLevel, AnalysisResult } from "../types";

// ⚠️ SECURITY WARNING: This file is DEPRECATED ⚠️
//
// This implementation exposed API keys in the frontend build, which is a critical security risk.
// API keys embedded in frontend JavaScript can be extracted by anyone using browser DevTools.
//
// ✅ SECURE ALTERNATIVE:
// Use the backend API implementation in backend/server.js
// Frontend should call the backend via frontend/src/services/api.ts
//
// This ensures API keys remain secure on the server and are never exposed to clients.

export const analyzeImage = async (
  _imageFiles: File[],
  _mode: AnalysisMode,
  _audience: AudienceLevel
): Promise<AnalysisResult> => {
  throw new Error(
    "DEPRECATED: Direct Gemini API calls from frontend are insecure. " +
    "Please use the backend API instead. " +
    "See frontend/src/services/api.ts for the secure implementation."
  );
};
