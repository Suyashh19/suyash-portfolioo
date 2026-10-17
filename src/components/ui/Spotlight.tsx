"use client";

import type { HTMLAttributes, PointerEvent } from "react";

// A container whose glow follows the pointer (see .spotlight in globals.css).
export function Spotlight({ className = "", children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }
  return (
    <div onPointerMove={onPointerMove} className={`spotlight ${className}`} {...rest}>
      {children}
    </div>
  );
}
