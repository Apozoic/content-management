/* ProgrammList.js */
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NonEditablePage, { Section } from "./NonEditablePage";
import { getPageVariables, savePageVariables } from "../services/universityApi";
import "./ProgrammList.css";

function ProgrammList() {
  const { id } = useParams();

  // State for the editable inputs and HTML content
  const [variables, setVariables] = useState({
    programList: "",
    // остальные поля сохраняем
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVariables = async () => {
      setIsLoading(true);
      try {
        const data = await getPageVariables(id);
        if (data) {
          setVariables((prev) => ({ ...prev, ...data }));
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
    setIsEditing((prev) => !prev);
  };

  const handleInputChange = (field, value) => {
    setVariables((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Function to determine the subgroup (H4 logic) for a link
  const getSubgroup = (text) => {
    const lowerText = text.toLowerCase();

    // Обновленная логика проверки: более специфичные правила проверяются первыми
    if (lowerText.includes("foundation")) return "Foundation";
    if (lowerText.includes("moptom") || lowerText.includes("meng")) return "Магистратура с бакалавриатом";
    if (lowerText.includes("mba")) return "MBA";
    if (lowerText.includes("certhe") || lowerText.includes("cert he") || lowerText.includes("hnc") || lowerText.includes("fdsc") || lowerText.includes("fda"))
      return "Неполный бакалавриат";
    if (lowerText.includes("llb") || lowerText.includes("top-up")) return "Бакалавриат";
    return "Бакалавриат"; // Дефолтное значение
  };

  // Function to determine the primary group (H3 logic) for a link
  const getPrimaryGroup = (text) => {
    const lowerText = text.toLowerCase();
    const primaryRules = [
      { group: "Другие", keywords: ["(online)", "education", "sociology", "forensic", "child"] },
      { group: "Спорт", keywords: ["sport"] },
      { group: "Туризм", keywords: ["tourism"] },
      { group: "Здравоохранение и медицина", keywords: ["nursery", "nursing", "medic", "pharma", "health", "optometr", "dental"] },
      { group: "Искусство", keywords: ["fine art", "photo", "music", "film"] },
      { group: "Дизайн", keywords: ["fashion", "illustra", "animation", "interior"] },
      { group: "Финансы", keywords: ["finance", "fintech", "accounting"] },
      { group: "Экономика", keywords: ["economic"] },
      { group: "Гостеприимство", keywords: ["hotel", "restaur"] },
      { group: "Архитектура", keywords: ["architect"] },
      { group: "Юриспруденция", keywords: ["law", "criminal"] },
      { group: "Международные отношения", keywords: ["international", "relation"], both: true },
      { group: "Другие", keywords: ["history"] },
      { group: "Медиа", keywords: ["journ", "media"] },
      { group: "Психология", keywords: ["psycholog"] },
      { group: "IT", keywords: ["software", "comput", "game", "information technology", "cyber", "artificial"] },
      { group: "Маркетинг", keywords: ["marketing"] },
      { group: "Менеджмент", keywords: ["manag"] },
      { group: "Бизнес", keywords: ["business", "enterpr"] },
      { group: "Арт и дизайн", keywords: ["2d", "3d", "concept", "fashion", "photo", "graphic"] },
      { group: "Инженерия", keywords: ["engineering"] },
    ];

    for (const rule of primaryRules) {
      if (rule.both) {
        if (rule.keywords.every((keyword) => lowerText.includes(keyword))) {
          return rule.group;
        }
      } else {
        if (rule.keywords.some((keyword) => lowerText.includes(keyword))) {
          return rule.group;
        }
      }
    }
    return "Другие"; // Default primary group
  };

  // Function to categorize links into primary groups and subgroups
 
  const getCategorizedLinks = () => {
    const categorized = {};
    if (!variables.programList) return [];

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(variables.programList, "text/html");
      const links = Array.from(doc.querySelectorAll("a"));

      links.forEach((link) => {
        const text = link.textContent;
        const primaryGroup = getPrimaryGroup(text);
        const subgroup = getSubgroup(text);

        if (!categorized[primaryGroup]) categorized[primaryGroup] = {};
        if (!categorized[primaryGroup][subgroup]) categorized[primaryGroup][subgroup] = [];
        categorized[primaryGroup][subgroup].push({ href: link.href, text });
      });
    } catch (error) {
      console.error("Error parsing programList HTML:", error);
    }

    // Convert grouped object into a sorted array
    const primaryOrder = [
      "Спорт",
      "Туризм",
      "Здравоохранение и медицина",
      "Искусство",
      "Дизайн",
      "Финансы",
      "Экономика",
      "Гостеприимство",
      "Архитектура",
      "Юриспруденция",
      "Международные отношения",
      "Медиа",
      "Психология",
      "IT",
      "Маркетинг",
      "Менеджмент",
      "Бизнес",
      "Арт и дизайн",
      "Инженерия",
      "Другие",
    ];
    const subgroupOrder = [
      "Бакалавриат",
      "Магистратура с бакалавриатом",
      "Неполный бакалавриат",
      "MBA",
      "Foundation"
    ];
    const result = primaryOrder.map((primary) => {
      if (!categorized[primary]) return null;

      // Собираем подгруппы согласно заданному порядку
      const sortedSubgroups = subgroupOrder
        .filter(subgroup => categorized[primary][subgroup])
        .map(subgroup => ({
          subgroup,
          links: categorized[primary][subgroup]
        }));

      return { 
        group: primary, 
        subgroups: sortedSubgroups // Убрали .reverse()
      };
    }).filter(Boolean);

    return result;
  };

  const categorizedLinksArr = !isEditing ? getCategorizedLinks() : [];
  
  // Подсчитываем общее количество ссылок
  const getTotalLinksCount = () => {
    try {
      if (!variables.programList) return 0;
      const parser = new DOMParser();
      const doc = parser.parseFromString(variables.programList, "text/html");
      return doc.querySelectorAll("a").length;
    } catch (error) {
      console.error("Error counting links:", error);
      return 0;
    }
  };

  const totalLinks = getTotalLinksCount();

  if (isLoading) {
    return <div>Загрузка данных...</div>;
  }

  return (
    <NonEditablePage title="Список программ" onEditClick={handleEditClick}>
      <Section title={`Список программ (${totalLinks})`} className="noneditable-content-1">
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
            dangerouslySetInnerHTML={{
              __html: variables.programList || "<p>Содержимое списка программ...</p>",
            }}
          />
        )}
      </Section>

      {!isEditing && (
        <Section title={`Распределение программ (${totalLinks})`} className="noneditable-content-2">
          {categorizedLinksArr.map((groupItem, idx) => {
            // Подсчитываем количество ссылок во всей группе (H3)
            const groupLinkCount = groupItem.subgroups.reduce(
              (count, subgroup) => count + subgroup.links.length, 
              0
            );
            
            return (
              <div key={idx} className="category">
                <h3>{groupItem.group} ({groupLinkCount})</h3>
                {groupItem.subgroups.map((subItem, subIdx) => (
                  <div key={subIdx} className="subcategory">
                    <h4>{subItem.subgroup} ({subItem.links.length})</h4>
                    {subItem.links.map((link, index) => (
                      <a
                        key={index}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="site-link"
                      >
                        {link.text}
                      </a>
                    ))}
                  </div>
                ))}
              </div>
            );
          })}
        </Section>
      )}
    </NonEditablePage>
  );
}

export default ProgrammList;
