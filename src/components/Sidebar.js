// components/Sidebar.js
import React from 'react';
import './Sidebar.css';

function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      {/* Кнопка-стрелочка для переключения состояния */}
      <button onClick={toggleSidebar} className="toggle-button">
        {isOpen ? '<' : '>'}
      </button>
      {/* Отображаем содержимое меню только если сайдбар открыт */}
      {isOpen && (
        <div className="menu">
          <h2>Меню</h2>
          <ul>
            <li><a href="#item1">Пункт 1</a></li>
            <li><a href="#item2">Пункт 2</a></li>
            <li><a href="#item3">Пункт 3</a></li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
