"use client";

import Link from "next/link";

import { Button, buttonVariants, cn, ConsultationTrigger, PageIntro } from "@drkav/ui";

import { SiteHeader } from "@/components/site-header/site-header";

export function CmsUnavailableFallback({ retry }: { retry: () => void }) {
  return (
    <>
      <SiteHeader />
      <PageIntro
        aria-live="polite"
        breadcrumbs={[{ href: "/", label: "Главная" }, { label: "Информация временно недоступна" }]}
        description="Содержимое временно не загрузилось. Попробуйте обновить страницу ещё раз или обратитесь к администратору."
        title="Информация временно недоступна"
      >
        <section aria-label="Доступные действия" className="content-card operation-error__actions">
          <Button onClick={retry}>Попробовать снова</Button>
          <ConsultationTrigger className={cn(buttonVariants({ variant: "outline" }), "operation-error__action")}>
            Записаться на консультацию
          </ConsultationTrigger>
          <Link className={cn(buttonVariants({ variant: "ghost" }), "operation-error__action")} href="/">
            На главную
          </Link>
        </section>
      </PageIntro>
    </>
  );
}
