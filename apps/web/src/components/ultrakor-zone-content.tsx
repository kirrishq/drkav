import { notFound } from "next/navigation";
import { OperationHero } from "@drkav/ui";

import { OperationContentRenderer } from "@/components/operation-content/operation-content-renderer";
import { UltrakorConsultation } from "@/components/ultrakor-consultation";
import {
  getUltrakorOperationByZone,
  getUltrakorOperationCatalog,
} from "@/content/ultrakor-operations";
import { ultrakorZones } from "@/content/ultrakor-zones";
import { ultrakorZoneContexts } from "@/content/ultrakor-zone-context";
import { getOperationHeroLinks } from "@/content/operation-page-navigation";

export async function UltrakorZoneContent({ params, inOverlay = false }: { params: Promise<{ zone: string }>; inOverlay?: boolean }) {
  const { zone } = await params;
  const [operation, operations] = await Promise.all([
    getUltrakorOperationByZone(zone),
    getUltrakorOperationCatalog(),
  ]);

  if (!operation) notFound();

  const zonePhoto = ultrakorZones.find(({ slug }) => slug === zone)?.imageSrc;
  const context = ultrakorZoneContexts[zone];
  const consultationId = inOverlay ? "ultrakor-zone-contact" : "contact";
  const consultationHref = `#${consultationId}`;
  const otherOperations = operations.filter((item) => item.zoneSlug !== zone);
  const Container = inOverlay ? "div" : "main";

  return (
    <Container className={zonePhoto ? "ultrakor-zone ultrakor-zone--photo" : "ultrakor-zone"}>
      <OperationHero
        backgroundSrc={zonePhoto ?? operation.heroImage?.url ?? "/images/ultrakor/hero-model.png"}
        breadcrumbs={[{ href: "/ultrakor", label: "Ультракор" }, { label: operation.breadcrumbLabel ?? operation.heading }]}
        title={context?.title ?? operation.heading}
        description={operation.heroDescription}
        ctaHref={consultationHref}
        ctaLabel="Записаться на консультацию"
        links={getOperationHeroLinks(operation.contentSections)}
      />
      <div className="ultrakor__section">
        <div className="ultrakor__inner">
          <OperationContentRenderer showNavigation={false} sections={operation.contentSections} prices={operation.prices} />

          {context && (
            <section className="ultrakor-zone__context">
              <h2 className="ultrakor__heading">Как зона влияет на общий силуэт</h2>
              <p>{context.combination}</p>
              <a className="ultrakor__button ultrakor__button--outline" href="/ultrakor#ultrakor-results-title">Смотреть результаты Ультракора</a>
            </section>
          )}

          <div className="ultrakor-zone__consultation">
            <a className="ultrakor__button ultrakor__button--solid" href={consultationHref}>Обсудить план с доктором</a>
          </div>

          <nav className="ultrakor-zone__zones" aria-label="Другие зоны Ультракора">
            {otherOperations.map((other) => (
              <a key={other.zoneSlug} href={other.canonicalPath} className="ultrakor__button ultrakor__button--outline">
                {other.heading}
              </a>
            ))}
            <a href="/ultrakor" className="ultrakor__button ultrakor__button--outline">О методике Ультракор</a>
          </nav>

          {context && (
            <aside className="ultrakor-zone__context" aria-label="Подробнее на основном сайте DrKAV">
              <h2 className="ultrakor__heading">Связанная операция на DrKAV</h2>
              <p>{context.relatedDescription}</p>
              <a className="ultrakor__button ultrakor__button--outline" href={context.related.href}>{context.related.label}</a>
            </aside>
          )}
        </div>
      </div>

      <UltrakorConsultation
        id={consultationId}
        title="Обсудите свою задачу с доктором"
        description="На консультации можно обсудить коррекцию этой зоны отдельно или в сочетании с другими зонами. Доктор объяснит, какой результат можно ожидать и как будет проходить восстановление."
      />
    </Container>
  );
}
