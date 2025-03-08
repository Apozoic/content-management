/* useUniversityTable.js */
/* useUniversityTable.js */
import { useState, useEffect, useCallback } from 'react';
import { useAppData } from '../context/DataContext';

// Константы
const FIELD_NAMES = ['name', 'location', 'website', 'founded', 'type'];

export function useUniversityTable() {
  const { getUniversities, universities, saveUniversity, isLoading } = useAppData();
  const [tableData, setTableData] = useState([]);
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');

  // Загрузка данных (определена с useCallback)
  const loadUniversities = useCallback(async () => {
    try {
      await getUniversities();
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    }
  }, [getUniversities]);

  // Используем loadUniversities в useEffect
  useEffect(() => {
    loadUniversities();
  }, [loadUniversities]);

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

  const saveChanges = async () => {
    if (!editingCell) return;
    
    const { row, col } = editingCell;
    const newTableData = [...tableData];
    newTableData[row][col] = editValue;
    setTableData(newTableData);
    
    try {
      if (row < universities.length) {
        await updateUniversity(row, col);
      } else if (col === 0 && editValue.trim()) {
        await createUniversity();
      }
      
      await getUniversities(); // Обновляем данные
    } catch (error) {
      console.error('Ошибка при сохранении данных:', error);
    }
    
    setEditingCell(null);
    setEditValue('');
  };
  
  const updateUniversity = async (row, col) => {
    const university = universities[row];
    const updatedUniversity = { ...university };
    
    // Обновляем нужное поле
    const field = FIELD_NAMES[col];
    
    if (field === 'founded') {
      updatedUniversity[field] = editValue ? parseInt(editValue, 10) : null;
    } else {
      updatedUniversity[field] = editValue;
    }
    
    await saveUniversity(university.id, updatedUniversity);
  };
  
  const createUniversity = async () => {
    const newId = Date.now();
    const newUniversity = {
      id: newId,
      name: editValue,
      location: '',
      website: '',
      founded: null,
      type: ''
    };
    
    await saveUniversity(newId, newUniversity);
  };

  // Возвращаем данные и функции для компонента
  return {
    tableData,
    editingCell,
    editValue,
    isLoading,
    startEditing,
    cancelEditing,
    handleInputChange,
    saveChanges
  };
}
