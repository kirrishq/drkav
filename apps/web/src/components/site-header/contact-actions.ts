import type { ContactFabAction } from "@drkav/ui";

import { administratorContact } from "./header-config";

export const contactActions: readonly ContactFabAction[] = [
  {
    detail: "+7 495 151-42-06",
    href: "tel:+74951514206",
    kind: "phone",
    label: "Позвонить в клинику",
  },
  {
    detail: administratorContact.phone,
    href: administratorContact.telHref,
    kind: "phone",
    label: "Позвонить администратору",
  },
  {
    detail: "Написать в WhatsApp",
    external: true,
    href: administratorContact.whatsappHref,
    kind: "whatsapp",
    label: "WhatsApp",
  },
  {
    detail: "Написать в Telegram",
    external: true,
    href: administratorContact.telegramHref,
    kind: "telegram",
    label: "Telegram",
  },
  {
    detail: "Открыть мессенджер",
    external: true,
    href: administratorContact.maxHref,
    kind: "max",
    label: "MAX",
  },
  {
    detail: "admin@drkav.ru",
    href: administratorContact.emailHref,
    kind: "email",
    label: "Электронная почта",
  },
] as const;
