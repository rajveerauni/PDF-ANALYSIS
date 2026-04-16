export interface KeyMetric {
  label: string;
  value: string;
}

export interface DocumentInsights {
  executiveSummary: string;
  keyInsights: string[];
  risks: string[];
  opportunities: string[];
  keyMetrics: KeyMetric[];
  recommendations: string[];
  confidenceScore: number;
}

export interface AnalyzeResponse {
  insights: DocumentInsights;
}

export interface QaResponse {
  answer: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
