"use client";

import { useEffect, useRef, useState } from "react";

import { CookieSettingsButton } from "@/components/cookie-consent/cookie-consent";
import { siteContact, socialLinks } from "@/components/site-header/header-config";

const sectionLinks = [
  { href: "#ultrakor-results-title", label: "О процедуре" },
  { href: "#ultrakor-safety-title", label: "Преимущества" },
  { href: "#ultrakor-portfolio-title", label: "До/после" },
  { href: "#ultrakor-indications-title", label: "Для кого" },
  { href: "#ultrakor-model-title", label: "Процесс" },
  { href: "#ultrakor-safety-title", label: "Безопасность" },
  { href: "#ultrakor-pricing-title", label: "Стоимость" },
  { href: "#ultrakor-doctor-title", label: "О хирурге" },
  { href: "#contact", label: "Консультация" },
  { href: "#ultrakor-questions-title", label: "Отзывы" },
] as const;

const footerSocialKinds = ["youtube", "telegram", "instagram"] as const;

function UltrakorSocialIcon({ kind }: { kind: (typeof footerSocialKinds)[number] }) {
  if (kind === "youtube") {
    return <svg aria-hidden="true" viewBox="0 0 28 28"><path d="M14 4.7s8.8 0 11 .6c1.2.3 2.1 1.3 2.4 2.5.6 2.2.6 6.7.6 6.7s0 4.6-.6 6.7c-.3 1.2-1.2 2.1-2.4 2.5-2.2.6-11 .6-11 .6s-8.8 0-11-.6C1.9 23.4 1 22.4.6 21.2 0 19.1 0 14.5 0 14.5s0-4.6.6-6.7C1 6.6 1.9 5.6 3 5.3c2.2-.6 11-.6 11-.6Zm-2.8 14 7.3-4.2-7.3-4.2v8.4Z" /></svg>;
  }

  if (kind === "telegram") {
    return <svg aria-hidden="true" viewBox="0 0 28 28"><path d="M1.9 12.3C9.4 9 14.4 6.9 17 5.8c7.1-3 8.6-3.5 9.6-3.5.2 0 .7.1 1 .3.5.4.5 1.2.4 1.7-.4 4.1-2.1 14-2.9 18.5-.4 1.9-1.1 2.6-1.8 2.6-1.5.1-2.6-1-4.1-1.9l-5.8-3.9c-2.5-1.7-.9-2.6.6-4.1.4-.4 7-6.4 7.1-6.9 0-.1 0-.3-.1-.4-.2-.1-.4-.1-.5 0-.2.1-3.9 2.4-10.9 7.2-1 .7-2 1-2.8 1-1 0-2.7-.5-4-.9-1.6-.5-2.9-.8-2.8-1.7.1-.5.7-1 1.9-1.5Z" /></svg>;
  }

  return <svg aria-hidden="true" viewBox="0 0 34 33"><path fillRule="evenodd" clipRule="evenodd" d="M14 7.52c3.74 0 4.18.02 5.66.09 3.79.17 5.56 1.97 5.74 5.74.07 1.48.08 1.92.08 5.66 0 3.74-.01 4.18-.08 5.66-.18 3.76-1.94 5.57-5.74 5.74-1.48.07-1.92.08-5.66.08-3.74 0-4.18-.01-5.66-.08-3.8-.18-5.57-1.98-5.74-5.74-.07-1.48-.08-1.92-.08-5.66 0-3.74.02-4.28.08-5.77C2.78 9.48 4.55 7.68 8.34 7.6c1.48-.06 1.92-.08 5.66-.08ZM14 5c-3.8 0-4.28.02-5.77.08C3.14 5.32.32 8.14.08 13.23 0 14.72 0 15.2 0 19s.02 4.28.08 5.77c.23 5.09 3.06 7.91 8.14 8.15 1.49.06 1.97.08 5.78.08s4.28-.02 5.77-.08c5.08-.23 7.91-3.06 8.14-8.15.07-1.49.09-1.97.09-5.77s-.02-4.28-.08-5.77c-.23-5.08-3.06-7.91-8.15-8.14C18.28 5.02 17.8 5 14 5Zm0 6.81a7.19 7.19 0 1 0 0 14.38 7.19 7.19 0 0 0 0-14.38Zm0 11.86A4.67 4.67 0 1 1 14 14.33a4.67 4.67 0 0 1 0 9.34Zm7.47-13.83a1.68 1.68 0 1 0 0 3.36 1.68 1.68 0 0 0 0-3.36Z" /><path d="M29.75 2.76 30.83 4.24l-.78.57-1.08-1.48-1.08 1.48-.78-.57 1.08-1.48-1.75-.56.31-.94 1.74.57V0h.98v1.83l1.74-.57.31.94.31.94-1.75.56Z" /></svg>;
}

