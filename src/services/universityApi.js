/* universityApi.js */
// services/universityApi.js
const API_URL = 'http://localhost:3001';

export const universityApi = {
  // Получение всех университетов
  getAll: async () => {
    const response = await fetch(`${API_URL}/universities`);
    return response.ok ? await response.json() : [];
  },
  
  // Получение университета по ID
  getById: async (id) => {
    const response = await fetch(`${API_URL}/universities/${id}`);
    return response.ok ? await response.json() : null;
  },
  
  // Создание нового университета
  create: async (university) => {
    const response = await fetch(`${API_URL}/universities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(university)
    });
    return response.ok ? await response.json() : null;
  },
  
  // Обновление существующего университета
  update: async (id, university) => {
    const response = await fetch(`${API_URL}/universities/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(university)
    });
    return response.ok ? await response.json() : null;
  }
};
