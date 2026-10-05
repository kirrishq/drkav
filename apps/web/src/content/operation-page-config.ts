import type { CmsMigratedOperationPath } from "./cms-migrated-operations";
import { operationCategoryFallbackImages } from "./operation-category-images";

export type OperationPagePromotion = {
  description: string;
  emphasis?: readonly string[];
  href: string;
  title: string;
};

export type OperationPageEnhancement = {
  heroImageSrc: string;
  promotion?: OperationPagePromotion;
};

const operationPageOverrides: Partial<Record<CmsMigratedOperationPath, Partial<OperationPageEnhancement>>> = {
  "/operaczii/plastika-grudi": {
    heroImageSrc: operationCategoryFallbackImages.breast,
    promotion: {
      description: "Оперируйтесь у доктора Коробова и получите в подарок процедуру стоимостью до 350 000 ₽ — липофилинг рук или интимную пластику на выбор. Предложение действует ограниченное время.",
      emphasis: ["до 350 000 ₽", "липофилинг рук", "интимную пластику"],
      href: "/akcii/intimnaya-plastika-ili-lipofiling-ruk-v-podarok",
      title: "Операция в подарок",
    },
  },
};

function getHeroImageSrc(path: CmsMigratedOperationPath): string {
  if (path.includes("plastika-grudi")) {
    return operationCategoryFallbackImages.breast;
  }

  if (path.includes("rf-lifting")) {
    return operationCategoryFallbackImages["non-surgical-rf-lifting"];
  }

  if (path.includes("intimnaya-plastika")) {
    return operationCategoryFallbackImages["intimate-surgery"];
  }

  if (path.includes("plasticheskaya-hirurgiya-posle-rodov")) {
    return operationCategoryFallbackImages.postpartum;
  }

  if (path.includes("plasticheskaya-hirurgiya-posle-pohudeniya")) {
    return operationCategoryFallbackImages["after-weight-loss"];
  }

  if (path.includes("muzhskaya-plastika")) {
    return operationCategoryFallbackImages["male-athletic-contouring"];
  }

  if (
    path.includes("liposkulptura") ||
    path.includes("lipofiling") ||
    path.includes("liposakcziya")
  ) {
    return operationCategoryFallbackImages["body-contouring"];
  }

  return operationCategoryFallbackImages["abdomen-and-waist"];
}

export function getOperationPageEnhancement(
  path: CmsMigratedOperationPath,
): OperationPageEnhancement {
  return {
    heroImageSrc: getHeroImageSrc(path),
    ...operationPageOverrides[path],
  };
}
