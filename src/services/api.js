/* api.js */
// Базовый URL для json-server
const API_URL = 'http://localhost:3001';

// API для menuItems
export const getMenuItems = async () => {
  const response = await fetch(`${API_URL}/menuItems`);
  return await response.json();
};

// API для pageVariables

// Получение переменных страницы по pageId
export const getPageVariables = async (pageId) => {
  try {
    const response = await fetch(`${API_URL}/pageVariables?pageId=${pageId}`);
    const data = await response.json();
    
    if (data.length > 0) {
      return data[0].variables; // Возвращаем объект переменных
    }
    return {}; // Если переменных нет, возвращаем пустой объект
  } catch (error) {
    console.error('Error fetching page variables:', error);
    return {};
  }
};

// Сохранение или обновление переменных страницы
export const savePageVariables = async (pageId, variables) => {
  try {
    // Проверяем, существуют ли уже переменные для этой страницы
    const response = await fetch(`${API_URL}/pageVariables?pageId=${pageId}`);
    const data = await response.json();
    
    if (data.length > 0) {
      // Обновляем существующие переменные
      const recordId = data[0].id;
      await fetch(`${API_URL}/pageVariables/${recordId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          variables: variables
        }),
      });
    } else {
      // Создаем новую запись с переменными
      await fetch(`${API_URL}/pageVariables`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pageId: pageId,
          variables: variables
        }),
      });
    }
    return true;
  } catch (error) {
    console.error('Error saving page variables:', error);
    return false;
  }
};
