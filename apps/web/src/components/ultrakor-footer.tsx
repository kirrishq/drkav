"use client";

import { useEffect, useRef, useState } from "react";

import { CookieSettingsButton } from "@/components/cookie-consent/cookie-consent";
import { siteContact, socialLinks } from "@/components/site-header/header-config";
import { UltrakorSocialIcon } from "@/components/ultrakor-social-icon";

const sectionLinks = [
  { href: "#ultrakor-results-title", label: "О процедуре" },
  { href: "#ultrakor-safety-title", label: "Преимущества" },
  { href: "#ultrakor-portfolio-title", label: "До/после" },
  { href: "#ultrakor-indications-title", label: "Для кого" },
  { href: "#ultrakor-model-title", label: "Процесс" },
  { href: "#ultrakor-safety-title", label: "Безопасность" },
  { href: "#ultrakor-pricing-title", label: "Стоимость" },
  { href: "/ultrakor/o-doktore", label: "О докторе" },
  { href: "#contact", label: "Консультация" },
  { href: "#ultrakor-questions-title", label: "Отзывы" },
] as const;

const footerSocialKinds = ["youtube", "telegram", "instagram"] as const;

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
            <a href={link.href.startsWith("#") ? `/ultrakor${link.href}` : link.href} key={link.label}>{link.label}</a>
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
          <a href="/ultrakor#certificates">Сертификаты и дипломы</a>
          <a href="/operaczii/muzhskaya-plastika">Все направления мужской пластики на DrKAV</a>
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
