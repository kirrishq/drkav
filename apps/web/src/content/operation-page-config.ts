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

const operationPageOverrides: Partial<Record<CmsMigratedOperationPath, Partial<OperationPageEnhancement>>> = {
  "/operaczii/plastika-grudi": {
    heroImageSrc: "/images/operations/mammoplasty-hero.png",
    heroDescription: "Маммопластика помогает подобрать способ коррекции груди под ваши задачи — увеличение, подтяжка, уменьшение или сочетание методов.",
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
  "/operaczii/diastaz-myshc-zhivota": {
    video: {
      posterAlt: "Видео об устранении диастаза",
      posterSrc: "https://drkav.ru/images/preview/diastaz-myshc-zhivota.jpg",
      title: "Диастаз без шрамов",
      videoSrc: "https://drkav.ru/videos/ceny/diastaz-myshc-zhivota.mp4",
    },
  },
  "/operaczii/plasticheskaya-hirurgiya-posle-rodov": {
    video: {
      posterAlt: "Видео о пластике после родов",
      posterSrc: "https://drkav.ru/images/preview/plasticheskaya-hirurgiya-posle-rodov.jpg",
      title: "Пластика после родов",
      videoSrc: "https://drkav.ru/videos/ceny/plasticheskaya-hirurgiya-posle-rodov.mp4",
    },
  },
  "/operaczii/plasticheskaya-hirurgiya-posle-pohudeniya": {
    video: {
      posterAlt: "Видео о пластике после похудения",
      posterSrc: "https://drkav.ru/images/preview/plasticheskaya-hirurgiya-posle-pohudeniya.jpg",
      title: "Пластика после похудения",
      videoSrc: "https://drkav.ru/videos/ceny/plasticheskaya-hirurgiya-posle-pohudeniya.mp4",
    },
  },
  "/operaczii/liposkulptura": {
    video: {
      posterAlt: "Видео о липоскульптуре",
      posterSrc: "https://drkav.ru/images/preview/liposkulptura.jpg",
      title: "Липоскульптура",
      videoSrc: "https://drkav.ru/videos/ceny/liposkulptura.mp4",
    },
  },
  "/operaczii/lipofiling": {
    video: {
      posterAlt: "Видео о липофилинге",
      posterSrc: "https://drkav.ru/images/preview/lipofiling.jpg",
      title: "Липофилинг",
      videoSrc: "https://drkav.ru/videos/ceny/lipofiling.mp4",
    },
  },
  "/operaczii/rf-lifting": {
    video: {
      posterAlt: "Видео о РФ-лифтинге",
      posterSrc: "https://drkav.ru/images/preview/rf-lifting.jpg",
      title: "РФ-лифтинг",
      videoSrc: "https://drkav.ru/videos/ceny/rf-lifting.mp4",
    },
  },
  "/operaczii/muzhskaya-plastika": {
    video: {
      posterAlt: "Видео о мужской пластике",
      posterSrc: "https://drkav.ru/images/preview/muzhskaya-plastika.jpg",
      title: "Мужская пластика",
      videoSrc: "https://drkav.ru/videos/ceny/muzhskaya-plastika.mp4",
    },
  },
  "/operaczii/muzhskaya-plastika/lechenie-ginekompastii": {
    video: {
      posterAlt: "Видео о лечении гинекомастии",
      posterSrc: "https://drkav.ru/images/preview/lechenie-ginekompastii.jpg",
      title: "Лечение гинекомастии",
      videoSrc: "https://drkav.ru/videos/ceny/lechenie-ginekompastii.mp4",
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
