import type { OperationContentSection } from "@drkav/content-contracts";

export type OperationHeroLink = {
  href: string;
  label: string;
};

export type OperationContentLink = {
  id: string;
  label: string;
};

type AnchorRule = {
  label: string;
  pattern: RegExp;
};

const anchorRules: readonly AnchorRule[] = [
  { label: "Показания", pattern: /показ|кому (подходит|показан|подойдет)|когда (нужна|показана|требуется|рекомендована)|причины развития|в каких случаях/iu },
  { label: "Противопоказания", pattern: /противопоказ/iu },
  { label: "Технология", pattern: /технолог|суть|принцип действия|как работает/iu },
  { label: "Как проходит", pattern: /как проходит|как проводится|как выполняется|этап|процесс|ход операции|подготовк/iu },
  { label: "Виды", pattern: /(?:^|\s)вид(?:ы)?(?:\s|$)|вариант|метод(?:ы)? (?:использ|провед|коррек|атлетиз)|зон[аы] (коррек|примен)|задач[аи]? решает/iu },
  { label: "Результаты", pattern: /результат|эффект|восстановлен|реабилитац/iu },
  { label: "Стоимость", pattern: /стоим|цен[аые]|сколько стоит/iu },
];

export function getOperationHeroLinks(
  sections: readonly OperationContentSection[],
): readonly OperationHeroLink[] {
  const usedLabels = new Set<string>();

  return sections.flatMap((section) => {
    if (!section.showInPageNavigation || !section.anchor || !section.heading) {
      return [];
    }

    const heading = section.heading;
    const rule = anchorRules.find(({ pattern }) => pattern.test(heading));

    if (!rule || usedLabels.has(rule.label)) {
      return [];
    }

    usedLabels.add(rule.label);
    return [{ href: `#${section.anchor}`, label: rule.label }];
  }).slice(0, 6);
}

export function getOperationContentLinks(
  sections: readonly OperationContentSection[],
): readonly OperationContentLink[] {
  return sections.flatMap((section) => {
    if (!section.anchor || !section.heading) {
      return [];
    }

    return [{ id: section.anchor, label: section.heading }];
  });
}
