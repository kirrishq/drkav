"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { TextLink } from "@drkav/ui";

const patentImageSrc = "/images/patents/patent-diastaz.webp";

export function ContributionPatent({ lead }: { lead?: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (isOpen && dialog && !dialog.open) dialog.showModal();
    if (!isOpen && dialog?.open) dialog.close();
  }, [isOpen]);

  function closeDialog() {
    setIsOpen(false);
  }

  return (
    <section aria-labelledby="contribution-patent-title" className="content-card content-card--muted contribution-patent">
      <h2 className="content-card__heading content-card__heading--h2" id="contribution-patent-title">Патент</h2>
      {lead ? <p className="content-card__lead">{lead}</p> : <p className="content-card__lead">На операцию <TextLink href="/operaczii/diastaz-myshc-zhivota">«Диастаз без шрамов»</TextLink> получен патент № 2801500 от 09 августа 2023 г.</p>}
      <button
        aria-label="Открыть патент на весь экран"
        className="contribution-patent__preview"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        <Image
          alt="Патент № 2801500 на способ хирургического лечения диастаза прямых мышц живота"
          className="contribution-patent__image"
          fill
          sizes="(min-width: 40rem) 44rem, 100vw"
          src={patentImageSrc}
        />
        <span aria-hidden="true" className="contribution-patent__preview-label">Открыть патент</span>
      </button>
      {isOpen ? (
        <dialog
          aria-label="Патент на способ хирургического лечения диастаза"
          className="contribution-patent__dialog"
          onCancel={(event) => {
            event.preventDefault();
            closeDialog();
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget) closeDialog();
          }}
          ref={dialogRef}
        >
          <button aria-label="Закрыть патент" className="contribution-patent__dialog-close" onClick={closeDialog} type="button">×</button>
          <Image
            alt="Патент № 2801500 на способ хирургического лечения диастаза прямых мышц живота"
            className="contribution-patent__dialog-image"
            height={1600}
            src={patentImageSrc}
            width={1200}
          />
        </dialog>
      ) : null}
    </section>
  );
}
