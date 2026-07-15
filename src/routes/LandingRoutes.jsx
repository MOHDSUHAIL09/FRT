import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import LandingLayout from '../layouts/LandingLayout';
import Home from '../pages/Landing/Home';

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
      </Route>
    </Routes>
  );
};

export default LandingRoutes;