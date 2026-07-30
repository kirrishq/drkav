"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "./lib/cn";

export type VideoCardProps = {
  className?: string;
  location: string;
  posterAlt: string;
  posterSrc: string;
  title: string;
  videoSrc: string;
  year: string;
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

/** Preview card that opens a supplied video in an accessible modal player. */
export function VideoCard({ className, location, posterAlt, posterSrc, title, videoSrc, year }: VideoCardProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);

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
          onClick={() => setIsOpen(true)}
          type="button"
        >
          <img alt={posterAlt} className="video-card__poster" src={posterSrc} />
          <span aria-hidden="true" className="video-card__play"><PlayIcon /></span>
        </button>
        <div className="video-card__content">
          <p className="video-card__meta">{[location, year].filter(Boolean).join(", ")}</p>
          <h3 className="video-card__title">{title}</h3>
        </div>
      </article>

      {isOpen ? (
        <dialog
          aria-labelledby="video-card-dialog-title"
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
          ref={dialogRef}
        >
          <div className="video-card__dialog-content">
            <div className="video-card__dialog-header">
              <h2 className="video-card__dialog-title" id="video-card-dialog-title">{title}</h2>
              <button aria-label="Закрыть видео" className="video-card__close" onClick={() => setIsOpen(false)} type="button">
                <CloseIcon />
              </button>
            </div>
            <video autoPlay className="video-card__player" controls poster={posterSrc} src={videoSrc} />
          </div>
        </dialog>
      ) : null}
    </>
  );
}
