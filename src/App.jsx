// src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAccount, useReadContract } from 'wagmi';
import { isAddress } from 'viem';

import LandingRoutes from './routes/LandingRoutes';
import DashboardRoutes from './routes/DashboardRoutes';
import RegistrationModal from './components/RegistrationModal';
import { REGISTRATION_ABI } from './abi/registrationAbi';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0xf8D1615a0Db38BcEf280B5DE5cb5036E2f2aDF11';
const API_BASE_URL = 'https://frtapi-des-cen-3.onrender.com';


const App = () => {
  const { isConnected, address } = useAccount();
  const location = useLocation();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const modalOpenedRef = useRef(false);
  const loginAttemptedRef = useRef(false);

  // ✅ Check if user is registered (Contract)
  const { 
    data: isUserRegistered, 
    isLoading: checkingRegistration, 
    error: regError,
    refetch 
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: REGISTRATION_ABI,
    functionName: 'isRegistered',
    args: [address],
    query: {
      enabled: !!address && address !== '0x' && isAddress(CONTRACT_ADDRESS),
    },
  });

  // ✅ ✅ ✅ LOGIN API CALL - Check if user exists in database
  const handleLogin = async (walletAddress) => {
    try {
      setIsLoading(true);
      
      const requestBody = {
        loginId: walletAddress,
        password: "string",
        deviceId: "web"
      };

      const response = await fetch(`${API_BASE_URL}/api/Authentication/login`, {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      // ✅ ✅ ✅ LOGIN SUCCESS (200)
      if (response.status === 200) {
        const data = await response.json();
      if (data.success) {
          // ✅ Save token
          const token = data.token;
          if (token) {
            localStorage.setItem('token', token);
            localStorage.setItem('isLoggedIn', 'true');
          }

          // ✅ Save user data
          if (data.data) {
            localStorage.setItem('userData', JSON.stringify(data.data));
            localStorage.setItem(`registered_${walletAddress}`, 'true');
          }

          setIsLoggedIn(true);
          setIsRegistered(true);
          setShowModal(false);
          modalOpenedRef.current = false;     
          // ✅ Redirect to dashboard
          navigate('/dashboard', { replace: true });
          return true;
        }
      } 
       
      // ✅ Agar 404 ya 401 hai toh registration modal open karo
      if (response.status === 404 || response.status === 401) {
        if (!modalOpenedRef.current && !isRegistered) {
          setShowModal(true);
          modalOpenedRef.current = true;
        }
      } else {
        // ✅ Other errors - try to parse response
        try {
          const errorData = await response.json();
          
          // ✅ Agar "User not found" type ka error hai toh modal open
          if (errorData.message?.toLowerCase().includes('not found') || 
              errorData.message?.toLowerCase().includes('invalid')) {;
            if (!modalOpenedRef.current && !isRegistered) {
              setShowModal(true);
              modalOpenedRef.current = true;
            }
          }
        } catch {
          // ✅ Agar response parse nahi ho paaya, toh bhi modal open
          if (!modalOpenedRef.current && !isRegistered) {
            setShowModal(true);
            modalOpenedRef.current = true;
          }
        }
      }
      
      return false;

    } catch (error) {
      console.error('❌ Login API Error:', error);
      
      // ✅ API call fail ho toh contract check karo
      if (isUserRegistered === true) {
        setIsRegistered(true);
        localStorage.setItem(`registered_${address}`, 'true');
        navigate('/dashboard', { replace: true });
        return true;
      } else {
        // ✅ Contract bhi nahi hai toh modal open
        if (!modalOpenedRef.current && !isRegistered) {
          setShowModal(true);
          modalOpenedRef.current = true;
        }
        return false;
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ ✅ ✅ REGISTER API CALL
  const saveUserToDatabase = async (walletAddress, sponsorAddress) => {
    try {
      const requestBody = {
        introRegNo: 0,
        introSide: "R",
        fName: "string",
        lName: "string",
        mobile: "123456",
        email: "user@example.com",
        loginId: walletAddress,
        password: "string",
        address: walletAddress,           
        affiliate_Level: 2147483647,
        referrer_Id: sponsorAddress || '',
        country: 91
      };

      const response = await fetch(`${API_BASE_URL}/api/Authentication/register`, {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // ✅ Registration successful - Now auto login
          await handleLogin(walletAddress);
          return true;
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Register Failed:', errorData);
        alert('Registration failed: ' + (errorData.message || 'Unknown error'));
        return false;
      }
    } catch (error) {
      console.error('❌ Register API Error:', error);
      alert('Registration API error: ' + error.message);
      return false;
    }
  };

  // ✅ Update registration status
  useEffect(() => {
    if (address) {
      setIsChecking(checkingRegistration);
      if (!checkingRegistration) {
        const contractReg = isUserRegistered === true;
        const localReg = localStorage.getItem(`registered_${address}`) === 'true';
        const isReg = contractReg || localReg;
        
        setIsRegistered(isReg);
        
        if (isReg) {
          setShowModal(false);
          modalOpenedRef.current = false;
        }
      }
    } else {
      setIsChecking(false);
      setIsRegistered(false);
    }
  }, [address, isUserRegistered, checkingRegistration]);

  // ✅ ✅ ✅ MAIN LOGIC - When wallet connects
  useEffect(() => {
    const checkUserAndRedirect = async () => {
      if (isConnected && address && !isChecking) {      
        // ✅ First check if already logged in (token exists)
        const hasToken = localStorage.getItem('token') !== null;
        const isLocallyRegistered = localStorage.getItem(`registered_${address}`) === 'true';
        
        if (hasToken && isLocallyRegistered) {
          setIsLoggedIn(true);
          setIsRegistered(true);
          if (!location.pathname.startsWith('/dashboard')) {
            navigate('/dashboard', { replace: true });
          }
          return;
        }

        // ✅ Check contract first
        if (isUserRegistered === true) {
          const loggedIn = await handleLogin(address);
          if (loggedIn) {
            return;
          }
        } else {
          // ✅ Contract says not registered - Check database directly
          const loggedIn = await handleLogin(address);
          if (loggedIn) {
            return;
          }
        }

        // ✅ If not registered - open modal (only if not already open)
        if (!modalOpenedRef.current && !isRegistered && !isLoggedIn) {
          setShowModal(true);
          modalOpenedRef.current = true;
        }
      }
    };

    checkUserAndRedirect();
  }, [isConnected, address, isChecking, isUserRegistered, isRegistered, isLoggedIn, location.pathname, navigate]);

  // ✅ Handle registration success
  const handleRegistrationSuccess = async (sponsorAddress) => {  
    if (address) {
      setIsLoading(true);
      try {
        // ✅ Step 1: Save to localStorage
        localStorage.setItem(`registered_${address}`, 'true');
        
        // ✅ Step 2: Register API Call
        const registered = await saveUserToDatabase(address, sponsorAddress);
        
        if (registered) {
          // ✅ Step 3: Update state
          setIsRegistered(true);
          setIsLoggedIn(true);
          setShowModal(false);
          modalOpenedRef.current = false;
          
          // ✅ Step 4: Redirect to dashboard
          setTimeout(() => {
            refetch();
            navigate('/dashboard', { replace: true });
          }, 500);
        } else {
          console.error('❌ Registration failed in database');
          alert('Registration failed! Please try again.');
        }
      } catch (error) {
        console.error('❌ Registration flow error:', error);
        alert('Registration failed! Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleModalClose = () => {
    if (isRegistered) {
      setShowModal(false);
      modalOpenedRef.current = false;
    }
  };

  // ✅ Protected Route
  const ProtectedRoute = ({ children }) => {
    const hasToken = localStorage.getItem('token') !== null;
    const isUserRegistered = localStorage.getItem(`registered_${address}`) === 'true' || hasToken;
    
    if (isLoading) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: '#0a0e1a',
          color: '#fff'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div className="spinner" style={{
              width: '50px',
              height: '50px',
              border: '3px solid rgba(28,133,234,0.1)',
              borderTop: '3px solid #1c85ea',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }} />
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>Loading...</p>
          </div>
        </div>
      );
    }

    if (showModal) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: '#0a0e1a',
          color: '#fff'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div className="spinner" style={{
              width: '50px',
              height: '50px',
              border: '3px solid rgba(28,133,234,0.1)',
              borderTop: '3px solid #1c85ea',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }} />
            <p>Please complete registration...</p>
          </div>
        </div>
      );
    }

    if (isChecking) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: '#0a0e1a',
          color: '#fff'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div className="spinner" style={{
              width: '50px',
              height: '50px',
              border: '3px solid rgba(28,133,234,0.1)',
              borderTop: '3px solid #1c85ea',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }} />
            <p>Checking registration...</p>
          </div>
        </div>
      );
    }

    if (!isUserRegistered) {
      return <Navigate to="/" replace />;
    }

    return children;
  };

  return (
    <>
      <Routes>
        <Route path="/*" element={<LandingRoutes />} />
        <Route 
          path="/dashboard/*" 
          element={
            <ProtectedRoute>
              <DashboardRoutes />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      <RegistrationModal 
        isOpen={showModal} 
        onClose={handleModalClose}
        address={address}
        onSuccess={handleRegistrationSuccess}
        contractAddress={CONTRACT_ADDRESS}
        abi={REGISTRATION_ABI}
      />
    </>
  );
};

export default App;