// Shared content types. Every section of the site renders from data shaped like this,
// so editing the files in src/data is all it takes to update the portfolio.

export type SocialKey =
  | "email"
  | "github"
  | "linkedin"
  | "leetcode"
  | "codeforces"
  | "codechef"
  | "kaggle";

export interface SocialLink {
  key: SocialKey;
  label: string;
  handle: string;
  href: string;
}

export interface Profile {
  name: string;
  shortName: string;
  initials: string;
  titles: string[]; // rotated in the hero
  tagline: string; // one-line headline under the name
  pitch: string[]; // paragraphs for the About section
  location: string;
  availability: string; // shown as the live status pill
  openTo: string[];
  email: string;
  resumeUrl: string | null; // put a PDF in /public and set e.g. "/resume.pdf"
  photos: {
    primary: { src: string; alt: string; position?: string };
    secondary?: { src: string; alt: string; position?: string };
  };
  quickFacts: { label: string; value: string }[];
}

export type ProjectVisual = "orbit" | "attendance" | "rag" | "recommender" | "neural" | "generic";

export interface ProjectLink {
  label: string;
  href: string;
  kind: "github" | "live" | "demo" | "paper" | "video";
}

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  context: string; // e.g. "Fusion Hackathon · Team project"
  summary: string;
  highlights: string[];
  stack: string[];
  metrics?: { value: string; label: string; note?: string }[];
  links: ProjectLink[];
  visual: ProjectVisual; // generative artwork used when no image is set
  image?: string; // optional screenshot in /public that replaces the artwork
  featured: boolean; // featured = big card; otherwise listed under "More builds"
  status?: string; // e.g. "In progress"
}

export interface Achievement {
  title: string;
  org: string;
  date?: string;
  kind: "win" | "finalist" | "semifinalist" | "experience" | "certification";
  description: string;
  link?: string;
}

export interface SkillGroup {
  title: string;
  icon: "code" | "brain" | "layers" | "database";
  skills: { name: string; level?: "core" | "working" }[];
}

export interface CodingProfile {
  platform: string;
  handle: string;
  href: string;
  rating?: number;
  ratingLabel?: string;
  badge?: string;
}

export interface Education {
  institution: string;
  degree: string;
  branch: string;
  start: string;
  end: string;
  location: string;
  details: string[];
}

// About also shows education; Skills also shows competitive-programming stats.
export type SectionId = "about" | "projects" | "achievements" | "skills" | "contact";
