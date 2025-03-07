import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import './App.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  const toggleEditMode = () => {
    setEditMode((prevState) => !prevState);
  };

  return (
    <div className={`App ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Sidebar component */}
      <Sidebar isOpen={isSidebarOpen} editMode={editMode} toggleEditMode={toggleEditMode} />

      {/* Toggle button located outside the sidebar */}
      <button className="toggle-button" onClick={toggleSidebar}>
        {isSidebarOpen ? '<' : '>'}
      </button>

      {/* Main content */}
      <div className="content">
        <h1>Добро пожаловать!</h1>
        <p>Здесь находится основное содержимое страницы.</p>
      </div>
    </div>
  );
}

export default App;
