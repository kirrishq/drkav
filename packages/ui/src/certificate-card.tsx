import type { CSSProperties } from "react";

import { cn } from "./lib/cn";

export type CertificateCardProps = {
  className?: string;
  imageAlt: string;
  imageSrc: string;
  label: string;
  onOpen?: () => void;
  year?: string;
};

/** Card for certificates, diplomas, and other image-based credentials. */
export function CertificateCard({ className, imageAlt, imageSrc, label, onOpen, year }: CertificateCardProps) {
  // The image address is content data, so it remains the only dynamic inline style.
  const previewStyle: CSSProperties = { backgroundImage: `url("${imageSrc}")` };
  const preview = (
    <div
      aria-label={imageAlt}
      className="certificate-card__preview"
      role="img"
      style={previewStyle}
    />
  );

  return (
    <article className={cn("certificate-card", className)}>
      {onOpen ? (
        <button aria-haspopup="dialog" aria-label={`Открыть: ${imageAlt}`} className="certificate-card__preview-button" onClick={onOpen} type="button">
          {preview}
        </button>
      ) : preview}
      <div className="certificate-card__content">
        <h3 className="card-title certificate-card__title record-card__title">{label}</h3>
        {year ? <p className="certificate-card__year record-card__meta">{year}</p> : null}
      </div>
    </article>
  );
}
