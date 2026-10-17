"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowUp } from "lucide-react";
import { useState } from "react";

export function BackToTop() {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setShow(y > window.innerHeight * 1.2));

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href="#top"
          aria-label="Back to top"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          whileHover={{ y: -3 }}
          className="glass fixed bottom-5 right-5 z-40 grid size-12 place-items-center rounded-full text-fg shadow-[var(--shadow)] transition-colors hover:border-accent hover:text-accent-text"
        >
          <ArrowUp className="size-5" />
        </motion.a>
      )}
    </AnimatePresence>
  );
}
