"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// Counts up to the number inside `value` ("120+", "1,600", "0.96") once it scrolls into view,
// keeping any prefix/suffix. Non-numeric values render as-is.
export function CountUp({ value, duration = 1.6 }: { value: string | number; duration?: number }) {
  const text = String(value);
  const match = text.match(/^(\D*)([\d,]*\.?\d+)(.*)$/);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const target = match ? Number(match[2].replace(/,/g, "")) : 0;
  const decimals = match?.[2].split(".")[1]?.length ?? 0;
  const isNumeric = !!match;
  const reduced = useReducedMotion();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!isNumeric || !inView) return;
    const controls = animate(0, target, {
      duration: reduced ? 0 : duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: setCurrent,
    });
    return () => controls.stop();
  }, [inView, target, duration, isNumeric, reduced]);

  if (!match) return <span>{text}</span>;
  const formatted = current.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: match[2].includes(","),
  });
  return (
    <span ref={ref} className="tabular-nums" aria-label={text}>
      <span aria-hidden>
        {match[1]}
        {formatted}
        {match[3]}
      </span>
    </span>
  );
}
