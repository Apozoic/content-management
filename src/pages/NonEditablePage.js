/* NonEditablePage.js */
/* NonEditablePage.js */
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './NonEditablePage.css';

// Компонент Section теперь поддерживает сворачивание/разворачивание
export function Section({ title, children, className }) {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <div className={`noneditable-content ${className || ''}`}>
      <div className="section-header" onClick={toggleCollapse}>
        <h2>{title}</h2>
        <span className="toggle-indicator">
          {collapsed ? '▼' : '▲'}
        </span>
      </div>
      {!collapsed && <div className="section-body">{children}</div>}
    </div>
  );
}

function NonEditablePage({ title, onEditClick, children }) {
  const { id } = useParams();

  return (
    <div className="noneditable-page">
      {/* Edit Button Row */}
      <div className="noneditable-button-row">
        <button className="noneditable-edit-button" onClick={onEditClick}>
          ✎
        </button>
      </div>
      
      {/* Title Row */}
      <div className="noneditable-title-row">
        <h1>Название заведения</h1>
      </div>
      
      {/* Вывод всех секций, которые переданы через children */}
      {children}
    </div>
  );
}

export default NonEditablePage;
