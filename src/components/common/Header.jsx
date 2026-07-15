import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Wallet, LogOut, CheckCircle, Menu, X } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

import logo from '../../assets/img/logo/logo.png'

const Header = () => {
  const { isConnected } = useAccount();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  

  // ✅ Tumhara navItems - yahi logic rahega
  const navItems = [
    { id: 'HOME', label: 'Home', path: '/' },
    { id: 'FEATURES', label: 'Features', path: '/features' },
    { id: 'WORK', label: 'How It Works', path: '/work' },
    { id: 'ROADMAP', label: 'Roadmap', path: '/roadmap' },
    { id: 'CONTACT', label: 'Contact', path: '/contact' }
  ];

  // ✅ Mobile menu toggle
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header id="home">
      {/* Sticky Header */}
      <div id="sticky-header" className="tg-header__area transparent-header">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="tgmenu__wrap">
                <nav className="tgmenu__nav" style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%'
                }}>

                  {/* Logo - Left */}
                  <div className="logo" style={{ flexShrink: 0 }}>
                    <Link to={isConnected ? '/dashboard' : '/'}>
                      <img src={logo} alt="Logo" />
                    </Link>
                  </div>

                  {/* ✅ Desktop Navigation - Center (Mobile me hide) */}
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
                                fontWeight: isActive ? 'bold' : 'normal'
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
                  <div className="mobile-nav-toggler" onClick={toggleMobileMenu} style={{
                    cursor: 'pointer',
                    padding: '8px',
                    color: '#fff',
                    display: 'none'
                  }}>
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                  </div>

                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Mobile Sidebar with Animation - Blue Theme */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="tgmobile__menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.7)',
                zIndex: 998
              }}
            />

            {/* Sidebar */}
            <motion.div
              className="tgmobile__menu"
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ 
                type: 'spring', 
                damping: 25, 
                stiffness: 300,
                duration: 0.3
              }}
              style={{
                position: 'fixed',
                right: 0,
                top: 0,
                width: '320px',
                height: '100%',
                background: '#0a0a0f',
                zIndex: 999,
                padding: '24px 20px',
                overflowY: 'auto',
                borderLeft: '1px solid #1a1a2e'
              }}
            >
              <nav className="tgmobile__menu-box">
                {/* Close Button */}
                <div className="close-btn" onClick={closeMobileMenu} style={{
                  textAlign: 'right',
                  cursor: 'pointer',
                  color: '#ffffff',
                  fontSize: '24px',
                  padding: '4px'
                }}>
                  <X size={24} />
                </div>
                
                {/* Logo */}
                <div className="nav-logo" style={{ 
                  marginBottom: '30px',
                  paddingBottom: '20px',
                  borderBottom: '1px solid #1a1a2e'
                }}>
                  <Link to="/" onClick={closeMobileMenu}>
                    <img src={logo} alt="Logo" style={{ maxHeight: '40px' }} />
                  </Link>
                </div>
                
                {/* Navigation Links */}
                <div className="tgmobile__menu-outer">
                  <ul className="navigation" style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0
                  }}>
                    {navItems.map((item) => {
                      const isActive = location.pathname === item.path;
                      return (
                        <motion.li 
                          key={item.id} 
                          className={isActive ? 'active' : ''} 
                          style={{
                            borderBottom: '1px solid #1a1a2e',
                            padding: '14px 0'
                          }}
                          whileHover={{ x: 5 }}
                          transition={{ type: 'spring', stiffness: 400 }}
                        >
                          <Link
                            to={item.path}
                            className="section-link"
                            onClick={closeMobileMenu}
                            style={{
                              color: isActive ? '#1c85ea' : '#ffffff',
                              textDecoration: 'none',
                              fontSize: '16px',
                              fontWeight: isActive ? 'bold' : 'normal',
                              display: 'block',
                              transition: 'color 0.3s ease'
                            }}
                          >
                            {item.label}
                          </Link>
                        </motion.li>
                      );
                    })}
                  </ul>
                </div>

                {/* ✅ Connect Wallet Button - Blue Theme */}
                <div style={{
                  marginTop: '30px',
                  paddingTop: '20px',
                  borderTop: '1px solid #1a1a2e'
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
                                padding: '14px 20px',
                                background: '#1c85ea',
                                border: 'none',
                                borderRadius: '12px',
                                color: '#ffffff',
                                fontWeight: 'bold',
                                fontSize: '16px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px'
                              }}
                            >
                              <Wallet size={20} />
                              Connect Wallet
                            </motion.button>
                          ) : chain?.unsupported ? (
                            <button onClick={openChainModal} style={{
                              width: '100%',
                              padding: '14px 20px',
                              background: 'red',
                              border: 'none',
                              borderRadius: '12px',
                              color: '#fff',
                              fontWeight: 'bold',
                              fontSize: '16px',
                              cursor: 'pointer'
                            }}>
                              Wrong Network
                            </button>
                          ) : (
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              background: 'rgba(28,133,234,0.1)',
                              border: '1px solid rgba(28,133,234,0.3)',
                              borderRadius: '12px',
                              padding: '12px 16px'
                            }}>
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                              }}>
                                <div style={{
                                  width: '40px',
                                  height: '40px',
                                  borderRadius: '10px',
                                  background: 'rgba(34,197,94,0.1)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: '#4ade80'
                                }}>
                                  <CheckCircle size={20} />
                                </div>
                                <div>
                                  <span style={{ fontSize: '11px', color: '#71717a', display: 'block' }}>
                                    Connected
                                  </span>
                                  <span style={{ fontSize: '14px', color: '#e4e4e7', fontWeight: 'bold' }}>
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
                                  borderRadius: '8px',
                                  background: 'transparent',
                                  border: 'none',
                                  color: '#71717a',
                                  cursor: 'pointer'
                                }}
                              >
                                <LogOut size={18} />
                              </motion.button>
                            </div>
                          )}
                        </div>
                      );
                    }}
                  </ConnectButton.Custom>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;