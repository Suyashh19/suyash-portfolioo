"use client";

import { motion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

// Heading words rise out of a mask one after another as the section enters the viewport.
export function SectionHeading({
  index,
  eyebrow,
  heading,
  children,
}: {
  index: number;
  eyebrow: string;
  heading: string;
  children?: React.ReactNode;
}) {
  return (
    <motion.div
      className="mb-8 max-w-3xl md:mb-12"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={{ show: { transition: { staggerChildren: 0.05 } } }}
    >
      <motion.p
        variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0, transition: { duration: 0.5, ease } } }}
        className="mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-accent-text"
      >
        <span>{String(index).padStart(2, "0")}</span>
        <motion.span
          variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.6, ease } } }}
          className="h-px w-10 origin-left bg-accent/60"
          aria-hidden
        />
        <span>{eyebrow}</span>
      </motion.p>
      <h2
        className="font-display text-3xl font-semibold leading-[1.08] tracking-tight text-balance sm:text-4xl md:text-5xl"
        aria-label={heading}
      >
        {heading.split(" ").map((word, i) => (
          <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom" aria-hidden>
            <motion.span
              className="inline-block"
              variants={{ hidden: { y: "110%" }, show: { y: 0, transition: { duration: 0.8, ease } } }}
            >
              {word}
              {" "}
            </motion.span>
          </span>
        ))}
      </h2>
      {children && (
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } }}
          className="mt-4 text-muted md:text-lg"
        >
          {children}
        </motion.div>
      )}
    </motion.div>
  );
}
