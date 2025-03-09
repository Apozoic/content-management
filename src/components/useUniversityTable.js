/* useUniversityTable.js */
// hooks/useUniversityTable.js
import { useState, useEffect, useCallback } from 'react';
import { useAppData } from '../context/DataContext';

// Константы
const FIELD_NAMES = ['name', 'location', 'website', 'founded', 'type'];

export function useUniversityTable() {
const { getUniversities, universities, isLoading } = useAppData();
const [tableData, setTableData] = useState([]);
const [editingCell, setEditingCell] = useState(null);
const [editValue, setEditValue] = useState('');

// Загрузка данных при монтировании
useEffect(() => {
getUniversities();
}, [getUniversities]);

// Обновление таблицы при изменении данных
useEffect(() => {
if (!universities) return;

const uniData = universities.map(uni => [
uni.name || '',
uni.location || '',
uni.website || '',
uni.founded?.toString() || '',
uni.type || ''
]);

while (uniData.length < 5) {
uniData.push(['', '', '', '', '']);
}

setTableData(uniData);
}, [universities]);

// Функции редактирования
const startEditing = useCallback((rowIndex, colIndex) => {
if (editingCell) return;
setEditingCell({ row: rowIndex, col: colIndex });
setEditValue(tableData[rowIndex][colIndex]);
}, [editingCell, tableData]);

const cancelEditing = useCallback(() => {
setEditingCell(null);
setEditValue('');
}, []);

const handleInputChange = useCallback((e) => {
setEditValue(e.target.value);
}, []);

// Создание нового университета напрямую через fetch
const createNewUniversity = useCallback(async (name) => {
    try {
      const newUniversity = {
        // НЕ передаём поле id – сервер сам назначит его
        name: name || `Новый университет`,
        location: '',
        website: '',
        founded: null,
        type: ''
      };
      
      console.log(`Создаем новый университет`);
      
      const createResponse = await fetch('http://localhost:3001/universities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUniversity)
      });
      
      if (!createResponse.ok) {
        throw new Error(`Ошибка создания: ${createResponse.status}`);
      }
      
      const createdRecord = await createResponse.json();
      
      // Обновляем данные через контекст сразу после создания
      await getUniversities();
      
      return createdRecord;
    } catch (error) {
      console.error('Ошибка при создании университета:', error);
      throw error;
    }
  }, [getUniversities]);
  

// Обновление университета напрямую через fetch
// Обновление университета напрямую через fetch - исправлено
const updateExistingUniversity = useCallback(async (updatedUniversity) => {
    try {
      // Формируем URL с id, который уже хранится в updatedUniversity,
      // он должен быть серверным (после создания через POST)
      const updateUrl = `http://localhost:3001/universities/${updatedUniversity.id}`;
      console.log(`Обновляем университет по URL: ${updateUrl}`);
      
      const updateResponse = await fetch(updateUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUniversity)
      });
      
      if (!updateResponse.ok) {
        throw new Error(`Ошибка обновления: ${updateResponse.status}`);
      }
      
      await getUniversities(); // Обновляем данные в контексте
    } catch (error) {
      console.error('Ошибка при обновлении:', error);
    }
  }, [getUniversities]);
  







// Сохранение изменений
const saveChanges = useCallback(async () => {
    if (!editingCell) return;
    
    const { row, col } = editingCell;
    const newTableData = [...tableData];
    newTableData[row][col] = editValue;
    setTableData(newTableData);
    
    try {
      if (row < universities.length) {
        // Редактируем существующий университет
        const university = universities[row];
        const updatedUniversity = { ...university };
        const field = FIELD_NAMES[col];
        if (field === 'founded') {
          updatedUniversity[field] = editValue ? parseInt(editValue, 10) : null;
        } else {
          updatedUniversity[field] = editValue;
        }
        
        await updateExistingUniversity(updatedUniversity);
      } else if (col === 0 && editValue.trim()) {
        // Создаем новый университет
        await createNewUniversity(editValue);
      }
    } catch (error) {
      console.error('Ошибка при сохранении данных:', error);
    }
    
    setEditingCell(null);
    setEditValue('');
  }, [editingCell, editValue, tableData, universities, updateExistingUniversity, createNewUniversity]);

  
  
// Добавление нового университета
const addNewUniversity = useCallback(async () => {
    try {
      await createNewUniversity();
    } catch (error) {
      console.error('Ошибка при добавлении университета:', error);
    }
  }, [createNewUniversity]);

return {
tableData,
editingCell,
editValue,
isLoading,
startEditing,
cancelEditing,
handleInputChange,
saveChanges,
addNewUniversity
};
}