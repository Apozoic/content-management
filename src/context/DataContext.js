/* DataContext.js */
import React, { createContext, useContext, useState } from 'react';
import { getPageVariables as fetchPageVariables, savePageVariables as savePageVariablesToAPI } from '../services/api';

// Создаем контекст для данных
const DataContext = createContext();

export function DataProvider({ children }) {
  // Локальный кеш для уменьшения числа запросов к API
  const [cache, setCache] = useState({});

  // Функция для получения переменных страницы
  const getPageVariables = async (pageId) => {
    // Если данные уже есть в кеше, используем их
    if (cache[pageId]) {
      return cache[pageId];
    }
    
    // Иначе загружаем с сервера
    try {
      const data = await fetchPageVariables(pageId);
      // Кешируем полученные данные
      setCache(prev => ({
        ...prev,
        [pageId]: data
      }));
      return data;
    } catch (error) {
      console.error("Error fetching page variables:", error);
      return {};
    }
  };

  // Функция для сохранения переменных страницы
  const setPageVariables = async (pageId, variables) => {
    try {
      await savePageVariablesToAPI(pageId, variables);
      // Обновляем кеш после успешного сохранения
      setCache(prev => ({
        ...prev,
        [pageId]: variables
      }));
      return true;
    } catch (error) {
      console.error("Error saving page variables:", error);
      return false;
    }
  };

  // Вспомогательные функции для работы с отдельными переменными
  const getVariable = async (pageId, variableName, defaultValue = '') => {
    const variables = await getPageVariables(pageId);
    return variables[variableName] ?? defaultValue;
  };

  const setVariable = async (pageId, variableName, value) => {
    const variables = await getPageVariables(pageId);
    const updatedVariables = {
      ...variables,
      [variableName]: value
    };
    return setPageVariables(pageId, updatedVariables);
  };

  const value = {
    getPageVariables,
    setPageVariables,
    getVariable,
    setVariable,
    // Добавим функцию для принудительного обновления кеша
    invalidateCache: (pageId) => {
      setCache(prev => {
        const newCache = {...prev};
        delete newCache[pageId];
        return newCache;
      });
    }
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

// Кастомный хук для использования данных
export function useAppData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useAppData must be used within a DataProvider');
  }
  return context;
}
