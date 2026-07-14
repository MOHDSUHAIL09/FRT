import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Wallet, LogOut, CheckCircle } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

const Header = () => {
  const { isConnected } = useAccount();
  const location = useLocation();

  const navItems = [
    { id: 'HOME', label: 'HOME', path: '/' },
    // { id: 'GET_STARTED', label: 'Get Started', path: '/get-started' },
    { id: 'PARTICIPATE', label: 'Participate', path: '/participate' },
    { id: 'EXPLORE', label: 'Explore', path: '/explore' },
    { id: 'OUR_APPROACH', label: 'Our Approach', path: '/our-approach' }
  ];

  return (
    <nav className="border-b border-zinc-900 bg-[#000000] sticky top-0 z-40 px-4 md:px-8 py-3.5 flex items-center justify-between select-none">
      {/* Left side: Brand Logo */}
      <Link
        to={isConnected ? '/dashboard' : '/'}
        className="flex items-center gap-2.5 cursor-pointer group active:scale-95 transition-transform"
      >
        <span className="font-display text-2xl md:text-3xl font-black tracking-wider text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.2)]">
          FRT
        </span>
      </Link>

      {/* Middle: Navigation Links */}
      <div className="hidden md:flex items-center gap-6 lg:gap-8">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.id}
              to={item.path}
              className="relative py-2 font-display text-[15px] font-bold tracking-widest text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
            >
              <span className={isActive ? 'text-amber-500 font-extrabold' : ''}>
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="navUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-amber-500 rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>

      {/* Right side: Connect Button */}
      <div>
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
                      onClick={() => {
                        openAccountModal();
                      }}
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
      </div>
    </nav>
  );
};

export default Header;