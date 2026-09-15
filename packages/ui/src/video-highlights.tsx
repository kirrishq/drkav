"use client";

import { useEffect, useId, useRef, useState } from "react";

import { buttonVariants } from "./button";
import { cn } from "./lib/cn";

export type VideoHighlight = {
  contentPosition?: "before" | "after";
  dialogVideoSrc?: string;
  description: string;
  posterAlt: string;
  posterSrc: string;
  title: string;
  videoSrc: string;
  webmSrc?: string;
};

export type VideoHighlightsProps = {
  ariaLabel?: string;
  className?: string;
  ctaHref?: string;
  ctaLabel?: string;
  items: readonly VideoHighlight[];
};

function PlayIcon() {
  return (
    <svg aria-hidden="true" className="video-highlights__play-icon" fill="currentColor" viewBox="0 0 24 24">
      <path d="m9 6 9 6-9 6V6Z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" className="video-highlights__close-icon" fill="none" viewBox="0 0 24 24">
      <path d="m7 7 10 10M17 7 7 17" stroke="currentColor" strokeLinecap="round" strokeWidth="1.75" />
    </svg>
  );
}

function selectPreviewSource(video: HTMLVideoElement, item: VideoHighlight) {
  if (item.webmSrc && video.canPlayType("video/webm")) {
    return item.webmSrc;
  }

  return item.videoSrc;
}

function VideoHighlightItem({ item }: { item: VideoHighlight }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const dialogTitleId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  useEffect(() => {
    const video = previewVideoRef.current;

    if (!video) {
      return;
    }

    const loadPreview = () => {
      setPreviewSrc(selectPreviewSource(video, item));
    };

    if (!("IntersectionObserver" in window)) {
      loadPreview();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) {
          return;
        }

        loadPreview();
        observer.disconnect();
      },
      { threshold: 0.01 },
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, [item, item.videoSrc, item.webmSrc]);

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

  const content = (
    <div className="video-highlights__content">
      <h3 className="type-h4 video-highlights__title">{item.title}</h3>
      <p className="type-text-sm video-highlights__description">{item.description}</p>
    </div>
  );

  const media = (
    <button
      aria-haspopup="dialog"
      aria-label={`Смотреть видео: ${item.title}`}
      className="focus-ring video-highlights__media-button"
      onClick={() => setIsOpen(true)}
      type="button"
    >
      <div className="video-highlights__media">
        <video
          aria-hidden="true"
          autoPlay={previewSrc !== null}
          loop
          muted
          playsInline
          poster={item.posterSrc}
          preload={previewSrc !== null ? "auto" : "none"}
          ref={previewVideoRef}
          src={previewSrc ?? undefined}
        >
        </video>
        <span aria-hidden="true" className="video-highlights__play"><PlayIcon /></span>
      </div>
    </button>
  );

  return (
    <>
      <article className={cn("video-highlights__item", `video-highlights__item--content-${item.contentPosition ?? "after"}`)}>
        {item.contentPosition === "before" ? content : media}
        {item.contentPosition === "before" ? media : content}
      </article>
      {isOpen ? (
        <dialog
          aria-labelledby={`${dialogTitleId}-title`}
          className="video-highlights__dialog"
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
          <div className="video-highlights__dialog-content">
            <div className="video-highlights__dialog-header">
              <h2 className="type-h3 video-highlights__dialog-title" id={`${dialogTitleId}-title`}>{item.title}</h2>
              <button aria-label="Закрыть видео" className="video-highlights__close" onClick={() => setIsOpen(false)} type="button">
                <CloseIcon />
              </button>
            </div>
            <video aria-label={item.posterAlt} autoPlay className="video-highlights__player" controls poster={item.posterSrc}>
              <source src={item.dialogVideoSrc ?? item.videoSrc} type="video/mp4" />
            </video>
          </div>
        </dialog>
      ) : null}
    </>
  );
}

/** Two-column video highlight block with looping previews and a shared CTA. */
export function VideoHighlights({ ariaLabel = "Видео о докторе", className, ctaHref, ctaLabel = "Посмотреть все видео", items }: VideoHighlightsProps) {
  return (
    <section aria-label={ariaLabel} className={cn("video-highlights", className)}>
      <div className="video-highlights__grid">
        {items.map((item) => (
          <VideoHighlightItem item={item} key={item.videoSrc} />
        ))}
      </div>
      {ctaHref ? <a className={buttonVariants({ size: "sm", variant: "outline" })} href={ctaHref}>{ctaLabel}</a> : null}
    </section>
  );
}
