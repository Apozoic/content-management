import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import './App.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const [editorContent, setEditorContent] = useState(""); // содержимое текстового редактора

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
        {activeTab ? (
          <div>
            <h2>Текстовый редактор для вкладки {activeTab}</h2>
            <textarea 
              value={editorContent}
              onChange={(e)=> setEditorContent(e.target.value)}
              style={{width:"100%", height:"400px"}}
            />
          </div>
        ) : (
          <div>
            <h1>Добро пожаловать!</h1>
            <p>Выберите вкладку для редактирования.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
