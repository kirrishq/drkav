'use strict';

const WORDS_PER_MINUTE = 180;

function collectText(value) {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map(collectText).join(' ');
  if (value && typeof value === 'object') return Object.values(value).map(collectText).join(' ');
  return '';
}

function setReadingTime(data) {
  if (!data.contentSections) return;
  const wordCount = collectText(data.contentSections).trim().split(/\s+/).filter(Boolean).length;
  data.readingTimeMinutes = Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

module.exports = {
  beforeCreate(event) {
    setReadingTime(event.params.data);
  },
  beforeUpdate(event) {
    setReadingTime(event.params.data);
  },
};
