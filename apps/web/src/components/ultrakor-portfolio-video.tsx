"use client";

import Image from "next/image";
import { useState } from "react";

type UltrakorPortfolioVideoProps = {
  alt: string;
  imageSrc: string;
  label: "До" | "После";
  videoSrc: string;
};

export function UltrakorPortfolioVideo({ alt, imageSrc, label, videoSrc }: UltrakorPortfolioVideoProps) {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="ultrakor-portfolio__image">
      {isActive ? <video aria-label={alt} autoPlay className="ultrakor-portfolio__video" loop muted playsInline poster={imageSrc} src={videoSrc} /> : <Image alt={alt} fill sizes="(max-width: 1023px) 42vw, 20vw" src={imageSrc} />}
      <span>{label}</span>
      <button
        aria-label={`${isActive ? "Остановить" : "Смотреть"} видео: ${alt}`}
        aria-pressed={isActive}
        className={`ultrakor-portfolio__video-trigger${isActive ? " is-active" : ""}`}
        onPointerEnter={event => { if (event.pointerType === "mouse" && window.matchMedia("(hover: hover) and (pointer: fine)").matches) setIsActive(true); }}
        onPointerLeave={event => { if (event.pointerType === "mouse") setIsActive(false); }}
        onClick={event => { if (event.detail > 0 && window.matchMedia("(hover: hover) and (pointer: fine)").matches) setIsActive(true); else setIsActive(active => !active); }}
        type="button"
      >
        <Image alt="" aria-hidden="true" className="ultrakor-portfolio__video-label" height={300} src="/icons/ultrakor/watch-video.svg" width={300} />
        <Image alt="" aria-hidden="true" className="ultrakor-portfolio__play" height={300} src="/icons/ultrakor/youtube.svg" width={300} />
      </button>
    </div>
  );
}
