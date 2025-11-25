export interface Viewpoint {
  title: string;
  description: string;
  sentiment: number; // 0-100
  speaker?: string;
}

export interface AnalysisResult {
  videoTitle: string;
  summary: string;
  viewpoints: Viewpoint[];
  conclusion: string;
  overallSentiment: number;
  topics: string[];
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
