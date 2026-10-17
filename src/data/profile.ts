import type { Profile, SocialLink } from "./types";

export const profile: Profile = {
  name: "Suyash Patil",
  shortName: "Suyash",
  initials: "SP",
  titles: ["AI/ML Engineer", "Software Developer", "Full-Stack Builder", "Future Founder"],
  tagline: "I build intelligent, scalable software that solves real-world problems.",
  pitch: [
    "I'm a third-year B.Tech Artificial Intelligence & Machine Learning student at Walchand College of Engineering, Sangli. I build intelligent, scalable software for real-world problems, with a focus on AI/ML, full-stack development and AI-powered applications.",
    "I want to become an AI engineer and, later, a tech founder. I'm focused on building useful products, working with advanced AI technologies, and gaining real-world experience through challenging projects and internships.",
  ],
  location: "Kolhapur, Maharashtra, India",
  availability: "Open to AI/ML internships",
  openTo: [
    "Remote AI/ML internships",
    "Collaborative AI/ML projects",
    "Hackathons & product builds",
    "Relocation for the right role",
  ],
  email: "suyashpatil7574@gmail.com",
  resumeUrl: null,
  photos: {
    // Large About photo
    primary: {
      src: "/images/suyash-standing.jpg",
      alt: "Suyash Patil standing by a railing in a navy polo",
      position: "50% 28%",
    },
    // Small photo in the top corner of the About photo
    secondary: {
      src: "/images/suyash-glasses.jpg",
      alt: "Suyash Patil smiling, wearing glasses",
      position: "50% 30%",
    },
  },
  quickFacts: [
    { label: "Based in", value: "Kolhapur, IN" },
    { label: "Year", value: "3rd year · B.Tech" },
    { label: "Focus", value: "LLMs · RAG · Full-stack" },
  ],
};

export const socials: SocialLink[] = [
  { key: "email", label: "Email", handle: "suyashpatil7574@gmail.com", href: "mailto:suyashpatil7574@gmail.com" },
  { key: "github", label: "GitHub", handle: "Suyashh19", href: "https://github.com/Suyashh19" },
  { key: "linkedin", label: "LinkedIn", handle: "suyash-sandip-patil", href: "https://www.linkedin.com/in/suyash-sandip-patil/" },
  { key: "leetcode", label: "LeetCode", handle: "Suyashh119", href: "https://leetcode.com/u/Suyashh119/" },
  { key: "codeforces", label: "Codeforces", handle: "Suyash_patil_11", href: "https://codeforces.com/profile/Suyash_patil_11" },
  { key: "codechef", label: "CodeChef", handle: "og_suyash", href: "https://www.codechef.com/users/og_suyash" },
  { key: "kaggle", label: "Kaggle", handle: "suyash7574", href: "https://www.kaggle.com/suyash7574" },
];
