import { buttonVariants, ConsultationTrigger } from "@drkav/ui";
import type { SiteNavigation } from "@drkav/content-contracts";
import Image from "next/image";
import Link from "next/link";

import { CookieSettingsButton } from "@/components/cookie-consent/cookie-consent";
import { getSiteNavigation } from "@/content/site-navigation";

function FooterLinkList({ links }: { links: SiteNavigation["footerColumns"][number]["links"] }) {
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

function SocialIcon({ kind }: { kind: SiteNavigation["socialLinks"][number]["kind"] }) {
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
export async function SiteFooter({
  navigation,
}: {
  navigation?: SiteNavigation;
}) {
  const siteNavigation = navigation ?? (await getSiteNavigation());
  const { contact, footerColumns, socialLinks } = siteNavigation;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__container">
        <div className="site-footer__main">
          <div className="site-footer__identity">
            <Link aria-label="Доктор Коробов — на главную" className="site-footer__brand" href="/">
              <Image alt="Доктор Коробов" className="site-footer__logo" height={230} src="/images/branding/logo-white.png" width={560} />
            </Link>
            <p className="type-text-base site-footer__tagline">{contact.clinicDescriptor}</p>
            <ConsultationTrigger className={buttonVariants({ size: "md", variant: "primary" })}>
              Записаться на консультацию
            </ConsultationTrigger>
            <div className="site-footer__contact-block">
              <a className="text-link site-footer__contact-link" href={contact.clinicPhoneHref}>{contact.clinicPhone}</a>
              <span className="type-text-base site-footer__contact-note">{contact.administratorHours}</span>
              <a className="text-link site-footer__contact-link" href={contact.footerWhatsappHref}>{contact.footerWhatsappLabel}</a>
              <a className="text-link site-footer__contact-link" href={contact.emailHref}>{contact.emailLabel}</a>
              <a className="text-link site-footer__contact-link" href={contact.footerEmailHref}>{contact.footerEmailLabel}</a>
            </div>
            <address className="type-text-base site-footer__address">{contact.clinicAddress}</address>
          </div>

          <nav aria-label="Навигация в подвале" className="site-footer__navigation">
            {footerColumns.map((column) => (
              <div className="site-footer__column" key={column.heading}>
                <h2 className="type-label site-footer__heading">{column.heading}</h2>
                <FooterLinkList links={column.links} />
              </div>
            ))}
          </nav>
        </div>

        <div className="site-footer__socials">
          <div className="site-footer__social-legal">
            <p className="type-text-xs site-footer__social-legal-line">ИП Коробов А.В. · ИНН 583201220045 · ОГРНИП 321645100059511</p>
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
            <Link className="text-link site-footer__legal-link" href="/oferta" rel="noreferrer" target="_blank">Публичная оферта</Link>
            <Link className="text-link site-footer__legal-link" href="/policy" rel="noreferrer" target="_blank">Политика обработки персональных данных</Link>
            <Link className="text-link site-footer__legal-link" href="/cookies" rel="noreferrer" target="_blank">Согласие на обработку cookies</Link>
            <Link className="text-link site-footer__legal-link" href="/consent" rel="noreferrer" target="_blank">Согласие на обработку персональных данных</Link>
            <Link className="text-link site-footer__legal-link" href="/consent-marketing" rel="noreferrer" target="_blank">Согласие на рекламную рассылку</Link>
            <CookieSettingsButton />
          </div>
        </div>
      </div>
    </footer>
  );
}
