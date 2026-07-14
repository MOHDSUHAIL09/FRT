import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { IconShare3 } from '@tabler/icons-react';
import {
  Wallet,
  LogOut,
  CheckCircle,
  LayoutDashboard,
  History,
  User,
} from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useDisconnect, useAccount } from 'wagmi';

const Navbar = () => {
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ NAV ITEMS - SAHI PATHS (DashboardRoutes ke hisaab se)
  const navItems = [
    { id: 'DASHBOARD', label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={16} /> },
    { id: 'REFER', label: 'Refer', path: '/dashboard/refer', icon: <IconShare3 size={16} stroke={2} /> },
    { id: 'HISTORY', label: 'History', path: '/dashboard/history', icon: <History size={16} /> },
  ];

  // Agar connected hai toh dashboard pe bhejo
  useEffect(() => {
    if (isConnected && location.pathname === '/') {
      navigate('/dashboard', { replace: true });
    }
  }, [isConnected, location.pathname, navigate]);

  // Agar connected nahi hai toh landing pe bhejo
  useEffect(() => {
    if (!isConnected && location.pathname !== '/') {
      navigate('/', { replace: true });
    }
  }, [isConnected, location.pathname, navigate]);

  // Agar connected nahi hai toh simple navbar
  if (!isConnected) {
    return (
      <nav className="border-b border-zinc-900 bg-[#000000] sticky top-0 z-40 px-4 md:px-8 py-3.5 flex items-center justify-between select-none">
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 cursor-pointer group active:scale-95 transition-transform"
        >
          <span className="font-display text-2xl md:text-3xl font-black tracking-wider text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.2)]">
            FRT
          </span>
        </div>
        <ConnectButton />
      </nav>
    );
  }

  return (
    <>
      <nav className="border-b border-zinc-900 bg-[#000000] sticky top-0 z-40 px-4 md:px-8 py-3.5 flex items-center justify-between select-none">

        {/* Left side: Brand Logo */}
        <div
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group active:scale-95 transition-transform"
        >
          <span className="font-display text-2xl md:text-3xl font-black tracking-wider text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.2)]">
            FRT
          </span>
        </div>

        {/* Middle: Navigation Links - Desktop */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.id}
                to={item.path}
                className={`relative py-2 px-3 lg:px-4 rounded-lg font-display text-[13px] font-bold tracking-wider transition-all cursor-pointer flex items-center gap-2
                  ${isActive
                    ? 'text-amber-500 bg-amber-500/10'
                    : 'text-white hover:text-amber-500 hover:bg-zinc-900/50'
                  }`}
              >
                {item.icon}
                <span className={isActive ? 'text-amber-500' : 'text-white'}>
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="dashboardNavUnderline"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2.5px] bg-amber-500 rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right side: Connect Button */}
        <div className="flex items-center gap-3">
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
                      className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-zinc-950 font-display text-sm font-black px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-lg shadow-amber-500/5 hover:shadow-amber-500/15"
                    >
                      <Wallet size={16} className="stroke-[2.5px]" />
                      Connect Wallet
                    </button>
                  ) : chain?.unsupported ? (
                    <button onClick={openChainModal} className="flex items-center gap-2 bg-red-500 hover:bg-red-600 active:scale-95 text-white font-display text-xs font-black px-4 py-2.5 rounded-xl transition-all cursor-pointer">
                      Wrong Network
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 bg-zinc-900/50 border border-zinc-800 rounded-xl p-1 pr-3">
                      <div className="h-8 w-8 rounded-lg bg-green-500/10 text-green-400 flex items-center justify-center">
                        <CheckCircle size={14} />
                      </div>
                      {/* ✅ MOBILE ME BHI ADDRESS DIKHEGA */}
                      <div className="text-left leading-none">
                        <span className="text-[10px] text-zinc-400 font-mono block">
                          Connected
                        </span>
                        <span className="text-xs text-white font-mono font-bold block">
                          {account.address?.slice(0, 6)}...{account.address?.slice(-4)}
                        </span>
                      </div>
                      <div className="h-5 w-[1px] bg-zinc-800 mx-2" />
                      <button
                        onClick={() => {
                          openAccountModal();
                        }}
                        className="p-1 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-all cursor-pointer"
                      >
                        <LogOut size={14} />
                      </button>
                    </div>
                  )}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>
      </nav>

      {/* ✅ Mobile Bottom Navigation - FIXED */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 bg-black/90 backdrop-blur-lg border border-zinc-800 rounded-2xl px-4 py-3 flex items-center justify-around shadow-2xl z-50">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 min-w-[44px] transition-all ${
                isActive ? 'text-amber-500' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <span className="text-[18px]">{item.icon}</span>
              <span className={`text-[9px] font-bold font-display tracking-wider ${
                isActive ? 'text-amber-500' : 'text-zinc-500'
              }`}>
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="mobileNavIndicator"
                  className="w-4 h-0.5 bg-amber-500 rounded-full mt-0.5"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default Navbar;