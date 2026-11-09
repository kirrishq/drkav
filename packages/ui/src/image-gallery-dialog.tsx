"use client";

import { useEffect, useRef } from "react";

export type ImageGalleryItem = { src: string; alt: string; label: string };
export type ImageGalleryDialogProps = {
  items: readonly ImageGalleryItem[];
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
};

/** Полноэкранный просмотр фото: стрелки, клавиатура и возврат фокуса. */
export function ImageGalleryDialog({ items, index, onIndexChange, onClose }: ImageGalleryDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const open = index !== null;
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => { dialog.close(); document.body.style.overflow = previousOverflow; };
  }, [open]);
  if (index === null || !items[index]) return null;
  const item = items[index];
  const move = (offset: number) => onIndexChange((index + offset + items.length) % items.length);
  return <dialog ref={dialogRef} className="image-gallery-dialog" aria-label="Просмотр фотографий" onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === event.currentTarget) onClose(); }} onKeyDown={event => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); move(event.key === "ArrowLeft" ? -1 : 1); }
  }}>
    <button className="image-gallery-dialog__close" type="button" aria-label="Закрыть фотографии" onClick={onClose}>×</button>
    {/* A plain image keeps the shared UI independent of the application image loader. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img className="image-gallery-dialog__image" src={item.src} alt={item.alt} />
    {items.length > 1 ? <>
      <button className="image-gallery-dialog__previous" type="button" aria-label="Предыдущее фото" onClick={() => move(-1)}>‹</button>
      <button className="image-gallery-dialog__next" type="button" aria-label="Следующее фото" onClick={() => move(1)}>›</button>
    </> : null}
    <p className="image-gallery-dialog__caption" aria-live="polite">{item.label} · {index + 1} / {items.length}</p>
  </dialog>;
}
