// src/layouts/DashboardLayout.jsx
// ✅ Dashboard Layout - Navbar + Content

import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAccount } from 'wagmi';
import Navbar from '../components/dashboard/Navbar';


const DashboardLayout = () => {
  const { isConnected } = useAccount();

  // Loading state
  if (isConnected === undefined) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111111]">
      {/* ✅ ✅ ✅ NAVBAR - SAB SE UPAR */}
      <Navbar />
      
      {/* ✅ ✅ ✅ CONTENT */}
      <main className="px-1 md:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;