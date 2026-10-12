import Link from "next/link";

import { buttonVariants, cn, PageIntro } from "@drkav/ui";

import { SiteHeader } from "@/components/site-header/site-header-server";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <PageIntro
        aria-live="polite"
        breadcrumbs={[{ href: "/", label: "Главная" }, { label: "Страница не найдена" }]}
        description="Возможно, адрес страницы изменился или ссылка устарела. Перейдите в нужный раздел сайта."
        title="Страница не найдена"
      >
        <section aria-label="Перейти в раздел" className="content-card operation-error__actions">
          <Link className={cn(buttonVariants({ size: "md", variant: "primary" }), "operation-error__action")} href="/">
            Главная
          </Link>
          <Link className={cn(buttonVariants({ size: "md", variant: "outline" }), "operation-error__action")} href="/ceny">
            Цены
          </Link>
          <Link className={cn(buttonVariants({ size: "md", variant: "ghost" }), "operation-error__action")} href="/operaczii">
            Операции
          </Link>
        </section>
      </PageIntro>
    </>
  );
}
