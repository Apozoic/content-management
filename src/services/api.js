/* api.js */
const API_URL = 'http://localhost:3001';

// Получение списка всех университетов
export const getUniversities = async () => {
  try {
    const response = await fetch(`${API_URL}/universities`);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching universities:", error);
    return [];
  }
};

// Получение данных конкретного университета по ID
export const getUniversityById = async (universityId) => {
  try {
    const response = await fetch(`${API_URL}/universities`);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    const universities = await response.json();
    return universities.find(uni => Number(uni.id) === Number(universityId)) || null;
  } catch (error) {
    console.error(`Error fetching university ${universityId}:`, error);
    return null;
  }
};

// Сохранение данных университета - простая и надежная версия
export const saveUniversity = async (universityId, universityData) => {
  try {
    // Получаем все университеты для проверки
    const response = await fetch(`${API_URL}/universities`);
    const universities = await response.json();
    
    // Ищем университет с таким ID
    const exists = universities.some(uni => Number(uni.id) === Number(universityId));
    
    if (exists) {
      // Обновляем существующий через PUT
      console.log(`Обновляем существующий университет ID=${universityId}`);
      const updateResponse = await fetch(`${API_URL}/universities/${universityId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(universityData)
      });
      
      if (!updateResponse.ok) {
        console.error(`Ошибка обновления: ${updateResponse.status}`);
        // Если обновление не удалось, пробуем создать новую запись
        return await createNewUniversity(universityData);
      }
      
      return await updateResponse.json();
    } else {
      // Создаем новый университет
      return await createNewUniversity(universityData);
    }
  } catch (error) {
    console.error("Error in saveUniversity:", error);
    return universityData; // Возвращаем исходные данные при ошибке
  }
};

// Вспомогательная функция для создания нового университета
async function createNewUniversity(universityData) {
  console.log(`Создаем новый университет ID=${universityData.id}`);
  const createResponse = await fetch(`${API_URL}/universities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(universityData)
  });
  
  if (!createResponse.ok) {
    console.error(`Ошибка создания: ${createResponse.status}`);
    return universityData;
  }
  
  return await createResponse.json();
}



// Получение переменных страницы
export const getPageVariables = async (pageId) => {
  const response = await fetch(`${API_URL}/pageVariables?pageId=${pageId}`);
  const data = await response.json();
  return data.length > 0 ? data[0].variables : {};
};

// Сохранение переменных страницы
export const savePageVariables = async (pageId, variables) => {
  const response = await fetch(`${API_URL}/pageVariables?pageId=${pageId}`);
  const data = await response.json();
  
  if (data.length > 0) {
    // Обновляем существующую запись
    const recordId = data[0].id;
    await fetch(`${API_URL}/pageVariables/${recordId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ variables })
    });
  } else {
    // Создаем новую запись
    await fetch(`${API_URL}/pageVariables`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ pageId, variables })
    });
  }
  
  return true;
};
