"use client";

import { Button, CertificateCard, cn } from "@drkav/ui";
import { useState } from "react";

const certificates = Array.from({ length: 9 }, (_, index) => ({
  imageAlt: `Сертификат ${index + 1}`,
  imageSrc: `/images/certificates/certificate-${String(index + 1).padStart(2, "0")}.jpg`,
  label: "Сертификат",
  year: "2022",
}));

export function CertificateSection() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="content-card content-card--muted content-section certificate-section" id="certificates">
      <h2 className="content-card__heading content-card__heading--h2">Сертификаты и дипломы</h2>
      <div className={cn("content-card__grid", "certificate-section__grid", expanded && "certificate-section__grid--expanded")}>
        {certificates.map((certificate) => (
          <CertificateCard className="certificate-section__item" key={certificate.imageSrc} {...certificate} />
        ))}
      </div>
      <div className="certificate-section__action">
        <Button onClick={() => setExpanded((isExpanded) => !isExpanded)} type="button" variant="outline">
          {expanded ? "Скрыть" : "Показать еще"}
        </Button>
      </div>
    </section>
  );
}
