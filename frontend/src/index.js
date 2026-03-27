import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Login from './pages/Login';
import HistoryPage from './pages/HistoryPage';
import Admin from './pages/Admin';
import About from './pages/About';
import ThreeBackground from './components/ThreeBackground';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      {/* This MUST stay here to be the bottom layer */}
      <ThreeBackground /> 
      
      <div style={{ position: 'relative', zIndex: 10 }}> 
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<App />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </BrowserRouter>
  </React.StrictMode>
);
