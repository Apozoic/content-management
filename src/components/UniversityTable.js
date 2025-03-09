import React, { useMemo, useCallback } from 'react';
import { useTable } from 'react-table';
import { useUniversityTable } from './useUniversityTable';
import './UniversityTable.css';

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

  // Обработчик нажатия клавиш при редактировании - обернут в useCallback
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') saveChanges();
    if (e.key === 'Escape') cancelEditing();
  }, [saveChanges, cancelEditing]);

  // Рендерим ячейку с возможностью редактирования
  // Рендерим ячейку с возможностью редактирования
const renderCell = useCallback((value, rowIndex, colIndex) => {
    const isEditing = editingCell?.row === rowIndex && editingCell?.col === colIndex;
    
    if (isEditing) {
      return (
        <input
          type="text"
          className="modern-cell-input"
          value={editValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={saveChanges}
          autoFocus
        />
      );
    }
    
    // Особая обработка для колонки "Веб-сайт" (индекс 2)
    if (colIndex === 2 && value) {
      // Проверяем наличие протокола в URL
      let href = value;
      if (value && !value.startsWith('http://') && !value.startsWith('https://')) {
        href = `https://${value}`;
      }
      
      return (
        <div 
          className="cell-content"
          onClick={() => startEditing(rowIndex, colIndex)}
        >
          <a 
            href={href} 
            className="website-link"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              // Предотвращаем переход по ссылке при клике (только если нужно)
              // e.preventDefault();
              
              // Предотвращаем запуск режима редактирования
              e.stopPropagation();
            }}
          >
            {value}
          </a>
        </div>
      );
    }
    
    // Для обычных ячеек
    return (
      <div 
        className="cell-content"
        onClick={() => startEditing(rowIndex, colIndex)}
      >
        {value}
      </div>
    );
  }, [editingCell, editValue, handleInputChange, handleKeyDown, saveChanges, startEditing]);
  

  // Преобразуем данные для react-table
  const data = useMemo(() => {
    return tableData.map((row, index) => ({
      name: row[0],
      location: row[1],
      website: row[2],
      founded: row[3],
      type: row[4],
      id: index
    }));
  }, [tableData]);

  // Определение колонок для react-table
  const columns = useMemo(() => [
    {
      Header: 'Название университета',
      accessor: 'name',
      width: '30%',
      Cell: ({ row }) => renderCell(row.original.name, row.index, 0)
    },
    {
      Header: 'Местоположение',
      accessor: 'location',
      width: '20%',
      Cell: ({ row }) => renderCell(row.original.location, row.index, 1)
    },
    {
      Header: 'Веб-сайт',
      accessor: 'website',
      width: '20%',
      Cell: ({ row }) => renderCell(row.original.website, row.index, 2)
    },
    {
      Header: 'Год основания',
      accessor: 'founded',
      width: '15%',
      Cell: ({ row }) => renderCell(row.original.founded, row.index, 3)
    },
    {
      Header: 'Тип',
      accessor: 'type',
      width: '15%',
      Cell: ({ row }) => renderCell(row.original.type, row.index, 4)
    }
  ], [renderCell]);

  // Инициализируем react-table
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({ columns, data });

  if (isLoading) {
    return (
      <div className="university-table-container">
        <div className="modern-loading">
          <div className="spinner"></div>
          <p>Загрузка данных...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="university-table-container">
      <h2 className="modern-table-title">Университеты</h2>
      
      <div className="modern-table-wrapper">
        <table className="modern-table" {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup, hgIndex) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={`header-group-${hgIndex}`}>
                {headerGroup.headers.map((column, colIndex) => (
                  <th 
                    {...column.getHeaderProps()}
                    style={{ width: column.width }}
                    key={`header-${colIndex}`}
                  >
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, rowIndex) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={`row-${rowIndex}`}>
                  {row.cells.map((cell, cellIndex) => (
                    <td {...cell.getCellProps()} key={`cell-${rowIndex}-${cellIndex}`}>
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UniversityTable;
