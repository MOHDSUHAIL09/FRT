// src/App.jsx
//  API Call - Sirf address aur referrer_Id dynamic, baaki sab static

import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAccount, useReadContract } from 'wagmi';
import { isAddress } from 'viem';

import LandingRoutes from './routes/LandingRoutes';
import DashboardRoutes from './routes/DashboardRoutes';
import RegistrationModal from './components/RegistrationModal';
import { REGISTRATION_ABI } from './abi/registrationAbi';

const 
CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0xf8D1615a0Db38BcEf280B5DE5cb5036E2f2aDF11';
const API_URL = 'https://frtapi-des-cen-3.onrender.com/api/Authentication/register';

const App = () => {
  const { isConnected, address } = useAccount();
  const location = useLocation();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const modalOpenedRef = useRef(false);

  //  Check if user is registered
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

  console.log('📝 App - Is Registered:', isUserRegistered);
  console.log('App - Error:', regError?.message);

  //  Update registration status
  useEffect(() => {
    if (address) {
      setIsChecking(checkingRegistration);
      if (!checkingRegistration) {
        const contractReg = isUserRegistered === true;
        const localReg = localStorage.getItem(`registered_${address}`) === 'true';
        const isReg = contractReg || localReg;
        
        setIsRegistered(isReg);
        console.log('📝 App - Registration Status:', isReg ? ' Registered' : 'Not Registered');
        
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

  //  Open modal when wallet connects
  useEffect(() => {
    if (isConnected && address && !isChecking && !isRegistered && !modalOpenedRef.current) {
      console.log(' Opening registration modal...');
      setShowModal(true);
      modalOpenedRef.current = true;
    }
  }, [isConnected, address, isChecking, isRegistered]);

  //    SIMPLE API CALL - Sirf address aur referrer_Id dynamic
  const saveUserToDatabase = async (walletAddress, sponsorAddress) => {
    console.log('📤 ===== API CALL START =====');
    console.log('  Wallet Address:', walletAddress);
    console.log('  Sponsor Address:', sponsorAddress);

    try {
      //    SIRF YEH DO FIELDS DYNAMIC HAIN
      const requestBody = {
        introRegNo: 0,                    //  Static
        introSide: "R",                   //  Static
        fName: "string",                  //  Static
        lName: "string",                  //  Static
        mobile: "123456",                 //  Static
        email: "user@example.com",        //  Static
        loginId: "string",                //  Static
        password: "string",               //  Static
        address: walletAddress,           //    WALLET ADDRESS (Dynamic)
        affiliate_Level: 2147483647,      //  Static
        referrer_Id: sponsorAddress || '', //    SPONSOR ADDRESS (Dynamic)
        country: 91                       //  Static
      };
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('📥 Response Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        
        let errorMessage = 'Failed to save user to database';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.result || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log(' API Success:', data);
      return data;

    } catch (error) {
      console.error('API Call Failed:', error.message);
      return null;
    }
  };

  //  Handle registration success - API Call + Redirect
  const handleRegistrationSuccess = async (sponsorAddress) => {
    console.log(' ===== REGISTRATION SUCCESS =====');
    console.log('  Sponsor Address:', sponsorAddress);
    
    if (address) {
      localStorage.setItem(`registered_${address}`, 'true');     
      //  Step 2: API Call - Sirf address aur referrer_Id
      console.log('📤 Calling API to save user...');
      await saveUserToDatabase(address, sponsorAddress);
      
      //  Step 3: Update state
      console.log('🔄 Updating state...');
      setIsRegistered(true);
      setShowModal(false);
      modalOpenedRef.current = false;
      
      //  Step 4: Redirect to dashboard
      console.log('🔄 Redirecting to dashboard...');
      setTimeout(() => {
        refetch();
        navigate('/dashboard', { replace: true });
      }, 500);
    } else {
      console.warn('⚠️ No wallet address found!');
    }
  };

  const handleModalClose = () => {
    if (isRegistered) {
      setShowModal(false);
      modalOpenedRef.current = false;
    }
  };

  return (
    <>
      <Routes>
        <Route path="/*" element={<LandingRoutes />} />
        <Route path="/dashboard/*" element={<DashboardRoutes />} />
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