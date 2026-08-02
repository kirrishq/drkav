import { buttonVariants, cn } from "@drkav/ui";
import Link from "next/link";

import { SiteHeader } from "@/components/site-header/site-header";
import { getPageMetadata } from "@/content/page-registry";

export const metadata = getPageMetadata("/");

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="home-page">
        <section aria-labelledby="home-hero-title" className="home-hero">
          <div className="home-hero__content">
            <div className="home-hero__details">
              <div className="home-hero__badges">
                <span className="home-hero__badge">Пластический хирург</span>
                <span className="home-hero__badge">Кандидат медицинских наук</span>
              </div>
              <h1 className="home-hero__title" id="home-hero-title">Пластический хирург Артём Владимирович Коробов</h1>
              <p className="home-hero__description">Специализируюсь на абдоминопластике, маммопластике, липоскульптуре, комплексном восстановлении фигуры и мужской атлетизации.</p>
              <div className="home-hero__actions">
                <Link className={buttonVariants({ size: "md", variant: "primary" })} href="/konsultaciya">Записаться на консультацию</Link>
                <Link className={cn(buttonVariants({ size: "md", variant: "outline" }), "home-hero__secondary-action")} href="/ceny">Услуги и цены</Link>
              </div>
            </div>
            <div aria-label="Место для фотографии доктора" className="home-hero__photo-placeholder" role="img" />
          </div>
        </section>
      </main>
    </>
  );
}
