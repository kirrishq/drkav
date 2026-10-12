"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const licenses = [
  ["license-01.jpg", "Выписка из реестра лицензий ASBeauty, медицинская деятельность, страница 1"],
  ["license-02.jpg", "Выписка из реестра лицензий ASBeauty, медицинская деятельность, страница 2"],
  ["license-03.jpg", "Выписка из реестра лицензий ASBeauty, медицинская деятельность, страница 3"],
  ["license-04.jpg", "Выписка из реестра лицензий ASBeauty, обращение с наркотическими средствами, страница 1"],
  ["license-05.jpg", "Выписка из реестра лицензий ASBeauty, обращение с наркотическими средствами, страница 2"],
] as const;

function CloseIcon() {
  return <svg aria-hidden="true" fill="none" viewBox="0 0 24 24"><path d="m7 7 10 10M17 7 7 17" stroke="currentColor" strokeLinecap="round" strokeWidth="1.75" /></svg>;
}

function ArrowIcon({ direction }: { direction: "next" | "previous" }) {
  return <svg aria-hidden="true" fill="none" viewBox="0 0 24 24"><path d={direction === "next" ? "m9 5 7 7-7 7" : "m15 5-7 7 7 7"} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" /></svg>;
}

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
          className="certificate-section__dialog"
          onCancel={(event) => { event.preventDefault(); setSelected(null); }}
          onClick={(event) => { if (event.target === event.currentTarget) setSelected(null); }}
          ref={dialogRef}
        >
          <div className="certificate-section__dialog-content">
            <div className="certificate-section__dialog-header">
              <p className="certificate-section__dialog-label">Лицензия клиники</p>
              <button aria-label="Закрыть" className="certificate-section__dialog-close" onClick={() => setSelected(null)} type="button"><CloseIcon /></button>
            </div>
            <button aria-label="Предыдущий документ" className="certificate-section__dialog-navigation certificate-section__dialog-navigation--previous" onClick={() => setSelected((current) => current === null ? null : (current - 1 + licenses.length) % licenses.length)} type="button"><ArrowIcon direction="previous" /></button>
            <button aria-label="Следующий документ" className="certificate-section__dialog-navigation certificate-section__dialog-navigation--next" onClick={() => setSelected((current) => current === null ? null : (current + 1) % licenses.length)} type="button"><ArrowIcon direction="next" /></button>
            <Image alt={selectedLicense[1]} className="certificate-section__dialog-image" height={1600} src={`/images/licenses/${selectedLicense[0]}`} width={1200} />
          </div>
        </dialog>
      ) : null}
    </section>
  );
}
