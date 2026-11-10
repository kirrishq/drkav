import "server-only";

import { cache } from "react";
import type {
  OperationContentSection,
  RichTextBlock,
  UltrakorOperationContent,
  UltrakorOperationSummary,
} from "@drkav/content-contracts";

import { createContentRepository } from "./content-repository";
import { logCmsError } from "./cms-logging";
import { ultrakorZones } from "./ultrakor-zones";

function paragraph(text: string): RichTextBlock {
  return {
    type: "paragraph",
    children: [{ type: "text", text }],
  };
}

function getFallbackSections(
  zone: (typeof ultrakorZones)[number],
): readonly OperationContentSection[] {
  return [
    {
      type: "rich-text",
      sectionKey: "intro",
      heading: undefined,
      showInPageNavigation: false,
      body: [paragraph(zone.description)],
    },
    {
      type: "list",
      sectionKey: "approach",
      anchor: "approach",
      heading: "Работа с зоной",
      showInPageNavigation: true,
      items: [
        { text: zone.description },
        { text: "План коррекции определяется после консультации с учётом анатомии, качества тканей и целей пациента." },
      ],
    },
    {
      type: "steps",
      sectionKey: "steps",
      anchor: "steps",
      heading: "Путь к результату",
      showInPageNavigation: true,
      steps: [
        { title: "Консультация", description: "Врач оценивает пропорции тела, зону коррекции и ожидаемый результат." },
        { title: "Подготовка", description: "Перед вмешательством назначается необходимое обследование и уточняется план операции." },
        { title: "Коррекция", description: "Выбранная методика выполняется по индивидуальному плану." },
        { title: "Реабилитация", description: "Врач сопровождает восстановление и проводит контрольные осмотры." },
      ],
    },
    {
      type: "price",
      sectionKey: "price",
      anchor: "price",
      heading: "Стоимость",
      showInPageNavigation: true,
      disclaimer: [paragraph("Ориентир не является публичной офертой. Окончательная стоимость определяется после консультации и зависит от объёма коррекции, выбранной методики и условий восстановления.")],
    },
  ];
}

function getFallbackOperation(
  zone: (typeof ultrakorZones)[number],
): UltrakorOperationContent {
  const canonicalPath = `/ultrakor/${zone.slug}`;

  return {
    slug: zone.slug,
    zoneSlug: zone.slug,
    canonicalPath,
    heading: zone.title,
    breadcrumbLabel: zone.title,
    heroDescription: zone.description,
    seo: {
      title: `${zone.title} — Ультракор | DrKAV`,
      description: zone.description,
      canonicalPath,
      noIndex: false,
    },
    prices: [{
      key: `${zone.slug}-price`,
      name: zone.title,
      type: "from",
      amount: zone.amount,
      currency: "RUB",
      note: "Ориентир стоимости. Окончательная сумма определяется после консультации.",
    }],
    contentSections: getFallbackSections(zone),
  };
}

const loadCmsOperation = cache(async (zoneSlug: string) => {
  try {
    return await createContentRepository().getUltrakorOperationByZone(zoneSlug);
  } catch (error) {
    logCmsError("cms_fetch_or_revalidation_failed", error, `/ultrakor/${zoneSlug}`);
    return null;
  }
});

export async function getUltrakorOperationByZone(
  zoneSlug: string,
): Promise<UltrakorOperationContent | null> {
  const cmsOperation = await loadCmsOperation(zoneSlug);

  if (cmsOperation) {
    return cmsOperation;
  }

  const fallbackZone = ultrakorZones.find((zone) => zone.slug === zoneSlug);
  return fallbackZone ? getFallbackOperation(fallbackZone) : null;
}

export async function getUltrakorOperationCatalog(): Promise<readonly UltrakorOperationSummary[]> {
  try {
    const operations = await createContentRepository().getUltrakorOperationCatalog();

    if (operations.length > 0) {
      return operations;
    }
  } catch (error) {
    logCmsError("cms_fetch_or_revalidation_failed", error, "ultrakor-operation-catalog");
  }

  return ultrakorZones.map((zone, index) => ({
    zoneSlug: zone.slug,
    canonicalPath: `/ultrakor/${zone.slug}`,
    heading: zone.title,
    heroDescription: zone.description,
    sortOrder: index,
  }));
}
