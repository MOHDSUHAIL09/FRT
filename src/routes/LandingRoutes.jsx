// src/routes/LandingRoutes.jsx
// ✅ Landing Routes - No redirect, Header inside LandingLayout

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingLayout from '../layouts/LandingLayout';
import Home from '../pages/Landing/Home';

const LandingRoutes = () => {

  return (
    <Routes>
      <Route element={<LandingLayout />}>
        <Route path="/" element={<Home />} />
        {/* Add more landing routes here */}
      </Route>
    </Routes>
  );
};

export default LandingRoutes;