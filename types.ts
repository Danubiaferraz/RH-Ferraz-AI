export enum AppTab {
  JOB_GENERATOR = 'JOB_GENERATOR',
  RESUME_ANALYST = 'RESUME_ANALYST',
  INTERVIEW_PREP = 'INTERVIEW_PREP',
  MARKET_ANALYST = 'MARKET_ANALYST',
}

export interface JobFormData {
  title: string;
  department: string;
  seniority: string;
  skills: string;
  tone: string;
}

// JSON Schema response types
export interface ResumeAnalysisResult {
  matchScore: number;
  strengths: string[];
  gaps: string[];
  summary: string;
}

export interface MarketAnalysisResult {
  salaryRange: string;
  currency: string;
  rareSkills: Array<{
    name: string;
    description: string;
  }>;
  marketOutlook: string;
}
