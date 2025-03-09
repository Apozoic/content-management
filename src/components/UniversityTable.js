/* UniversityTable.js */
/* UniversityTable.js */
import React from 'react';
import { useUniversityTable } from './useUniversityTable';
import './UniversityTable.css';

// Константы
const COLUMN_HEADERS = [
  "Название университета", 
  "Местоположение", 
  "Веб-сайт", 
  "Год основания", 
  "Тип"
];

function UniversityTable() {
  const {
    tableData,
    editingCell,
    editValue,
    isLoading,
    startEditing,
    cancelEditing,
    handleInputChange,
    saveChanges
  } = useUniversityTable();

  // Обработчик нажатия клавиш
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') saveChanges();
    if (e.key === 'Escape') cancelEditing();
  };

  // Рендеринг ячейки
  const renderCell = (cell, rowIndex, colIndex) => {
    const isEditing = editingCell?.row === rowIndex && editingCell?.col === colIndex;
    const cellClass = `table-cell ${isEditing ? 'editing' : ''} ${colIndex === 0 ? 'name-column' : ''}`;
    
    return (
      <td 
        key={colIndex} 
        className={cellClass}
        onClick={() => startEditing(rowIndex, colIndex)}
      >
        {isEditing ? (
          <input
            type="text"
            className="cell-input"
            value={editValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={saveChanges}
            autoFocus
          />
        ) : cell}
      </td>
    );
  };

  return (
    <div className="university-table-container">
      <h2>Университеты</h2>
      
      {isLoading ? (
        <div className="loading">Загрузка данных...</div>
      ) : (
        <table className="university-table">
          <thead>
            <tr>
              {COLUMN_HEADERS.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => renderCell(cell, rowIndex, colIndex))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UniversityTable;
