export type Stage =
  | "Applied"
  | "Screening"
  | "Interview Scheduled"
  | "Under Review"
  | "Hired / Rejected"
  | "Hired"
  | "Rejected";


export interface Candidate {
  id: string;
  name: string;
  role: string;
  score: number;
  experience: number;
  stage: Stage;
  skills: string[];
  bio: string;
  location?: string;
  email?: string;
  phone?: string;
  resumeUrl?: string;
  currentCompany?: string;
}

export interface Filters {
  role: string | null;
  minScore: number;
  maxScore: number;
  nameQuery: string;
}
