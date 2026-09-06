"use client";

import { useEffect, useRef } from "react";

type Star = {
  alpha: number;
  depth: number;
  phase: number;
  radius: number;
  speed: number;
  x: number;
  y: number;
};

const TAU = Math.PI * 2;

function parseHexColor(value: string, fallback: [number, number, number]): [number, number, number] {
  const normalized = value.trim().replace("#", "");

  if (!/^[\da-f]{6}$/i.test(normalized)) {
    return fallback;
  }

  return [
    Number.parseInt(normalized.slice(0, 2), 16),
    Number.parseInt(normalized.slice(2, 4), 16),
    Number.parseInt(normalized.slice(4, 6), 16),
  ];
}

function rgba(color: [number, number, number], alpha: number) {
  return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
}

function createStars(width: number, height: number): Star[] {
  const count = Math.min(260, Math.max(110, Math.round((width * height) / 5600)));

  return Array.from({ length: count }, () => ({
    alpha: 0.36 + Math.random() * 0.64,
    depth: 0.2 + Math.random() * 0.8,
    phase: Math.random() * TAU,
    radius: 0.35 + Math.random() * 1.45,
    speed: 0.35 + Math.random() * 1.2,
    x: Math.random() * width,
    y: Math.random() * height,
  }));
}

export function HomeSpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = canvas?.parentElement;

    if (!canvas || !section) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const styles = getComputedStyle(section);
    const accent = parseHexColor(styles.getPropertyValue("--accent"), [255, 74, 168]);
    const inverse = parseHexColor(styles.getPropertyValue("--surface-inverse"), [25, 26, 31]);
    const light = parseHexColor(styles.getPropertyValue("--text-inverse"), [255, 255, 255]);
    const cool: [number, number, number] = [accent[1], accent[2], accent[0]];
    const deepSpace = inverse.map((channel) => Math.round(channel * 0.46)) as [number, number, number];
    const voidSpace = inverse.map((channel) => Math.round(channel * 0.24)) as [number, number, number];
    const pointer = { currentX: 0, currentY: 0, targetX: 0, targetY: 0 };
    let animationFrame = 0;
    let height = 0;
    let stars: Star[] = [];
    let width = 0;

    const resize = () => {
      const bounds = section.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.75);
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      stars = createStars(width, height);
    };

    const drawNebula = (time: number) => {
      const drift = reducedMotion.matches ? 0 : Math.sin(time * 0.00012) * width * 0.025;
      const nebulaX = width * 0.72 + pointer.currentX * width * 0.08 + drift;
      const nebulaY = height * 0.38 + pointer.currentY * height * 0.08;
      const radius = Math.max(width, height) * 0.72;
      const background = context.createLinearGradient(0, 0, width, height);
      background.addColorStop(0, rgba(inverse, 1));
      background.addColorStop(0.46, rgba(deepSpace, 1));
      background.addColorStop(1, rgba(voidSpace, 1));
      context.fillStyle = background;
      context.fillRect(0, 0, width, height);

      const glow = context.createRadialGradient(nebulaX, nebulaY, 0, nebulaX, nebulaY, radius);
      glow.addColorStop(0, rgba(accent, 0.3));
      glow.addColorStop(0.24, rgba(accent, 0.12));
      glow.addColorStop(0.58, rgba(cool, 0.08));
      glow.addColorStop(1, rgba(accent, 0));
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);

      const coolGlow = context.createRadialGradient(width * 0.2, height * 0.92, 0, width * 0.2, height * 0.92, radius * 0.65);
      coolGlow.addColorStop(0, rgba(cool, 0.12));
      coolGlow.addColorStop(1, rgba(cool, 0));
      context.fillStyle = coolGlow;
      context.fillRect(0, 0, width, height);
    };

    const drawStars = (time: number) => {
      for (const star of stars) {
        const twinkle = reducedMotion.matches ? 0.78 : 0.58 + Math.sin(time * 0.001 * star.speed + star.phase) * 0.34;
        const parallaxX = pointer.currentX * star.depth * 22;
        const parallaxY = pointer.currentY * star.depth * 14;
        const x = (star.x + parallaxX + width) % width;
        const y = (star.y + parallaxY + height) % height;
        const alpha = Math.max(0.12, twinkle * star.alpha);

        context.beginPath();
        context.fillStyle = rgba(light, alpha);
        context.arc(x, y, star.radius * (0.75 + star.depth * 0.55), 0, TAU);
        context.fill();

        if (star.radius > 1.45 && alpha > 0.58) {
          context.strokeStyle = rgba(accent, alpha * 0.42);
          context.lineWidth = 0.6;
          context.beginPath();
          context.moveTo(x - 4, y);
          context.lineTo(x + 4, y);
          context.moveTo(x, y - 4);
          context.lineTo(x, y + 4);
          context.stroke();
        }
      }
    };

    const draw = (time: number) => {
      pointer.currentX += (pointer.targetX - pointer.currentX) * 0.045;
      pointer.currentY += (pointer.targetY - pointer.currentY) * 0.045;
      drawNebula(time);
      drawStars(time);

      if (!reducedMotion.matches) {
        animationFrame = requestAnimationFrame(draw);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = section.getBoundingClientRect();
      pointer.targetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      pointer.targetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    };

    const resetPointer = () => {
      pointer.targetX = 0;
      pointer.targetY = 0;
    };

    const handleMotionPreference = () => {
      cancelAnimationFrame(animationFrame);
      draw(performance.now());
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (reducedMotion.matches) {
        draw(performance.now());
      }
    });

    resize();
    resizeObserver.observe(section);
    section.addEventListener("pointermove", handlePointerMove);
    section.addEventListener("pointerleave", resetPointer);
    reducedMotion.addEventListener("change", handleMotionPreference);
    draw(performance.now());

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      section.removeEventListener("pointermove", handlePointerMove);
      section.removeEventListener("pointerleave", resetPointer);
      reducedMotion.removeEventListener("change", handleMotionPreference);
    };
  }, []);

  return <canvas aria-hidden="true" className="home-hero__space" ref={canvasRef} />;
}
