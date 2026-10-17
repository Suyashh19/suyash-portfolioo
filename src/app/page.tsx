import { MotionConfig } from "motion/react";
import { site, type SectionId } from "@/data";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { CommandPalette } from "@/components/CommandPalette";
import { Navbar } from "@/components/Navbar";
import { About } from "@/components/sections/About";
import { Achievements } from "@/components/sections/Achievements";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";

type SectionProps = { index: number; eyebrow: string; heading: string };

const registry: Record<SectionId, (props: SectionProps) => React.ReactNode> = {
  about: About,
  projects: Projects,
  achievements: Achievements,
  skills: Skills,
  contact: Contact,
};

export default function Home() {
  const sections = site.sections.filter((s) => s.enabled);

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-ink"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        {sections.map((s, i) => {
          const Section = registry[s.id];
          return (
            <section key={s.id} id={s.id} className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-20">
              <Section index={i + 1} eyebrow={s.eyebrow} heading={s.heading} />
            </section>
          );
        })}
      </main>
      <Footer />
      <BackToTop />
      <CommandPalette />
    </MotionConfig>
  );
}
