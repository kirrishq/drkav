"use client";

import { Button, buttonVariants, cn, RecordCard } from "@drkav/ui";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";

const patentTitle = "Способ хирургического лечения диастаза прямых мышц живота";
const patentImageSrc = "/images/patents/patent-diastaz.webp";

function CloseIcon() {
  return (
    <svg aria-hidden="true" className="patent-modal__close-icon" fill="none" viewBox="0 0 24 24">
      <path d="m7 7 10 10M17 7 7 17" stroke="currentColor" strokeLinecap="round" strokeWidth="1.75" />
    </svg>
  );
}

function PatentModal({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  // The image address is content data, so it remains the only dynamic inline style.
  const previewStyle: CSSProperties = { backgroundImage: `url("${patentImageSrc}")` };

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();

    return () => {
      if (dialog?.open) {
        dialog.close();
      }
    };
  }, []);

  function openImageFullscreen() {
    const preview = previewRef.current;

    if (!preview) {
      return;
    }

    if (document.fullscreenElement === preview) {
      void document.exitFullscreen();
      return;
    }

    void preview.requestFullscreen();
  }

  return (
    <dialog
      aria-labelledby="patent-modal-title"
      className="patent-modal"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      ref={dialogRef}
    >
      <div className="patent-modal__content">
        <div className="patent-modal__header">
          <h2 className="type-h3 patent-modal__title" id="patent-modal-title">{patentTitle}</h2>
          <Button aria-label="Закрыть попап" onClick={onClose} size="icon" variant="ghost">
            <CloseIcon />
          </Button>
        </div>
        <div
          aria-label="Открыть изображение патента на весь экран"
          className="patent-modal__preview"
          onClick={openImageFullscreen}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              openImageFullscreen();
            }
          }}
          role="button"
          ref={previewRef}
          style={previewStyle}
          tabIndex={0}
        />
        <Link className={cn(buttonVariants({ size: "md", variant: "primary" }), "patent-modal__operation-link")} href="/operaczii/diastaz-myshc-zhivota">
          Подробнее об операции
        </Link>
      </div>
    </dialog>
  );
}

export function PatentSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="content-card content-card--muted content-section patent-section" id="patents">
      <h2 className="content-card__heading content-card__heading--h2">Патенты</h2>
      <div className="content-card__grid patent-section__grid">
        <RecordCard
          aria-haspopup="dialog"
          className="patent-section__item"
          details={[{ tone: "secondary", value: "ФСПИС" }]}
          icon={<span aria-hidden="true" className="patent-section__icon" />}
          meta="2022"
          onClick={() => setIsModalOpen(true)}
          title={patentTitle}
        />
      </div>
      {isModalOpen ? <PatentModal onClose={() => setIsModalOpen(false)} /> : null}
    </section>
  );
}
