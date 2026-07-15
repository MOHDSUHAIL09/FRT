
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import FeaturesSection from '../pages/Landing/FeaturesSection ';
import Visionsection from '../pages/Landing/Visionsection';
import WorkSection from '../pages/Landing/WorkSection';
import Ecosystem from '../pages/Landing/Ecosystem';
import Foresight from '../pages/Landing/Foresight';
import Fotter from '../components/common/Fotter';






const LandingLayout = () => {
  return (
    <div className="min-h-screen">
      <Header />     
      <main>
        <Outlet />
      </main>
      <FeaturesSection/>
      <Visionsection/>
      <WorkSection/>
      <Ecosystem/>
      <Foresight/>
      <Fotter/>
    </div>
  );
};

export default LandingLayout;