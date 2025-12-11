import { AnalysisMode, AudienceLevel, AnalysisResult } from '../types';

// The URL of your deployed Cloud Run backend
// In development, this might be http://localhost:8080
// In production, set VITE_API_URL in your .env or build settings
const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8080';

export const analyzeImage = async (
  imageFiles: File[],
  mode: AnalysisMode,
  audience: AudienceLevel
): Promise<AnalysisResult> => {
  
  const formData = new FormData();
  
  // Append images
  imageFiles.forEach((file) => {
    formData.append('images', file);
  });

  // Append metadata
  formData.append('mode', mode);
  formData.append('audience', audience);

  try {
    const response = await fetch(`${API_URL}/analyze`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 429 || errorData.error === 'DEMO_QUOTA_EXCEEDED') {
        throw new Error('DEMO_QUOTA_EXCEEDED');
      }
      
      throw new Error(errorData.error || `Server Error: ${response.status}`);
    }

    const data = await response.json();
    return data as AnalysisResult;

  } catch (error) {
    console.error("API Call Failed:", error);
    throw error;
  }
};