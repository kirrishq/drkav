"use client";

import { useRef, type MouseEvent } from "react";
import Image from "next/image";
import { TextLink } from "@drkav/ui";

const patentImageSrc = "/images/patents/patent-diastaz.webp";

export function ContributionPatent() {
  const imageRef = useRef<HTMLImageElement>(null);

  function openFullscreen() {
    void imageRef.current?.requestFullscreen();
  }

  function closeFullscreen(event: MouseEvent<HTMLImageElement>) {
    if (!document.fullscreenElement) {
      return;
    }

    event.stopPropagation();
    void document.exitFullscreen();
  }

  return (
    <section aria-labelledby="contribution-patent-title" className="content-card content-card--muted contribution-patent">
      <h2 className="content-card__heading content-card__heading--h2" id="contribution-patent-title">Патент</h2>
      <p className="content-card__lead">
        На операцию <TextLink href="/operacii/diastaz-myshc-zhivota">«Диастаз без шрамов»</TextLink> получен патент № 2801500 от 09 августа 2023 г.
      </p>
      <button
        aria-label="Открыть патент на весь экран"
        className="contribution-patent__preview"
        onClick={openFullscreen}
        type="button"
      >
        <Image
          alt="Патент № 2801500 на способ хирургического лечения диастаза прямых мышц живота"
          className="contribution-patent__image"
          fill
          onClick={closeFullscreen}
          ref={imageRef}
          sizes="(min-width: 40rem) 44rem, 100vw"
          src={patentImageSrc}
        />
        <span aria-hidden="true" className="contribution-patent__preview-label">Открыть патент</span>
      </button>
    </section>
  );
}
