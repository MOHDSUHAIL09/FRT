
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';

const LandingLayout = () => {
  return (
    <div className="min-h-screen bg-[#111111]">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default LandingLayout;