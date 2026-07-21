import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  ArrowUpRight, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  DollarSign
} from 'lucide-react';

const IncomePayout = ({
  wallet = { connected: false, address: null, balanceFRT: 0 },
  onPayout = () => {},
  onAddTransaction = () => {},
}) => {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [payoutStatus, setPayoutStatus] = useState(null); // 'success', 'error', null

  // Available balance (example - FRT balance)
  const availableBalance = wallet?.balanceFRT || 0;
  
  // Min withdrawal
  const MIN_WITHDRAWAL = 10;
  
  // Max withdrawal (90% of balance)
  const maxWithdrawal = availableBalance * 0.9;

  // Calculate payout amount (after fees - 2%)
  const calculatePayout = (inputAmount) => {
    const numAmount = parseFloat(inputAmount) || 0;
    const fee = numAmount * 0.02; // 2% fee
    return numAmount - fee;
  };

  const payoutAmount = calculatePayout(amount);
  const fee = parseFloat(amount) * 0.02 || 0;
  const isValidAmount = parseFloat(amount) >= MIN_WITHDRAWAL && parseFloat(amount) <= maxWithdrawal;

  const handleMaxClick = () => {
    setAmount(maxWithdrawal.toFixed(4));
  };

  const handlePayout = async () => {
    if (!wallet.connected) {
      alert('Please connect your wallet first!');
      return;
    }

    if (!isValidAmount) {
      alert(`Please enter amount between $${MIN_WITHDRAWAL} and $${maxWithdrawal.toFixed(2)}`);
      return;
    }

    setIsLoading(true);
    setPayoutStatus(null);

    try {
      // Simulate payout process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success
      setPayoutStatus('success');
      
      // Add transaction
      onAddTransaction({
        type: 'PAYOUT',
        amount: payoutAmount.toFixed(4),
        token: 'FRT',
        from: wallet.address,
        to: 'Payout Wallet',
        status: 'COMPLETED',
        date: new Date().toLocaleString(),
        fee: fee.toFixed(2)
      });

      // Callback
      onPayout({
        amount: payoutAmount,
        fee: fee,
        address: wallet.address
      });

      // Reset after 3 seconds
      setTimeout(() => {
        setAmount('');
        setPayoutStatus(null);
      }, 3000);

    } catch (error) {
      setPayoutStatus('error');
      console.error('Payout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" swaptable rounded-2xl border border-zinc-800 p-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white ">Income Withdrawal</h3>
        </div>
        <div className=" p-3 rounded-full border border-amber-500/20">
          <Wallet className="w-5 h-5 text-amber-500" />
        </div>
      </div>

      {/* Balance Display */}
      <div className=" rounded-xl p-4 mb-6"style={{background: "rgba(147, 146, 146, 0.094)"}}>
        <div className="flex justify-between items-center">
          <span className="text-zinc-400 text-sm">Available Balance</span>
          <span className="text-white font-bold text-lg">
            ${availableBalance.toFixed(4)} FRT
          </span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-zinc-400 text-sm">Min Withdrawal</span>
          <span className="text-emerald-400 font-semibold">
            ${MIN_WITHDRAWAL}
          </span>
        </div>
      </div>

      {/* Amount Input */}
      <div className="mb-4">
        <label className="text-zinc-300 text-sm font-medium block mb-2">
          Enter Amount
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 font-bold">
            $
          </span>
          <input
            type="number"
            value={amount}
            onChange={(e) => {
              const val = e.target.value;
              if (val === '' || parseFloat(val) >= 0) {
                setAmount(val);
                setPayoutStatus(null);
              }
            }}
            placeholder="0.00"
            className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-8 py-4 text-white text-xl font-bold outline-none focus:border-amber-500 transition-all"
            min="0"
            step="0.0001"
          />
          <button
            onClick={handleMaxClick}
            className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-amber-500/20 text-amber-500 rounded-lg text-xs font-bold hover:bg-amber-500/30 transition-all"
          >
            MAX
          </button>
        </div>
      </div>
      {/* Payout Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handlePayout}
        disabled={isLoading || !isValidAmount || !wallet.connected}
        className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
          isValidAmount && wallet.connected
            ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-lg hover:shadow-amber-500/30'
            : 'bg-zinc-700 cursor-not-allowed opacity-50'
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Processing...
          </div>
        ) : (
          'PayOut'
        )}
      </motion.button>

      {/* Note */}
      {/* <p className="text-zinc-500 text-xs text-center mt-4">
        <AlertCircle className="inline w-3 h-3 mr-1" />
        Min Withdrawal ${MIN_WITHDRAWAL} • 2% Fee Applied
      </p> */}

      {/* Status Messages */}
      {payoutStatus === 'success' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3"
        >
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <div>
            <p className="text-emerald-400 font-semibold">Payout Successful!</p>
            <p className="text-emerald-400/70 text-sm">${payoutAmount.toFixed(4)} FRT sent</p>
          </div>
        </motion.div>
      )}

      {payoutStatus === 'error' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-400" />
          <div>
            <p className="text-red-400 font-semibold">Payout Failed</p>
            <p className="text-red-400/70 text-sm">Please try again later</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default IncomePayout;