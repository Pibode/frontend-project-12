// frontend/src/utils/profanity.js
import leoProfanity from "leo-profanity";

// Создаем единый экземпляр фильтра
const profanityFilter = leoProfanity;

// Загружаем русский словарь (поддерживается en, fr, ru)
profanityFilter.loadDictionary("ru");

// При необходимости можно добавить дополнительные слова
// profanityFilter.add(['слово1', 'слово2']);

// Добавляем слова в белый список, если нужно исключить какие-то слова
// profanityFilter.addWhitelist(['хорошее', 'слово']);

/**
 * Проверяет, содержит ли текст нецензурные слова
 * @param {string} text - Текст для проверки
 * @returns {boolean} - true если есть нецензурные слова
 */
export const containsProfanity = (text) => {
  if (!text || typeof text !== "string") return false;
  return profanityFilter.check(text);
};

/**
 * Очищает текст от нецензурных слов (заменяет на ***)
 * @param {string} text - Текст для очистки
 * @returns {string} - Очищенный текст
 */
export const cleanProfanity = (text) => {
  if (!text || typeof text !== "string") return text;
  return profanityFilter.clean(text);
};

/**
 * Проверяет и возвращает результат с сообщением об ошибке
 * @param {string} text - Текст для проверки
 * @param {string} fieldName - Название поля для сообщения об ошибке
 * @returns {Object} - { isValid: boolean, errorMessage: string | null }
 */
export const validateProfanity = (text, fieldName = "поле") => {
  if (containsProfanity(text)) {
    return {
      isValid: false,
      errorMessage: `${fieldName} содержит недопустимые слова`,
    };
  }
  return { isValid: true, errorMessage: null };
};

/**
 * Добавляет слова в белый список (не будут фильтроваться)
 * @param {string|string[]} words - Слово или массив слов
 */
export const addToWhitelist = (words) => {
  profanityFilter.addWhitelist(words);
};

/**
 * Удаляет слова из белого списка
 * @param {string|string[]} words - Слово или массив слов
 */
export const removeFromWhitelist = (words) => {
  profanityFilter.removeWhitelist(words);
};

export default profanityFilter;
