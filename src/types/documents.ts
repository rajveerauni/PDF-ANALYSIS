export type DocumentStatus = 'uploading' | 'parsing' | 'analyzing' | 'done' | 'error';
export type FileType = 'pdf' | 'docx' | 'txt';

export interface Document {
  id: string;
  user_id: string;
  name: string;
  file_type: FileType;
  file_size: number;
  storage_path: string;
  status: DocumentStatus;
  page_count: number | null;
  char_count: number | null;
  created_at: string;
  updated_at: string;
}

export interface DocumentWithInsights extends Document {
  insights?: {
    id: string;
    executive_summary: string | null;
    key_insights: string[] | null;
    risks: string[] | null;
    opportunities: string[] | null;
    key_metrics: { label: string; value: string }[] | null;
    recommendations: string[] | null;
    confidence_score: number | null;
  } | null;
}
