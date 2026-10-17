import Image from "next/image";
import { GraduationCap } from "lucide-react";
import { education, profile } from "@/data";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

export function About({ index, eyebrow, heading }: { index: number; eyebrow: string; heading: string }) {
  const { primary, secondary } = profile.photos;

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
      <div>
        <SectionHeading index={index} eyebrow={eyebrow} heading={heading} />
        <div className="space-y-4 leading-relaxed text-muted text-pretty md:text-lg">
          {profile.pitch.map((p, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <p>{p}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-line pt-6">
            {profile.quickFacts.map((f) => (
              <div key={f.label}>
                <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-faint">{f.label}</dt>
                <dd className="mt-1 font-display font-medium sm:text-lg">{f.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        {education.map((e) => (
          <Reveal key={e.institution} delay={0.18}>
            <div className="mt-6 flex items-center gap-4 rounded-2xl border border-line bg-surface p-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent-text">
                <GraduationCap className="size-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display font-semibold leading-snug">{e.institution}</p>
                <p className="text-sm text-muted">
                  {e.degree.replace(/\s*\(.*\)/, "")} · {e.branch}
                </p>
              </div>
              <p className="shrink-0 font-mono text-xs text-faint">
                {e.start}–{e.end}
              </p>
            </div>
          </Reveal>
        ))}

        <Reveal delay={0.2}>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-faint">Open to</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {profile.openTo.map((o) => (
              <li key={o} className="rounded-full border border-line px-3.5 py-1.5 text-sm text-muted">
                {o}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <Reveal y={40} className="relative mx-auto w-full max-w-sm lg:mt-20">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-line-strong shadow-[var(--shadow)]">
          <Image
            src={primary.src}
            alt={primary.alt}
            fill
            sizes="(min-width: 1024px) 28rem, 90vw"
            className="object-cover"
            style={{ objectPosition: primary.position }}
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-transparent to-transparent" />
          <div className="absolute inset-x-5 bottom-5 flex items-end justify-between">
            <div>
              <p className="font-display text-2xl font-semibold text-white">{profile.name}</p>
              <p className="font-mono text-xs text-white/70">{profile.titles[0]}</p>
            </div>
            <span className="rounded-full bg-accent px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-accent-ink">
              Class of 2028
            </span>
          </div>
        </div>

        {secondary && (
          <div className="absolute -left-8 -top-8 hidden aspect-square w-32 overflow-hidden rounded-3xl border-4 border-bg shadow-[var(--shadow)] sm:block">
            <Image
              src={secondary.src}
              alt={secondary.alt}
              fill
              sizes="9rem"
              className="object-cover"
              style={{ objectPosition: secondary.position }}
            />
          </div>
        )}
      </Reveal>
    </div>
  );
}
