"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Copy, FolderGit2, Hash, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { profile, projects, site, socials, type SocialKey } from "@/data";
import { OPEN_PALETTE_EVENT, selectProject } from "@/lib/events";
import { BrandIcon } from "./ui/BrandIcon";

type Command = {
  id: string;
  group: "Sections" | "Projects" | "Links" | "Actions";
  label: string;
  hint?: string;
  icon: React.ReactNode;
  keywords?: string;
  run: () => void;
};

function goTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

// Ctrl/⌘+K quick-jump: sections, projects, profiles and a few actions, all generated from src/data.
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState("");

  const commands = useMemo<Command[]>(
    () => [
      { id: "s-top", group: "Sections", label: "Home", icon: <Hash className="size-4" />, run: () => goTo("top") },
      ...site.sections
        .filter((s) => s.enabled)
        .map<Command>((s) => ({
          id: `s-${s.id}`,
          group: "Sections",
          label: s.label,
          hint: s.eyebrow,
          keywords: s.heading,
          icon: <Hash className="size-4" />,
          run: () => goTo(s.id),
        })),
      ...projects.map<Command>((p) => ({
        id: `p-${p.slug}`,
        group: "Projects",
        label: p.title,
        hint: p.subtitle,
        keywords: `${p.category} ${p.stack.join(" ")}`,
        icon: <FolderGit2 className="size-4" />,
        run: () => (p.featured ? selectProject(p.slug) : window.open(p.links[0]?.href, "_blank", "noopener")),
      })),
      ...socials
        .filter((s) => s.key !== "email")
        .map<Command>((s) => ({
          id: `l-${s.key}`,
          group: "Links",
          label: s.label,
          hint: s.handle,
          icon: <BrandIcon name={s.key as SocialKey} />,
          run: () => window.open(s.href, "_blank", "noopener"),
        })),
      {
        id: "a-email",
        group: "Actions",
        label: "Copy email address",
        hint: profile.email,
        icon: <Copy className="size-4" />,
        run: () => {
          navigator.clipboard?.writeText(profile.email).then(
            () => setToast("Email copied"),
            () => (window.location.href = `mailto:${profile.email}`),
          );
        },
      },
    ],
    [],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE_EVENT, onOpen);
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 1800);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <>
      <AnimatePresence>{open && <PaletteDialog commands={commands} onClose={() => setOpen(false)} />}</AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.p
            role="status"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed bottom-6 left-1/2 z-[85] -translate-x-1/2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-ink"
          >
            {toast}
          </motion.p>
        )}
      </AnimatePresence>
    </>
  );
}

// Mounted only while open, so the query and cursor start fresh every time.
function PaletteDialog({ commands, onClose }: { commands: Command[]; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const prevOverflow = useRef("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) =>
      `${c.label} ${c.hint ?? ""} ${c.keywords ?? ""} ${c.group}`.toLowerCase().includes(q),
    );
  }, [commands, query]);

  useEffect(() => {
    inputRef.current?.focus();
    prevOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow.current;
    };
  }, []);

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${cursor}"]`)?.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  function run(c: Command | undefined) {
    if (!c) return;
    // Unlock page scroll now; the dialog stays mounted during its exit animation.
    document.body.style.overflow = prevOverflow.current;
    onClose();
    c.run();
  }

  function onInputKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(results[cursor]);
    } else if (e.key === "Escape") {
      onClose();
    }
  }

  const groupStarts = new Set(results.filter((c, i) => i === 0 || results[i - 1].group !== c.group).map((c) => c.id));

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-start justify-center bg-black/50 px-4 pt-[12vh] backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Search and jump"
        initial={{ opacity: 0, y: -12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.98 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-line-strong bg-bg-elev shadow-[var(--shadow)]"
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search className="size-4 text-faint" aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCursor(0);
            }}
            onKeyDown={onInputKey}
            placeholder="Jump to a section, project or profile…"
            aria-label="Search"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-results"
            aria-activedescendant={results[cursor] ? `cmd-${results[cursor].id}` : undefined}
            className="h-14 flex-1 bg-transparent text-base outline-none placeholder:text-faint focus-visible:outline-none"
          />
          <kbd className="rounded-md border border-line px-1.5 py-0.5 font-mono text-[10px] text-faint">Esc</kbd>
        </div>

        <ul ref={listRef} id="palette-results" role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
          {results.length === 0 && (
            <li className="px-3 py-8 text-center text-sm text-muted">No matches for “{query}”.</li>
          )}
          {results.map((c, i) => {
            const header = groupStarts.has(c.id);
            return (
              <li key={c.id} role="presentation">
                {header && (
                  <p className="px-3 pb-1 pt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-faint first:pt-1">
                    {c.group}
                  </p>
                )}
                <div
                  id={`cmd-${c.id}`}
                  role="option"
                  aria-selected={i === cursor}
                  data-index={i}
                  onMouseMove={() => setCursor(i)}
                  onClick={() => run(c)}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${
                    i === cursor ? "bg-accent-soft text-fg" : "text-muted"
                  }`}
                >
                  <span className={i === cursor ? "text-accent-text" : "text-faint"}>{c.icon}</span>
                  <span className="font-medium">{c.label}</span>
                  {c.hint && <span className="truncate text-xs text-faint">{c.hint}</span>}
                  {i === cursor && <ArrowRight className="ml-auto size-4 shrink-0 text-accent-text" aria-hidden />}
                </div>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-4 border-t border-line px-4 py-2.5 font-mono text-[10px] text-faint">
          <span>↑↓ navigate</span>
          <span>↵ open</span>
          <span className="ml-auto">{results.length} results</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
