
// services/api.js
const API_URL = 'http://localhost:3001';

// Получение списка всех университетов
export const getUniversities = async () => {
  const response = await fetch(`${API_URL}/universities`);
  return await response.json();
};

// Получение данных конкретного университета по ID
export const getUniversityById = async (universityId) => {
  const response = await fetch(`${API_URL}/universities/${universityId}`);
  return await response.json();
};

// Сохранение данных университета
export const saveUniversity = async (universityId, universityData) => {
  try {
    // Проверяем существование университета
    const checkResponse = await fetch(`${API_URL}/universities/${universityId}`);
    
    if (checkResponse.ok) {
      // Если университет существует - обновляем по ID
      const response = await fetch(`${API_URL}/universities/${universityId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(universityData)
      });
      return await response.json();
    } else {
      // Проверяем, нет ли уже университета с таким именем
      const nameCheckResponse = await fetch(`${API_URL}/universities?name=${encodeURIComponent(universityData.name)}`);
      const existingByName = await nameCheckResponse.json();
      
      if (existingByName.length > 0) {
        // Если университет с таким именем уже существует, обновляем его
        const existingId = existingByName[0].id;
        const response = await fetch(`${API_URL}/universities/${existingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...universityData,
            id: existingId // Обязательно сохраняем существующий ID
          })
        });
        return await response.json();
      } else {
        // Создаем новый университет с переданным ID
        const response = await fetch(`${API_URL}/universities`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(universityData)
        });
        return await response.json();
      }
    }
  } catch (error) {
    console.error("Error saving university:", error);
    throw error;
  }
};



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
