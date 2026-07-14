import React, { useState } from 'react';
import { motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
  TrendingUp,
  DollarSign,
  Wallet,
  History,
  Activity,
  Gift,
  Coins,
  Users,
  Trophy,
  Award,
  Share2
} from 'lucide-react';
import { SwapView } from './SwapView';

const DashboardCard = ({
  title,
  value,
  subValue,
  trend,
  trendColor = 'text-green-400',
  footerText,
  icon,
  className = 'aa',
}) => {
  return (
    <div className={`rounded-2xl border border-zinc-800 bg-[#141416] p-6 shadow-xl transition-all duration-300 hover:border-zinc-700/80 flex flex-col justify-between h-[175px] ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-zinc-300 text-[15px] font-medium tracking-tight truncate">{title}</span>
        <div
          className="w-8 h-8 rounded-full border border-amber-500/30 flex items-center justify-center text-amber-500 bg-transparent shrink-0 outline-offset-[2px]"
          style={{ outline: '1px solid #f59e0b' }}
        >
          {icon}
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-end">
        <div className="text-[28px] font-extrabold text-white tracking-tight leading-none font-sans">
          {value}
        </div>
        {trend && (
          <div className={`text-[12px] font-semibold mt-1.5 flex items-center gap-1 ${trend.startsWith('↗') || trend.startsWith('+') ? 'text-emerald-400' : 'text-zinc-400'
            }`}>
            {trend}
          </div>
        )}
      </div>
      <div className="text-[12px] text-zinc-500 mt-2 font-sans truncate">
        {footerText}
      </div>
    </div>
  );
};

export const DashboardView = ({
  wallet = { connected: false, address: null, balanceETH: 0, balanceUSDT: 0, balanceAPX: 0, balanceWBNB: 0, balanceFRT: 0 },
  transactions = [],
  staking = {
    totalStaked: 0,
    userStaked: 0,
    pendingRewards: 0,
    claimedRewards: 0,
    currentAPY: 0,
    tokenPriceUSD: 0
  },
  profile = { registered: false, username: '', email: '' },
  onUpdateWallet,
  onAddTransaction,
}) => {
  const [timeframe, setTimeframe] = useState('7D');

  // Price data
  const priceData24H = [
    { date: '00:00', price: 0.1012, volume: 154000 },
    { date: '04:00', price: 0.1025, volume: 182000 },
    { date: '08:00', price: 0.1041, volume: 220000 },
    { date: '12:00', price: 0.1039, volume: 195000 },
    { date: '16:00', price: 0.1068, volume: 310000 },
    { date: '20:00', price: 0.1083, volume: 284000 },
  ];

  const priceData7D = [
    { date: 'Jun 30', price: 0.0895, volume: 1200000 },
    { date: 'Jul 01', price: 0.0921, volume: 1450000 },
    { date: 'Jul 02', price: 0.0945, volume: 1800000 },
    { date: 'Jul 03', price: 0.0982, volume: 2100000 },
    { date: 'Jul 04', price: 0.1024, volume: 1950000 },
    { date: 'Jul 05', price: 0.1050, volume: 2400000 },
    { date: 'Jul 06', price: 0.1083, volume: 2650000 },
  ];

  const priceData30D = [
    { date: 'Jun 07', price: 0.0450, volume: 8200000 },
    { date: 'Jun 14', price: 0.0620, volume: 9100000 },
    { date: 'Jun 21', price: 0.0780, volume: 11000000 },
    { date: 'Jun 28', price: 0.0890, volume: 14500000 },
    { date: 'Jul 05', price: 0.1083, volume: 18200000 },
  ];

  const getChartData = () => {
    switch (timeframe) {
      case '24H': return priceData24H;
      case '30D': return priceData30D;
      default: return priceData7D;
    }
  };

  const currentChartData = getChartData();

  // Derived Stats
  const activeBondValue = transactions
    .filter((t) => t.type === 'BOND')
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

  const bondsCount = transactions.filter((t) => t.type === 'BOND').length;

  const totalPortfolioValue = wallet.connected
    ? (wallet.balanceFRT || 0) + (staking.userStaked || 0) + (staking.pendingRewards || 0) + activeBondValue
    : 0;

  const teamSize = profile?.registered ? 12 : 0;
  const directIncome = profile?.registered ? 125.0 : 0.0;
  const levelRewards = profile?.registered ? 45.0 : 0.0;
  const referralIncome = profile?.registered ? 180.0 : 0.0;

  return (
    <div className="px-1
    
    lg:px-10 max-w-8xl mx-auto py-3">

      {/* Header */}
      <div className="space-y-1 pt-4">
        {/* <h2 className="text-[34px] font-black text-amber-500 tracking-tight font-sans">
          Dashboard
        </h2> */}
      </div>

      {/* 🔥 MOBILE: SwapView TOP, then Cards, then Table */}
      
      {/* SwapView - Mobile pe SABSE UPPER */}
      <div className="lg:hidden mb-6">
        <SwapView
          wallet={wallet}
          onUpdateWallet={onUpdateWallet}
          onAddTransaction={onAddTransaction}
        />
      </div>

      {/* 2️⃣ Cards Grid - Mobile pe BEECH ME */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">

        <DashboardCard
          title="Total Portfolio Value"
          value={wallet.connected ? `${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 4 })} FRT` : '0 FRT'}
          trend="↗ +5.67%"
          footerText="24h change"
          icon={<Wallet size={16} />}
        />

        <DashboardCard
          title="Pending Rewards"
          value={wallet.connected ? `${(staking.pendingRewards || 0).toFixed(8)} FRT` : '0 FRT'}
          trend="↗ Ready to claim"
          footerText="Accumulated rewards"
          icon={<Gift size={16} />}
        />

        <DashboardCard
          title="Direct Income"
          value={wallet.connected && profile?.registered ? `${directIncome.toLocaleString()} FRT` : '0 FRT'}
          trend="↗ Earned from directs"
          footerText="Aggregate payouts from directs"
          icon={<Gift size={16} />}
        />

        <DashboardCard
          title="FRT Token Price"
          value={`$${staking.tokenPriceUSD || 0}`}
          trend="LP-derived price"
          footerText="USD quote from PancakeSwap"
          icon={<DollarSign size={16} />}
        />

        <DashboardCard
          title="Total ROI Earned"
          value={wallet.connected ? `${(staking.claimedRewards || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 4 })} FRT` : '0 FRT'}
          trend="↗ Since day one"
          footerText="Compounded staking rewards"
          icon={<Trophy size={16} />}
        />

        <DashboardCard
          title="Level Rewards Earned"
          value={wallet.connected && profile?.registered ? `${levelRewards.toLocaleString()} FRT` : '0 FRT'}
          trend="↗ From team levels"
          footerText="Company pool distributions"
          icon={<Award size={16} />}
        />

        <DashboardCard
          title="Referral Income"
          value={wallet.connected && profile?.registered ? `${referralIncome.toLocaleString()} FRT` : '0 FRT'}
          trend="↗ Lifetime referrals"
          footerText="Direct & indirect referrals"
          icon={<Share2 size={16} />}
        />

        <DashboardCard
          title="sponser Income"
          value={wallet.connected && profile?.registered ? `${directIncome.toLocaleString()} FRT` : '0 FRT'}
          trend="↗ Earned from directs"
          footerText="Aggregate payouts from directs"
          icon={<Gift size={16} />}
        />

      </div>

      {/* 3️⃣ SWAP + TABLE Section - Desktop me side by side, Mobile me Table neeche */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">

        {/* Left Side - SwapView (Desktop me dikhega, Mobile me hidden) */}
        <div className="hidden lg:block lg:col-span-4">
          <SwapView
            wallet={wallet}
            onUpdateWallet={onUpdateWallet}
            onAddTransaction={onAddTransaction}
          />
        </div>

        {/* Right Side - Table (Mobile me neeche) */}
        <div className="swaptable rounded-2xl lg:col-span-8">
          <div className="rounded-2xl border border-zinc-800 p-4 h-full flex flex-col">
            <h3 className="text-sm font-bold text-white mb-4">Swap History</h3>
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left py-1.5 px-2 text-zinc-400 font-medium text-[18px] uppercase tracking-wider">S.No</th>
                    <th className="text-left py-1.5 px-2 text-zinc-400 font-medium text-[18px] uppercase tracking-wider">Type</th>
                    <th className="text-left py-1.5 px-2 text-zinc-400 font-medium text-[18px] uppercase tracking-wider">From</th>
                    <th className="text-left py-1.5 px-2 text-zinc-400 font-medium text-[18px] uppercase tracking-wider">To</th>
                    <th className="text-left py-1.5 px-2 text-zinc-400 font-medium text-[18px] uppercase tracking-wider">Amount</th>
                    <th className="text-left py-1.5 px-2 text-zinc-400 font-medium text-[18px] uppercase tracking-wider">Token</th>
                    <th className="text-left py-1.5 px-2 text-zinc-400 font-medium text-[18px] uppercase tracking-wider">Date</th>
                    <th className="text-left py-1.5 px-2 text-zinc-400 font-medium text-[18px] uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center text-zinc-500">
                        <div className="text-6xl mb-1" style={{marginTop: "100px"}}>📭</div>
                        <p className="text-[20px]">No transactions yet</p>
                        <p className="text-[18px] text-zinc-600 mt-0.5">Start swapping to see your history</p>
                      </td>
                    </tr>
                  ) : (
                    transactions.map((tx, index) => (
                      <tr key={index} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-all">
                        <td className="py-1.5 px-2 text-zinc-300 text-[10px]">
                          <div className="h-9 w-9 rounded-full bg-zinc-700 flex items-center justify-center">
                            {index + 1}
                          </div>
                        </td>
                        <td className="py-1.5 px-2">
                          <td className={`px-1.5 py-0.5 rounded-lg font-bold ${
                            tx.type === 'STAKE' ? 'bg-amber-500/10 text-amber-500' :
                            tx.type === 'CLAIM' ? 'bg-emerald-500/10 text-emerald-400' :
                            tx.type === 'BOND' ? 'bg-cyan-500/10 text-cyan-400' :
                            tx.type === 'SWAP' ? 'bg-purple-500/10 text-purple-400' :
                            'bg-zinc-500/10 text-zinc-400'
                          }`}>
                            {tx.type || 'TX'}
                          </td>
                        </td>
                        <td className="py-1.5 px-2 text-zinc-300 text-[10px] font-mono">
                          {tx.from ? `${tx.from.slice(0, 6)}...${tx.from.slice(-4)}` : '---'}
                        </td>
                        <td className="py-1.5 px-2 text-zinc-300 text-[10px] font-mono">
                          {tx.to ? `${tx.to.slice(0, 6)}...${tx.to.slice(-4)}` : '---'}
                        </td>
                        <td className="py-1.5 px-2 text-zinc-300 font-mono text-[10px]">{tx.amount || '0'}</td>
                        <td className="py-1.5 px-2 text-zinc-300 text-[10px]">{tx.token || 'FRT'}</td>
                        <td className="py-1.5 px-2 text-zinc-500 text-[9px]">{tx.date || 'Just now'}</td>
                        <td className="py-1.5 px-2">
                          <td className={`px-1.5 py-0.5 rounded-full font-bold ${
                            tx.status === 'COMPLETED'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-yellow-500/10 text-yellow-400'
                          }`}>
                            {tx.status || 'PENDING'}
                          </td>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default DashboardView;