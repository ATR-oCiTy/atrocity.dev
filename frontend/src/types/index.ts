export interface Experience {
  _id: string;
  company: string;
  role: string;
  duration: string;
  description: string[];
}

export interface Education {
  _id: string;
  institution: string;
  degree: string;
  duration: string;
  details: string;
}

export interface Profile {
  name: string;
  alias: string;
  tagline: string;
  bioLines: string[];
  location: string;
  email: string;
  linkedinUrl: string;
}

export interface SkillCategory {
  _id: string;
  title: string;
  skills: string[];
}

export interface Client {
  _id: string;
  name: string;
  logoUrl: string;
  domain: string;
}
