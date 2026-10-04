"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { ImageAsset } from "@drkav/content-contracts";

export function PortfolioImageViewer({ asset, className = "" }: { asset: ImageAsset; className?: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (isOpen && dialog && !dialog.open) dialog.showModal();
    if (!isOpen && dialog?.open) dialog.close();
  }, [isOpen]);

  return (
    <>
      <button aria-label="Открыть фотографию" className={`portfolio-case__image-button ${className}`} onClick={() => setIsOpen(true)} type="button">
        <Image alt={asset.alternativeText ?? ""} height={asset.height ?? 900} sizes="(min-width: 64rem) 58rem, 100vw" src={asset.url} width={asset.width ?? 1200} />
      </button>
      {isOpen ? (
        <dialog
          aria-label={asset.alternativeText ?? "Фотография кейса"}
          className="portfolio-case__image-dialog"
          onCancel={(event) => { event.preventDefault(); setIsOpen(false); }}
          onClick={(event) => { if (event.target === event.currentTarget) setIsOpen(false); }}
          ref={dialogRef}
        >
          <button aria-label="Закрыть фотографию" className="portfolio-case__image-dialog-close" onClick={() => setIsOpen(false)} type="button">×</button>
          <Image alt={asset.alternativeText ?? ""} className="portfolio-case__image-dialog-image" height={asset.height ?? 900} sizes="92vw" src={asset.url} width={asset.width ?? 1200} />
        </dialog>
      ) : null}
    </>
  );
}
