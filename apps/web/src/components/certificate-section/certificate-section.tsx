"use client";

import { Button, CertificateCard, cn } from "@drkav/ui";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const certificates = [
  { imageAlt: "Сертификат о повышении квалификации 1", imageSrc: "/images/certificates/certificate-01.webp", label: "Сертификат" },
  { imageAlt: "Сертификат о повышении квалификации 2", imageSrc: "/images/certificates/certificate-02.webp", label: "Сертификат" },
  { imageAlt: "Сертификат о повышении квалификации 3", imageSrc: "/images/certificates/certificate-03.webp", label: "Сертификат" },
  { imageAlt: "Сертификат о повышении квалификации 4", imageSrc: "/images/certificates/certificate-04.webp", label: "Сертификат" },
  { imageAlt: "Сертификат о повышении квалификации 5", imageSrc: "/images/certificates/certificate-05.webp", label: "Сертификат" },
  { imageAlt: "Сертификат о повышении квалификации 6", imageSrc: "/images/certificates/certificate-06.webp", label: "Сертификат" },
  { imageAlt: "Свидетельство", imageSrc: "/images/certificates/certificate-07.jpg", label: "Свидетельство" },
  { imageAlt: "Certificate of Attendance", imageSrc: "/images/certificates/certificate-08.webp", label: "Сертификат" },
  { imageAlt: "Свидетельство 2", imageSrc: "/images/certificates/certificate-09.jpg", label: "Свидетельство" },
  { imageAlt: "Сертификат по эстетической хирургии груди и тела", imageSrc: "/images/certificates/certificate-10.webp", label: "Сертификат" },
  { imageAlt: "Сертификат по ринопластике и контурной пластике лица", imageSrc: "/images/certificates/certificate-11.webp", label: "Сертификат" },
  { imageAlt: "Сертификат по современной эстетической хирургии", imageSrc: "/images/certificates/certificate-12.webp", label: "Сертификат" },
] as const;

function CloseIcon() {
  return <svg aria-hidden="true" fill="none" viewBox="0 0 24 24"><path d="m7 7 10 10M17 7 7 17" stroke="currentColor" strokeLinecap="round" strokeWidth="1.75" /></svg>;
}

function ArrowIcon({ direction }: { direction: "next" | "previous" }) {
  return <svg aria-hidden="true" fill="none" viewBox="0 0 24 24"><path d={direction === "next" ? "m9 5 7 7-7 7" : "m15 5-7 7 7 7"} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" /></svg>;
}

export function CertificateSection() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selectedCertificate = selectedIndex === null ? null : certificates[selectedIndex];

  useEffect(() => {
    const dialog = dialogRef.current;

    if (selectedCertificate && dialog && !dialog.open) {
      dialog.showModal();
    }

    if (!selectedCertificate && dialog?.open) {
      dialog.close();
    }

    return () => {
      if (dialog?.open && !selectedCertificate) {
        dialog.close();
      }
    };
  }, [selectedCertificate]);

  useEffect(() => {
    if (selectedIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setSelectedIndex((current) => current === null ? null : (current - 1 + certificates.length) % certificates.length);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        setSelectedIndex((current) => current === null ? null : (current + 1) % certificates.length);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedIndex]);

  return (
    <>
      <section className="content-card content-card--muted content-section certificate-section" id="certificates">
        <h2 className="content-card__heading content-card__heading--h2">Сертификаты и дипломы</h2>
        <div className={cn("content-card__grid", "certificate-section__grid", expanded && "certificate-section__grid--expanded")}>
          {certificates.map((certificate, index) => (
            <CertificateCard className="certificate-section__item" key={certificate.imageSrc} onOpen={() => setSelectedIndex(index)} {...certificate} />
          ))}
        </div>
        <div className="certificate-section__action">
          <Button onClick={() => setExpanded((isExpanded) => !isExpanded)} type="button" variant="outline">
            {expanded ? "Скрыть" : "Показать еще"}
          </Button>
        </div>
      </section>

      {selectedCertificate ? (
        <dialog
          aria-label={selectedCertificate.imageAlt}
          className="certificate-section__dialog"
          onCancel={(event) => {
            event.preventDefault();
            setSelectedIndex(null);
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget) setSelectedIndex(null);
          }}
          ref={dialogRef}
        >
          <div className="certificate-section__dialog-content">
            <div className="certificate-section__dialog-header">
              <p className="certificate-section__dialog-label">{selectedCertificate.label}</p>
              <button aria-label="Закрыть" className="certificate-section__dialog-close" onClick={() => setSelectedIndex(null)} type="button"><CloseIcon /></button>
            </div>
            <button aria-label="Предыдущий документ" className="certificate-section__dialog-navigation certificate-section__dialog-navigation--previous" onClick={() => setSelectedIndex((current) => current === null ? null : (current - 1 + certificates.length) % certificates.length)} type="button"><ArrowIcon direction="previous" /></button>
            <button aria-label="Следующий документ" className="certificate-section__dialog-navigation certificate-section__dialog-navigation--next" onClick={() => setSelectedIndex((current) => current === null ? null : (current + 1) % certificates.length)} type="button"><ArrowIcon direction="next" /></button>
            <Image alt={selectedCertificate.imageAlt} className="certificate-section__dialog-image" height={905} src={selectedCertificate.imageSrc} width={1280} />
          </div>
        </dialog>
      ) : null}
    </>
  );
}
