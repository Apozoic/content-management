/* PageLayout.js */
import React, { useState } from 'react';
import './PageLayout.css';

// Компонент для отдельных блоков с возможностью настройки
function ContentBlock({ children, className, title }) {
  return (
    <div className={`content-block ${className || ''}`}>
      {title && <div className="block-header">{title}</div>}
      <div className="block-content">
        {children}
      </div>
    </div>
  );
}

// Основной шаблон страницы
function PageLayout({ 
  leftSidebar, 
  mainContent, 
  comments,
  rightSidebar,
  // Настройки отображения
  defaultLeftSidebarOpen = false,
  defaultRightSidebarOpen = false,
  showComments = true,
}) {
  // Состояния для сайдбаров (по умолчанию скрыты)
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(defaultLeftSidebarOpen);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(defaultRightSidebarOpen);

  return (
    <div className={`page-layout 
      ${!showComments ? 'no-comments' : ''}
      ${!leftSidebarOpen ? 'left-sidebar-closed' : 'left-sidebar-open'}
      ${!rightSidebarOpen ? 'right-sidebar-closed' : 'right-sidebar-open'}
    `}>
      {/* Левый сайдбар с кнопкой разворачивания */}
      <div className="layout-left-sidebar">
        <button 
          className="sidebar-toggle left-toggle"
          onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
        >
          {leftSidebarOpen ? '◀' : '▶'}
        </button>
        <div className="sidebar-content">
          <ContentBlock className="sidebar">
            {leftSidebar}
          </ContentBlock>
        </div>
      </div>
      
      {/* Основной контент */}
      <div className="layout-main-content">
        <ContentBlock>
          {mainContent}
        </ContentBlock>
      </div>
      
      {/* Комментарии (если включены) */}
      {showComments && (
        <div className="layout-comments">
          <ContentBlock title="Комментарии">
            {comments}
          </ContentBlock>
        </div>
      )}
      
      {/* Правый сайдбар с кнопкой разворачивания */}
      <div className="layout-right-sidebar">
        <button 
          className="sidebar-toggle right-toggle"
          onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
        >
          {rightSidebarOpen ? '▶' : '◀'}
        </button>
        <div className="sidebar-content">
          <ContentBlock className="sidebar">
            {rightSidebar}
          </ContentBlock>
        </div>
      </div>
    </div>
  );
}

export default PageLayout;
export { ContentBlock };
