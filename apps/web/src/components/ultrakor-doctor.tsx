"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

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

function SocialIcon({ type }: { type: (typeof socialLinks)[number]["icon"] }) {
  if (type === "youtube") return <svg aria-hidden="true" viewBox="0 0 28 28"><path d="M14 4.7s8.8 0 11 0.6c1.2.3 2.1 1.3 2.4 2.5.6 2.2.6 6.7.6 6.7s0 4.6-.6 6.7c-.3 1.2-1.2 2.1-2.4 2.5-2.2.6-11 .6-11 .6s-8.8 0-11-.6C1.9 23.4 1 22.4.6 21.2 0 19.1 0 14.5 0 14.5s0-4.6.6-6.7C1 6.6 1.9 5.6 3 5.3c2.2-.6 11-.6 11-.6Zm-2.8 14 7.3-4.2-7.3-4.2v8.4Z" /></svg>;
  if (type === "telegram") return <svg aria-hidden="true" viewBox="0 0 28 28"><path d="M1.9 12.3C9.4 9 14.4 6.9 17 5.8c7.1-3 8.6-3.5 9.6-3.5.2 0 .7.1 1 .3.5.4.5 1.2.4 1.7-.4 4.1-2.1 14-2.9 18.5-.4 1.9-1.1 2.6-1.8 2.6-1.5.1-2.6-1-4.1-1.9l-5.8-3.9c-2.5-1.7-.9-2.6.6-4.1.4-.4 7-6.4 7.1-6.9 0-.1 0-.3-.1-.4-.2-.1-.4-.1-.5 0-.2.1-3.9 2.4-10.9 7.2-1 .7-2 1-2.8 1-1 0-2.7-.5-4-.9-1.6-.5-2.9-.8-2.8-1.7.1-.5.7-1 1.9-1.5Z" /></svg>;
  return <svg aria-hidden="true" viewBox="0 0 34 33"><path fillRule="evenodd" clipRule="evenodd" d="M14 7.52c3.74 0 4.18.02 5.66.09 3.79.17 5.56 1.97 5.74 5.74.07 1.48.08 1.92.08 5.66 0 3.74-.01 4.18-.08 5.66-.18 3.76-1.94 5.57-5.74 5.74-1.48.07-1.92.08-5.66.08-3.74 0-4.18-.01-5.66-.08-3.8-.18-5.57-1.98-5.74-5.74-.07-1.48-.08-1.92-.08-5.66 0-3.74.02-4.28.08-5.77C2.78 9.48 4.55 7.68 8.34 7.6c1.48-.06 1.92-.08 5.66-.08ZM14 5c-3.8 0-4.28.02-5.77.08C3.14 5.32.32 8.14.08 13.23 0 14.72 0 15.2 0 19s.02 4.28.08 5.77c.23 5.09 3.06 7.91 8.14 8.15 1.49.06 1.97.08 5.78.08s4.28-.02 5.77-.08c5.08-.23 7.91-3.06 8.14-8.15.07-1.49.09-1.97.09-5.77s-.02-4.28-.08-5.77c-.23-5.08-3.06-7.91-8.15-8.14C18.28 5.02 17.8 5 14 5Zm0 6.81a7.19 7.19 0 1 0 0 14.38 7.19 7.19 0 0 0 0-14.38Zm0 11.86A4.67 4.67 0 1 1 14 14.33a4.67 4.67 0 0 1 0 9.34Zm7.47-13.83a1.68 1.68 0 1 0 0 3.36 1.68 1.68 0 0 0 0-3.36Z" /><path d="M29.75 2.76 30.83 4.24l-.78.57-1.08-1.48-1.08 1.48-.78-.57 1.08-1.48-1.75-.56.31-.94 1.74.57V0h.98v1.83l1.74-.57.31.94-1.75.56Z" /></svg>;
}

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
    <section className="ultrakor-doctor" aria-labelledby="ultrakor-doctor-title">
      <div className="ultrakor-doctor__inner">
        <h2 className="ultrakor__heading" id="ultrakor-doctor-title">О докторе Коробове</h2>

        <div className="ultrakor-doctor__profile">
          <div className="ultrakor-doctor__portrait">
            <Image src="/images/ultrakor/doctor.jpg.webp" alt="Артём Коробов" fill sizes="(max-width: 700px) 100vw, 32vw" />
          </div>
          <div className="ultrakor-doctor__bio">
            <span className="ultrakor-doctor__rule" aria-hidden="true" />
            <p><strong>Артём Коробов — КМН, пластический хирург,</strong><br />разработчик методики УЛЬТРАКОР. Специализируется<br className="ultrakor-doctor__desktop-break" /> на липоскульптуре и анатомическом моделировании тела.</p>
            <p><strong>Более 16 лет работы, сотни операций,</strong> системный<br className="ultrakor-doctor__desktop-break" /> подход, инженерное мышление.</p>
            <a className="ultrakor-doctor__more" href="#certificates">Подробнее</a>
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
              {socialLinks.map((social) => <a href={social.href} key={social.href} target="_blank" rel="noreferrer" aria-label={social.label}><SocialIcon type={social.icon} /></a>)}
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
