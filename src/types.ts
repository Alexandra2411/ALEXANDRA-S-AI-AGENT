export interface CvExperience {
  title: string;
  subtitle: string;
  period: string;
  location: string;
  details: string[];
}

export interface CvEducation {
  title: string;
  subtitle: string;
  period: string;
  location: string;
}

export interface CvSkillGroup {
  category: string;
  skills: string[];
}

export interface CvData {
  name: string;
  title: string;
  contact: {
    phone: string;
    email: string;
    location: string;
  };
  education: CvEducation[];
  experiences: CvExperience[];
  skills: string[];
  languages: { name: string; level: string }[];
  extra: { category: string; description: string; period?: string }[];
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export type AgentState = "uninitialized" | "idle" | "listening" | "thinking" | "speaking";
