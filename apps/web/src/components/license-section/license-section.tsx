"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const licenses = [
  ["asbeauty-license-01.webp", "Выписка из реестра лицензий ASBeauty, страница 1"],
  ["asbeauty-license-02.webp", "Выписка из реестра лицензий ASBeauty, страница 2"],
  ["asbeauty-license-03.webp", "Санитарно-эпидемиологическое заключение ASBeauty"],
  ["asbeauty-license-04.webp", "Приложение к санитарно-эпидемиологическому заключению ASBeauty"],
] as const;

export function LicenseSection() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (selected !== null && dialog && !dialog.open) dialog.showModal();
    if (selected === null && dialog?.open) dialog.close();
  }, [selected]);

  const selectedLicense = selected === null ? null : licenses[selected];

  return (
    <section className="content-card content-card--muted content-section license-section" id="clinic-licenses">
      <h2 className="content-card__heading content-card__heading--h2">Лицензии клиники ASBeauty</h2>
      <div className="license-section__grid">
        {licenses.map(([src, alt], index) => (
          <button aria-label={`Открыть: ${alt}`} className="license-section__item" key={src} onClick={() => setSelected(index)} type="button">
            <Image alt={alt} height={1600} src={`/images/licenses/${src}`} width={1200} />
          </button>
        ))}
      </div>
      {selectedLicense ? (
        <dialog
          aria-label={selectedLicense[1]}
          className="license-section__dialog"
          onCancel={(event) => { event.preventDefault(); setSelected(null); }}
          onClick={(event) => { if (event.target === event.currentTarget) setSelected(null); }}
          ref={dialogRef}
        >
          <button aria-label="Закрыть документ" className="license-section__close" onClick={() => setSelected(null)} type="button">×</button>
          <Image alt={selectedLicense[1]} className="license-section__dialog-image" height={1600} src={`/images/licenses/${selectedLicense[0]}`} width={1200} />
        </dialog>
      ) : null}
    </section>
  );
}
