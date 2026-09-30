import type { Promotion } from "@drkav/content-contracts";
import { buttonVariants, cn, ConsultationTrigger } from "@drkav/ui";
import Link from "next/link";

export function PromotionsCatalog({ items }: { items?: readonly Promotion[] }) {
  const promotions = items ?? [];

  if (promotions.length === 0) {
    return (
      <div className="content-card content-card--muted">
        <p>Актуальные предложения временно недоступны. Пожалуйста, обновите страницу позже.</p>
      </div>
    );
  }

  return <div className="promotions-catalog">{promotions.map((promotion) => <article className="promotions-catalog__card" key={promotion.key}><h2 className="card-title card-title--prominent promotions-catalog__title">{promotion.title}</h2>{promotion.subtitle ? <p className="promotions-catalog__subtitle">{promotion.subtitle}</p> : null}<div className="promotions-catalog__description">{promotion.description.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>{promotion.href === "/konsultaciya" ? <ConsultationTrigger className={cn(buttonVariants({ size: "sm", variant: "outline" }), "promotions-catalog__action")}>Подробнее</ConsultationTrigger> : <Link className={cn(buttonVariants({ size: "sm", variant: "outline" }), "promotions-catalog__action")} href={promotion.href}>Подробнее</Link>}</article>)}</div>;
}
