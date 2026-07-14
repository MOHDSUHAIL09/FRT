import React, { useState, useEffect } from 'react';
import Hero from './components/Landing/Hero';
import Header from './components/common/Header';  
import { DashboardView } from './pages/Dashboard/DashboardView'; 
import { useAccount } from 'wagmi';

const App = () => {
  const [currentTab, setCurrentTab] = useState('HOME');
  const { address, isConnected } = useAccount();

  // 🔥 Sample data for dashboard
  // const [walletData, setWalletData] = useState({
  //   connected: false,
  //   address: null,
  //   balanceETH: 0,
  //   balanceUSDT: 0,
  //   balanceAPX: 0,
  //   balanceWBNB: 0,
  //   balanceETN: 0
  // });

  // const [transactions, setTransactions] = useState([]);
  // const [stakingData, setStakingData] = useState({
  //   totalStaked: 0,
  //   userStaked: 0,
  //   pendingRewards: 0,
  //   claimedRewards: 0,
  //   currentAPY: 0,
  //   tokenPriceUSD: 0
  // });

  // const [profileData, setProfileData] = useState({
  //   registered: false,
  //   username: '',
  //   email: ''
  // });

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
  };

  // 🔥 AUTO-REDIRECT TO DASHBOARD WHEN CONNECTED
  useEffect(() => {
    if (isConnected && currentTab === 'HOME') {
      setCurrentTab('DASHBOARD');
    }
    if (!isConnected && currentTab === 'DASHBOARD') {
      setCurrentTab('HOME');
    } 
  }, [isConnected, currentTab]);

  const renderContent = () => {
    switch(currentTab) {
      case 'HOME':
        return <Hero onGetStarted={handleTabChange} isConnected={isConnected} />;
      case 'DASHBOARD':
        return (
          <DashboardView 
            // wallet={walletData}
            // transactions={transactions}
            // staking={stakingData}
            // profile={profileData}
            // onUpdateWallet={setWalletData}
            // onAddTransaction={(tx) => setTransactions([tx, ...transactions])}
          />
        );
      default:
        return <Hero onGetStarted={handleTabChange} isConnected={isConnected} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#111111]">
      <Header
        currentTab={currentTab}
        onTabChange={handleTabChange}
      />
      {renderContent()}
    </div>
  );
};

export default App;