// src/routes/DashboardRoutes.jsx
// ✅ Dashboard Routes - Protected

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import DashboardLayout from '../layouts/DashboardLayout';
import DashboardView from '../pages/Dashboard/DashboardView';
import Refer from '../pages/Dashboard/Refer';
// import History from '../pages/Dashboard/History';
import Profile from '../pages/Dashboard/Profile';
import Liquidity from '../pages/Dashboard/Liquidity';

const DashboardRoutes = () => {
  const { isConnected } = useAccount();

  // ✅ Agar connected nahi hai toh home pe redirect
  if (!isConnected) {
    return <Navigate to="/" replace />;
  }

  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<DashboardView />} />
        <Route path="refer" element={<Refer />} />
        {/* <Route path="history" element={<History />} /> */}
        <Route path="Liquidity" element={<Liquidity/>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default DashboardRoutes;