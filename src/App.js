/* App.js */
// App.js - исправленная версия
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
// Импортируйте другие компоненты страниц

function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      {/* Другие маршруты */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
