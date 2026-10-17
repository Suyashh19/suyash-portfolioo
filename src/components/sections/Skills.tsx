"use client";

import { motion } from "motion/react";
import { ArrowUpRight, Brain, Code2, Database, Layers } from "lucide-react";
import { codingProfiles, practiceAreas, problemsSolved, skillGroups, type SkillGroup } from "@/data";
import { BrandIcon, platformKey } from "../ui/BrandIcon";
import { CountUp } from "../ui/CountUp";
import { SectionHeading } from "../ui/SectionHeading";

const icons: Record<SkillGroup["icon"], typeof Brain> = { code: Code2, brain: Brain, layers: Layers, database: Database };
const ease = [0.22, 1, 0.36, 1] as const;
const MAX_RATING = 2000; // scale for the rating bars

function CompetitiveProgramming() {
  const rated = codingProfiles.filter((p) => p.rating);
  const unrated = codingProfiles.filter((p) => !p.rating);

  return (
    <div className="glass relative flex h-full flex-col overflow-hidden rounded-3xl p-6">
      <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-accent/15 blur-3xl" aria-hidden />
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-faint">Competitive programming</p>
      <p className="mt-2 flex items-baseline gap-3">
        <span className="font-display text-6xl font-bold tracking-tighter text-accent-text">
          <CountUp value={problemsSolved} duration={2} />
        </span>
        <span className="text-sm text-muted">problems solved</span>
      </p>

      <ul className="mt-5 space-y-4">
        {rated.map((p, i) => (
          <li key={p.platform}>
            <a href={p.href} target="_blank" rel="noopener noreferrer" className="group block">
              <span className="flex items-center gap-3">
                <BrandIcon name={platformKey(p.platform)} className="size-4 text-accent-text" />
                <span className="flex-1 font-medium">
                  {p.platform}
                  {p.badge && <span className="ml-1.5 font-mono text-xs text-accent-text">{p.badge}</span>}
                </span>
                <span className="font-display text-xl font-semibold">
                  <CountUp value={p.rating!} />
                </span>
                <ArrowUpRight className="size-3.5 text-faint transition group-hover:text-accent-text" aria-hidden />
              </span>
              <span className="mt-2 block h-1 overflow-hidden rounded-full bg-line" aria-hidden>
                <motion.span
                  className="block h-full rounded-full bg-accent"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(p.rating! / MAX_RATING) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.1 * i, ease }}
                />
              </span>
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
        {practiceAreas.map((a) => (
          <span key={a} className="rounded-full border border-line px-2.5 py-1 text-[11px] text-muted">
            {a}
          </span>
        ))}
        {unrated.map((p) => (
          <a
            key={p.platform}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-[11px] text-muted transition hover:border-accent hover:text-accent-text"
          >
            <BrandIcon name={platformKey(p.platform)} className="size-3" /> {p.platform}
          </a>
        ))}
      </div>
    </div>
  );
}

export function Skills({ index, eyebrow, heading }: { index: number; eyebrow: string; heading: string }) {
  return (
    <>
      <SectionHeading index={index} eyebrow={eyebrow} heading={heading}>
        <span className="inline-flex items-center gap-2 text-base">
          <span className="size-2 rounded-full bg-accent shadow-[0_0_10px_var(--glow)]" aria-hidden /> Highlighted = strongest
        </span>
      </SectionHeading>

      <div className="grid gap-4 lg:grid-cols-[1.55fr_1fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          {skillGroups.map((g, gi) => {
            const Icon = icons[g.icon];
            return (
              <motion.div
                key={g.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: (gi % 2) * 0.08, ease }}
                className="glass rounded-3xl p-5"
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="size-4 text-accent-text" aria-hidden />
                  <h3 className="font-display font-semibold">{g.title}</h3>
                </div>
                <motion.ul
                  className="mt-4 flex flex-wrap gap-1.5"
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  variants={{ show: { transition: { staggerChildren: 0.03, delayChildren: 0.1 } } }}
                >
                  {g.skills.map((s) => (
                    <motion.li
                      key={s.name}
                      variants={{ hidden: { opacity: 0, scale: 0.85 }, show: { opacity: 1, scale: 1 } }}
                      className={`rounded-lg px-2.5 py-1.5 text-[13px] ${
                        s.level === "core"
                          ? "border border-accent/50 bg-accent-soft font-medium text-fg"
                          : "border border-line text-muted"
                      }`}
                    >
                      {s.name}
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            );
          })}
        </div>
        <CompetitiveProgramming />
      </div>
    </>
  );
}
