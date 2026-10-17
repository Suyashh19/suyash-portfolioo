"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { ArrowUpRight, Menu, Search, X } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { profile, site, socials } from "@/data";
import { openPalette } from "@/lib/events";
import { BrandIcon } from "./ui/BrandIcon";

const sections = site.sections.filter((s) => s.enabled);
const links = sections.filter((s) => s.id !== "contact");
const noop = () => () => {};

export function Navbar() {
  const [active, setActive] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const isMac = useSyncExternalStore(
    noop,
    () => /Mac|iPhone|iPad/.test(navigator.platform),
    () => false,
  );
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  // The bar stays visible at all times; it only gains its glass background once the page scrolls.
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  useEffect(() => {
    // Highlight the nav link for the section in the middle of the viewport.
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ["top", ...sections.map((s) => s.id)].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Full-screen mobile menu: lock page scroll and close on Escape.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <motion.div
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[55] h-0.5 origin-left bg-accent"
        aria-hidden
      />
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
        <nav
          aria-label="Primary"
          className={`mx-auto flex max-w-6xl items-center justify-between gap-2 rounded-full px-3 py-2 transition-[background-color,border-color,box-shadow] duration-500 ${
            scrolled || open ? "glass shadow-[var(--shadow)]" : "border border-transparent"
          }`}
        >
          <a href="#top" className="group flex items-center gap-2.5 pl-2" aria-label={`${profile.name}, back to top`}>
            <span className="grid size-8 place-items-center rounded-full bg-accent font-display text-sm font-bold text-accent-ink">
              {profile.initials}
            </span>
            <span className="hidden font-display font-semibold tracking-tight sm:block">{profile.name}</span>
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  aria-current={active === l.id ? "true" : undefined}
                  className={`relative rounded-full px-3.5 py-2 text-sm transition ${
                    active === l.id ? "text-fg" : "text-muted hover:text-fg"
                  }`}
                >
                  {active === l.id && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-accent-soft"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openPalette}
              aria-label="Search and jump to anything"
              aria-keyshortcuts="Control+K Meta+K"
              className="flex h-10 items-center gap-2 rounded-full border border-line px-3 text-sm text-muted transition hover:border-accent hover:text-fg"
            >
              <Search className="size-4" />
              <kbd className="hidden rounded-md border border-line px-1.5 py-0.5 font-mono text-[10px] lg:inline">
                {isMac ? "⌘" : "Ctrl"} K
              </kbd>
            </button>
            <a
              href="#contact"
              className="hidden rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-ink transition hover:shadow-[0_0_24px_var(--glow)] sm:block"
            >
              Contact
            </a>
            <button
              type="button"
              className="grid size-10 place-items-center rounded-full border border-line md:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 flex flex-col bg-bg/95 px-6 pb-8 pt-28 backdrop-blur-xl md:hidden"
          >
            <nav aria-label="Mobile" className="flex-1">
              <ul className="space-y-1">
                {sections.map((l, i) => (
                  <motion.li
                    key={l.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i, duration: 0.35 }}
                  >
                    <a
                      href={`#${l.id}`}
                      onClick={() => setOpen(false)}
                      className={`flex items-baseline gap-4 rounded-2xl py-3 font-display text-4xl font-semibold tracking-tight ${
                        active === l.id ? "text-accent-text" : ""
                      }`}
                    >
                      <span className="font-mono text-xs text-faint">{String(i + 1).padStart(2, "0")}</span>
                      {l.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <div className="flex flex-wrap gap-2 border-t border-line pt-6">
              {socials
                .filter((s) => s.key !== "email")
                .slice(0, 4)
                .map((s) => (
                  <a
                    key={s.key}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm"
                  >
                    <BrandIcon name={s.key} /> {s.label} <ArrowUpRight className="size-3.5 text-faint" />
                  </a>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
