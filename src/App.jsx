import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingRoutes from './routes/LandingRoutes';
import DashboardRoutes from './routes/DashboardRoutes';

const App = () => {
  return (
    <Routes>
      {/* Landing page routes */}
      <Route path="/*" element={<LandingRoutes />} />
      
      {/* Dashboard routes - Protected */}
      <Route path="/dashboard/*" element={<DashboardRoutes />} />
      
      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;

