import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wallet, UserPlus, Copy, Check, Loader2, Shield, AlertCircle 
} from 'lucide-react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { isAddress } from 'viem';
import { useNavigate } from 'react-router-dom';

const RegistrationModal = ({ isOpen, onClose, address, onSuccess, contractAddress, abi }) => {
  const navigate = useNavigate();
  const [sponsorAddress, setSponsorAddress] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [registrationError, setRegistrationError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  // ✅ REFS - Track if already processed
  const successHandledRef = useRef(false);

  // ✅ ✅ ✅ FIXED: Success handler - DIRECT REDIRECT, NO ALERT
  useEffect(() => {
    // ✅ Agar already handled ho gaya toh return
    if (successHandledRef.current) return;
    
    if (isConfirmed && hash) {
      // ✅ Flag set karo - Dobara nahi chalega
      successHandledRef.current = true;
      
      setRegistrationSuccess(true);
      setTxHash(hash);
      
      // ✅ ✅ ✅ DIRECT REDIRECT - NO ALERT
      setTimeout(() => {
        // ✅ Modal close karo
        onClose();
        
        // ✅ Success callback
        if (onSuccess) {
          onSuccess(sponsorAddress);
        }
        
        // ✅ ✅ ✅ DIRECT REDIRECT TO DASHBOARD
        navigate('/dashboard', { replace: true });
        
        // ✅ Reset states
        setRegistrationSuccess(false);
        setSponsorAddress('');
        setTxHash('');
        setIsProcessing(false);
        successHandledRef.current = false;
        
      }, 1000); // ✅ 1 second wait for smooth UX
    }
  }, [isConfirmed, hash, onSuccess, sponsorAddress, onClose, navigate]);

  // ✅ Error handler - SIRF EK BAAR
  const errorHandledRef = useRef(false);
  
  useEffect(() => {
    if (error && !errorHandledRef.current) {
      errorHandledRef.current = true;
      console.error('❌ Registration error:', error);
      const errorMsg = error.message || 'Registration failed. Please try again.';
      setRegistrationError(errorMsg);
      setIsProcessing(false);
      
      // ✅ Reset after 5 seconds
      setTimeout(() => {
        errorHandledRef.current = false;
      }, 5000);
    }
  }, [error]);

  // ✅ Pending handler
  useEffect(() => {
    if (isPending) {
      setIsProcessing(true);
    }
  }, [isPending]);

  // ✅ Reset success flag when modal closes
  useEffect(() => {
    if (!isOpen) {
      successHandledRef.current = false;
      errorHandledRef.current = false;
      setRegistrationSuccess(false);
      setRegistrationError('');
      setIsProcessing(false);
    }
  }, [isOpen]);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleRegister = async () => {
    setRegistrationError('');
    setRegistrationSuccess(false);
    setTxHash('');
    setIsProcessing(true);
    
    // ✅ Reset flags
    successHandledRef.current = false;
    errorHandledRef.current = false;
    
    if (!sponsorAddress) {
      const msg = 'Please enter sponsor address';
      setRegistrationError(msg);
      setIsProcessing(false);
      return;
    }

    if (!isAddress(sponsorAddress)) {
      const msg = 'Invalid sponsor address.';
      setRegistrationError(msg);
      setIsProcessing(false);
      return;
    }

    if (sponsorAddress.toLowerCase() === address?.toLowerCase()) {
      const msg = 'You cannot be your own sponsor';
      setRegistrationError(msg);
      setIsProcessing(false);
      return;
    }

    const userId = address;

    try {
      await writeContract({
        address: contractAddress,
        abi: abi,
        functionName: 'register',
        args: [sponsorAddress, userId],
      });
    } catch (err) {
      console.error('❌ Registration error:', err);
      const msg = err.message || 'Registration failed. Please try again.';
      setRegistrationError(msg);
      setIsProcessing(false);
    }
  };

  // ✅ Close modal handler
  const handleModalClose = () => {
    if (registrationSuccess) {
      onClose();
    } else {
      setRegistrationError('Please complete registration to continue');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(12px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            style={{
              background: 'linear-gradient(180deg, #0d1b3e, #0a0e1a)',
              borderRadius: '24px',
              maxWidth: '480px',
              width: '100%',
              padding: '28px',
              border: '1px solid rgba(28,133,234,0.2)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.8)'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{
                padding: '10px',
                borderRadius: '12px',
                background: 'rgba(28,133,234,0.12)',
                color: '#4facfe'
              }}>
                <Shield size={24} />
              </div>
              <div>
                <h3 style={{ color: '#fff', margin: 0, fontSize: '20px', fontWeight: '700' }}>
                  Complete Registration
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.4)', margin: 0, fontSize: '12px' }}>
                  Enter sponsor address to register
                </p>
              </div>
            </div>

            {/* Success Message - NO ALERT, only UI feedback */}
            {registrationSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  padding: '14px 16px',
                  borderRadius: '12px',
                  background: 'rgba(34,197,94,0.08)',
                  border: '1px solid rgba(34,197,94,0.15)',
                  marginBottom: '20px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Check size={20} color="#4ade80" />
                  <span style={{ color: '#4ade80', fontSize: '14px', fontWeight: '500' }}>
                    ✅ Registration Successful! Redirecting to dashboard...
                  </span>
                </div>
              </motion.div>
            )}

            {/* Error Message */}
            {registrationError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.15)',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <AlertCircle size={20} color="#ef4444" />
                <span style={{ color: '#ef4444', fontSize: '14px', fontWeight: '500' }}>
                  {registrationError}
                </span>
              </motion.div>
            )}

            {/* Wallet Address */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                display: 'block',
                marginBottom: '6px'
              }}>
                <Wallet size={14} style={{ display: 'inline', marginRight: '6px' }} />
                Your Wallet Address
              </label>
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '12px',
                padding: '12px 16px',
                border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{
                  color: '#4facfe',
                  fontSize: '14px',
                  fontWeight: '500',
                  fontFamily: 'monospace'
                }}>
                  {address?.slice(0, 8)}...{address?.slice(-6)}
                </span>
                <button 
                  onClick={copyAddress}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '4px 12px',
                    color: 'rgba(255,255,255,0.3)',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {isCopied ? <Check size={14} color="#4ade80" /> : <Copy size={14} />}
                  {isCopied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p style={{
                color: 'rgba(255,255,255,0.2)',
                fontSize: '11px',
                margin: '6px 0 0 0'
              }}>
                Your wallet address will be used as User ID
              </p>
            </div>

            {/* Sponsor Address */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                display: 'block',
                marginBottom: '6px'
              }}>
                <UserPlus size={14} style={{ display: 'inline', marginRight: '6px' }} />
                Sponsor Address *
              </label>
              <input
                type="text"
                value={sponsorAddress}
                onChange={(e) => setSponsorAddress(e.target.value)}
                placeholder="Enter sponsor wallet address (0x...)"
                disabled={isProcessing || isConfirming || registrationSuccess}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${sponsorAddress ? 'rgba(28,133,234,0.2)' : 'rgba(255,255,255,0.05)'}`,
                  color: '#e4e4e7',
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
              />
              <p style={{
                color: 'rgba(255,255,255,0.2)',
                fontSize: '11px',
                margin: '6px 0 0 0'
              }}>
                Enter any wallet address as sponsor
              </p>
            </div>

            {/* Register Button */}
            <motion.button
              onClick={handleRegister}
              disabled={isProcessing || isConfirming || !sponsorAddress || registrationSuccess}
              whileHover={!(isProcessing || isConfirming || registrationSuccess) ? { scale: 1.02 } : {}}
              whileTap={!(isProcessing || isConfirming || registrationSuccess) ? { scale: 0.98 } : {}}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '14px',
                border: 'none',
                fontWeight: '700',
                fontSize: '16px',
                cursor: (isProcessing || isConfirming || !sponsorAddress || registrationSuccess) ? 'not-allowed' : 'pointer',
                background: registrationSuccess
                  ? 'rgba(34,197,94,0.1)'
                  : isProcessing || isConfirming 
                    ? 'rgba(28,133,234,0.2)' 
                    : 'linear-gradient(135deg, #1c85ea, #4facfe)',
                color: registrationSuccess
                  ? '#4ade80'
                  : isProcessing || isConfirming 
                    ? 'rgba(255,255,255,0.5)' 
                    : '#ffffff',
                boxShadow: registrationSuccess || isProcessing || isConfirming 
                  ? 'none' 
                  : '0 4px 20px rgba(28,133,234,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'all 0.3s ease',
                opacity: (isProcessing || isConfirming || !sponsorAddress || registrationSuccess) ? 0.6 : 1
              }}
            >
              {registrationSuccess ? (
                <>
                  <Check size={20} />
                  ✅ Redirecting...
                </>
              ) : isProcessing || isConfirming ? (
                <>
                  <Loader2 size={20} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
                  {isProcessing ? 'Processing...' : 'Confirming...'}
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  Register Now
                </>
              )}
            </motion.button>

            {/* Status Text */}
            <div style={{ textAlign: 'center', marginTop: '12px' }}>
              {isProcessing || isConfirming ? (
                <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px' }}>
                  {isProcessing ? 'Processing registration...' : 'Please confirm the transaction in your wallet'}
                </p>
              ) : registrationSuccess ? (
                <p style={{ color: '#4ade80', fontSize: '13px', fontWeight: '500' }}>
                  ✅ Registration successful! Redirecting to dashboard...
                </p>
              ) : (
                <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '11px' }}>
                  Enter any wallet address as sponsor to register
                </p>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default RegistrationModal;