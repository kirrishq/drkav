import type { SiteContactSettings } from "@drkav/content-contracts";
import type { ContactFabAction } from "@drkav/ui";

import { siteContact } from "./header-config";

export function createContactActions(
  contact: SiteContactSettings,
): readonly ContactFabAction[] {
  return [
    {
      detail: contact.clinicPhone,
      href: contact.clinicPhoneHref,
      kind: "phone",
      label: "Позвонить в клинику",
    },
    {
      detail: contact.administratorPhone,
      href: contact.administratorPhoneHref,
      kind: "phone",
      label: "Позвонить администратору",
    },
    {
      detail: "Написать в WhatsApp",
      external: true,
      href: contact.whatsappHref,
      kind: "whatsapp",
      label: "WhatsApp",
    },
    {
      detail: "Написать в Telegram",
      external: true,
      href: contact.telegramHref,
      kind: "telegram",
      label: "Telegram",
    },
    {
      detail: "Открыть мессенджер",
      external: true,
      href: contact.maxHref,
      kind: "max",
      label: "MAX",
    },
    {
      detail: contact.emailLabel,
      href: contact.emailHref,
      kind: "email",
      label: "Электронная почта",
    },
  ];
}

export const contactActions = createContactActions(siteContact);
