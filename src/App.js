// App.js
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import './App.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(prevState => !prevState);
  };

  return (
    // Добавляем класс 'sidebar-open', если сайдбар открыт – для сдвига контента
    <div className={`App ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="content">
        <h1>Добро пожаловать!</h1>
        <p>Здесь находится основное содержимое страницы.</p>
      </div>
    </div>
  );
}

export default App;
