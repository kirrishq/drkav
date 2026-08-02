import { buttonVariants, cn } from "@drkav/ui";
import Image from "next/image";

const bookUrl = "https://book.drkav.ru/";

export function BookPageContent() {
  return (
    <>
      <section aria-label="О книге" className="book-page__story">
        <figure className="book-page__portrait">
          <Image alt="Доктор Коробов читает книгу в кресле" height={420} sizes="(min-width: 640px) 320px, 100vw" src="/images/about-pages/book.png" width={420} />
        </figure>
        <div className="content-card content-card--muted book-page__description">
          <p>На консультациях женщины рассказывают мне о своей жизни: у каждой своя боль и свое счастье, и я вижу следы этой истории на их телах.</p>
          <p>Живот, бедра, спина, грудь — все это страницы книги, написанные языком стыда, боли и любви. Мне понадобился опыт — профессиональный и человеческий, — чтобы увидеть за телами людей истории и пройденный путь.</p>
          <p>Этим опытом я делюсь в книге, рассказывая вам истории двенадцати женщин…</p>
          <a className={cn(buttonVariants({ size: "sm", variant: "outline" }), "book-page__action")} href={bookUrl} rel="noreferrer" target="_blank">
            Подробнее о книге
          </a>
        </div>
      </section>

      <section aria-labelledby="book-page-order-title" className="content-card content-card--spacious book-page__order">
        <div className="book-page__order-content">
          <h2 className="book-page__order-title" id="book-page-order-title">Закажите бумажную версию книги и получите консультацию доктора Коробова бесплатно!</h2>
          <a className={cn(buttonVariants({ size: "sm", variant: "primary" }), "book-page__action")} href={bookUrl} rel="noreferrer" target="_blank">
            Забрать книгу и подарок
          </a>
        </div>
        <figure className="book-page__mockup">
          <Image alt="Мокап книги «Боль двенадцати женщин»" height={360} sizes="(min-width: 640px) 50vw, 100vw" src="/images/book/book-mockup.png" width={596} />
        </figure>
      </section>
    </>
  );
}
