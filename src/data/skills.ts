import type { CodingProfile, Education, SkillGroup } from "./types";

// level "core" = strongest skills; they get highlighted on the site.
export const skillGroups: SkillGroup[] = [
  {
    title: "Languages",
    icon: "code",
    skills: [
      { name: "Python", level: "core" },
      { name: "C++", level: "core" },
      { name: "TypeScript", level: "core" },
      { name: "JavaScript" },
      { name: "SQL" },
    ],
  },
  {
    title: "AI / Machine Learning",
    icon: "brain",
    skills: [
      { name: "Machine Learning & model evaluation", level: "core" },
      { name: "Retrieval-Augmented Generation", level: "core" },
      { name: "Large Language Models", level: "core" },
      { name: "Embeddings & semantic search" },
      { name: "LangChain" },
      { name: "Hugging Face" },
      { name: "PyTorch" },
      { name: "scikit-learn" },
      { name: "XGBoost / LightGBM" },
    ],
  },
  {
    title: "Full-Stack Development",
    icon: "layers",
    skills: [
      { name: "React", level: "core" },
      { name: "Next.js", level: "core" },
      { name: "Node.js & Express", level: "core" },
      { name: "React Native & Expo" },
      { name: "REST APIs" },
      { name: "Socket.IO" },
      { name: "Tailwind CSS" },
    ],
  },
  {
    title: "Data & Infrastructure",
    icon: "database",
    skills: [
      { name: "PostgreSQL", level: "core" },
      { name: "Prisma ORM" },
      { name: "NeonDB" },
      { name: "Qdrant vector DB" },
      { name: "Git & GitHub", level: "core" },
      { name: "Vercel" },
      { name: "Render" },
    ],
  },
];

export const problemsSolved = "500+";

export const codingProfiles: CodingProfile[] = [
  { platform: "LeetCode", handle: "Suyashh119", href: "https://leetcode.com/u/Suyashh119/", rating: 1600, ratingLabel: "Contest rating" },
  { platform: "CodeChef", handle: "og_suyash", href: "https://www.codechef.com/users/og_suyash", rating: 1421, ratingLabel: "Rating", badge: "2★" },
  { platform: "Codeforces", handle: "Suyash_patil_11", href: "https://codeforces.com/profile/Suyash_patil_11", rating: 1070, ratingLabel: "Rating" },
  { platform: "Kaggle", handle: "suyash7574", href: "https://www.kaggle.com/suyash7574" },
];

export const practiceAreas = ["Data Structures & Algorithms", "C++", "Problem solving", "Competitive programming"];

export const education: Education[] = [
  {
    institution: "Walchand College of Engineering, Sangli",
    degree: "Bachelor of Technology (B.Tech)",
    branch: "Artificial Intelligence & Machine Learning",
    start: "2024",
    end: "2028",
    location: "Sangli, Maharashtra",
    details: [
      "Third year, expected graduation 2028",
      "Department ideathon winner",
      "Built the AIML department's attendance app",
    ],
  },
];
