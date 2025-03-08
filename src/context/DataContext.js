/* DataContext.js */
/* DataContext.js */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  getUniversities, 
  getUniversityById, 
  saveUniversity, 
  getPageVariables, 
  savePageVariables 
} from '../services/api';

const DataContext = createContext();

export function DataProvider({ children }) {
  // Многоуровневый кеш для эффективного доступа к данным
  const [cache, setCache] = useState({
    universities: {},       // Кеш университетов {universityId: {name, pages, variables}}
    pageVariables: {},      // Кеш переменных страниц {pageId: variables}
    loading: false,         // Статус загрузки данных
    initialized: false      // Флаг инициализации кеша
  });
  
  // Инициализация кеша при первой загрузке
  const refreshUniversities = useCallback(async () => {
    try {
      setCache(prev => ({ ...prev, loading: true }));
      const universities = await getUniversities();
      
      // Преобразуем массив в объект для удобного доступа
      const universitiesMap = universities.reduce((acc, uni) => {
        acc[uni.id] = uni;
        return acc;
      }, {});
      
      setCache(prev => ({ 
        ...prev, 
        universities: universitiesMap,
        loading: false,
        initialized: true
      }));
      
      return universitiesMap;
    } catch (error) {
      console.error("Failed to fetch universities:", error);
      setCache(prev => ({ ...prev, loading: false, initialized: true }));
      return {};
    }
  }, []);

  useEffect(() => {
    if (!cache.initialized) {
      refreshUniversities();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cache.initialized]);
  
  // Получение данных университета по ID
  const getUniversityData = useCallback(async (universityId) => {
    // Проверка кеша
    if (cache.universities[universityId]) {
      return cache.universities[universityId];
    }
    
    try {
      const university = await getUniversityById(universityId);
      
      // Обновляем кеш
      setCache(prev => ({
        ...prev,
        universities: {
          ...prev.universities,
          [universityId]: university
        }
      }));
      
      return university;
    } catch (error) {
      console.error(`Failed to fetch university ${universityId}:`, error);
      return null;
    }
  }, [cache.universities]);
  
  // Сохранение данных университета
  const saveUniversityData = useCallback(async (universityId, universityData) => {
    try {
      // Убедимся, что ID объекта соответствует переданному ID
      const dataWithCorrectId = { 
        ...universityData,
        id: universityId
      };
      
      // Сохраняем с корректным ID
      const savedData = await saveUniversity(universityId, dataWithCorrectId);
      
      // Обновляем кеш сразу после сохранения
      setCache(prev => ({
        ...prev,
        universities: {
          ...prev.universities,
          [universityId]: savedData
        }
      }));
      
      // Сразу обновляем список университетов без setTimeout
      await refreshUniversities();
      
      return true;
    } catch (error) {
      console.error(`Failed to save university ${universityId}:`, error);
      return false;
    }
  }, [refreshUniversities]); 
  


  
  // Получение переменных страницы
  const getPageVariablesData = useCallback(async (pageId) => {
    // Используем функциональный подход для получения актуального состояния
    let cachedValue = null;
    setCache(prev => {
      cachedValue = prev.pageVariables[pageId];
      return prev; // не меняем состояние
    });
    
    // Если в кеше есть данные - возвращаем их
    if (cachedValue) {
      return cachedValue;
    }
    
    try {
      const variables = await getPageVariables(pageId);
      
      // Обновляем кеш
      setCache(prev => ({
        ...prev,
        pageVariables: {
          ...prev.pageVariables,
          [pageId]: variables
        }
      }));
      
      return variables;
    } catch (error) {
      console.error(`Failed to fetch page variables for ${pageId}:`, error);
      return {};
    }
  }, []);
  
  // Сохранение переменных страницы
  const setPageVariablesData = useCallback(async (pageId, variables, universityId = null) => {
    try {
      await savePageVariables(pageId, variables);
      
      // Обновляем кеш переменных страницы
      setCache(prev => ({
        ...prev,
        pageVariables: {
          ...prev.pageVariables,
          [pageId]: variables
        }
      }));
      
      // Если известен universityId, обновляем также кеш университета
      if (universityId && cache.universities[universityId]) {
        const university = cache.universities[universityId];
        const updatedPages = university.pages.map(page => {
          if (page.id === pageId) {
            return { ...page, variables };
          }
          return page;
        });
        
        setCache(prev => ({
          ...prev,
          universities: {
            ...prev.universities,
            [universityId]: {
              ...university,
              pages: updatedPages
            }
          }
        }));
      }
      
      return true;
    } catch (error) {
      console.error(`Failed to save page variables for ${pageId}:`, error);
      return false;
    }
  }, [cache.universities]);
  
  // Сброс кеша для принудительного обновления данных
  const invalidateCache = useCallback((target, id = null) => {
    if (target === 'universities' && !id) {
      // Сбрасываем весь кеш университетов
      setCache(prev => ({
        ...prev,
        universities: {},
        initialized: false
      }));
    } else if (target === 'university' && id) {
      // Сбрасываем кеш конкретного университета
      setCache(prev => {
        const { [id]: removed, ...rest } = prev.universities;
        return {
          ...prev,
          universities: rest
        };
      });
    } else if (target === 'page' && id) {
      // Сбрасываем кеш конкретной страницы
      setCache(prev => {
        const { [id]: removed, ...rest } = prev.pageVariables;
        return {
          ...prev,
          pageVariables: rest
        };
      });
    }
  }, []);
  
  // Значения и функции, предоставляемые контекстом
  const value = {
    // Данные
    universities: Object.values(cache.universities),
    isLoading: cache.loading,
    
    // Методы для работы с университетами
    getUniversities: refreshUniversities,
    getUniversity: getUniversityData,
    saveUniversity: saveUniversityData,
    
    // Методы для работы со страницами и переменными
    getPageVariables: getPageVariablesData,
    setPageVariables: setPageVariablesData,
    
    // Вспомогательные методы
    invalidateCache,
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
