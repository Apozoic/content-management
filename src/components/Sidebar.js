import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import './Sidebar.css';

function Sidebar({ isOpen, toggleSidebar, activeTab, setActiveTab }) {
  const [menuItems, setMenuItems] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  // Получаем вкладки с сервера при монтировании
  useEffect(() => {
    fetch('http://localhost:3001/menuItems')
      .then((res) => res.json())
      .then((data) => {
        // Сортируем по order (если отсутствует, по id)
        const sorted = data.sort((a, b) => {
          const orderA = a.order !== undefined ? a.order : a.id;
          const orderB = b.order !== undefined ? b.order : b.id;
          return orderA - orderB;
        });
        setMenuItems(sorted);
      })
      .catch((err) => console.error('Ошибка загрузки меню:', err));
  }, []);

  // Финализируем изменения: обновляем на сервере поля label, order и editable
  const finalizeEdits = async () => {
    try {
      await Promise.all(
        menuItems.map(async (item) => {
          return fetch(`http://localhost:3001/menuItems/${item.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              label: item.label,
              order: item.order,
              editable: item.editable
            }),
          });
        })
      );
    } catch (error) {
      console.error('Ошибка обновления пунктов:', error);
    }
  };

  // Обработчик drag-n-drop для изменения порядка вкладок
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    if (sourceIndex === destinationIndex) return;
    const updated = [...menuItems];
    const [removed] = updated.splice(sourceIndex, 1);
    updated.splice(destinationIndex, 0, removed);
    const withOrder = updated.map((item, index) => ({ ...item, order: index }));
    setMenuItems(withOrder);
  };

  // Удаление вкладки (если editable === true)
  const removeItem = async (id) => {
    try {
      await fetch(`http://localhost:3001/menuItems/${id}`, { method: 'DELETE' });
      setMenuItems((items) => items.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Ошибка удаления пункта:', error);
    }
  };

  // Добавление новой вкладки — новые вкладки получают editable: true
  const addItem = async () => {
    const newItem = {
      label: '',
      order: menuItems.length,
      editable: true,
    };
    try {
      const response = await fetch('http://localhost:3001/menuItems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      const addedItem = await response.json();
      setMenuItems((items) => [...items, addedItem]);
    } catch (error) {
      console.error('Ошибка добавления пункта:', error);
    }
  };

  // Обработка изменения текста в поле ввода
  const handleInputChange = (id, event) => {
    const newLabel = event.target.value;
    setMenuItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, label: newLabel } : item
      )
    );
  };

  // Переключение режима редактирования.
  // При выходе (нажатии "Готово") размываем активный input (если есть) и вызываем finalizeEdits.
  const toggleEditMode = async () => {
    if (editMode) {
      if (document.activeElement && document.activeElement.tagName === 'INPUT') {
        document.activeElement.blur();
      }
      await finalizeEdits();
    }
    setEditMode((prev) => !prev);
  };

  // Обработка клика по вкладке (в режиме просмотра)
  const handleTabClick = (item) => {
    if (item.editable) {
      navigate(`/editable/${item.id}`);
    } else {
      navigate(`/noneditable/${item.id}`);
    }
    setActiveTab(item.id);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <button onClick={toggleSidebar} className="toggle-button">
        {isOpen ? '<' : '>'}
      </button>
      <div className="sidebar-header">
        <button onClick={toggleEditMode} className="edit-button">
          {editMode ? 'Готово' : '✎'}
        </button>
      </div>
      <div className="menu">
        {editMode ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="menu">
              {(provided) => (
                <ul
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="menu-list"
                >
                  {menuItems.map((item, index) => (
                    <Draggable
                      draggableId={item.id.toString()}
                      key={item.id}
                      index={index}
                    >
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="menu-item"
                        >
                          <span className="drag-handle">☰</span>
                          {item.editable ? (
                            <input
                              type="text"
                              value={item.label}
                              onChange={(e) => handleInputChange(item.id, e)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') e.target.blur();
                              }}
                              autoFocus={item.label === ''}
                              className="menu-input"
                            />
                          ) : (
                            <input
                              type="text"
                              value={item.label}
                              disabled
                              className="menu-input read-only"
                            />
                          )}
                          {item.editable && (
                            <button
                              onClick={() => removeItem(item.id)}
                              className="remove-button"
                            >
                              &minus;
                            </button>
                          )}
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  <li className="add-item">
                    <button onClick={addItem} className="add-button">
                      +
                    </button>
                  </li>
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <div className="display-menu">
            {menuItems.map((item) => (
              <button
                key={item.id}
                className={`display-item-button ${activeTab === item.id ? 'active' : ''} ${item.editable ? 'editable' : 'noneditable'}`}
                onClick={() => handleTabClick(item)}
              >
                {item.label || "Новая вкладка"}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
