import { buttonVariants, ConsultationTrigger } from "@drkav/ui";
import type { SiteNavigation } from "@drkav/content-contracts";
import Image from "next/image";
import Link from "next/link";

import { CookieSettingsButton } from "@/components/cookie-consent/cookie-consent";
import { SocialIcon } from "@/components/social-icon";
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
        <p className="type-text-xs site-footer__medical-disclaimer">
          Имеются противопоказания. Необходима консультация специалиста.
        </p>
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
