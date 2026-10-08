const transliterationMap = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "zh", з: "z", и: "i", й: "y",
  к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h",
  ц: "ts", ч: "ch", ш: "sh", щ: "shch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

function slugifyPromotionTitle(title) {
  const slug = String(title)
    .trim()
    .toLocaleLowerCase("ru-RU")
    .split("")
    .map((character) => transliterationMap[character] ?? character)
    .join("")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `/akcii/${slug || "aktsiya"}`;
}

module.exports = {
  beforeCreate(event) {
    const { data } = event.params;
    if (data.title) {
      data.href = slugifyPromotionTitle(data.title);
    }
  },

  beforeUpdate(event) {
    const { data } = event.params;
    if (data.title) {
      data.href = slugifyPromotionTitle(data.title);
    }
  },
};
