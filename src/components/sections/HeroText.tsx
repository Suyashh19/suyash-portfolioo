"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// Hero typography that borrows the particle field's language: letters gather from scattered,
// blurred specks, the title dissolves into dots and re-resolves whenever the field morphs,
// and the tagline condenses word by word.

const ease = [0.22, 1, 0.36, 1] as const;
const DOTS = ["·", "•", "∙", "◦", "°", "*"];

// Small deterministic hash so server and client agree on every letter's start position.
function noise(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export function ParticleName({ name, delay = 0.1 }: { name: string; delay?: number }) {
  const words = name.split(" ");
  let charIndex = 0;
  const total = name.replace(/\s/g, "").length;

  return (
    <h1
      aria-label={name}
      className="font-display text-[clamp(3.4rem,11vw,8.5rem)] font-bold leading-[0.88] tracking-[-0.04em]"
    >
      {words.map((word, wi) => (
        <span key={wi} className="block whitespace-nowrap" aria-hidden>
          {[...word].map((ch) => {
            const i = charIndex++;
            // Whole pixels: the server serialises transforms at lower precision than the client,
            // so fractional offsets cause a hydration mismatch.
            const dx = Math.round((noise(i + 1) - 0.5) * 260);
            const dy = Math.round((noise(i + 41) - 0.5) * 200);
            return (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ opacity: 0, x: dx, y: dy, scale: 0.3, filter: "blur(14px)" }}
                animate={{ opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 1.3, delay: delay + (i / total) * 0.55 + noise(i + 7) * 0.25, ease }}
              >
                {ch}
              </motion.span>
            );
          })}
          {wi === words.length - 1 && (
            // The orange full stop lands last, like a single accent particle.
            <motion.span
              className="inline-block text-accent"
              initial={{ opacity: 0, scale: 0, y: -120, x: 80 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              transition={{ type: "spring", stiffness: 140, damping: 12, delay: delay + 1.15 }}
            >
              .
            </motion.span>
          )}
        </span>
      ))}
    </h1>
  );
}

// Re-resolves `text` from particle dots each time it changes (left-to-right with a little jitter).
export function ScrambleTitle({ text, duration = 1100 }: { text: string; duration?: number }) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState<{ ch: string; done: boolean }[]>(() =>
    [...text].map((ch) => ({ ch, done: true })),
  );
  const first = useRef(true);

  useEffect(() => {
    const chars = [...text];
    if (reduced) return;
    // On first mount wait for the name to land before decoding.
    const startDelay = first.current ? 900 : 0;
    first.current = false;
    const resolveAt = chars.map((_, i) => (i / chars.length) * duration * 0.65 + Math.random() * duration * 0.35);
    let raf = 0;
    let start = 0;
    let lastSwap = 0;
    const timer = setTimeout(() => {
      start = performance.now();
      const tick = (now: number) => {
        const t = now - start;
        // Swap the dot glyphs every ~60ms so they shimmer rather than flicker every frame.
        if (now - lastSwap > 60 || t >= duration) {
          lastSwap = now;
          setDisplay(
            chars.map((ch, i) =>
              ch === " " || t >= resolveAt[i]
                ? { ch, done: true }
                : { ch: DOTS[Math.floor(Math.random() * DOTS.length)], done: false },
            ),
          );
        }
        if (t < duration) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, startDelay);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [text, duration, reduced]);

  return (
    <span className="relative inline-grid">
      <span className="sr-only">{text}</span>
      {/* invisible copy reserves the final width so the line never jitters */}
      <span className="invisible col-start-1 row-start-1 whitespace-nowrap" aria-hidden>
        {text}
      </span>
      <span className="col-start-1 row-start-1 whitespace-nowrap text-accent-text" aria-hidden>
        {reduced
          ? text
          : display.map((c, i) => (
              <span key={i} className={c.done ? "" : "text-accent/70"}>
                {c.ch}
              </span>
            ))}
      </span>
    </span>
  );
}

// Words condense out of a blur, one after another.
export function CondenseText({
  text,
  delay = 0,
  className = "",
}: {
  text: string;
  delay?: number;
  className?: string;
}) {
  const words = text.split(" ");
  return (
    <p className={className}>
      <span className="sr-only">{text}</span>
      {words.map((w, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block whitespace-pre"
          initial={{ opacity: 0, filter: "blur(8px)", y: 6, letterSpacing: "0.25em" }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0, letterSpacing: "0em" }}
          transition={{ duration: 0.8, delay: delay + i * 0.045, ease }}
        >
          {w}
          {i < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </p>
  );
}
