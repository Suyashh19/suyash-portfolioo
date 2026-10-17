import { Award, BadgeCheck, Briefcase, Medal, Trophy } from "lucide-react";
import { achievements, type Achievement } from "@/data";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

const kindMeta: Record<Achievement["kind"], { label: string; Icon: typeof Trophy }> = {
  win: { label: "Winner", Icon: Trophy },
  finalist: { label: "Finalist", Icon: Medal },
  semifinalist: { label: "Semifinalist", Icon: Award },
  experience: { label: "Experience", Icon: Briefcase },
  certification: { label: "Certification", Icon: BadgeCheck },
};

export function Achievements({ index, eyebrow, heading }: { index: number; eyebrow: string; heading: string }) {
  const main = achievements.filter((a) => a.kind !== "certification");
  const certs = achievements.filter((a) => a.kind === "certification");

  return (
    <>
      <SectionHeading index={index} eyebrow={eyebrow} heading={heading} />

      <Reveal>
        <ol className="grid overflow-hidden rounded-3xl border border-line md:grid-cols-2">
          {main.map((a, i) => {
            const { label, Icon } = kindMeta[a.kind];
            const highlight = a.kind === "experience" || a.kind === "win";
            return (
              <li
                key={a.title}
                className={`flex gap-4 border-line bg-surface p-5 transition-colors hover:bg-accent-soft ${
                  i > 0 ? "border-t" : ""
                } ${i === 0 ? "md:col-span-2" : ""} ${i > 0 && i % 2 === 0 ? "md:border-l" : ""}`}
              >
                <span
                  className={`grid size-10 shrink-0 place-items-center rounded-xl ${
                    highlight ? "bg-accent text-accent-ink" : "bg-accent-soft text-accent-text"
                  }`}
                >
                  <Icon className="size-[18px]" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent-text">
                    {label}
                    {a.date && <span className="text-faint"> · {a.date}</span>}
                  </p>
                  <h3 className="mt-1 font-display text-lg font-semibold leading-snug">
                    {a.link ? (
                      <a href={a.link} target="_blank" rel="noopener noreferrer" className="hover:text-accent-text">
                        {a.title}
                      </a>
                    ) : (
                      a.title
                    )}
                  </h3>
                  <p className="text-sm text-muted">{a.org}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-faint">{a.description}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </Reveal>

      {certs.length > 0 && (
        <Reveal className="mt-5 flex flex-wrap items-center gap-2">
          <span className="mr-1 font-mono text-[11px] uppercase tracking-[0.2em] text-faint">Certified</span>
          {certs.map((c) => (
            <span key={c.title} className="inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-1.5 text-sm">
              <BadgeCheck className="size-4 text-accent-text" aria-hidden />
              {c.title}
              <span className="text-faint">· {c.org}</span>
            </span>
          ))}
        </Reveal>
      )}
    </>
  );
}
