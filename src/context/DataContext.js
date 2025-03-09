/* DataContext.js */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { universityApi } from '../services/universityApi';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [universities, setUniversities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Получение списка университетов
  const getUniversities = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await universityApi.getAll();
      setUniversities(data);
      return data;
    } catch (error) {
      console.error("Ошибка загрузки университетов:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Первоначальная загрузка данных
  useEffect(() => {
    getUniversities();
  }, [getUniversities]);

  // Получение университета по ID
  const getUniversity = useCallback(async (id) => {
    try {
      return await universityApi.getById(id);
    } catch (error) {
      console.error(`Ошибка при получении университета ${id}:`, error);
      return null;
    }
  }, []);

  // Сохранение университета
  const saveUniversity = useCallback(async (id, data) => {
    try {
      if (id) {
        // Обновление существующего
        await universityApi.update(id, data);
      } else {
        // Создание нового
        await universityApi.create(data);
      }
      
      // Обновляем список после изменений
      await getUniversities();
      return true;
    } catch (error) {
      console.error(`Ошибка при сохранении университета ${id}:`, error);
      return false;
    }
  }, [getUniversities]);

  const value = {
    universities,
    isLoading,
    getUniversities,
    getUniversity,
    saveUniversity
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useAppData должен использоваться внутри DataProvider');
  }
  return context;
}
