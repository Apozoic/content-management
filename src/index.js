/* index.js */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { DataProvider } from './context/DataContext';
import './index.css';

window.process = {
  env: {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PUBLIC_URL: process.env.PUBLIC_URL || ''
  }
};

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <DataProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </DataProvider>
  </React.StrictMode>
);
