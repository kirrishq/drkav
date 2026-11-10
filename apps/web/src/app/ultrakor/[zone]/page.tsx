import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ConsultationTrigger, OperationHero } from "@drkav/ui";
import { OperationContentRenderer } from "@/components/operation-content/operation-content-renderer";
import {
  getUltrakorOperationByZone,
  getUltrakorOperationCatalog,
} from "@/content/ultrakor-operations";
import { getOperationHeroLinks } from "@/content/operation-page-navigation";
import { toMetadata } from "@/content/seo";

type Props = { params: Promise<{ zone: string }> };
export async function generateStaticParams() {
  const operations = await getUltrakorOperationCatalog();
  return operations.map(({ zoneSlug }) => ({ zone: zoneSlug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { zone } = await params;
  const operation = await getUltrakorOperationByZone(zone);

  if (!operation) notFound();
  return toMetadata(operation.seo);
}

export default async function UltrakorZonePage({ params }: Props) {
  const { zone } = await params;
  const [operation, operations] = await Promise.all([
    getUltrakorOperationByZone(zone),
    getUltrakorOperationCatalog(),
  ]);

  if (!operation) notFound();

  const otherOperations = operations.filter((item) => item.zoneSlug !== zone);

  return <main className="ultrakor-zone">
    <OperationHero
      backgroundSrc={operation.heroImage?.url ?? "/images/ultrakor/hero-model.png"}
      breadcrumbs={[{ href: "/ultrakor", label: "Ультракор" }, { label: operation.breadcrumbLabel ?? operation.heading }]}
      title={operation.heading}
      description={operation.heroDescription}
      ctaLabel="Записаться на консультацию"
      links={getOperationHeroLinks(operation.contentSections)}
    />
    <div className="ultrakor__section"><div className="ultrakor__inner">
      <OperationContentRenderer showNavigation={false} sections={operation.contentSections} prices={operation.prices} />
      <div className="ultrakor-zone__consultation"><ConsultationTrigger className="ultrakor__button ultrakor__button--solid">Обсудить на консультации</ConsultationTrigger></div>
      <nav className="ultrakor-zone__zones" aria-label="Другие зоны Ультракора">{otherOperations.map(other => <Link key={other.zoneSlug} href={other.canonicalPath} className="ultrakor__button ultrakor__button--outline">{other.heading} ↗</Link>)}<Link href="/ultrakor" className="ultrakor__button ultrakor__button--outline">Все зоны</Link></nav>
    </div></div>
  </main>;
}
