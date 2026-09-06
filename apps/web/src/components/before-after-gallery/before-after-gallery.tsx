"use client";

import type { BeforeAfterCase } from "@drkav/content-contracts";
import { Button } from "@drkav/ui";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function BeforeAfterGallery({ items }: { items: readonly BeforeAfterCase[] }) {
  const [visibleCount, setVisibleCount] = useState(12);
  const visibleItems = items.slice(0, visibleCount);

  return <>
    <div className="results-gallery">
      {visibleItems.map((item) => <Link aria-label={`Открыть: ${item.title}`} className="results-gallery__tile" href={item.operation.canonicalPath} key={item.slug}>
        <Image
          alt={item.title}
          className="results-gallery__image"
          fill
          sizes="(min-width: 64rem) 25vw, (min-width: 48rem) 33vw, 50vw"
          src={item.image.url}
          unoptimized
        />
        <span className="results-gallery__label">{item.operation.heading}</span>
      </Link>)}
    </div>
    {visibleCount < items.length ? <div className="results-gallery__more"><Button onClick={() => setVisibleCount((count) => count + 12)} variant="outline">Показать ещё</Button></div> : null}
  </>;
}
