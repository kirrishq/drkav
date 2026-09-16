import { SectionNavigation } from "@drkav/ui";

const aboutSections = [
  { id: "about-doctor", label: "О докторе" },
  { id: "education", label: "Образование" },
  { id: "qualifications", label: "Квалификации" },
  { id: "certificates", label: "Сертификаты и дипломы" },
  { id: "awards", label: "Награды" },
  { id: "associations", label: "Ассоциации" },
  { id: "patents", label: "Патенты" },
  { id: "journal-articles", label: "Статьи в журнале" },
  { id: "theses", label: "Тезисы" },
  { id: "rating", label: "Рейтинг" },
] as const;

export function AboutSectionNavigation() {
  return (
    <SectionNavigation
      ariaLabel="Разделы страницы «Обо мне»"
      items={aboutSections}
    />
  );
}
