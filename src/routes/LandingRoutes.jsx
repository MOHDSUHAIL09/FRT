import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import LandingLayout from '../layouts/LandingLayout';
import Home from '../pages/Landing/Home';
import Participate from '../pages/Landing/Participate';
import Explore from '../pages/Landing/Explore';
import OurApproach from '../pages/Landing/OurApproach';

const LandingRoutes = () => {
  const { isConnected } = useAccount();
  const navigate = useNavigate();

  // ✅ Jab wallet connect ho, dashboard pe redirect karo
  useEffect(() => {
    if (isConnected) {
      navigate('/dashboard', { replace: true });
    }
  }, [isConnected, navigate]);

  // ✅ Agar already connected hai toh redirect (safety)
  if (isConnected) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Routes>
      <Route element={<LandingLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/participate" element={<Participate />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/our-approach" element={<OurApproach />} />
      </Route>
    </Routes>
  );
};

export default LandingRoutes;