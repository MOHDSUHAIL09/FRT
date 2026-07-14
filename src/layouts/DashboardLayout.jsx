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

  // Agar connected nahi hai toh null return (parent handle karega)
  if (!isConnected) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#111111]">
      <Navbar />
      <main className="px-4 md:px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;