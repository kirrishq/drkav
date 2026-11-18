"use client";

import { useRef } from "react";

import { socialLinks } from "@/components/site-header/header-config";
import { UltrakorSocialIcon } from "@/components/ultrakor-social-icon";

const sectionLinks = [
  { href: "/ultrakor#ultrakor-title", label: "О процедуре" },
  { href: "/ultrakor#ultrakor-results-title", label: "До/после" },
  { href: "/ultrakor#ultrakor-indications-title", label: "Для кого" },
  { href: "/ultrakor#ultrakor-process", label: "Процесс" },
  { href: "/ultrakor#ultrakor-safety-title", label: "Безопасность" },
  { href: "/ultrakor#ultrakor-pricing-title", label: "Стоимость" },
  { href: "/ultrakor/o-doktore", label: "О хирурге" },
  { href: "/ultrakor#contact", label: "Консультация" },
  { href: "/ultrakor#ultrakor-questions-title", label: "Вопросы и ответы" },
] as const;

const actionLinks = [
  { href: "/ultrakor#contact", label: "Записаться на консультацию" },
  { href: "/ultrakor#ultrakor-assistant", label: "Задать вопрос" },
] as const;

const socialKinds = ["vk", "instagram", "telegram", "youtube"] as const;

function HeaderSocials() {
  return (
    <div className="ultrakor-header__socials" aria-label="Социальные сети">
      {socialKinds.map((kind) => {
        const link = socialLinks.find((item) => item.kind === kind);
        return link && (
          <a aria-label={link.label} data-social={kind} href={link.href} key={kind} rel="noreferrer" target="_blank">
            <UltrakorSocialIcon kind={kind} />
          </a>
        );
      })}
    </div>
  );
}

export function UltrakorHeader() {
  const menu = useRef<HTMLDialogElement>(null);
  const closeMenu = () => menu.current?.close();

  return (
    <header className="ultrakor-header">
      <HeaderSocials />
      <div className="ultrakor-header__actions">
        {actionLinks.map(({ href, label }) => <a href={href} key={href}>{label}</a>)}
      </div>
      <button
        aria-controls="ultrakor-menu"
        aria-haspopup="dialog"
        aria-label="Открыть меню"
        className="ultrakor-header__toggle"
        type="button"
        onClick={() => menu.current?.showModal()}
      >
        <span /><span />
      </button>

      <dialog aria-label="Меню Ультракора" className="ultrakor-header__menu" id="ultrakor-menu" ref={menu}>
        <button autoFocus aria-label="Закрыть меню" className="ultrakor-header__toggle ultrakor-header__close" type="button" onClick={closeMenu}>
          <span /><span />
        </button>
        <div className="ultrakor-header__menu-inner">
          <nav aria-label="Разделы Ультракора">
            {sectionLinks.map(({ href, label }) => <a href={href} key={href} onClick={closeMenu}>{label}</a>)}
          </nav>
          <HeaderSocials />
          <div className="ultrakor-header__menu-actions">
            {actionLinks.map(({ href, label }) => <a href={href} key={href} onClick={closeMenu}>{label}</a>)}
          </div>
        </div>
      </dialog>
    </header>
  );
}
