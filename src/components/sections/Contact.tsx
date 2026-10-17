"use client";

import { ArrowUpRight, Check, Copy, Download, Mail } from "lucide-react";
import { useState } from "react";
import { profile, socials } from "@/data";
import { BrandIcon } from "../ui/BrandIcon";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";
import { Spotlight } from "../ui/Spotlight";

export function Contact({ index, eyebrow, heading }: { index: number; eyebrow: string; heading: string }) {
  const [copied, setCopied] = useState(false);
  const links = socials.filter((s) => s.key !== "email");

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  }

  return (
    <>
      <SectionHeading index={index} eyebrow={eyebrow} heading={heading}>
        I&apos;m open to AI/ML internships, hackathons and collaborations on products that solve real problems. My inbox
        is always open.
      </SectionHeading>

      <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
        <Reveal>
          <Spotlight className="glass relative h-full overflow-hidden rounded-3xl p-6 sm:p-8">
            <div
              className="pointer-events-none absolute -bottom-32 -left-20 size-96 rounded-full bg-accent/15 blur-[100px]"
              aria-hidden
            />
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-faint">Say hello</p>
            <a
              href={`mailto:${profile.email}`}
              className="mt-3 block break-all font-display text-[clamp(1.4rem,4vw,2.6rem)] font-semibold leading-tight tracking-tight transition hover:text-accent-text"
            >
              {profile.email}
            </a>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-accent-ink transition hover:shadow-[0_0_32px_var(--glow)]"
              >
                <Mail className="size-4" /> Send an email
              </a>
              <button
                type="button"
                onClick={copyEmail}
                className="inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-3 font-medium transition hover:border-accent"
              >
                {copied ? <Check className="size-4 text-accent-text" /> : <Copy className="size-4" />}
                <span aria-live="polite">{copied ? "Copied!" : "Copy email"}</span>
              </button>
              {profile.resumeUrl && (
                <a
                  href={profile.resumeUrl}
                  download
                  className="inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-3 font-medium transition hover:border-accent"
                >
                  <Download className="size-4" /> Download resume
                </a>
              )}
            </div>
          </Spotlight>
        </Reveal>

        <Reveal delay={0.1}>
          <ul className="grid h-full grid-cols-2 gap-3">
            {links.map((s) => (
              <li key={s.key}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass group flex h-full items-center gap-3 rounded-2xl p-3.5 transition hover:border-accent/50"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent-text">
                    <BrandIcon name={s.key} className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{s.label}</span>
                    <span className="block truncate font-mono text-[11px] text-faint">{s.handle}</span>
                  </span>
                  <ArrowUpRight
                    className="size-4 shrink-0 text-faint transition group-hover:text-accent-text"
                    aria-hidden
                  />
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </>
  );
}
