/* NonEditablePage.js */
// NonEditablePage.js
import React from 'react';
import { useParams } from 'react-router-dom';
import './NonEditablePage.css';

// Экспортируем компонент Section для использования в других файлах
export function Section({ title, children, className }) {
  return (
    <div className={`noneditable-content ${className || ''}`}>
      <h2>{title}</h2>
      {children}
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
      
      {/* Здесь выводим все секции, которые передаются через children */}
      {children}
    </div>
  );
}

export default NonEditablePage;
