// components/Sidebar.js
import React, { useState, useEffect } from 'react';
import './Sidebar.css';

function Sidebar({ isOpen, toggleSidebar }) {
  const [menuItems, setMenuItems] = useState([]);
  const [editMode, setEditMode] = useState(false);

  // Загружаем пункты меню с сервера при монтировании компонента
  useEffect(() => {
    fetch('http://localhost:3001/menuItems')
      .then(response => response.json())
      .then(data => setMenuItems(data))
      .catch(error => console.error('Ошибка загрузки меню:', error));
  }, []);

  // Удаление пункта меню на сервере
  const removeItem = (id) => {
    fetch(`http://localhost:3001/menuItems/${id}`, {
      method: 'DELETE'
    })
      .then(() => {
        setMenuItems(items => items.filter(item => item.id !== id));
      })
      .catch(error => console.error('Ошибка удаления пункта:', error));
  };

  // Добавление нового пункта меню на сервере
  const addItem = () => {
    const text = window.prompt('Введите название нового пункта:');
    if (text && text.trim() !== '') {
      // Здесь для уникальности id можно использовать, например, время
      const newItem = { id: new Date().getTime(), label: text };

      fetch('http://localhost:3001/menuItems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newItem)
      })
        .then(response => response.json())
        .then(addedItem => {
          setMenuItems(items => [...items, addedItem]);
        })
        .catch(error => console.error('Ошибка добавления пункта:', error));
    }
  };

  // Переключатель режима редактирования
  const toggleEditMode = () => {
    setEditMode(prev => !prev);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      {/* Кнопка-стрелочка для переключения видимости сайдбара */}
      <button onClick={toggleSidebar} className="toggle-button">
        {isOpen ? '<' : '>'}
      </button>
      {isOpen && (
        <>
          <div className="sidebar-header">
            <button onClick={toggleEditMode} className="edit-button">
              {editMode ? 'Готово' : 'Редактировать'}
            </button>
          </div>
          <div className="menu">
            <ul>
              {menuItems.map(item => (
                <li key={item.id}>
                  <a href={`#${item.label}`}>{item.label}</a>
                  {editMode && (
                    <button onClick={() => removeItem(item.id)} className="remove-button">
                      &minus;
                    </button>
                  )}
                </li>
              ))}
              {editMode && (
                <li className="add-item">
                  <button onClick={addItem} className="add-button">+</button>
                </li>
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default Sidebar;
