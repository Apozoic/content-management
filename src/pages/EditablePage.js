import React from 'react';
import { useParams } from 'react-router-dom';

function EditablePage() {
  const { id } = useParams();
  return (
    <div>
      <h1>Редактируемая вкладка {id}</h1>
      <p>Здесь отображается контент редактируемой вкладки на основе общего шаблона.</p>
    </div>
  );
}

export default EditablePage;
