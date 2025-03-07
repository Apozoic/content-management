import React from 'react';
import { useParams } from 'react-router-dom';
import './NonEditablePage.css';

function NonEditablePage({ 
  title, 
  onEditClick, 
  children, 
  firstSectionTitle = "Общая информация" // Добавляем параметр с заголовком по умолчанию
}) {
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
      
      {/* Content Section 1 with customizable title */}
      <div className="noneditable-content noneditable-content-1">
        <h2>{firstSectionTitle}</h2> {/* Используем переданный заголовок */}
        {children}
      </div>
      
      {/* Content Section 2 */}
      <div className="noneditable-content noneditable-content-2">
        <h2>Вторая секция</h2>
        <p>Содержимое второй секции страницы.</p>
      </div>
      
      {/* Content Section 3 */}
      <div className="noneditable-content noneditable-content-3">
        <h2>Третья секция</h2>
        <p>Содержимое третьей секции страницы.</p>
      </div>
    </div>
  );
}

export default NonEditablePage;
