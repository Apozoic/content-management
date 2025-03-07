import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import EditablePage from './pages/EditablePage';
import NonEditablePage from './pages/NonEditablePage';
import './App.css';
import GeneralInfoPage from './pages/GeneralInfoPage';
import ProgrammList from './pages/ProgrammList';


function App() {
  // Можно хранить состояние открытого сайдбара и выбранной вкладки
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div className={`App ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
      />
      <div className="content">
        <Routes>
        <Route path="/editable/:id" element={<EditablePage />} />
          <Route path="/noneditable/1741314245696" element={<ProgrammList />} />
          <Route path="/noneditable/1741314243113" element={<GeneralInfoPage />} />
          <Route path="/noneditable/:id" element={<NonEditablePage />} />
          <Route path="*" element={<div>Выберите вкладку для редактирования.</div>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
