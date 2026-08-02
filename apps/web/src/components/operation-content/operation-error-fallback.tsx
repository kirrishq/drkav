"use client";

import Link from "next/link";

import { Button, buttonVariants, cn, PageIntro } from "@drkav/ui";

import { SiteHeader } from "@/components/site-header/site-header";

type OperationErrorFallbackProps = {
  retry: () => void;
};

export function OperationErrorFallback({ retry }: OperationErrorFallbackProps) {
  return (
    <>
      <SiteHeader />
      <PageIntro
        aria-live="polite"
        breadcrumbs={[
          { href: "/", label: "Главная" },
          { href: "/operaczii", label: "Операции" },
          { label: "Информация временно недоступна" },
        ]}
        description="Не удалось загрузить содержимое этой страницы. Попробуйте ещё раз или перейдите к записи на консультацию."
        title="Информация временно недоступна"
      >
        <section
          aria-label="Доступные действия"
          className="content-card operation-error__actions"
        >
          <Button onClick={retry}>Попробовать снова</Button>
          <Link
            className={cn(buttonVariants({ variant: "outline" }), "operation-error__action")}
            href="/konsultaciya"
          >
            Записаться на консультацию
          </Link>
          <Link
            className={cn(buttonVariants({ variant: "ghost" }), "operation-error__action")}
            href="/operaczii"
          >
            Все операции
          </Link>
        </section>
      </PageIntro>
    </>
  );
}
