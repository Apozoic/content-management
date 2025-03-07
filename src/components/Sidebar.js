// components/Sidebar.js
import React, { useState } from 'react';
import './Sidebar.css';

function Sidebar({ isOpen, toggleSidebar }) {
  // Режим редактирования: по умолчанию выключен
  const [editMode, setEditMode] = useState(false);
  // Исходный список пунктов меню
  const [menuItems, setMenuItems] = useState([
    { id: 1, label: 'Пункт 1' },
    { id: 2, label: 'Пункт 2' },
    { id: 3, label: 'Пункт 3' }
  ]);

  // Переключает режим редактирования
  const toggleEditMode = () => {
    setEditMode(prev => !prev);
  };

  // Удаляет пункт меню по id
  const removeItem = (id) => {
    setMenuItems(items => items.filter(item => item.id !== id));
  };

  // Добавляет новый пункт меню (запрашиваем название через prompt)
  const addItem = () => {
    const text = window.prompt("Введите название нового пункта:");
    if (text && text.trim() !== "") {
      const newItem = { id: new Date().getTime(), label: text };
      setMenuItems(items => [...items, newItem]);
    }
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      {/* Кнопка-стрелочка для переключения видимости сайдбара */}
      <button onClick={toggleSidebar} className="toggle-button">
        {isOpen ? '<' : '>'}
      </button>
      {isOpen && (
        <>
          {/* Заголовок сайдбара с кнопкой редактирования */}
          <div className="sidebar-header">
            <button onClick={toggleEditMode} className="edit-button">
              {editMode ? 'Готово' : 'Редактировать'}
            </button>
          </div>
          {/* Меню */}
          <div className="menu">
            <ul>
              {menuItems.map(item => (
                <li key={item.id}>
                  <a href={`#${item.label}`}>{item.label}</a>
                  {/* Если включен режим редактирования, отображаем кнопку удаления */}
                  {editMode && (
                    <button onClick={() => removeItem(item.id)} className="remove-button">
                      &minus;
                    </button>
                  )}
                </li>
              ))}
              {/* При активном режиме редактирования отображается кнопка добавления */}
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
