export enum AnalysisMode {
  EXPLAIN = 'Explain It',
  RESEARCH = 'Research View',
  TEACH = 'Teach Me'
}

export enum AudienceLevel {
  CHILD = '5-Year-Old',
  STUDENT = 'High School Student',
  COLLEGE = 'Undergraduate',
  EXPERT = 'Industry Expert'
}

export enum InputMode {
  SINGLE = 'Single Image',
  COMPARE = 'Compare Two'
}

export interface AnalysisSection {
  title: string;
  content: string; // Markdown supported
}

export interface AnalysisResult {
  sections: AnalysisSection[];
}

export interface AnalysisState {
  isLoading: boolean;
  error: string | null;
  result: AnalysisResult | null;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface HistoryItem {
  id: string;
  userId: string;
  timestamp: number;
  mode: AnalysisMode;
  audience: AudienceLevel;
  result: AnalysisResult;
  thumbnailUrl: string; // Base64 or URL
  imageCount: number;
}
