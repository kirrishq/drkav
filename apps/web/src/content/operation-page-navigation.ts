import type { OperationContentSection } from "@drkav/content-contracts";
import type { OperationSectionIconKey } from "@drkav/ui";
import { isOperationSectionIconKey } from "@drkav/ui";

export type OperationHeroLink = {
  href: string;
  label: string;
};

export type OperationContentLink = {
  id: string;
  icon: OperationSectionIconKey;
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

    return [{
      icon: getOperationSectionIconKey(section.iconKey ?? section.heading),
      id: section.anchor,
      label: section.heading,
    }];
  });
}

const iconRules: readonly { icon: OperationSectionIconKey; pattern: RegExp }[] = [
  { icon: "promotion", pattern: /подар|акци/iu },
  { icon: "price", pattern: /стоим|цен[аые]|сколько стоит|доступност/iu },
  { icon: "additional-costs", pattern: /дополнительно оплач|дополнительн.*расход|наркоз|стационар/iu },
  { icon: "included", pattern: /что входит|включен|состав стоимости/iu },
  { icon: "contraindications", pattern: /противопоказ|риск/iu },
  { icon: "implants", pattern: /имплант|аугментац/iu },
  { icon: "indications", pattern: /показ|кому подходит|когда нужна|когда показана|почему женщины|почему мужчины|причины/iu },
  { icon: "preparation", pattern: /подготов|консультац|обследован/iu },
  { icon: "process", pattern: /как проходит|как проводится|этап|ход операции|хирургическое вмешательство/iu },
  { icon: "types", pattern: /вид|вариант|метод|зон[аы]|коррекци/iu },
  { icon: "results", pattern: /результат|эффект|до и после/iu },
  { icon: "recovery", pattern: /восстанов|реабилитац/iu },
  { icon: "benefits", pattern: /преимуществ|почему стоит|почему выбрать|отличи/iu },
  { icon: "faq", pattern: /часто задаваем|вопрос/iu },
  { icon: "technology", pattern: /технолог|принцип|как работает|суть/iu },
];

export function getOperationSectionIconKey(value?: string): OperationSectionIconKey {
  if (value) {
    const explicitKey = value.trim().toLowerCase();

    if (isOperationSectionIconKey(explicitKey)) {
      return explicitKey;
    }

    const rule = iconRules.find(({ pattern }) => pattern.test(value));

    if (rule) {
      return rule.icon;
    }
  }

  return "information";
}