export function UltrakorFooter() {
  const footerRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const currentYear = new Date().getFullYear();
  const footerSocialLinks = footerSocialKinds.flatMap((kind) => {
    const link = socialLinks.find((item) => item.kind === kind);
    return link ? [{ ...link, kind }] : [];
  });

  useEffect(() => {
    if (!footerRef.current) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.15 });
    observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <footer className={`ultrakor-footer${visible ? " is-visible" : ""}`} ref={footerRef}>
      <div className="ultrakor-footer__inner ultrakor__inner">
        <div aria-hidden="true" className="ultrakor-footer__rule" />

        <nav aria-label="Навигация в подвале" className="ultrakor-footer__navigation">
          {sectionLinks.map((link) => (
            <a href={`/ultrakor${link.href}`} key={link.label}>{link.label}</a>
          ))}
        </nav>

        <div className="ultrakor-footer__socials">
          {footerSocialLinks.map((link) => (
            <a aria-label={link.label} href={link.href} key={link.href} rel="noreferrer" target="_blank">
              <UltrakorSocialIcon kind={link.kind} />
            </a>
          ))}
        </div>

        <div className="ultrakor-footer__secondary">
          <a href="#certificates">Сертификаты и дипломы</a>
        </div>

        <div aria-hidden="true" className="ultrakor-footer__rule ultrakor-footer__rule--lower" />

        <div className="ultrakor-footer__legal">
          <p>
            ИП Коробов А.В. · ИНН 583201220045 · ОГРНИП 321645100059511 · {siteContact.clinicAddress}
          </p>
          <p>
            {siteContact.emailLabel}
          </p>
          <p>
            © Все материалы данного сайта являются объектами авторского права «ИП КОРОБОВ А.В.» © 2009–{currentYear}
          </p>
        </div>

        <nav aria-label="Юридическая информация" className="ultrakor-footer__legal-links">
          <a href="/oferta" rel="noreferrer" target="_blank">Публичная оферта</a>
          <a href="/policy" rel="noreferrer" target="_blank">Политика обработки персональных данных</a>
          <a href="/cookies" rel="noreferrer" target="_blank">Согласие на обработку cookies</a>
          <a href="/consent" rel="noreferrer" target="_blank">Согласие на обработку персональных данных</a>
          <a href="/consent-marketing" rel="noreferrer" target="_blank">Согласие на рекламную рассылку</a>
          <CookieSettingsButton />
        </nav>

        <div className="ultrakor-footer__seal" aria-label="Ультракор от доктора Коробова">
          <svg aria-hidden="true" className="ultrakor-footer__seal-ring" viewBox="0 0 568 567">
            <defs>
              <path d="M284 24a259.5 259.5 0 1 1 0 519a259.5 259.5 0 1 1 0-519" id="ultrakor-footer-seal-path" />
            </defs>
            <circle cx="284" cy="283.5" fill="none" r="259.5" />
            <text>
              <textPath href="#ultrakor-footer-seal-path" startOffset="50%">
                МУЖСКАЯ СИЛА И СТАТУС · АРХИТЕКТУРА СИЛЫ · АТЛЕТИЗАЦИЯ 2.0 · МУЖСКАЯ СИЛА И СТАТУС · АРХИТЕКТУРА СИЛЫ · АТЛЕТИЗАЦИЯ 2.0 ·
              </textPath>
            </text>
          </svg>
          <p className="ultrakor-footer__seal-title">ULTRACORE</p>
          <p className="ultrakor-footer__seal-byline">BY DRKAV</p>
          <p className="ultrakor-footer__seal-caption">*УЛЬТРАКОР ОТ ДОКТОРА КОРОБОВА</p>
        </div>
      </div>
    </footer>
  );
}
