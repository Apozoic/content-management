import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './EditablePage.css'; // We'll need to create this CSS file

function EditablePage({ 
  title, 
  onEditClick, 
  children, 
  firstSectionTitle = "Содержание страницы" // Default title for first section
}) {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);

  // Toggle editing mode
  const handleEditToggle = () => {
    if (onEditClick) {
      onEditClick();
    } else {
      setIsEditing(prev => !prev);
    }
  };

  return (
    <div className="editable-page">
      {/* Edit Button Row */}
      <div className="editable-button-row">
        <button className="editable-edit-button" onClick={handleEditToggle}>
          {isEditing ? "Сохранить" : "✎"}
        </button>
      </div>
      
      {/* Title Row */}
      <div className="editable-title-row">
        <h1>{title || `Редактируемая вкладка ${id}`}</h1>
      </div>
      
      {/* Content Section 1 with customizable title */}
      <div className="editable-content editable-content-1">
        <h2>{firstSectionTitle}</h2>
        {children}
      </div>
      
      {/* Content Section 2 */}
      <div className="editable-content editable-content-2">
        <h2>Вторая секция</h2>
        <p>Это вторая секция редактируемой страницы.</p>
      </div>
      
      {/* Content Section 3 */}
      <div className="editable-content editable-content-3">
        <h2>Третья секция</h2>
        <p>Это третья секция редактируемой страницы.</p>
      </div>
    </div>
  );
}

export default EditablePage;
