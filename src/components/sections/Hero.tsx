"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowDown, ArrowUpRight, Download, Mail } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { profile, site } from "@/data";
import { CountUp } from "../ui/CountUp";
import { HERO_HOLD_MS, HERO_SHAPES } from "./heroShapes";
import { CondenseText, ParticleName, ScrambleTitle } from "./HeroText";

// Three.js is only downloaded in the browser, after the page is interactive.
const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const reduced = useReducedMotion() ?? false;
  const [mountScene, setMountScene] = useState(false);
  const [stage, setStage] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  // As the hero scrolls away, the particle field sinks and fades while the copy drifts up slightly.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const sceneY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);

  useEffect(() => {
    if (!site.hero.show3D) return;
    let cancelled = false;
    // Wait for the display font so the particle initials are drawn in it.
    const start = () => document.fonts.ready.then(() => !cancelled && setMountScene(true));
    let cleanup: () => void;
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(start, { timeout: 1200 });
      cleanup = () => window.cancelIdleCallback(id);
    } else {
      const id = setTimeout(start, 300);
      cleanup = () => clearTimeout(id);
    }
    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  // Pause rendering and cycling when the hero is off-screen.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([e]) => setInView(e.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Cycle through the shapes (and, in step, the title). A manual pick holds for a while before auto-play resumes.
  useEffect(() => {
    if (!inView || reduced) return;
    const id = setTimeout(
      () => {
        setPaused(false);
        setStage((n) => (n + 1) % HERO_SHAPES.length);
      },
      paused ? HERO_HOLD_MS * 2.5 : HERO_HOLD_MS,
    );
    return () => clearTimeout(id);
  }, [stage, paused, inView, reduced]);

  return (
    <section ref={sectionRef} id="top" className="relative flex min-h-dvh items-center overflow-hidden pb-16 pt-28">
      <div className="backdrop-grid pointer-events-none absolute inset-0" aria-hidden />
      <div
        className="pointer-events-none absolute -right-40 top-1/4 size-[38rem] rounded-full bg-accent/10 blur-[120px]"
        aria-hidden
      />

      {/* 3D scene: full-bleed behind the text on mobile, right half on desktop */}
      <motion.div
        style={reduced ? undefined : { y: sceneY, opacity: sceneOpacity }}
        className="absolute inset-0 max-md:opacity-40 md:left-[38%] max-md:[mask-image:linear-gradient(to_bottom,black,transparent)]"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: mountScene ? 1 : 0, scale: mountScene ? 1 : 0.92 }}
          transition={{ duration: 1.6, ease }}
          className="size-full"
        >
          {mountScene && <HeroScene stage={stage} reducedMotion={reduced} active={inView} />}
        </motion.div>
      </motion.div>

      {mountScene && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease }}
          className="absolute bottom-8 right-6 z-10 hidden items-center gap-4 md:flex lg:right-[max(1.5rem,calc((100vw-72rem)/2))]"
        >
          <p className="font-mono text-[11px] text-faint" aria-live="polite">
            <span className="text-accent-text">{"//"}</span> rendering{" "}
            <AnimatePresence mode="wait">
              <motion.span
                key={stage}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="inline-block text-muted"
              >
                {HERO_SHAPES[stage].label}
              </motion.span>
            </AnimatePresence>
          </p>
          <div className="flex items-center gap-1.5" role="group" aria-label="Choose hero animation shape">
            {HERO_SHAPES.map((sh, i) => (
              <button
                key={sh.id}
                type="button"
                onClick={() => {
                  setStage(i);
                  setPaused(true);
                }}
                aria-label={`Show ${sh.label}`}
                aria-pressed={i === stage}
                className="group grid h-6 place-items-center px-0.5"
              >
                <span
                  className={`block h-1 rounded-full transition-all duration-500 ${
                    i === stage ? "w-7 bg-accent" : "w-3 bg-line-strong group-hover:bg-muted"
                  }`}
                />
              </button>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div style={reduced ? undefined : { y: copyY }} className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="glass mb-8 inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 font-mono text-xs text-muted"
        >
          <span className="relative flex size-2">
            <span className="animate-ping-soft absolute inline-flex size-full rounded-full bg-accent" />
            <span className="relative inline-flex size-2 rounded-full bg-accent" />
          </span>
          {profile.availability} · {profile.location.split(",")[0]}, IN
        </motion.div>

        <ParticleName name={profile.name} />

        <div className="mt-8 max-w-xl">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.8 }}
            className="font-display text-2xl font-medium md:text-3xl"
          >
            {/* the title re-resolves in step with each particle morph */}
            <ScrambleTitle text={profile.titles[stage % profile.titles.length]} />
          </motion.p>
          <CondenseText
            text={profile.tagline}
            delay={1.1}
            className="mt-4 text-lg leading-relaxed text-muted text-pretty"
          />

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.5, ease }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-accent-ink transition hover:shadow-[0_0_32px_var(--glow)]"
            >
              View my work
              <ArrowUpRight className="size-4 transition group-hover:rotate-45" />
            </a>
            <a
              href="#contact"
              className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold transition hover:border-accent"
            >
              <Mail className="size-4 text-accent-text" />
              Get in touch
            </a>
            {profile.resumeUrl && (
              <a
                href={profile.resumeUrl}
                download
                className="inline-flex items-center gap-2 rounded-full px-4 py-3 font-medium text-muted transition hover:text-fg"
              >
                <Download className="size-4" /> Resume
              </a>
            )}
          </motion.div>
        </div>

        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.8 }}
          className="mt-16 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4"
        >
          {site.hero.stats.map((s) => (
            <li key={s.label} className="bg-bg/80 p-4 backdrop-blur-sm">
              <span className="block font-display text-3xl font-semibold tracking-tight">
                <CountUp value={s.value} />
              </span>
              <span className="mt-1 block text-xs leading-snug text-muted">{s.label}</span>
            </li>
          ))}
        </motion.ul>
      </motion.div>

      <a
        href="#about"
        aria-label="Scroll to About"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-faint transition hover:text-accent-text md:flex"
      >
        scroll
        <ArrowDown className="size-4 animate-bounce" />
      </a>
    </section>
  );
}
