import type { SectionId } from "./types";

// Site-wide settings. Reorder `sections` to reorder the page, set `enabled: false`
// to hide a section, and edit labels/eyebrows/headings freely. Section numbers are added automatically.
export const site = {
  url: "https://suyashpatil.vercel.app", // update after deploying / adding a domain
  title: "Suyash Patil | AI/ML Engineer & Software Developer",
  description:
    "Portfolio of Suyash Patil, an AI/ML engineering student at WCE Sangli who builds LLM systems, machine-learning products and full-stack apps.",
  keywords: ["Suyash Patil", "AI/ML Engineer", "Machine Learning", "RAG", "LLM", "Full-Stack Developer", "WCE Sangli"],

  sections: [
    { id: "about", label: "About", enabled: true, eyebrow: "About", heading: "Engineer by training, builder by instinct." },
    { id: "projects", label: "Work", enabled: true, eyebrow: "Selected work", heading: "Things I've built that actually run." },
    { id: "achievements", label: "Journey", enabled: true, eyebrow: "Journey", heading: "Hackathons, wins and real users." },
    { id: "skills", label: "Skills", enabled: true, eyebrow: "Toolkit", heading: "The stack I reach for, sharpened on CP." },
    { id: "contact", label: "Contact", enabled: true, eyebrow: "Contact", heading: "Let's build something that matters." },
  ] satisfies { id: SectionId; label: string; enabled: boolean; eyebrow: string; heading: string }[],

  hero: {
    // Short stats strip under the hero headline.
    stats: [
      { value: "4", label: "hackathon & ideathon milestones" },
      { value: "120+", label: "students use my app" },
      { value: "500+", label: "DSA problems solved" },
      { value: "1600", label: "LeetCode rating" },
    ],
    show3D: true,
  },

  footerNote: "Designed & built by Suyash Patil with Next.js, Three.js and too much chai.",
};

export type SiteSection = (typeof site.sections)[number];
