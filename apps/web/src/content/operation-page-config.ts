import type { CmsMigratedOperationPath } from "./cms-migrated-operations";

export type OperationPagePromotion = {
  description: string;
  emphasis?: readonly string[];
  href: string;
  title: string;
};

export type OperationPageEnhancement = {
  heroImageSrc: string;
  heroDescription?: string;
  promotion?: OperationPagePromotion;
  video?: {
    posterAlt: string;
    posterSrc: string;
    title: string;
    videoSrc: string;
  };
};

const operationPageOverrides: Partial<Record<CmsMigratedOperationPath, OperationPageEnhancement>> = {
  "/operaczii/plastika-grudi": {
    heroImageSrc: "/images/operations/mammoplasty-hero.png",
    promotion: {
      description: "Оперируйтесь у доктора Коробова и получите в подарок процедуру стоимостью до 350 000 ₽ — липофилинг рук или интимную пластику на выбор. Предложение действует ограниченное время.",
      emphasis: ["до 350 000 ₽", "липофилинг рук", "интимную пластику"],
      href: "/akcii/intimnaya-plastika-ili-lipofiling-ruk-v-podarok",
      title: "Операция в подарок",
    },
    video: {
      posterAlt: "Видео о маммопластике",
      posterSrc: "https://drkav.ru/images/preview/plastika-grudi.jpg",
      title: "Маммопластика",
      videoSrc: "https://drkav.ru/videos/ceny/plastika-grudi.mp4",
    },
  },
};

function getHeroImageSrc(path: CmsMigratedOperationPath): string {
  if (path.includes("plastika-grudi") || path.includes("lipofiling-grudi")) {
    return "/images/operations/mammoplasty-hero.png";
  }

  if (path.includes("rf-lifting")) {
    return "/images/operations/heroes/rf-face-neck.png";
  }

  if (path.includes("intimnaya-plastika")) {
    return "/images/operations/heroes/intimate.png";
  }

  if (
    path.includes("lipofiling-yagodic") ||
    path.includes("podtyazhka-yagodic") ||
    path.includes("podtyazhka-beder") ||
    path.includes("muzhskaya-podtyazhka-yagodic")
  ) {
    return "/images/operations/heroes/hips.png";
  }

  if (
    path.includes("podtyazhka-ruk") ||
    path.includes("liposakcziya-ruk") ||
    path.includes("atletizaciya-plech-i-ruk")
  ) {
    return "/images/operations/heroes/arms.png";
  }

  if (
    path.includes("liposakcziya-spiny") ||
    path.includes("vdovego-gorbika")
  ) {
    return "/images/operations/heroes/back-neck.png";
  }

  if (path.includes("muzhskaya-plastika")) {
    return "/images/operations/heroes/male-torso.png";
  }

  return "/images/operations/heroes/abdomen.png";
}

export function getOperationPageEnhancement(
  path: CmsMigratedOperationPath,
): OperationPageEnhancement {
  return {
    heroImageSrc: getHeroImageSrc(path),
    ...operationPageOverrides[path],
  };
}
