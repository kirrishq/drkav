import { buttonVariants, ConsultationTrigger } from "@drkav/ui";
import Image from "next/image";
import Link from "next/link";

import { headerMenu, type HeaderMenuLink } from "@/components/site-header/header-config";

const aboutLinks = headerMenu.find((item) => item.href === "/obo-mne")?.links ?? [];
const operationLinks = headerMenu.find((item) => item.href === "/operaczii")?.links ?? [];
const patientLinks = headerMenu.find((item) => item.href === "/pacientam")?.links ?? [];

const mainLinks: readonly HeaderMenuLink[] = [
  { href: "/akcii", label: "Акции" },
  { href: "/ceny", label: "Цены" },
  { href: "/kontakty", label: "Контакты" },
];

const socialLinks = [
  { href: "https://t.me/drkav_official", kind: "telegram", label: "Telegram" },
  { href: "https://www.youtube.com/channel/UCyNisHCb9vYS6qLWlgK6lwg", kind: "youtube", label: "YouTube" },
  { href: "https://www.instagram.com/dr.kav/", kind: "instagram", label: "Instagram*" },
  { href: "https://vk.com/publicdoctorkav", kind: "vk", label: "ВКонтакте" },
] as const;

function FooterLinkList({ links }: { links: readonly HeaderMenuLink[] }) {
  return (
    <ul className="site-footer__links">
      {links.map((link) => (
        <li key={link.href}>
          <Link className="text-link site-footer__link" href={link.href}>
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function SocialIcon({ kind }: { kind: (typeof socialLinks)[number]["kind"] }) {
  if (kind === "telegram") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="m20.7 4.2-2.9 15.1c-.2 1.1-.8 1.4-1.7.9l-4.8-3.5-2.3 2.2c-.3.3-.5.5-1 .5l.3-4.9 8.9-8c.4-.4-.1-.6-.6-.2L5.6 13.1.9 11.6c-1-.3-1-1 .2-1.5L19.4 3c.8-.3 1.5.2 1.3 1.2Z" />
      </svg>
    );
  }

  if (kind === "youtube") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M20.1 6.3a2.8 2.8 0 0 0-2-2C16.4 3.8 12 3.8 12 3.8s-4.4 0-6.1.5a2.8 2.8 0 0 0-2 2C3.4 8 3.4 12 3.4 12s0 4 .5 5.7a2.8 2.8 0 0 0 2 2c1.7.5 6.1.5 6.1.5s4.4 0 6.1-.5a2.8 2.8 0 0 0 2-2c.5-1.7.5-5.7.5-5.7s0-4-.5-5.7ZM10 16V8l6 4-6 4Z" />
      </svg>
    );
  }

  if (kind === "instagram") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <rect height="15" rx="4" width="15" x="4.5" y="4.5" />
        <circle cx="12" cy="12" r="3.5" />
        <circle cx="16.8" cy="7.3" r="1" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M4.7 7.2h2.6c.1 4.1 1.8 5.9 3.1 6.3V7.2h2.5v3.5c1.3-.1 2.7-1.8 3.1-3.5h2.5c-.4 2.1-1.8 3.8-3 4.6 1.2.6 2.8 2.1 3.5 4.7h-2.7c-.5-1.6-1.8-2.9-3.4-3v3h-.4c-5.1 0-8-3.5-8.2-9.3Z" />
    </svg>
  );
}

/** Site-wide footer with current project navigation and original contact details. */
export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__container">
        <div className="site-footer__main">
          <div className="site-footer__identity">
            <Link aria-label="Доктор Коробов — на главную" className="site-footer__brand" href="/">
              <Image alt="Доктор Коробов" className="site-footer__logo" height={230} src="/images/branding/logo-white.png" width={560} />
            </Link>
            <p className="type-text-base site-footer__tagline">Пластический хирург Артём Владимирович Коробов</p>
            <ConsultationTrigger className={buttonVariants({ size: "md", variant: "primary" })}>
              Записаться на консультацию
            </ConsultationTrigger>
            <div className="site-footer__contact-block">
              <a className="text-link site-footer__contact-link" href="tel:+74951514206">+7 495 151-42-06</a>
              <span className="type-text-base site-footer__contact-note">Администратор · 9:15–19:00, Пн–Пт</span>
              <a className="text-link site-footer__contact-link" href="https://api.whatsapp.com/send/?app_absent=0&phone=79256255510&text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5%2C%20%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%21%20%D0%9F%D0%B8%D1%88%D1%83%20%D1%81%20%D1%81%D0%B0%D0%B9%D1%82%D0%B0%20drkav.ru.%20%D0%95%D1%81%D1%82%D1%8C%20%D0%B2%D0%BE%D0%BF%D1%80%D0%BE%D1%81%3A">WhatsApp: +7 925 625-55-10</a>
              <a className="text-link site-footer__contact-link" href="mailto:admin@drkav.ru">admin@drkav.ru</a>
              <a className="text-link site-footer__contact-link" href="mailto:pr@drkav.ru">pr@drkav.ru</a>
            </div>
            <address className="type-text-base site-footer__address">г. Москва, ул. Большая Очаковская, 31, этаж 1, кабинет 12</address>
          </div>

          <nav aria-label="Навигация в подвале" className="site-footer__navigation">
            <div className="site-footer__column">
              <h2 className="type-label site-footer__heading">Обо мне</h2>
              <FooterLinkList links={aboutLinks} />
            </div>
            <div className="site-footer__column">
              <h2 className="type-label site-footer__heading">Операции</h2>
              <FooterLinkList links={operationLinks} />
            </div>
            <div className="site-footer__column">
              <h2 className="type-label site-footer__heading">Пациентам</h2>
              <FooterLinkList links={[
                ...patientLinks,
                { href: "/pacientam/portfolio", label: "Портфолио" },
                { href: "/pacientam/do-i-posle", label: "До/после" },
              ]} />
            </div>
            <div className="site-footer__column">
              <h2 className="type-label site-footer__heading">Основное</h2>
              <FooterLinkList links={mainLinks} />
            </div>
          </nav>
        </div>

        <div className="site-footer__socials">
          <div className="site-footer__social-legal">
            <p className="type-text-xs site-footer__social-legal-line">ИП Коробов А.В. · ИНН 7702070139 · ОГРНИП 321645100059511</p>
            <p className="type-text-xs site-footer__social-legal-line">© 2014–{currentYear} DrKAV. Все материалы сайта охраняются авторским правом.</p>
            <p className="type-text-xs site-footer__social-legal-line">Meta Platforms Inc. признана экстремистской организацией и запрещена на территории РФ.</p>
          </div>
          <div className="site-footer__social-links">
            {socialLinks.map((link) => (
              <a aria-label={link.label} className="site-footer__social-link" href={link.href} key={link.href} rel="noreferrer" target="_blank">
                <SocialIcon kind={link.kind} />
              </a>
            ))}
          </div>
        </div>

        <div className="site-footer__legal">
          <div className="site-footer__legal-links">
            <Link className="text-link site-footer__legal-link" href="/obo-mne/diplomy-i-licenzii">Лицензии и сертификаты</Link>
            <Link className="text-link site-footer__legal-link" href="/oferta">Публичная оферта</Link>
            <Link className="text-link site-footer__legal-link" href="/policy">Политика обработки персональных данных</Link>
            <Link className="text-link site-footer__legal-link" href="/cookies">Согласие на обработку cookies</Link>
            <Link className="text-link site-footer__legal-link" href="/consent">Согласие на обработку персональных данных</Link>
            <Link className="text-link site-footer__legal-link" href="/consent-marketing">Согласие на рекламную рассылку</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
