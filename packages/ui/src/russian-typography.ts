const SHORT_RUSSIAN_WORDS = "а|в|во|и|к|ко|с|со|у|о|об|от|до|из|на|по|за|не|ни";
const SHORT_WORD_PATTERN = new RegExp(
  `(^|[\\s([{«„“—–-])(${SHORT_RUSSIAN_WORDS})([ \\t\\u00a0]+)(?=\\S)`,
  "giu",
);

/** Prevents short Russian prepositions and conjunctions from hanging at line ends. */
export function formatRussianText(value: string): string {
  return value.replace(SHORT_WORD_PATTERN, (_match, prefix: string, word: string) => `${prefix}${word}\u00a0`);
}
