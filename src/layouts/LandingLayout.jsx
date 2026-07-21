// src/layouts/LandingLayout.jsx
// ✅ Landing Layout - Header + All Sections + Footer

import React from 'react';
import { Outlet } from 'react-router-dom';

// ✅ Components
import Header from '../components/common/Header';           // ✅ Landing Header
import FeaturesSection from '../pages/Landing/FeaturesSection ';
import Visionsection from '../pages/Landing/Visionsection';
import WorkSection from '../pages/Landing/WorkSection';
import Ecosystem from '../pages/Landing/Ecosystem';
import Foresight from '../pages/Landing/Foresight';
import Footer from '../components/common/Fotter';           // ✅ Footer
const LandingLayout = () => {
  return (
    <div className="min-h-screen" style={{ background: '#0a0e1a' }}>

      <Header />

      <main>
        <Outlet />
      </main>


      <FeaturesSection />
      <Visionsection />
      <WorkSection />
      <Ecosystem />
      <Foresight />

      <Footer />
    </div>
  );
};

export default LandingLayout;