import { buttonVariants, cn } from "@drkav/ui";
import Image from "next/image";

const schoolUrl = "https://neschool.drkav.ru/";

type EducationProjectProps = {
  paragraphs?: readonly string[];
};

const defaultParagraphs = [
  "Не Школа — это максимально много практики в разных форматах. Теорию разберем на примерах из моего опыта (а так же обсудим и ваши кейсы, если вы придете на тариф с обратной связью или менторство).",
  "Смотрите мастер-классы онлайн, посещайте операционную, приходите на долгосрочную стажировку.",
  "Присоединяйтесь!",
] as const;

export function EducationProject({ paragraphs = defaultParagraphs }: EducationProjectProps) {
  return (
    <section aria-label="О проекте «Не Школа»" className="education-project">
      <figure className="education-project__image">
        <Image alt="Пластический хирург во время операции" height={328} sizes="(min-width: 640px) 320px, 100vw" src="/images/education/neschool.png" width={416} />
      </figure>
      <div className="content-card content-card--muted education-project__content">
        {paragraphs.map((paragraph) => <p className="education-project__paragraph" key={paragraph}>{paragraph}</p>)}
        <a className={cn(buttonVariants({ size: "sm", variant: "primary" }), "education-project__action")} href={schoolUrl} rel="noreferrer" target="_blank">
          Перейти на сайт НеШколы
        </a>
      </div>
    </section>
  );
}
