import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowDown, Settings, Info, ExternalLink, HelpCircle, Check, ArrowRightLeft } from 'lucide-react';
import { ethers } from 'ethers';
import Swal from 'sweetalert2';
import { useAccount } from 'wagmi';

// ============================================================
//  PANCAKESWAP CONSTANTS
// ============================================================
const PANCAKE_LIST = 'https://tokens.pancakeswap.finance/pancakeswap-extended.json';
const ROUTER_ADDRESS = '0x10ED43C718714eb63d5aA57B78B54704E256024E';
const USDT_ADDRESS = '0x55d398326f99059fF775485246999027B3197955';

// 🔥 FALLBACK TOKENS - AGAR API FAIL HO
const FALLBACK_TOKENS = [
  { symbol: 'USDT', address: '0x55d398326f99059fF775485246999027B3197955', decimals: 18, chainId: 56, logoURI: 'https://tokens.pancakeswap.finance/images/0x55d398326f99059fF775485246999027B3197955.png' },
  { symbol: 'BNB', address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', decimals: 18, chainId: 56, logoURI: 'https://tokens.pancakeswap.finance/images/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c.png' },
  { symbol: 'CAKE', address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82', decimals: 18, chainId: 56, logoURI: 'https://tokens.pancakeswap.finance/images/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82.png' },
  { symbol: 'BUSD', address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', decimals: 18, chainId: 56, logoURI: 'https://tokens.pancakeswap.finance/images/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56.png' },
];

const DEFAULT_FROM_TOKEN = {
  address: USDT_ADDRESS,
  decimals: 18,
  logoURI: 'https://tokens.pancakeswap.finance/images/0x55d398326f99059fF775485246999027B3197955.png',
  symbol: "USDT",

};

const ROUTER_ABI = [
  'function getAmountsOut(uint amountIn, address[] memory path) view returns (uint[] memory)',
  'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] memory path, address to, uint deadline) returns (uint[] memory amounts)',
];

const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function decimals() view returns (uint8)',
];

export const SwapView = ({
  wallet,
  onUpdateWallet,
  onAddTransaction,
}) => {

  const { address, isConnected } = useAccount();

  const [tokens, setTokens] = useState(FALLBACK_TOKENS); // 🔥 FALLBACK SET
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapSuccess, setSwapSuccess] = useState(false);
  const [lastSwappedData, setLastSwappedData] = useState(null);
  const [balance, setBalance] = useState('0.00');

  const [fromToken, setFromToken] = useState(DEFAULT_FROM_TOKEN);
  const [toToken, setToToken] = useState(null);

  const [amountIn, setAmountIn] = useState('');
  const [amountOut, setAmountOut] = useState('');
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [fromSearchTerm, setFromSearchTerm] = useState('');
  const [toSearchTerm, setToSearchTerm] = useState('');
  const [slippage, setSlippage] = useState(0.5);
  const [showSettings, setShowSettings] = useState(false);
  const [customSlippage, setCustomSlippage] = useState('');

  // ============================================================
  //  EFFECT: Provider Setup - ethers v6
  // ============================================================
  useEffect(() => {
    if (window.ethereum && isConnected && address) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        provider.getSigner().then((signer) => {
          setProvider(provider);
          setSigner(signer);
          console.log(' Provider set up');
        }).catch((error) => {
          console.error('Signer error:', error);
        });
      } catch (error) {
        console.error('Provider setup error:', error);
      }
    }
  }, [isConnected, address]);

  // ============================================================
  //  🔥 FETCH BALANCE
  // ============================================================
  const fetchBalance = async (tokenAddress) => {
    if (!isConnected || !address || !provider || !tokenAddress) {
      setBalance('0.00');
      return;
    }

    try {
      const checksumAddress = ethers.getAddress(tokenAddress);
      const tokenContract = new ethers.Contract(checksumAddress, ERC20_ABI, provider);

      const bal = await tokenContract.balanceOf(address);
      const decimals = await tokenContract.decimals();
      const formatted = ethers.formatUnits(bal, decimals);
      setBalance(formatted);
      console.log(' Balance:', formatted);

    } catch (error) {
      console.error('Balance fetch error:', error);
      setBalance('0.00');
    }
  };

  useEffect(() => {
    if (fromToken?.address) {
      fetchBalance(fromToken.address);
    }
  }, [fromToken, isConnected, address, provider]);

  // ============================================================
  //  🔥 FETCH TOKENS - PANCAKESWAP API SE (WITH FALLBACK)
  // ============================================================
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await fetch(PANCAKE_LIST);
        if (!response.ok) {
          throw new Error('API response not ok');
        }
        const data = await response.json();
        if (data && data.tokens) {
          const bsc = data.tokens.filter(t => t.chainId === 56);
          if (bsc.length > 0) {
            setTokens(bsc);
            console.log(' Tokens fetched:', bsc.length);
            const firstNonUSDT = bsc.find(t => t.address !== USDT_ADDRESS);
            if (firstNonUSDT) {
              setToToken(firstNonUSDT);
            }
            return;
          }
        }
        throw new Error('No tokens found');
      } catch (error) {
        console.error('Token fetch error, using fallback:', error);
        // 🔥 FALLBACK TOKENS USE KARO
        setTokens(FALLBACK_TOKENS);
        const firstNonUSDT = FALLBACK_TOKENS.find(t => t.address !== USDT_ADDRESS);
        if (firstNonUSDT) {
          setToToken(firstNonUSDT);
        }
      }
    };

    fetchTokens();
  }, []);

  // ============================================================
  //  🔥 EFFECT: Fetch Rate on Amount Change
  // ============================================================
  useEffect(() => {
    if (amountIn && parseFloat(amountIn) > 0 && fromToken?.address && toToken?.address) {
      fetchRate(amountIn, fromToken.address, toToken.address);
    } else {
      setAmountOut('');
      setRate(null);
    }
  }, [amountIn, fromToken, toToken]);

  // ============================================================
  //  🔥 FETCH RATE - FIXED CHECKSUM
  // ============================================================
  const fetchRate = async (amount, fromAddr, toAddr) => {
    if (!amount || parseFloat(amount) <= 0 || !fromAddr || !toAddr) {
      setAmountOut('');
      setRate(null);
      return;
    }

    setLoading(true);

    try {
      // 🔥 FIX: SAHI CHECKSUM USE KARO
      const fromAddrChecksum = ethers.getAddress(fromAddr);
      const toAddrChecksum = ethers.getAddress(toAddr);

      const bscProvider = new ethers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
      const router = new ethers.Contract(ROUTER_ADDRESS, ROUTER_ABI, bscProvider);

      const amountInWei = ethers.parseUnits(amount, 18);
      const path = [fromAddrChecksum, toAddrChecksum];

      const amounts = await router.getAmountsOut(amountInWei, path);
      const output = ethers.formatUnits(amounts[1], 18);

      setAmountOut(output);
      setRate(parseFloat(output) / parseFloat(amount));
      console.log(' Rate fetched:', output);

    } catch (error) {
      console.error('Rate fetch error:', error.message);
      setAmountOut('Error');
      setRate(null);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  //  HANDLE AMOUNT CHANGE
  // ============================================================
  const handleFromAmountChange = (value) => {
    setAmountIn(value);
  };

  // ============================================================
  //  HANDLE TOKEN SELECT - FIXED
  // ============================================================
  const handleFromSelect = async (token) => {
    try {
      if (!token || !token.address) {
        console.error('Invalid token selected');
        return;
      }

      // 🔥 FIX: SAHI ADDRESS USE KARO
      const checksumAddress = ethers.getAddress(token.address);
      const selectedToken = {
        ...token,
        address: checksumAddress,
        logoURI: token.logoURI || `https://tokens.pancakeswap.finance/images/${checksumAddress}.png`
      };
      setFromToken(selectedToken);
      setShowFromDropdown(false);
      setFromSearchTerm('');

      await fetchBalance(selectedToken.address);
    } catch (error) {
      console.error('Token select error:', error);
    }
  };

  const handleToSelect = async (token) => {
    try {
      if (!token || !token.address) {
        console.error('Invalid token selected');
        return;
      }

      const checksumAddress = ethers.getAddress(token.address);
      const selectedToken = {
        ...token,
        address: checksumAddress,
        logoURI: token.logoURI || `https://tokens.pancakeswap.finance/images/${checksumAddress}.png`
      };
      setToToken(selectedToken);
      setShowToDropdown(false);
      setToSearchTerm('');
    } catch (error) {
      console.error('Token select error:', error);
    }
  };

  // ============================================================
  //  FLIP TOKENS
  // ============================================================
  const handleFlipTokens = () => {
    const tempFrom = { ...fromToken };
    const tempTo = { ...toToken };
    const tempAmount = amountIn;
    const tempOut = amountOut;

    setFromToken(tempTo);
    setToToken(tempFrom);
    setAmountIn(tempOut);
    setAmountOut(tempAmount);
    setRate(null);

    if (tempOut && parseFloat(tempOut) > 0) {
      setTimeout(() => {
        fetchRate(tempOut, tempTo.address, tempFrom.address);
      }, 100);
    }
  };

  // ============================================================
  //  SET MAX AMOUNT
  // ============================================================
  const handleMaxFrom = () => {
    if (!isConnected) {
      alert('Please connect wallet first!');
      return;
    }
    const balanceNum = parseFloat(balance);
    if (balanceNum > 0) {
      setAmountIn(balanceNum.toString());
    } else {
      alert('Your balance is 0');
    }
  };

  // ============================================================
  //  ALERT FUNCTIONS
  // ============================================================
  const showErrorAlert = (message) => {
    Swal.fire({
      icon: 'error',
      title: 'Swap Failed',
      html: message,
      confirmButtonColor: '#f0b90b',
      confirmButtonText: 'OK',
      background: '#0a0e1a',
      color: '#ffffff',
    });
  };

  const showSuccessAlert = (amountInVal, amountOutVal, symbol, txHash) => {
    Swal.fire({
      icon: 'success',
      title: ' Swap Successful!',
      confirmButtonColor: '#f0b90b',
      confirmButtonText: ' View on BSCScan',
      background: '#0a0e1a',
      color: '#ffffff',
    }).then((result) => {
      if (result.isConfirmed) {
        window.open(`https://bscscan.com/tx/${txHash}`, '_blank');
      }
    });
  };

  // ============================================================
  //  EXECUTE SWAP
  // ============================================================
  const executeSwap = async () => {
    if (!isConnected) {
      showErrorAlert('Please connect wallet first!');
      return;
    }

    if (!amountIn || parseFloat(amountIn) <= 0) {
      showErrorAlert('Please enter amount to swap!');
      return;
    }

    if (!signer) {
      showErrorAlert('Signer not available!');
      return;
    }

    const userBalance = parseFloat(balance);
    const amountToSwap = parseFloat(amountIn);

    if (userBalance < amountToSwap) {
      showErrorAlert(`
        <b>Insufficient Balance!</b><br/>
        Your balance: ${userBalance.toFixed(4)} ${fromToken.symbol}<br/>
        Amount to swap: ${amountToSwap.toFixed(4)} ${fromToken.symbol}
      `);
      return;
    }

    setIsSwapping(true);

    try {
      const router = new ethers.Contract(ROUTER_ADDRESS, ROUTER_ABI, signer);
      const amountInWei = ethers.parseUnits(amountIn, 18);

      const fromContract = new ethers.Contract(fromToken.address, ERC20_ABI, signer);

      let allowance;
      try {
        allowance = await fromContract.allowance(address, ROUTER_ADDRESS);
        console.log(' Allowance:', allowance.toString());
      } catch (allowanceError) {
        console.log('⚠️ Allowance check failed, assuming 0');
        allowance = 0n;
      }

      if (allowance < amountInWei) {
        try {
          const approveTx = await fromContract.approve(ROUTER_ADDRESS, amountInWei);
          await approveTx.wait();
        } catch (approveError) {
          console.error('Approval failed:', approveError);
          showErrorAlert('Token approval failed! Please try again.');
          setIsSwapping(false);
          return;
        }
      }

      const amountOutMin = ethers.parseUnits(
        (parseFloat(amountOut) * (1 - slippage / 100)).toFixed(18),
        18
      );

      const path = [
        ethers.getAddress(fromToken.address),
        ethers.getAddress(toToken.address)
      ];

      const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

      const tx = await router.swapExactTokensForTokens(
        amountInWei,
        amountOutMin,
        path,
        address,
        deadline,
        { gasLimit: 500000 }
      );

      const receipt = await tx.wait();

      await fetchBalance(fromToken.address);

      const walletUpdates = {};
      const fromBalanceNum = parseFloat(balance);
      const toBalanceNum = parseFloat(amountOut);

      if (fromToken.symbol === 'USDT') walletUpdates.balanceUSDT = fromBalanceNum - amountToSwap;
      if (toToken.symbol === 'USDT') walletUpdates.balanceUSDT = (wallet.balanceUSDT || 0) + toBalanceNum;

      onUpdateWallet(walletUpdates);

      const newTx = {
        id: Math.random().toString(),
        type: 'SWAP',
        amount: `${parseFloat(amountIn).toFixed(2)} ${fromToken.symbol} ➔ ${parseFloat(amountOut).toFixed(2)} ${toToken.symbol}`,
        token: 'PancakeSwap',
        date: new Date().toLocaleTimeString(),
        status: 'COMPLETED',
        txHash: receipt.hash,
      };
      onAddTransaction(newTx);

      setLastSwappedData({
        fromAmt: amountIn,
        fromTok: fromToken.symbol,
        toAmt: amountOut,
        toTok: toToken.symbol,
        txHash: receipt.hash,
      });

      showSuccessAlert(amountIn, amountOut, toToken.symbol, receipt.hash);

      setAmountIn('');
      setAmountOut('');
      setRate(null);
      setSwapSuccess(true);
      setIsSwapping(false);

    } catch (error) {
      console.error('Swap error:', error);
      showErrorAlert(error.message?.slice(0, 150) || 'Unknown error occurred');
      setIsSwapping(false);
    }
  };

  // ============================================================
  //  GET BUTTON STATE
  // ============================================================
  const getButtonState = () => {
    if (!isConnected) {
      return {
        text: 'Connect Wallet',
        className: 'w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest bg-amber-500 hover:bg-amber-600 text-zinc-950 transition-all cursor-pointer shadow-lg shadow-amber-500/5',
        disabled: false,
        onClick: null
      };
    }
    if (isSwapping) {
      return {
        text: 'Processing...',
        className: 'w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest bg-zinc-800 text-zinc-500 cursor-not-allowed',
        disabled: true,
        onClick: null
      };
    }
    if (!amountIn || parseFloat(amountIn) <= 0) {
      return {
        text: 'Enter Amount',
        className: 'w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest bg-zinc-900 text-zinc-500 cursor-not-allowed',
        disabled: true,
        onClick: null
      };
    }
    if (parseFloat(balance) < parseFloat(amountIn)) {
      return {
        text: 'Insufficient Balance',
        className: 'w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest bg-red-500/10 border border-red-500/30 text-red-400 cursor-not-allowed',
        disabled: true,
        onClick: null
      };
    }
    if (loading) {
      return {
        text: 'Loading...',
        className: 'w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest bg-zinc-800 text-zinc-500 cursor-not-allowed',
        disabled: true,
        onClick: null
      };
    }
    if (!amountOut || amountOut === 'Error') {
      return {
        text: 'Rate Error',
        className: 'w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest bg-zinc-800 text-zinc-500 cursor-not-allowed',
        disabled: true,
        onClick: null
      };
    }
    return {
      text: 'Swap Tokens',
      className: 'w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest bg-amber-500 hover:bg-amber-600 active:scale-98 text-zinc-950 transition-all cursor-pointer shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20',
      disabled: false,
      onClick: executeSwap
    };
  };

  const buttonState = getButtonState();

  // ============================================================
  //  RENDER
  // ============================================================
  return (
    <div className="relative">
      <div className="swaptable rounded-2xl border border-zinc-800 bg-[#0d0d10] p-6 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-amber-500/10 text-amber-500">
                <ArrowRightLeft size={16} />
              </span>
              <h2 className="text-lg font-black text-white tracking-wide font-sans">FRT SWAP</h2>
            </div>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-xl border border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:text-white transition-all cursor-pointer ${showSettings ? 'border-amber-500/40 text-amber-500 bg-amber-500/[0.03]' : ''
              }`}
          >
            <Settings size={16} />
          </button>
        </div>

        {/* Slippage Settings */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border border-amber-500/10 bg-amber-500/[0.02] rounded-2xl p-4 mb-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-300 font-bold font-sans">Slippage Tolerance</span>
                <span className="text-xs font-mono font-extrabold text-amber-500">{slippage}%</span>
              </div>
              <div className="flex items-center gap-2">
                {[0.1, 0.5, 1.0].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => { setSlippage(preset); setCustomSlippage(''); }}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${slippage === preset && !customSlippage
                        ? 'border-amber-500 bg-amber-500 text-zinc-950'
                        : 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700'
                      }`}
                  >
                    {preset}%
                  </button>
                ))}
                <div className="relative flex-1 flex items-center bg-zinc-900/80 rounded-lg border border-zinc-800 px-2">
                  <input
                    type="number"
                    placeholder="Custom"
                    value={customSlippage}
                    onChange={(e) => {
                      setCustomSlippage(e.target.value);
                      const parsed = parseFloat(e.target.value);
                      if (!isNaN(parsed) && parsed > 0 && parsed <= 50) {
                        setSlippage(parsed);
                      }
                    }}
                    className="w-full bg-transparent font-mono text-xs font-bold text-zinc-200 outline-none py-1.5 pr-4 placeholder-zinc-700"
                  />
                  <span className="absolute right-2 text-[10px] font-mono text-zinc-500">%</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Swap Success */}
        <AnimatePresence>
          {swapSuccess && lastSwappedData && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.02] mb-5 text-center space-y-3"
            >
              <div className="h-10 w-10 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <Check size={20} className="stroke-[3px]" />
              </div>
              <h4 className="text-sm font-black text-zinc-200 font-sans">Transaction Submitted!</h4>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans font-medium">
                Successfully swapped <strong className="text-zinc-100 font-mono">{parseFloat(lastSwappedData.fromAmt).toFixed(3)} {lastSwappedData.fromTok}</strong> for <strong className="text-zinc-100 font-mono">{parseFloat(lastSwappedData.toAmt).toFixed(3)} {lastSwappedData.toTok}</strong>
              </p>
              <button
                onClick={() => setSwapSuccess(false)}
                className="mt-2 text-[10px] uppercase font-bold tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={(e) => { e.preventDefault(); buttonState.onClick && buttonState.onClick(); }} className="space-y-4">

          {/* FROM */}
          <div className="rounded-2xl p-5 space-y-5" style={{ background: "#93929218" }}>
            <div className="flex  justify-between text-xs text-zinc-500 font-sans">
              <div>
                <span style={{ color: "#facc15" }}>From:</span> <span className='text-emerald-400'>{isConnected && `${address?.slice(0, 6)}...${address?.slice(-4)}`}</span>
              </div>
              <span style={{ color: "#facc15" }}>Balance: <strong className="font-mono text-zinc-300">{parseFloat(balance).toFixed(4)} {fromToken.symbol}</strong></span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <input
                type="number"
                step="any"
                placeholder="0.0"
                value={amountIn}
                onChange={(e) => setAmountIn(e.target.value)}
                disabled={isSwapping}
                className="font-mono text-2xl font-bold text-white outline-none w-full" />

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleMaxFrom}
                  disabled={isSwapping || !isConnected}
                  className="px-2 py-1 text-[9px] font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/20 rounded-lg transition-all"
                >
                  MAX
                </button>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowFromDropdown(!showFromDropdown)}
                    className="drop bg-zinc-700  text-xs text-zinc-200 font-bold py-1.5 px-3 rounded-xl outline-none cursor-pointer hover:border-zinc-700 flex items-center gap-1.5"
                  >
                    {fromToken.logoURI && <img src={fromToken.logoURI} alt="" className="w-4 h-4 rounded-full" />}
                    {fromToken.symbol} <span className="text-zinc-500">⌵</span>
                  </button>

                  {showFromDropdown && (
                    <div className="absolute right-0 top-full mt-1 w-64 max-h-60 overflow-auto bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-20 p-2">
                      <input
                        type="text"
                        placeholder="Search tokens..."
                        value={fromSearchTerm}
                        onChange={(e) => setFromSearchTerm(e.target.value)}
                        className="w-full bg-zinc-800 text-xs text-zinc-200 rounded-lg p-2 outline-none mb-2"
                      />
                      <div className="space-y-1">
                        {tokens
                          .filter(t => t.symbol?.toLowerCase().includes(fromSearchTerm.toLowerCase()))
                          .slice(0, 30)
                          .map(t => (
                            <div
                              key={t.address}
                              className="flex items-center gap-2 p-2 hover:bg-zinc-800 rounded-lg cursor-pointer text-xs text-zinc-300"
                              onClick={() => handleFromSelect(t)}
                            >
                              <img src={t.logoURI} alt="" className="w-5 h-5 rounded-full" />
                              {t.symbol}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Flip */}
          <div className="relative flex justify-center -my-8 -my-md-4 z-10 ">
            <button
              type="button"
              onClick={handleFlipTokens}
              disabled={isSwapping}
              className="h-15 w-15 rounded-full bg-zinc-700 text-amber-500 hover:text-white transition-all flex items-center justify-center shadow-lg active:scale-90 cursor-pointer">
              <ArrowDown size={22} />
            </button>
          </div>

          {/* TO */}
          <div className="rounded-2xl p-5 space-y-5" style={{ background: "#93929218" }}>
            <div className="flex items-center justify-between text-xs text-zinc-500 font-sans">
              <div>
                <span style={{ color: "#facc15" }}>To: </span> <span className='text-emerald-400'>{isConnected && `${address?.slice(0, 6)}...${address?.slice(-4)}`}</span>
              </div>
              <span className='text-white'>{fromToken.symbol} ≈ {rate ? rate.toFixed(6) : '...'} {toToken?.symbol || 'Select Token'}</span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <input
                type="text"
                placeholder="0.0"
                value={loading ? 'Loading...' : amountOut}
                readOnly
                className="font-mono text-2xl font-bold outline-none w-full "
                style={{color: "#ffffff"}}
              />

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowToDropdown(!showToDropdown)}
                  className="drop bg-zinc-700 text-xs text-zinc-200 font-bold py-1.5 px-3 rounded-xl outline-none cursor-pointer hover:border-zinc-700 flex items-center gap-1.5"
                >
                  {toToken?.logoURI && <img src={toToken.logoURI} alt="" className="w-4 h-4 rounded-full" />}
                  {toToken?.symbol || 'Select'} <span className="text-zinc-500">⌵</span>
                </button>

                {showToDropdown && (
                  <div className="absolute right-0 top-full mt-1 w-64 max-h-60 overflow-auto bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-20 p-2">
                    <input
                      type="text"
                      placeholder="Search tokens..."
                      value={toSearchTerm}
                      onChange={(e) => setToSearchTerm(e.target.value)}
                      className="w-full bg-zinc-800 text-xs text-zinc-200 rounded-lg p-2 outline-none mb-2"
                    />
                    <div className="space-y-1">
                      {tokens
                        .filter(t => t.symbol?.toLowerCase().includes(toSearchTerm.toLowerCase()))
                        .slice(0, 30)
                        .map(t => (
                          <div
                            key={t.address}
                            className="flex items-center gap-2 p-2 hover:bg-zinc-800 rounded-lg cursor-pointer text-xs text-zinc-300"
                            onClick={() => handleToSelect(t)}
                          >
                            <img src={t.logoURI} alt="" className="w-5 h-5 rounded-full" />
                            {t.symbol}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Button */}
          <div className="settings-box pt-2">
            <button
              className={buttonState.className}
              onClick={buttonState.onClick}
              disabled={buttonState.disabled}
            >
              {buttonState.text}
            </button>

            <div className="price-row flex items-center justify-between mt-3 text-xs text-zinc-400">
              <span>1 {fromToken.symbol} ≈ {rate ? rate.toFixed(6) : '...'} {toToken?.symbol || '...'}</span>
              <span>Slippage: {slippage}%</span>
            </div>
          </div>
        </form>

        {amountIn && parseFloat(amountIn) > 0 && amountOut && amountOut !== 'Error' && (
          <div className="mt-5 border-t border-zinc-800/80 pt-4 space-y-2.5">
            <div className="flex items-center justify-between text-[11px] font-sans">
              <span className="text-zinc-500 flex items-center gap-1">
                Received <Info size={11} className="text-zinc-600" />
              </span>
              <span className="font-mono font-bold text-zinc-300">
                {(parseFloat(amountOut) * (1 - slippage / 100)).toFixed(6)} {toToken?.symbol || ''}
              </span>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};