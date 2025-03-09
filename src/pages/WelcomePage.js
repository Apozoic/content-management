/* WelcomePage.js */
/* WelcomePage.js */
/* WelcomePage.js */
import React from 'react';
import PageLayout from './PageLayout'; // Проверьте правильность пути
import { Link } from 'react-router-dom';
import UniversityTable from '../components/UniversityTable';
import { useUniversityTable } from '../components/useUniversityTable';

// Компоненты для разных секций
const LeftSidebar = () => (
  <div className="sidebar-menu">
    <ul>
      <li><Link to="/">Главная</Link></li>
      <li><Link to="/universities">Университеты</Link></li>
      <li><Link to="/programs">Программы</Link></li>
      <li><Link to="/settings">Настройки</Link></li>
    </ul>
  </div>
);

const Comments = () => (
  <div>
    <p>Здесь будут отображаться комментарии пользователей.</p>
  </div>
);

const RightSidebar = () => (
  <div>
    <p>Дополнительная информация или панель быстрого доступа.</p>
  </div>
);

function WelcomePage() {
  // Получаем функцию из хука
  const { addNewUniversity } = useUniversityTable();

  return (
    <PageLayout
      leftSidebar={<LeftSidebar />}
      mainContent={
        <div className="welcome-content">
          <h1>Управление университетами</h1>
          <p>Выберите университет из таблицы ниже для редактирования или добавьте новый.</p>
          
          {/* Таблица университетов */}
          <UniversityTable />
          
          <div className="actions">
            <button 
              className="add-university-btn" 
              onClick={addNewUniversity}
            >
              + Добавить университет
            </button>
          </div>
        </div>
      }
      comments={<Comments />}
      rightSidebar={<RightSidebar />}
      defaultLeftSidebarOpen={false}
      defaultRightSidebarOpen={false}
      showComments={false} // Отключаем отображение комментариев
    />
  );
}

export default WelcomePage;
