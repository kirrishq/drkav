import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ConsultationTrigger, OperationHero } from "@drkav/ui";
import type { OperationContentSection } from "@drkav/content-contracts";
import { OperationContentRenderer } from "@/components/operation-content/operation-content-renderer";
import { ultrakorZones } from "@/content/ultrakor-zones";

type Props = { params: Promise<{ zone: string }> };
export function generateStaticParams() { return ultrakorZones.map(({ slug }) => ({ zone: slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { zone } = await params;
  const item = ultrakorZones.find(({ slug }) => slug === zone);
  if (!item) notFound();
  return { title: `${item.title} — Ультракор`, description: item.description, alternates: { canonical: `/ultrakor/${item.slug}` } };
}

export default async function UltrakorZonePage({ params }: Props) {
  const { zone } = await params;
  const item = ultrakorZones.find(({ slug }) => slug === zone);
  if (!item) notFound();
  const sections: readonly OperationContentSection[] = [
    { type: "list", sectionKey: "approach", anchor: "approach", heading: "Работа с зоной", showInPageNavigation: true, items: [{ text: item.description }, { text: "Методика сочетает удаление лишних жировых отложений и точное моделирование пропорций с учётом мужской анатомии." }] },
    { type: "steps", sectionKey: "steps", anchor: "steps", heading: "Путь к результату", showInPageNavigation: true, steps: [
      { title: "Консультация", description: "Врач оценивает пропорции тела, зоны коррекции и ожидаемый результат." },
      { title: "Липосакция", description: "Убираются локальные жировые отложения там, где они скрывают рельеф." },
      { title: "Липофилинг", description: "Собственные ткани используются для дополнительного объёма и акцента в нужных зонах." },
      { title: "Реабилитация", description: "Врач сопровождает восстановление." },
    ] },
    { type: "price", sectionKey: "price", anchor: "price", heading: "Стоимость", showInPageNavigation: true },
  ];
  return <main className="ultrakor-zone">
    <OperationHero backgroundSrc="/images/ultrakor/hero-model.png" breadcrumbs={[{ href: "/ultrakor", label: "Ультракор" }, { label: item.title }]} title={item.title} description={item.description} ctaLabel="Записаться на консультацию" links={sections.map(section => ({ href: `#${section.anchor}`, label: section.heading! }))} />
    <div className="ultrakor__section"><div className="ultrakor__inner">
      <OperationContentRenderer showNavigation={false} sections={sections} prices={[{ key: item.slug, name: item.title, type: "from", amount: item.amount, currency: "RUB", note: "Не является публичной офертой. Стоимость операции рассчитывается доктором в индивидуальном порядке после консультации." }]} />
      <div className="ultrakor-zone__consultation"><ConsultationTrigger className="ultrakor__button ultrakor__button--solid">Обсудить на консультации</ConsultationTrigger></div>
      <nav className="ultrakor-zone__zones" aria-label="Другие зоны Ультракора">{ultrakorZones.filter(other => other.slug !== item.slug).map(other => <Link key={other.slug} href={`/ultrakor/${other.slug}`} className="ultrakor__button ultrakor__button--outline">{other.title} ↗</Link>)}<Link href="/ultrakor" className="ultrakor__button ultrakor__button--outline">Все зоны</Link></nav>
    </div></div>
  </main>;
}
