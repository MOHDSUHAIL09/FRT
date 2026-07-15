import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Wallet, LogOut, CheckCircle, Menu, X, ChevronRight } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

import logo from '../../assets/img/logo/logo.png';

const Header = () => {
  const { isConnected } = useAccount();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'HOME', label: 'Home', path: '/' },
    { id: 'FEATURES', label: 'Features', path: '/features' },
    { id: 'WORK', label: 'How It Works', path: '/work' },
    { id: 'ROADMAP', label: 'Roadmap', path: '/roadmap' },
    { id: 'CONTACT', label: 'Contact', path: '/contact' }
  ];

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header id="home">
      <div id="sticky-header" className="tg-header__area transparent-header">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="tgmenu__wrap">
                <nav className="tgmenu__nav" style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '10px 0'
                }}>

                  {/* Logo - Left */}
                  <div className="logo" style={{ flexShrink: 0 }}>
                    <Link to={isConnected ? '/dashboard' : '/'}>
                      <img src={logo} alt="Logo" style={{ height: '40px' }} />
                    </Link>
                  </div>

                  {/* Desktop Navigation - Center */}
                  <div className="tgmenu__navbar-wrap tgmenu__main-menu d-none d-lg-flex" style={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <ul className="navigation" style={{
                      display: 'flex',
                      alignItems: 'center',
                      margin: 0,
                      padding: 0,
                      gap: '5px'
                    }}>
                      {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                          <li key={item.id} className={isActive ? 'active' : ''} style={{ listStyle: 'none' }}>
                            <Link
                              to={item.path}
                              className="section-link"
                              onClick={closeMobileMenu}
                              style={{
                                color: isActive ? '#1c85ea' : '#ffffff',
                                fontWeight: isActive ? 'bold' : 'normal',
                                textDecoration: 'none',
                                padding: '8px 16px',
                                transition: 'color 0.3s ease'
                              }}
                            >
                              {item.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* Action Buttons - Right */}
                  <div className="tgmenu__action" style={{ flexShrink: 0 }}>
                    <ul className="list-wrap" style={{
                      display: 'flex',
                      alignItems: 'center',
                      margin: 0,
                      padding: 0,
                      gap: '10px'
                    }}>
                      <li className="header-btn" style={{ listStyle: 'none' }}>
                        <ConnectButton.Custom>
                          {({
                            account,
                            chain,
                            openAccountModal,
                            openChainModal,
                            openConnectModal,
                            authenticationStatus,
                            mounted,
                          }) => {
                            const ready = mounted && authenticationStatus !== 'loading';
                            const connected = ready && account && chain;

                            return (
                              <div {...(!ready && { 'aria-hidden': true, style: { opacity: 0, pointerEvents: 'none', userSelect: 'none' } })}>
                                {!connected ? (
                                  <button
                                    onClick={openConnectModal}
                                    className="tg-btn"
                                    style={{
                                      background: '#1c85ea',
                                      color: '#fff',
                                      border: 'none',
                                      padding: '10px 24px',
                                      borderRadius: '30px',
                                      fontWeight: 'bold',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '8px'
                                    }}
                                  >
                                    <Wallet size={16} />
                                    Connect Wallet
                                  </button>
                                ) : chain?.unsupported ? (
                                  <button onClick={openChainModal} className="tg-btn" style={{ background: 'red', color: '#fff', padding: '10px 24px', borderRadius: '30px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                                    Wrong Network
                                  </button>
                                ) : (
                                  <div className="flex items-center gap-2 bg-zinc-900/50 border border-zinc-800 rounded-xl p-1 pr-3">
                                    <div className="h-8 w-8 rounded-lg bg-green-500/10 text-green-400 flex items-center justify-center">
                                      <CheckCircle size={14} />
                                    </div>
                                    <div className="text-left leading-none hidden sm:block">
                                      <span className="text-[10px] text-zinc-500 font-mono block">
                                        Connected
                                      </span>
                                      <span className="text-xs text-zinc-200 font-mono font-bold block">
                                        {account.address?.slice(0, 6)}...{account.address?.slice(-4)}
                                      </span>
                                    </div>
                                    <div className="h-5 w-[1px] bg-zinc-800 mx-2 hidden sm:block" />
                                    <button
                                      onClick={openAccountModal}
                                      className="p-1 rounded-lg text-zinc-500 hover:bg-zinc-800 hover:text-red-400 transition-all cursor-pointer"
                                    >
                                      <LogOut size={14} />
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          }}
                        </ConnectButton.Custom>
                      </li>
                    </ul>
                  </div>

                  {/* Mobile Toggle Button */}
                  <div 
                    className="mobile-nav-toggler" 
                    onClick={toggleMobileMenu} 
                    style={{
                      cursor: 'pointer',
                      padding: '8px',
                      color: '#fff',
                      display: 'none'
                    }}
                  >
                    <Menu size={28} />
                  </div>

                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Premium Mobile Sidebar */}
      <AnimatePresence mode="wait">
        {isMobileMenuOpen && (
          <>
            {/* Backdrop with blur */}
            <motion.div
              className="tgmobile__menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={closeMobileMenu}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.85)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                zIndex: 998
              }}
            />

            {/* Sidebar */}
            <motion.div
              className="tgmobile__menu"
              initial={{ x: '100%', opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0.5 }}
              transition={{ 
                type: 'tween',
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              style={{
                position: 'fixed',
                right: 0,
                top: 0,
                width: '340px',
                maxWidth: '85vw',
                height: '100%',
                background: 'linear-gradient(180deg, #0a0e1a 0%, #0d1225 50%, #0a0e1a 100%)',
                zIndex: 999,
                overflowY: 'auto',
                borderLeft: '1px solid rgba(28, 133, 234, 0.15)',
                boxShadow: '-20px 0 60px rgba(0,0,0,0.8), -5px 0 30px rgba(28,133,234,0.05)'
              }}
            >
              <nav className="tgmobile__menu-box" style={{
                padding: '0'
              }}>
                
                {/* ✅ Premium Header - Different Color */}
                <div className="sidebar-header" style={{ 
                  background: 'linear-gradient(135deg, #0d1b3e 0%, #1a2d5e 50%, #0d1b3e 100%)',
                  padding: '24px 24px 20px',
                  borderBottom: '1px solid rgba(28, 133, 234, 0.2)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  
                  {/* Logo + Close Button */}
                  <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'relative',
                    zIndex: 1
                  }}>
                    <Link to="/" onClick={closeMobileMenu} style={{ flexShrink: 0 }}>
                      <img src={logo} alt="Logo" style={{ 
                        maxHeight: '42px',
                        filter: 'brightness(1.1)'
                      }} />
                    </Link>
                    
                    {/* Close Button - Premium */}
                    <motion.div 
                      onClick={closeMobileMenu} 
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      style={{
                        cursor: 'pointer',
                        color: '#ffffff',
                        padding: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '12px',
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        width: '44px',
                        height: '44px',
                        transition: 'all 0.3s ease',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <X size={22} />
                    </motion.div>
                  </div>


                </div>
                
                {/* Navigation Links - Premium */}
                <div className="tgmobile__menu-outer" style={{
                  padding: '16px 20px'
                }}>
                  <ul className="navigation" style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0
                  }}>
                    {navItems.map((item, index) => {
                      const isActive = location.pathname === item.path;
                      return (
                        <motion.li 
                          key={item.id} 
                          className={isActive ? 'active' : ''} 
                          style={{
                            marginBottom: '4px',
                            borderRadius: '12px',
                            background: isActive ? 'rgba(28, 133, 234, 0.12)' : 'transparent',
                            border: isActive ? '1px solid rgba(28, 133, 234, 0.2)' : '1px solid transparent',
                            transition: 'all 0.3s ease',
                            overflow: 'hidden'
                          }}
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ 
                            delay: index * 0.06,
                            duration: 0.3,
                            ease: [0.25, 0.46, 0.45, 0.94]
                          }}
                          whileHover={{
                            background: 'rgba(255,255,255,0.05)',
                            x: 5
                          }}
                        >
                          <Link
                            to={item.path}
                            className="section-link"
                            onClick={closeMobileMenu}
                            style={{
                              color: isActive ? '#4facfe' : '#e4e4e7',
                              textDecoration: 'none',
                              fontSize: '15px',
                              fontWeight: isActive ? '600' : '400',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '14px 18px',
                              transition: 'all 0.3s ease',
                              letterSpacing: '0.3px'
                            }}
                          >
                            <span>{item.label}</span>
                            {isActive && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 500 }}
                              >
                                <ChevronRight size={18} style={{ color: '#4facfe' }} />
                              </motion.div>
                            )}
                          </Link>
                        </motion.li>
                      );
                    })}
                  </ul>
                </div>

                {/* Divider */}
                <div style={{
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(28,133,234,0.2), transparent)',
                  margin: '0 20px'
                }} />

                {/* Connect Wallet Button - Premium */}
                <div style={{
                  padding: '20px 20px 24px'
                }}>
                  <ConnectButton.Custom>
                    {({
                      account,
                      chain,
                      openAccountModal,
                      openChainModal,
                      openConnectModal,
                      authenticationStatus,
                      mounted,
                    }) => {
                      const ready = mounted && authenticationStatus !== 'loading';
                      const connected = ready && account && chain;

                      return (
                        <div {...(!ready && { 'aria-hidden': true, style: { opacity: 0, pointerEvents: 'none', userSelect: 'none' } })}>
                          {!connected ? (
                            <motion.button
                              onClick={openConnectModal}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              style={{
                                width: '100%',
                                padding: '16px 20px',
                                background: 'linear-gradient(135deg, #1c85ea, #4facfe)',
                                border: 'none',
                                borderRadius: '14px',
                                color: '#ffffff',
                                fontWeight: '600',
                                fontSize: '15px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '12px',
                                boxShadow: '0 4px 20px rgba(28, 133, 234, 0.3)',
                                transition: 'all 0.3s ease'
                              }}
                            >
                              <Wallet size={20} />
                              Connect Wallet
                            </motion.button>
                          ) : chain?.unsupported ? (
                            <button onClick={openChainModal} style={{
                              width: '100%',
                              padding: '16px 20px',
                              background: 'linear-gradient(135deg, #dc3545, #ff6b7a)',
                              border: 'none',
                              borderRadius: '14px',
                              color: '#fff',
                              fontWeight: '600',
                              fontSize: '15px',
                              cursor: 'pointer',
                              boxShadow: '0 4px 20px rgba(220, 53, 69, 0.3)'
                            }}>
                              Wrong Network
                            </button>
                          ) : (
                            <motion.div 
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                background: 'rgba(28,133,234,0.08)',
                                border: '1px solid rgba(28,133,234,0.2)',
                                borderRadius: '14px',
                                padding: '12px 16px',
                                backdropFilter: 'blur(10px)'
                              }}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.2 }}
                            >
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                              }}>
                                <div style={{
                                  width: '40px',
                                  height: '40px',
                                  borderRadius: '10px',
                                  background: 'rgba(34,197,94,0.12)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: '#4ade80'
                                }}>
                                  <CheckCircle size={20} />
                                </div>
                                <div>
                                  <span style={{ fontSize: '10px', color: '#71717a', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Connected
                                  </span>
                                  <span style={{ fontSize: '13px', color: '#e4e4e7', fontWeight: '600' }}>
                                    {account.address?.slice(0, 6)}...{account.address?.slice(-4)}
                                  </span>
                                </div>
                              </div>
                              <motion.button
                                onClick={openAccountModal}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                style={{
                                  padding: '8px',
                                  borderRadius: '10px',
                                  background: 'rgba(255,255,255,0.05)',
                                  border: '1px solid rgba(255,255,255,0.05)',
                                  color: '#71717a',
                                  cursor: 'pointer',
                                  transition: 'all 0.3s ease'
                                }}
                              >
                                <LogOut size={18} />
                              </motion.button>
                            </motion.div>
                          )}
                        </div>
                      );
                    }}
                  </ConnectButton.Custom>
                </div>

                {/* Footer Text */}
                <div style={{
                  padding: '0 20px 20px',
                  textAlign: 'center'
                }}>
                  <p style={{
                    color: 'rgba(255,255,255,0.2)',
                    fontSize: '10px',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    margin: 0
                  }}>
                    © 2026 Foresight • Web3 Ecosystem
                  </p>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ✅ CSS for responsive & animations */}
      <style jsx>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @media (max-width: 991px) {
          .tgmenu__navbar-wrap {
            display: none !important;
          }
          .mobile-nav-toggler {
            display: block !important;
          }
        }
        @media (min-width: 992px) {
          .mobile-nav-toggler {
            display: none !important;
          }
        }
        
        /* Smooth scroll for mobile menu */
        .tgmobile__menu {
          will-change: transform, opacity;
          -webkit-overflow-scrolling: touch;
        }
        
        .tgmobile__menu-backdrop {
          will-change: opacity;
        }

        /* Scrollbar styling */
        .tgmobile__menu::-webkit-scrollbar {
          width: 3px;
        }
        .tgmobile__menu::-webkit-scrollbar-track {
          background: transparent;
        }
        .tgmobile__menu::-webkit-scrollbar-thumb {
          background: rgba(28, 133, 234, 0.3);
          border-radius: 10px;
        }
        .tgmobile__menu::-webkit-scrollbar-thumb:hover {
          background: rgba(28, 133, 234, 0.5);
        }
      `}</style>
    </header>
  );
};

export default Header;