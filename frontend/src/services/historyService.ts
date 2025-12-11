import { HistoryItem, AnalysisResult, AnalysisMode, AudienceLevel } from '../types';

const HISTORY_KEY = 'arc_history';

export const historyService = {
  getHistory(userId: string): HistoryItem[] {
    try {
      const allHistory = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
      return allHistory
        .filter((item: HistoryItem) => item.userId === userId)
        .sort((a: HistoryItem, b: HistoryItem) => b.timestamp - a.timestamp);
    } catch (e) {
      console.error("Failed to load history", e);
      return [];
    }
  },

  async saveItem(
    userId: string,
    result: AnalysisResult,
    mode: AnalysisMode,
    audience: AudienceLevel,
    images: File[]
  ): Promise<void> {
    try {
      // Create a thumbnail from the first image
      const thumbnail = await createThumbnail(images[0]);
      
      const newItem: HistoryItem = {
        id: crypto.randomUUID(),
        userId,
        timestamp: Date.now(),
        mode,
        audience,
        result,
        thumbnailUrl: thumbnail,
        imageCount: images.length
      };

      const allHistory = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
      
      // Limit history per user to prevent LocalStorage quota issues (keep last 10)
      const userHistory = allHistory.filter((h: HistoryItem) => h.userId === userId);
      const otherHistory = allHistory.filter((h: HistoryItem) => h.userId !== userId);
      
      const updatedUserHistory = [newItem, ...userHistory].slice(0, 10);
      
      localStorage.setItem(HISTORY_KEY, JSON.stringify([...updatedUserHistory, ...otherHistory]));
    } catch (e) {
      console.error("Failed to save history item. Storage might be full.", e);
      // Fail silently or handle error appropriately in UI
    }
  }
};

// Helper to create a small thumbnail to save space
const createThumbnail = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        // Max dimension 100px
        const scale = 100 / Math.max(img.width, img.height);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};
