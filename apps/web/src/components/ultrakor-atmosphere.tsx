"use client";

import { useEffect } from "react";

export function UltrakorAtmosphere() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".ultrakor");

    if (!root) {
      return;
    }

    let frame = 0;

    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const viewportProgress = window.scrollY / Math.max(window.innerHeight, 1);
        const reveal = Math.min(Math.max(viewportProgress / 0.65, 0), 1);
        const phase = viewportProgress * 1.25;
        const pulse = (Math.sin(phase * 0.75) + 1) / 2;

        root.style.setProperty("--ultrakor-glow-one-x", `${-4 + Math.sin(phase) * 15}%`);
        root.style.setProperty("--ultrakor-glow-one-y", `${32 + Math.cos(phase * 0.72) * 22}%`);
        root.style.setProperty("--ultrakor-glow-two-x", `${101 + Math.cos(phase * 0.84) * 14}%`);
        root.style.setProperty("--ultrakor-glow-two-y", `${64 + Math.sin(phase * 0.9) * 24}%`);
        root.style.setProperty("--ultrakor-glow-three-x", `${58 + Math.sin(phase * 0.58) * 28}%`);
        root.style.setProperty("--ultrakor-glow-three-y", `${108 + Math.cos(phase * 0.78) * 10}%`);
        root.style.setProperty("--ultrakor-glow-opacity", `${0.02 + reveal * (0.58 + pulse * 0.16)}`);
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return <div className="ultrakor-atmosphere" aria-hidden="true"><span /><span /><span /><span /></div>;
}
