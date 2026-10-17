import { ArrowUp } from "lucide-react";
import { profile, site, socials } from "@/data";
import { BrandIcon } from "./ui/BrandIcon";

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-line">
      <div className="mx-auto max-w-6xl px-4 pb-10 pt-16 sm:px-6">
        <p
          className="outline-text select-none font-display text-[clamp(4rem,17vw,13rem)] font-bold leading-none tracking-[-0.05em]"
          aria-hidden
        >
          {profile.shortName.toUpperCase()}
        </p>
        <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-md text-sm text-muted">{site.footerNote}</p>
          <div className="flex items-center gap-2">
            {socials.slice(0, 4).map((s) => (
              <a
                key={s.key}
                href={s.href}
                target={s.key === "email" ? undefined : "_blank"}
                rel="noopener noreferrer"
                aria-label={s.label}
                className="grid size-10 place-items-center rounded-full border border-line text-muted transition hover:border-accent hover:text-accent-text"
              >
                <BrandIcon name={s.key} />
              </a>
            ))}
            <a
              href="#top"
              aria-label="Back to top"
              className="ml-2 grid size-10 place-items-center rounded-full bg-accent text-accent-ink transition hover:-translate-y-1"
            >
              <ArrowUp className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
