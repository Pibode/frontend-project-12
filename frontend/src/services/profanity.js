// frontend/src/services/profanity.js
import leoProfanity from "leo-profanity";

// Создаем единственный экземпляр фильтра (синглтон)
const profanityFilter = leoProfanity;

// Загружаем русский словарь. fallback на английский, если русского нет.
try {
  profanityFilter.loadDictionary("ru");
  console.log("Profanity filter: Russian dictionary loaded.");
} catch (error) {
  console.warn(
    "Profanity filter: Russian dictionary not found, using default.",
  );
  // Если русского словаря нет, библиотека использует английский по умолчанию.
}

// При необходимости можно добавить свои слова в словарь.
// profanityFilter.add(['свое_слово', 'еще_одно']);

/**
 * Проверяет, содержит ли текст нецензурные слова.
 * @param {string} text - Текст для проверки.
 * @returns {boolean} - true, если есть нецензурные слова.
 */
export const containsProfanity = (text) => {
  if (!text || typeof text !== "string") return false;
  return profanityFilter.check(text);
};

/**
 * Очищает текст от нецензурных слов, полностью заменяя каждое слово на ***
 * @param {string} text - Текст для очистки.
 * @returns {string} - Очищенный текст.
 */
export const cleanProfanity = (text) => {
  if (!text || typeof text !== "string") return text;

  // Разбиваем текст на слова
  const words = text.split(" ");

  // Обрабатываем каждое слово
  const cleanedWords = words.map((word) => {
    // Проверяем, содержит ли слово нецензурную лексику
    if (profanityFilter.check(word)) {
      // Полностью заменяем слово на ***
      return "***";
    }
    return word;
  });

  // Собираем обратно в строку
  return cleanedWords.join(" ");
};

/**
 * Валидирует текст на наличие нецензурных слов.
 * @param {string} text - Текст для проверки.
 * @param {string} fieldName - Название поля для сообщения об ошибке.
 * @returns {Object} - { isValid: boolean, errorMessage: string | null }
 */
export const validateProfanity = (text, fieldName = "Текст") => {
  if (containsProfanity(text)) {
    return {
      isValid: false,
      errorMessage: `${fieldName} содержит недопустимые слова.`,
    };
  }
  return { isValid: true, errorMessage: null };
};

export default profanityFilter;
