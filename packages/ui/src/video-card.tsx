"use client";

import { useEffect, useId, useRef, useState } from "react";

import { cn } from "./lib/cn";

export type VideoCardItem = {
  location: string;
  posterAlt: string;
  posterSrc: string;
  title: string;
  videoSrc: string;
  year: string;
};

export type VideoCardProps = VideoCardItem & {
  className?: string;
  dialogItems?: readonly VideoCardItem[];
  showDetails?: boolean;
};

function PlayIcon() {
  return (
    <svg aria-hidden="true" className="video-card__play-icon" fill="currentColor" viewBox="0 0 24 24">
      <path d="m9 6 9 6-9 6V6Z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" className="video-card__close-icon" fill="none" viewBox="0 0 24 24">
      <path d="m7 7 10 10M17 7 7 17" stroke="currentColor" strokeLinecap="round" strokeWidth="1.75" />
    </svg>
  );
}

function DialogArrowIcon({ direction }: { direction: "next" | "previous" }) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d={direction === "next" ? "m9 5 7 7-7 7" : "m15 5-7 7 7 7"}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
      />
    </svg>
  );
}

/** Preview card that opens a supplied video in an accessible modal player. */
export function VideoCard({
  className,
  location,
  posterAlt,
  posterSrc,
  dialogItems,
  showDetails = true,
  title,
  videoSrc,
  year,
}: VideoCardProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const currentItem: VideoCardItem = { location, posterAlt, posterSrc, title, videoSrc, year };
  const navigationItems = dialogItems?.length ? dialogItems : [currentItem];
  const selectedItem = navigationItems[selectedIndex] ?? currentItem;

  const openDialog = () => {
    const itemIndex = navigationItems.findIndex((item) => item.videoSrc === videoSrc);
    setSelectedIndex(itemIndex >= 0 ? itemIndex : 0);
    setIsOpen(true);
  };

  const selectRelativeVideo = (direction: "next" | "previous") => {
    if (navigationItems.length < 2) {
      return;
    }

    const offset = direction === "next" ? 1 : -1;
    setSelectedIndex((current) => (current + offset + navigationItems.length) % navigationItems.length);
  };

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!isOpen || !dialog) {
      return;
    }

    dialog.showModal();

    return () => {
      if (dialog.open) {
        dialog.close();
      }
    };
  }, [isOpen]);

  return (
    <>
      <article className={cn("video-card", className)}>
        <button
          aria-haspopup="dialog"
          aria-label={`Смотреть видео: ${title}`}
          className="video-card__preview"
          onClick={openDialog}
          type="button"
        >
          <img alt={posterAlt} className="video-card__poster" src={posterSrc} />
          <span aria-hidden="true" className="video-card__play"><PlayIcon /></span>
        </button>
        {showDetails ? (
          <div className="video-card__content">
            <p className="video-card__meta">{[location, year].filter(Boolean).join(", ")}</p>
            <h3 className="card-title video-card__title">{title}</h3>
          </div>
        ) : null}
      </article>

      {isOpen ? (
        <dialog
          aria-labelledby={`${titleId}-title`}
          className="video-card__dialog"
          onCancel={(event) => {
            event.preventDefault();
            setIsOpen(false);
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setIsOpen(false);
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              selectRelativeVideo("previous");
            }

            if (event.key === "ArrowRight") {
              event.preventDefault();
              selectRelativeVideo("next");
            }
          }}
          ref={dialogRef}
        >
          <div className="video-card__dialog-content">
            <div className="video-card__dialog-header">
              <h2 className="type-h3 video-card__dialog-title" id={`${titleId}-title`}>{selectedItem.title}</h2>
              <button aria-label="Закрыть видео" className="video-card__close" onClick={() => setIsOpen(false)} type="button">
                <CloseIcon />
              </button>
            </div>
            {navigationItems.length > 1 ? (
              <>
                <button aria-label="Предыдущее видео" className="video-card__navigation video-card__navigation--previous" onClick={() => selectRelativeVideo("previous")} type="button">
                  <DialogArrowIcon direction="previous" />
                </button>
                <button aria-label="Следующее видео" className="video-card__navigation video-card__navigation--next" onClick={() => selectRelativeVideo("next")} type="button">
                  <DialogArrowIcon direction="next" />
                </button>
              </>
            ) : null}
            <video autoPlay className="video-card__player" controls key={selectedItem.videoSrc} poster={selectedItem.posterSrc} src={selectedItem.videoSrc} />
          </div>
        </dialog>
      ) : null}
    </>
  );
}
