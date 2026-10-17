"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { projects, type Project } from "@/data";
import { SELECT_PROJECT_EVENT } from "@/lib/events";
import { BrandIcon } from "../ui/BrandIcon";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";
import { ProjectVisual } from "./ProjectVisual";

// The live 3D orbit scene for OrbitGuard AI; the SVG artwork shows while Three.js loads.
const OrbitScene = dynamic(() => import("./OrbitScene"), {
  ssr: false,
  loading: () => (
    <div className="size-full p-6 pt-10">
      <ProjectVisual visual="orbit" />
    </div>
  ),
});

function LiveOrbit() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const reduced = useReducedMotion() ?? false;
  return (
    <div ref={ref} className="absolute inset-0">
      <OrbitScene reducedMotion={reduced} active={inView} />
    </div>
  );
}

const ease = [0.22, 1, 0.36, 1] as const;

function LinkButtons({ links }: { links: Project["links"] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {links.map((l) => (
        <a
          key={l.href}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition ${
            l.kind === "live" || l.kind === "demo"
              ? "bg-accent text-accent-ink hover:shadow-[0_0_24px_var(--glow)]"
              : "border border-line-strong hover:border-accent hover:text-accent-text"
          }`}
        >
          {l.kind === "github" && <BrandIcon name="github" className="size-3.5" />}
          {l.label}
          <ArrowUpRight className="size-3.5" />
        </a>
      ))}
    </div>
  );
}

function ProjectPanel({
  project,
  index,
  total,
  onStep,
}: {
  project: Project;
  index: number;
  total: number;
  onStep: (d: number) => void;
}) {
  return (
    <motion.article
      key={project.slug}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease }}
      className="grid md:grid-cols-[0.9fr_1.1fr]"
    >
      <div className="relative min-h-52 overflow-hidden border-b border-line bg-bg-elev/60 md:min-h-full md:border-b-0 md:border-r">
        <div className="backdrop-grid absolute inset-0 opacity-60" aria-hidden />
        <p className="absolute left-4 top-4 z-10 font-mono text-[11px] uppercase tracking-[0.2em] text-faint">
          {project.category}
        </p>
        {project.image ? (
          <Image
            src={project.image}
            alt={`${project.title} screenshot`}
            fill
            className="object-cover"
            sizes="(min-width:768px) 30vw, 100vw"
          />
        ) : project.visual === "orbit" ? (
          <LiveOrbit />
        ) : (
          <div className="absolute inset-0 p-6 pt-10">
            <ProjectVisual visual={project.visual} />
          </div>
        )}
      </div>

      <div className="flex flex-col p-5 sm:p-7">
        <p className="font-mono text-xs text-muted">{project.context}</p>
        <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">{project.title}</h3>
        <p className="text-accent-text">{project.subtitle}</p>
        <p className="mt-4 text-sm leading-relaxed text-muted text-pretty sm:text-base">{project.summary}</p>

        {project.metrics && (
          <ul className="mt-5 grid grid-cols-3 gap-2">
            {project.metrics.map((m) => (
              <li key={m.label} className="rounded-xl border border-line p-2.5" title={m.note}>
                <span className="block font-display text-lg font-semibold tracking-tight sm:text-xl">{m.value}</span>
                <span className="block text-[11px] leading-snug text-muted">{m.label}</span>
              </li>
            ))}
          </ul>
        )}

        {project.highlights.length > 0 && (
          <ul className="mt-5 grid gap-x-5 gap-y-1.5 sm:grid-cols-2">
            {project.highlights.map((h) => (
              <li key={h} className="flex gap-2.5 text-[13px] leading-relaxed text-muted">
                <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" aria-hidden />
                {h}
              </li>
            ))}
          </ul>
        )}

        <ul className="mt-5 flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <li key={s} className="rounded-md bg-accent-soft px-2 py-1 font-mono text-[11px] text-accent-text">
              {s}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-6">
          <LinkButtons links={project.links} />
          <div className="flex items-center gap-2 font-mono text-xs text-faint">
            <button
              type="button"
              onClick={() => onStep(-1)}
              aria-label="Previous project"
              className="grid size-9 place-items-center rounded-full border border-line transition hover:border-accent hover:text-accent-text"
            >
              <ArrowLeft className="size-4" />
            </button>
            <span className="tabular-nums">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={() => onStep(1)}
              aria-label="Next project"
              className="grid size-9 place-items-center rounded-full border border-line transition hover:border-accent hover:text-accent-text"
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// A master–detail explorer: every featured project is one click away, without a long scroll.
const featured = projects.filter((p) => p.featured);
const more = projects.filter((p) => !p.featured);

export function Projects({ index, eyebrow, heading }: { index: number; eyebrow: string; heading: string }) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const onSelect = (e: Event) => {
      const i = featured.findIndex((p) => p.slug === (e as CustomEvent<string>).detail);
      if (i >= 0) setActive(i);
    };
    window.addEventListener(SELECT_PROJECT_EVENT, onSelect);
    return () => window.removeEventListener(SELECT_PROJECT_EVENT, onSelect);
  }, []);

  const step = (d: number) => setActive((a) => (a + d + featured.length) % featured.length);

  function onTabKey(e: KeyboardEvent<HTMLDivElement>) {
    const keys: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    if (!(e.key in keys)) return;
    e.preventDefault();
    const next = (active + keys[e.key] + featured.length) % featured.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  const current = featured[active];

  return (
    <>
      <SectionHeading index={index} eyebrow={eyebrow} heading={heading} />

      <Reveal className="grid grid-cols-1 gap-4 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <div className="min-w-0">
          <div
            role="tablist"
            aria-label="Projects"
            aria-orientation="vertical"
            onKeyDown={onTabKey}
            className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0"
          >
            {featured.map((p, i) => {
              const selected = i === active;
              return (
                <button
                  key={p.slug}
                  ref={(el) => void (tabRefs.current[i] = el)}
                  role="tab"
                  id={`tab-${p.slug}`}
                  aria-selected={selected}
                  aria-controls="project-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(i)}
                  className={`group relative shrink-0 snap-start rounded-2xl border px-4 py-3 text-left transition lg:py-4 ${
                    selected
                      ? "border-accent/50 bg-accent-soft"
                      : "border-line hover:border-line-strong hover:bg-surface"
                  }`}
                >
                  <span className={`block font-mono text-[11px] ${selected ? "text-accent-text" : "text-faint"}`}>
                    P/{String(i + 1).padStart(2, "0")}
                    <span className="hidden lg:inline"> · {p.category}</span>
                  </span>
                  <span className="mt-0.5 block whitespace-nowrap font-display font-semibold lg:whitespace-normal">
                    {p.title}
                  </span>
                  {selected && (
                    <motion.span
                      layoutId="project-tab-bar"
                      className="absolute inset-y-3 left-0 hidden w-0.5 rounded-full bg-accent lg:block"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {more.length > 0 && (
            <div className="mt-4 hidden border-t border-line pt-4 lg:block">
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-faint">More builds</p>
              <ul className="space-y-1">
                {more.map((p) => (
                  <li key={p.slug}>
                    <a
                      href={p.links[0]?.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={p.summary}
                      className="group flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-sm text-muted transition hover:bg-surface hover:text-fg"
                    >
                      <span className="truncate">{p.title}</span>
                      <ArrowUpRight className="size-3.5 shrink-0 opacity-50 group-hover:text-accent-text group-hover:opacity-100" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div
          id="project-panel"
          role="tabpanel"
          aria-labelledby={`tab-${current.slug}`}
          className="glass overflow-hidden rounded-3xl"
        >
          <AnimatePresence mode="wait" initial={false}>
            <ProjectPanel key={current.slug} project={current} index={active} total={featured.length} onStep={step} />
          </AnimatePresence>
        </div>
      </Reveal>

      {more.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2 lg:hidden">
          {more.map((p) => (
            <li key={p.slug}>
              <a
                href={p.links[0]?.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-2 text-sm text-muted"
              >
                {p.title} <ArrowUpRight className="size-3.5" />
              </a>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
