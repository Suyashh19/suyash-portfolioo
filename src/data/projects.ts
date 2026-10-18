import type { Project } from "./types";

// Order matters: projects render in this order. Set featured: false to move one
// into the compact "More builds" list.
export const projects: Project[] = [
  {
    slug: "orbitguard-ai",
    title: "OrbitGuard AI",
    subtitle: "AI-powered satellite collision avoidance",
    category: "Machine Learning · Space",
    context: "Fusion Hackathon · Team project",
    summary:
      "A space-debris monitoring system that predicts satellite close approaches, ranks collision risk with machine learning, and recommends fuel-efficient avoidance manoeuvres, then checks them for safety.",
    highlights: [
      "Screens satellite orbits for potential close approaches up to seven days ahead.",
      "Ranks high-risk conjunction events with gradient-boosted models.",
      "Computes avoidance manoeuvres and re-propagates trajectories to catch new risks.",
      "Visualises orbits and predicted events on an interactive 3D globe.",
    ],
    stack: ["Python", "XGBoost", "LightGBM", "scikit-learn", "SGP4", "SciPy", "Three.js", "JavaScript"],
    metrics: [
      { value: "18,550", label: "objects screened", note: "7-day screening run" },
      { value: "0.96", label: "ROC-AUC", note: "XGBoost, held-out test set (project-reported)" },
      { value: "7 days", label: "look-ahead window" },
    ],
    links: [{ label: "GitHub", href: "https://github.com/shambhuz28/Fusion-hackathon", kind: "github" }],
    visual: "orbit",
    featured: true,
  },
  {
    slug: "attendance-system",
    title: "Attendance Management System",
    subtitle: "Real-time, proxy-resistant attendance",
    category: "Full-Stack · Mobile",
    context: "Freelance build for the AIML Department, WCE",
    summary:
      "A real-time attendance platform that stops proxy attendance using time-limited codes, device binding and server-side verification. It is used by the AIML department at WCE.",
    highlights: [
      "Time-limited attendance sessions with four-digit codes.",
      "Device-bound student accounts and duplicate-submission prevention.",
      "OTP-based registration and password recovery.",
      "Real-time updates via Socket.IO, push notifications, analytics and Excel reports.",
    ],
    stack: ["React Native", "Expo", "TypeScript", "Node.js", "Express", "Socket.IO", "PostgreSQL", "NeonDB", "Prisma"],
    metrics: [
      { value: "120+", label: "students using it" },
      { value: "10+", label: "faculty members" },
      { value: "Real-time", label: "Socket.IO sync" },
    ],
    links: [
      {
        label: "Download app",
        href: "https://expo.dev/accounts/sp177/projects/attendance-system/builds/50b4e877-96e2-47f7-beff-a7d9c341a798",
        kind: "demo",
      },
      { label: "Backend", href: "https://github.com/Suyashh19/Attendance-System-Backend", kind: "github" },
      { label: "Mobile app", href: "https://github.com/Suyashh19/Attendance-System-App", kind: "github" },
      { label: "Web dashboard", href: "https://attendence-system-web.vercel.app", kind: "live" },
    ],
    visual: "attendance",
    featured: true,
  },
  {
    slug: "enterprise-rag",
    title: "Enterprise-Grade RAG",
    subtitle: "Agentic document question answering",
    category: "LLMs · AI Engineering",
    context: "AI engineering · Personal project",
    summary:
      "An enterprise-oriented retrieval-augmented generation system. It ingests documents, retrieves and reranks the most relevant context, and generates grounded answers behind guardrails, with built-in evaluation.",
    highlights: [
      "Multi-format ingestion (PDF, DOCX, PPTX, HTML) with chunking.",
      "Embedding-based semantic retrieval on a Qdrant vector database.",
      "FlashRank cross-encoder reranking to improve relevance.",
      "LangGraph agent flow with NeMo Guardrails and a Portkey LLM gateway.",
      "Evaluation harness with RAGAS and DeepEval on a golden dataset.",
    ],
    stack: ["Python", "LangChain", "LangGraph", "Qdrant", "Hugging Face", "FastAPI", "FlashRank", "RAGAS", "Streamlit"],
    metrics: [
      { value: "Rerank", label: "cross-encoder stage" },
      { value: "Guarded", label: "input/output rails" },
      { value: "Evals", label: "RAGAS + DeepEval" },
    ],
    links: [
      { label: "GitHub", href: "https://github.com/Suyashh19/Enterprise_grade_rag", kind: "github" },
      { label: "Live demo", href: "https://enterprisegraderag-11.streamlit.app/", kind: "live" },
    ],
    visual: "rag",
    featured: true,
  },
  {
    slug: "movie-recommender",
    title: "CinemaScout Movie Recommender",
    subtitle: "Content-based movie recommender",
    category: "Machine Learning · Web App",
    context: "Personal project",
    summary:
      "A movie discovery app that recommends five similar films to the one you pick. It compares genres, keywords, cast, crew and plot, and shows live posters from the TMDB API.",
    highlights: [
      "Searchable picker across the TMDB 5000 movie dataset.",
      "Bag-of-words features with CountVectorizer and cosine similarity.",
      "Top-5 recommendations with posters fetched live from TMDB.",
      "Deployed as an interactive Streamlit web app.",
    ],
    stack: ["Python", "scikit-learn", "Pandas", "NumPy", "Streamlit", "TMDB API"],
    metrics: [
      { value: "~5,000", label: "movies in catalogue" },
      { value: "Top 5", label: "recommendations per pick" },
    ],
    links: [
      { label: "GitHub", href: "https://github.com/Suyashh19/Movie-Recommender-App", kind: "github" },
      {
        label: "Live demo",
        href: "https://movie-recommender-app-hk9zssrecgokfqokvtyv3b4hp.streamlit.app/",
        kind: "live",
      },
    ],
    visual: "recommender",
    featured: true,
  },
  {
    slug: "transformer-from-scratch",
    title: "Attention Is All You Need, From Scratch",
    subtitle: "The Transformer, built piece by piece",
    category: "Deep Learning",
    context: "Learning project",
    summary:
      "A step-by-step PyTorch implementation of the Transformer paper. It covers attention, multi-head attention, positional encoding, the encoder and the decoder, built by hand without torch.nn.Transformer.",
    highlights: [],
    stack: ["Python", "PyTorch"],
    links: [
      { label: "GitHub", href: "https://github.com/Suyashh19/attention-is-all-you-need-from-scratch", kind: "github" },
    ],
    visual: "neural",
    featured: false,
  },
  {
    slug: "expense-tracker",
    title: "AI Expense Tracker",
    subtitle: "Expense tracking with AI insights",
    category: "Full-Stack · AI",
    context: "Personal project",
    summary:
      "A web app for tracking personal expenses. You can log spending in plain language, have it categorised automatically, and get AI-written summaries of your spending trends.",
    highlights: [],
    stack: ["React", "Vite", "Tailwind CSS", "Firebase", "Groq", "Recharts"],
    // The live app comes first: "More builds" links to a project's first link.
    links: [
      { label: "Live app", href: "https://expense-tracker-1869c.web.app/", kind: "live" },
      { label: "GitHub", href: "https://github.com/Suyashh19/EXPENCE-TRACKER", kind: "github" },
    ],
    visual: "generic",
    featured: false,
  },
  {
    slug: "cognilend",
    title: "Cognilend",
    subtitle: "Explainable, fair loan decisioning",
    category: "ML · Responsible AI",
    context: "Third-year mini project · Team",
    summary:
      "A hybrid system that combines policy rules with machine learning for loan decisions. It produces human-readable reasons, keeps an audit trail and checks fairness across groups.",
    highlights: [],
    stack: ["Python", "XGBoost", "MySQL", "Flask", "Streamlit"],
    links: [{ label: "GitHub", href: "https://github.com/Suyashh19/Cognilend", kind: "github" }],
    visual: "generic",
    featured: false,
    status: "In progress",
  },
];
