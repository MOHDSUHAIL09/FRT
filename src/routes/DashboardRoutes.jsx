import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import DashboardLayout from '../layouts/DashboardLayout';
import DashboardView from '../pages/Dashboard/DashboardView';
import Refer from '../pages/Dashboard/Refer';
import History from '../pages/Dashboard/History';
import Profile from '../pages/Dashboard/Profile';

const DashboardRoutes = () => {
  const { isConnected } = useAccount();

  // ✅ Agar connected nahi hai toh landing pe bhejo
  if (!isConnected) {
    return <Navigate to="/" replace />;
  }

  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<DashboardView />} />
        <Route path="refer" element={<Refer />} />
        <Route path="history" element={<History />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
};

export default DashboardRoutes;