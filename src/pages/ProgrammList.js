/* ProgrammList.js */

import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import NonEditablePage from "./NonEditablePage";
import { getPageVariables, savePageVariables } from "../services/api";
import "./ProgrammList.css";

function ProgrammList() {
  const { id } = useParams();
  
  // Локальное состояние для переменных
  const [variables, setVariables] = useState({
    type: "",
    site: "",
    country: "",
    city: "",
    address: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  // Загрузка переменных при первом рендере
  useEffect(() => {
    const fetchVariables = async () => {
      setIsLoading(true);
      try {
        const data = await getPageVariables(id);
        if (Object.keys(data).length > 0) {
          setVariables(prev => ({
            ...prev,
            ...data
          }));
        }
      } catch (error) {
        console.error("Error loading variables:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVariables();
  }, [id]);

  const handleEditClick = async () => {
    if (isEditing) {
      // Если выходим из режима редактирования, сохраняем данные
      try {
        await savePageVariables(id, variables);
      } catch (error) {
        console.error("Error saving variables:", error);
        // Можно добавить обработку ошибок, например показать уведомление
      }
    }
    setIsEditing(prev => !prev);
  };

 
  if (isLoading) {
    return <div>Загрузка данных...</div>;
  }

  return (
    <NonEditablePage 
      title="Список программ" 
      onEditClick={handleEditClick}
      firstSectionTitle="Список программ" // Передаем пользовательский заголовок
    >
      {/* Здесь будет контент секции */}
      <p>Содержимое списка программ...</p>
    </NonEditablePage>
  );
}

export default ProgrammList;
