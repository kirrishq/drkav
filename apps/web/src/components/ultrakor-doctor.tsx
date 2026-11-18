"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { UltrakorSocialIcon } from "@/components/ultrakor-social-icon";

const certificates = [
  "certificate-01.webp",
  "certificate-02.webp",
  "certificate-03.webp",
  "certificate-04.webp",
  "certificate-05.webp",
  "certificate-06.webp",
];

const socialLinks = [
  { href: "https://www.youtube.com/channel/UCyNisHCb9vYS6qLWlgK6lwg", label: "YouTube", icon: "youtube" },
  { href: "https://t.me/drkav_official", label: "Telegram", icon: "telegram" },
  { href: "https://www.instagram.com/dr.kav/", label: "Instagram*", icon: "instagram" },
] as const;

export function UltrakorDoctor() {
  const [selectedCertificateIndex, setSelectedCertificateIndex] = useState<number | null>(null);
  const selectedCertificate = selectedCertificateIndex === null ? null : certificates[selectedCertificateIndex];

  useEffect(() => {
    if (selectedCertificateIndex === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedCertificateIndex(null);
      if (event.key === "ArrowLeft") setSelectedCertificateIndex((selectedCertificateIndex! - 1 + certificates.length) % certificates.length);
      if (event.key === "ArrowRight") setSelectedCertificateIndex((selectedCertificateIndex! + 1) % certificates.length);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedCertificateIndex]);

  return (
    <section className="ultrakor__section ultrakor-doctor" aria-labelledby="ultrakor-doctor-title">
      <div className="ultrakor__inner">
        <h2 className="ultrakor__heading" id="ultrakor-doctor-title">О докторе Коробове</h2>

        <div className="ultrakor-doctor__profile">
          <div className="ultrakor-doctor__portrait">
            <Image src="/images/ultrakor/doctor.jpg.webp" alt="Артём Коробов" fill sizes="(max-width: 700px) 100vw, 32vw" />
          </div>
          <div className="ultrakor-doctor__bio">
            <span className="ultrakor-doctor__rule" aria-hidden="true" />
            <p><strong>Артём Коробов — КМН, пластический хирург,</strong><br />разработчик методики УЛЬТРАКОР. Специализируется<br className="ultrakor-doctor__desktop-break" /> на липоскульптуре и анатомическом моделировании тела.</p>
            <p><strong>Более 16 лет работы, сотни операций,</strong> системный<br className="ultrakor-doctor__desktop-break" /> подход, инженерное мышление.</p>
            <a className="ultrakor-doctor__more" href="/ultrakor/o-doktore">Подробнее о докторе</a>
            <a className="ultrakor-doctor__rating" href="https://prodoctorov.ru/moskva/vrach/158087-korobov/" target="_blank" rel="noreferrer" aria-label="Открыть профиль Артёма Коробова на ПроДокторов">
              <div className="ultrakor-doctor__rating-copy">
                <Image className="ultrakor-doctor__rating-logo" src="/images/branding/prodoctorov-widget.svg" alt="ПроДокторов" width={112} height={17} />
                <strong>Коробов Артем Владимирович</strong>
                <span className="ultrakor-doctor__rating-stars" aria-label="5 из 5">★★★★★</span>
                <span>43 отзыва</span>
              </div>
              <Image className="ultrakor-doctor__rating-speaker" src="/images/ultrakor/megaphone-speaker.png" alt="" width={100} height={120} />
            </a>
            <nav className="ultrakor-doctor__socials" aria-label="Социальные сети">
              {socialLinks.map((social) => <a href={social.href} key={social.href} target="_blank" rel="noreferrer" aria-label={social.label}><UltrakorSocialIcon kind={social.icon} /></a>)}
            </nav>
          </div>
        </div>

        <h3 className="ultrakor__heading" id="certificates">Сертификаты и дипломы</h3>
        <div className="ultrakor-doctor__certificates" role="list">
          <div className="ultrakor-doctor__certificates-track">
            {[...certificates, ...certificates].map((certificate, index) => (
              <figure className="ultrakor-doctor__certificate" key={`${certificate}-${index}`} role="listitem">
                <button className="ultrakor-doctor__certificate-button" type="button" onClick={() => setSelectedCertificateIndex(index % certificates.length)} aria-label="Открыть сертификат">
                <Image src={`/images/certificates/${certificate}`} alt={index < certificates.length ? `Сертификат или диплом ${(index % certificates.length) + 1}` : ""} fill sizes="(max-width: 700px) 72vw, 19vw" />
                </button>
              </figure>
            ))}
          </div>
        </div>
      </div>
      {selectedCertificate && (
        <div className="ultrakor-doctor__lightbox" role="dialog" aria-modal="true" aria-label="Просмотр сертификата" onClick={() => setSelectedCertificateIndex(null)}>
          <button className="ultrakor-doctor__lightbox-close" type="button" onClick={() => setSelectedCertificateIndex(null)} aria-label="Закрыть">×</button>
          <div className="ultrakor-doctor__lightbox-image" onClick={(event) => event.stopPropagation()}>
            <Image src={`/images/certificates/${selectedCertificate}`} alt="Сертификат или диплом" fill sizes="100vw" />
          </div>
          <button className="ultrakor-doctor__lightbox-nav ultrakor-doctor__lightbox-nav--previous" type="button" onClick={(event) => { event.stopPropagation(); setSelectedCertificateIndex((selectedCertificateIndex! - 1 + certificates.length) % certificates.length); }} aria-label="Предыдущий сертификат">‹</button>
          <button className="ultrakor-doctor__lightbox-nav ultrakor-doctor__lightbox-nav--next" type="button" onClick={(event) => { event.stopPropagation(); setSelectedCertificateIndex((selectedCertificateIndex! + 1) % certificates.length); }} aria-label="Следующий сертификат">›</button>
        </div>
      )}
    </section>
  );
}
