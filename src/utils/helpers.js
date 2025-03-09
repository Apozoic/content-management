/* helpers.js */
/* helpers.js */
// src/utils/helpers.js

/**
 * Получает все университеты напрямую из JSON Server
 */
export async function fetchAllUniversities() {
    const response = await fetch('http://localhost:3001/universities');
    return await response.json();
  }
  
  /**
   * Создает новый университет
   */
  export const createUniversity = async () => {};
  
  /**
   * Обновляет существующий университет
   */
  export const updateUniversity = async () => {};

