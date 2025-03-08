/* ProgrammList.js */
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import NonEditablePage, { Section } from "./NonEditablePage";
import { getPageVariables, savePageVariables } from "../services/api";
import "./ProgrammList.css";

function ProgrammList() {
  const { id } = useParams();

  // Добавляем новое поле programList в начальное состояние
  const [variables, setVariables] = useState({
    type: "",
    site: "",
    country: "",
    city: "",
    address: "",
    programList: "" // HTML контент для списка программ
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
      try {
        await savePageVariables(id, variables);
      } catch (error) {
        console.error("Error saving variables:", error);
      }
    }
    setIsEditing(prev => !prev);
  };

  const handleInputChange = (field, value) => {
    setVariables(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Теперь первая секция – список программ
  // В режиме редактирования отображается textarea, иначе HTML-контент.
  return (
    <NonEditablePage title="Список программ" onEditClick={handleEditClick}>
      {/* Первая секция: список программ */}
      <Section title="Список программ" className="noneditable-content-1">
        {isEditing ? (
          <textarea
            className="program-list-textarea"
            value={variables.programList}
            placeholder='Введите список программ, например: <a href="https://example.com">Программа 1</a>'
            onChange={(e) => handleInputChange("programList", e.target.value)}
          />
        ) : (
          <div
            className="program-list-content"
            // Рендерим HTML-контент, введенный пользователем
            dangerouslySetInnerHTML={{
              __html:
                variables.programList ||
                "<p>Содержимое списка программ...</p>",
            }}
          />
        )}
      </Section>

      {/* Вторая секция */}
      <Section title="Требования к поступающим" className="noneditable-content-2">
        <p>Информация о требованиях для поступления на программы.</p>
        <ul>
          <li>Минимальный балл ЕГЭ</li>
          <li>Необходимые документы</li>
          <li>Сроки подачи заявлений</li>
        </ul>
      </Section>

      {/* Третья секция */}
      <Section title="Стоимость обучения" className="noneditable-content-3">
        <p>Информация о стоимости обучения на различных программах.</p>
        <p>Возможности получения скидок и грантов.</p>
      </Section>
    </NonEditablePage>
  );
}

export default ProgrammList;
