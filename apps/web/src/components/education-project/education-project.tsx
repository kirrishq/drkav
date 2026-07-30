import { buttonVariants, cn } from "@drkav/ui";

const schoolUrl = "https://neschool.drkav.ru/";

export function EducationProject() {
  return (
    <section aria-label="О проекте «Не Школа»" className="education-project">
      <figure className="education-project__image">
        <img alt="Пластический хирург во время операции" src="/images/education/neschool.png" />
      </figure>
      <div className="content-card content-card--muted education-project__content">
        <p className="education-project__paragraph">
          Не Школа — это максимально много практики в разных форматах. Теорию разберем на примерах из моего опыта (а так же обсудим и ваши кейсы, если вы придете на тариф с обратной связью или менторство).
        </p>
        <p className="education-project__paragraph">
          Смотрите мастер-классы онлайн, посещайте операционную, приходите на долгосрочную стажировку.
        </p>
        <p className="education-project__paragraph">Присоединяйтесь!</p>
        <a className={cn(buttonVariants({ size: "sm", variant: "primary" }), "education-project__action")} href={schoolUrl} rel="noreferrer" target="_blank">
          Перейти на сайт НеШколы
        </a>
      </div>
    </section>
  );
}
