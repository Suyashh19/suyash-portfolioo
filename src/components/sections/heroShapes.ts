// The forms the hero particle field morphs through, in order. Each one hints at a part of the story.
export const HERO_SHAPES = [
  { id: "portrait", label: "Suyash Patil" },
  { id: "orbit", label: "OrbitGuard · orbital ML" },
  { id: "neural", label: "Neural networks" },
  { id: "vectors", label: "Embeddings · RAG" },
] as const;

export type HeroShapeId = (typeof HERO_SHAPES)[number]["id"];

export const HERO_HOLD_MS = 4200; // time each shape stays before morphing to the next
