// src/components/LiquidityForm.jsx
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useAccount } from 'wagmi';
import { IconArrowDown } from '@tabler/icons-react';

// ============================================================
// 🔴 PANCAKESWAP CONTRACT ADDRESSES (BSC Mainnet)
// ============================================================
const CONTRACTS = {
    ROUTER_V2: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
    ROUTER_V3: '0x1b81D678ffb9C0263b24A97847620C99d213eB14',
    FACTORY_V2: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
};

// ============================================================
// 🔴 TOKEN LIST (Popular BSC Tokens)
// ============================================================
const TOKENS = {
    'BNB': {
        address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
        symbol: 'BNB',
        name: 'BNB',
        decimals: 18,
        logo: 'https://assets.coingecko.com/coins/images/825/thumb/bnb-icon2_2x.png'
    },
    'WBNB': {
        address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
        symbol: 'WBNB',
        name: 'Wrapped BNB',
        decimals: 18,
        logo: 'https://assets.coingecko.com/coins/images/825/thumb/bnb-icon2_2x.png'
    },
    'CAKE': {
        address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
        symbol: 'CAKE',
        name: 'PancakeSwap Token',
        decimals: 18,
        logo: 'https://tokens.pancakeswap.finance/images/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82.png'
    },
    'USDT': {
        address: '0x55d398326f99059fF775485246999027B3197955',
        symbol: 'USDT',
        name: 'Tether USD',
        decimals: 18,
        logo: 'https://assets.coingecko.com/coins/images/325/thumb/Tether-logo_2x.png'
    },
    'BUSD': {
        address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
        symbol: 'BUSD',
        name: 'Binance USD',
        decimals: 18,
        logo: 'https://assets.coingecko.com/coins/images/9576/thumb/BUSD_2x.png'
    },
    'ETH': {
        address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
        symbol: 'ETH',
        name: 'Ethereum',
        decimals: 18,
        logo: 'https://assets.coingecko.com/coins/images/279/thumb/ethereum_2x.png'
    },
    'BTCB': {
        address: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
        symbol: 'BTCB',
        name: 'Bitcoin BEP2',
        decimals: 18,
        logo: 'https://assets.coingecko.com/coins/images/26115/thumb/btcb_2x.png'
    },
    'ETN': {
        address: '0x5bA1a0F1A9c3d3A3b4C5D6E7F8A9B0C1D2E3F4A5',
        symbol: 'ETN',
        name: 'Electroneum',
        decimals: 18,
        logo: 'https://assets.coingecko.com/coins/images/2449/thumb/etn_2x.png'
    }
};

// ============================================================
// 🔴 LIQUIDITY FORM COMPONENT
// ============================================================
const LiquidityForm = () => {
    const { address, isConnected } = useAccount();
    
    // ===== STATE =====
    const [activeTab, setActiveTab] = useState('V3');
    const [tokenA, setTokenA] = useState('BNB');
    const [tokenB, setTokenB] = useState('CAKE');
    const [amountA, setAmountA] = useState('');
    const [amountB, setAmountB] = useState('');
    const [filter, setFilter] = useState('All Pools');
    const [filterOpen, setFilterOpen] = useState(false);
    
    // ===== CONTRACT STATE =====
    const [signer, setSigner] = useState(null);
    const [balance, setBalance] = useState({});
    const [loading, setLoading] = useState(false);
    const [poolInfo, setPoolInfo] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isInitialized, setIsInitialized] = useState(false);

    // ===== TOKEN SELECTOR MODAL =====
    const [showTokenModal, setShowTokenModal] = useState(false);
    const [selectingToken, setSelectingToken] = useState('A');

    // ============================================================
    // 🔴 INIT WALLET (Using wagmi)
    // ============================================================
    const initWallet = async () => {
        try {
            if (!window.ethereum || !address) {
                return;
            }

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            setSigner(signer);

            // Get BNB balance
            const balance = await provider.getBalance(address);
            setBalance(prev => ({
                ...prev,
                BNB: ethers.utils.formatEther(balance)
            }));

            // Get token balances
            await getTokenBalances(signer, address);

            // Get pool info
            await getPoolInfo(provider, signer);
            
            setIsInitialized(true);

        } catch (err) {
            console.error('Init error:', err);
            setError(err.message);
        }
    };

    // ===== GET TOKEN BALANCES =====
    const getTokenBalances = async (signer, address) => {
        try {
            const balances = {};
            for (const [symbol, token] of Object.entries(TOKENS)) {
                if (symbol === 'BNB') continue;
                try {
                    const contract = new ethers.Contract(
                        token.address,
                        ['function balanceOf(address) view returns (uint256)'],
                        signer
                    );
                    const bal = await contract.balanceOf(address);
                    balances[symbol] = ethers.utils.formatUnits(bal, token.decimals);
                } catch (e) {
                    balances[symbol] = '0';
                }
            }
            setBalance(prev => ({ ...prev, ...balances }));
        } catch (err) {
            console.error('Error fetching token balances:', err);
        }
    };

    // ============================================================
    // 🔴 GET POOL INFO
    // ============================================================
    const getPoolInfo = async (provider, signer) => {
        try {
            const token0 = TOKENS[tokenA];
            const token1 = TOKENS[tokenB];

            if (!token0 || !token1) {
                return;
            }

            let poolAddress = 'Not found';
            let fee = 0;

            if (activeTab === 'V2' || activeTab === 'Infinity') {
                try {
                    const factory = new ethers.Contract(
                        CONTRACTS.FACTORY_V2,
                        ['function getPair(address,address) view returns (address)'],
                        provider || signer
                    );
                    const pair = await factory.getPair(token0.address, token1.address);
                    if (pair && pair !== '0x0000000000000000000000000000000000000000') {
                        poolAddress = pair;
                    }
                    fee = 25;
                } catch (e) {
                    console.warn('V2 pool not found:', e);
                }
            }

            if (activeTab === 'V3') {
                fee = 2500;
                poolAddress = 'V3 Pool';
            }

            if (activeTab === 'StableSwap') {
                fee = 4;
                poolAddress = 'StableSwap Pool';
            }

            setPoolInfo({
                address: poolAddress,
                fee: fee,
                token0: token0,
                token1: token1,
            });

        } catch (err) {
            console.error('Error getting pool info:', err);
        }
    };

    // ============================================================
    // 🔴 ADD LIQUIDITY
    // ============================================================
    const addLiquidity = async () => {
        if (!amountA || !amountB) {
            setError('Please enter amounts');
            return;
        }

        if (parseFloat(amountA) <= 0 || parseFloat(amountB) <= 0) {
            setError('Amount must be greater than 0');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const token0 = TOKENS[tokenA];
            const token1 = TOKENS[tokenB];

            if (!poolInfo || poolInfo.address === 'Not found' || poolInfo.address === 'V3 Pool' || poolInfo.address === 'StableSwap Pool') {
                setError('Pool not found. Please select a different pair.');
                setLoading(false);
                return;
            }

            const router = new ethers.Contract(
                activeTab === 'V3' ? CONTRACTS.ROUTER_V3 : CONTRACTS.ROUTER_V2,
                [
                    'function addLiquidity(address tokenA, address tokenB, uint amountADesired, uint amountBDesired, uint amountAMin, uint amountBMin, address to, uint deadline) returns (uint amountA, uint amountB, uint liquidity)'
                ],
                signer
            );

            const amountADesired = ethers.utils.parseUnits(amountA, token0.decimals);
            const amountBDesired = ethers.utils.parseUnits(amountB, token1.decimals);
            
            // Check balances
            const balanceA = parseFloat(balance[tokenA] || 0);
            const balanceB = parseFloat(balance[tokenB] || 0);
            
            if (balanceA < parseFloat(amountA)) {
                setError(`Insufficient ${tokenA} balance. Available: ${balanceA.toFixed(4)}`);
                setLoading(false);
                return;
            }
            
            if (balanceB < parseFloat(amountB)) {
                setError(`Insufficient ${tokenB} balance. Available: ${balanceB.toFixed(4)}`);
                setLoading(false);
                return;
            }

            // Slippage: 0.5%
            const slippage = 0.005;
            const amountAMin = amountADesired.mul(Math.floor((1 - slippage) * 1000)).div(1000);
            const amountBMin = amountBDesired.mul(Math.floor((1 - slippage) * 1000)).div(1000);

            const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

            // Approve tokens
            setError('Approving tokens...');
            
            if (tokenA !== 'BNB') {
                await approveToken(token0.address, CONTRACTS.ROUTER_V2, amountADesired);
            }
            if (tokenB !== 'BNB') {
                await approveToken(token1.address, CONTRACTS.ROUTER_V2, amountBDesired);
            }

            setError('Adding liquidity...');

            let tx;
            if (tokenA === 'BNB' || tokenB === 'BNB') {
                const routerWithETH = new ethers.Contract(
                    CONTRACTS.ROUTER_V2,
                    [
                        'function addLiquidityETH(address token, uint amountTokenDesired, uint amountTokenMin, uint amountETHMin, address to, uint deadline) payable returns (uint amountToken, uint amountETH, uint liquidity)'
                    ],
                    signer
                );
                
                const isTokenA_BNB = tokenA === 'BNB';
                const tokenAddr = isTokenA_BNB ? token1.address : token0.address;
                const amountToken = isTokenA_BNB ? amountBDesired : amountADesired;
                const amountTokenMin = isTokenA_BNB ? amountBMin : amountAMin;
                const amountETHMin = isTokenA_BNB ? amountAMin : amountBMin;
                const ethAmount = isTokenA_BNB ? amountADesired : amountBDesired;

                tx = await routerWithETH.addLiquidityETH(
                    tokenAddr,
                    amountToken,
                    amountTokenMin,
                    amountETHMin,
                    address,
                    deadline,
                    { value: ethAmount }
                );
            } else {
                tx = await router.addLiquidity(
                    token0.address,
                    token1.address,
                    amountADesired,
                    amountBDesired,
                    amountAMin,
                    amountBMin,
                    address,
                    deadline
                );
            }

            await tx.wait();
            setSuccess('✅ Liquidity added successfully! 🎉');
            setAmountA('');
            setAmountB('');
            setError('');
            
            // Refresh balances
            await initWallet();
            
        } catch (err) {
            console.error('Error:', err);
            if (err.code === 'ACTION_REJECTED' || err.code === 4001) {
                setError('Transaction rejected by user');
            } else {
                setError(err.message || 'Failed to add liquidity');
            }
        } finally {
            setLoading(false);
        }
    };

    // ===== APPROVE TOKEN =====
    const approveToken = async (tokenAddress, spender, amount) => {
        const token = new ethers.Contract(
            tokenAddress,
            ['function approve(address spender, uint256 amount) returns (bool)'],
            signer
        );
        const tx = await token.approve(spender, amount);
        await tx.wait();
    };

    // ===== MAX AMOUNT =====
    const setMaxAmount = (token) => {
        const bal = parseFloat(balance[token] || 0);
        if (bal > 0) {
            if (token === 'BNB' && bal > 0.01) {
                if (token === tokenA) {
                    setAmountA((bal - 0.01).toFixed(6));
                } else {
                    setAmountB((bal - 0.01).toFixed(6));
                }
            } else {
                if (token === tokenA) {
                    setAmountA(bal.toFixed(6));
                } else {
                    setAmountB(bal.toFixed(6));
                }
            }
        }
    };

    // ============================================================
    // 🔴 EFFECTS
    // ============================================================
    useEffect(() => {
        if (address && isConnected) {
            initWallet();
        }
    }, [address, isConnected]);

    useEffect(() => {
        if (signer && isInitialized) {
            getPoolInfo(null, signer);
        }
    }, [activeTab, tokenA, tokenB, signer, isInitialized]);

    // ============================================================
    // 🔴 RENDER — TOKEN SELECTOR MODAL
    // ============================================================
    const TokenSelectorModal = () => {
        return (
            <div className="modal-overlay" onClick={() => setShowTokenModal(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h3>Select Token</h3>
                        <button className="modal-close" onClick={() => setShowTokenModal(false)}>✕</button>
                    </div>
                    <div className="modal-search">
                        <input
                            type="text"
                            placeholder="Search token by name or address"
                            className="search-input"
                            onChange={(e) => {
                                const search = e.target.value.toLowerCase();
                                document.querySelectorAll('.token-item').forEach(el => {
                                    const symbol = el.dataset.symbol?.toLowerCase() || '';
                                    const name = el.dataset.name?.toLowerCase() || '';
                                    el.style.display = symbol.includes(search) || name.includes(search) ? 'flex' : 'none';
                                });
                            }}
                        />
                    </div>
                    <div className="token-list">
                        {Object.entries(TOKENS).map(([symbol, token]) => (
                            <div
                                key={symbol}
                                className="token-item"
                                data-symbol={symbol}
                                data-name={token.name}
                                onClick={() => {
                                    if (selectingToken === 'A') {
                                        if (symbol === tokenB) {
                                            setError('Same token not allowed');
                                            return;
                                        }
                                        setTokenA(symbol);
                                    } else {
                                        if (symbol === tokenA) {
                                            setError('Same token not allowed');
                                            return;
                                        }
                                        setTokenB(symbol);
                                    }
                                    setShowTokenModal(false);
                                }}
                            >
                                <img src={token.logo} alt={symbol} className="token-logo" />
                                <div className="token-info">
                                    <span className="token-symbol">{symbol}</span>
                                    <span className="token-name">{token.name}</span>
                                </div>
                                <span className="token-balance">
                                    {balance[symbol] ? parseFloat(balance[symbol]).toFixed(4) : '0'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    // ============================================================
    // 🔴 RENDER — MAIN UI
    // ============================================================
    return (
        <div className="liquidity-provider">
   

            {/* ===== MAIN CARD ===== */}
            <div className="liquidity-card">
                
                {/* 1. SELECT WHERE TO PROVIDE LIQUIDITY */}
                <div className="section">
                    <label className="section-label">Select Where to Provide Liquidity</label>
                    <div className="tab-group">
                        {['Infinity', 'V3', 'V2', 'StableSwap'].map((tab) => (
                            <button
                                key={tab}
                                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 2. CHOOSE TOKEN PAIR */}
                <div className="section">
                    <label className="section-label">Choose Token Pair</label>
                    <div className="token-pair">
                        <div className="token-select" onClick={() => {
                            setSelectingToken('A');
                            setShowTokenModal(true);
                        }}>
                            <img src={TOKENS[tokenA]?.logo} alt={tokenA} className="token-logo-sm" />
                            <span className="token-symbol-sm">{tokenA}</span>
                            <i className="fas fa-chevron-down"></i>
                        </div>

                        <div className="token-arrow">
                            <i className="fas fa-arrow-right"></i>
                        </div>

                        <div className="token-select" onClick={() => {
                            setSelectingToken('B');
                            setShowTokenModal(true);
                        }}>
                            <img src={TOKENS[tokenB]?.logo} alt={tokenB} className="token-logo-sm" />
                            <span className="token-symbol-sm">{tokenB}</span>
                            <i className="fas fa-chevron-down"></i>
                        </div>

                        {/* <button className="swap-btn" onClick={() => {
                            const temp = tokenA;
                            setTokenA(tokenB);
                            setTokenB(temp);
                        }}>
                            <IconArrowDown stroke={2}/>
                        </button> */}
                    </div>

                    {/* Amount inputs */}
                    {/* <div className="amount-inputs">
                        <div className="amount-group">
                            <span className="amount-label">{tokenA}</span>
                            <input
                                type="number"
                                placeholder="0.0"
                                value={amountA}
                                onChange={(e) => setAmountA(e.target.value)}
                                className="amount-input"
                            />
                            <span className="max-btn" onClick={() => setMaxAmount(tokenA)}>MAX</span>
                        </div>
                        <div className="amount-group">
                            <span className="amount-label">{tokenB}</span>
                            <input
                                type="number"
                                placeholder="0.0"
                                value={amountB}
                                onChange={(e) => setAmountB(e.target.value)}
                                className="amount-input"
                            />
                            <span className="max-btn" onClick={() => setMaxAmount(tokenB)}>MAX</span>
                        </div>
                    </div> */}

       

                    {/* Messages */}
                    {/* {error && <div className="error-msg">{error}</div>} */}
                    {success && <div className="success-msg">{success}</div>}
                </div>

                {/* 3. POOL FILTER */}
                <div className="section">
                    <label className="section-label">Pool Filter (Optional)</label>
                    <div className="filter-group" onClick={() => setFilterOpen(!filterOpen)}>
                        <div className="filter-display">
                            <span>{filter}</span>
                            <i className={`fas fa-chevron-${filterOpen ? 'up' : 'down'}`}></i>
                        </div>
                        {filterOpen && (
                            <div className="filter-dropdown">
                                {['All Pools', 'Pool Type', 'CLAMM', 'LBAMM', 'Pool Fee', 'TVL'].map((f) => (
                                    <div
                                        key={f}
                                        className={`filter-item ${filter === f ? 'active' : ''}`}
                                        onClick={() => {
                                            setFilter(f);
                                            setFilterOpen(false);
                                        }}
                                    >
                                        {f}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ===== ADD LIQUIDITY BUTTON ===== */}
                <button
                    className="next-btn"
                    onClick={addLiquidity}
                    disabled={loading || !address}
                >
                    {loading ? (
                        <><i className="fas fa-spinner spinner"></i> Processing...</>
                    ) : !address ? (
                        'Connect Wallet First'
                    ) : (
                        'Add Liquidity →'
                    )}
                </button>

            </div>

            {/* ===== TOKEN MODAL ===== */}
            {showTokenModal && <TokenSelectorModal />}

            {/* ============================================================
                STYLES
                ============================================================ */}
            <style>{`
                .liquidity-provider {
                    max-width: 520px;
                    margin: 20px auto;
                    padding: 0 16px;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    background: #0d0d1a;
                    min-height: 100vh;
                }

                .wallet-bar {
                    background: #1a1a2e;
                    border-radius: 16px;
                    padding: 12px 20px;
                    margin-bottom: 20px;
                    border: 1px solid #2a2a4a;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .wallet-info {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    flex-wrap: wrap;
                }
                .wallet-status {
                    color: #4ade80;
                    font-size: 13px;
                    font-weight: 600;
                }
                .connected-dot {
                    font-size: 8px;
                    margin-right: 6px;
                }
                .wallet-address {
                    color: #fff;
                    font-size: 14px;
                    font-weight: 500;
                }
                .wallet-address i {
                    color: #8892b0;
                    margin-right: 6px;
                }
                .wallet-balance {
                    color: #f0b90b;
                    font-size: 14px;
                    font-weight: 600;
                }
                .wallet-balance i {
                    margin-right: 6px;
                }

                .liquidity-card {
                    background: #1a1a2e;
                    border-radius: 24px;
                    padding: 24px;
                    border: 1px solid #2a2a4a;
                    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.4);
                }

                .section {
                    margin-bottom: 24px;
                }

                .section-label {
                    display: block;
                    color: #8892b0;
                    font-size: 12px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 10px;
                }

                .tab-group {
                    display: flex;
                    gap: 4px;
                    background: #0d0d1a;
                    padding: 4px;
                    border-radius: 16px;
                    margin-bottom: 12px;
                }

                .tab-btn {
                    flex: 1;
                    padding: 8px 0;
                    border: none;
                    background: transparent;
                    color: #8892b0;
                    font-weight: 600;
                    font-size: 14px;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .tab-btn:hover {
                    color: #fff;
                }

                .tab-btn.active {
                    background: #1fc7d4;
                    color: #fff;
                    box-shadow: 0 4px 12px rgba(31, 199, 212, 0.3);
                }

                .chain-selector {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: #0d0d1a;
                    padding: 6px 14px;
                    border-radius: 12px;
                    color: #8892b0;
                    font-size: 13px;
                    cursor: pointer;
                }

                .token-pair {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: #0d0d1a;
                    padding: 12px 16px;
                    border-radius: 16px;
                }

                .token-select {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: #1a1a2e;
                    padding: 6px 12px 6px 8px;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                    flex: 1;
                }

                .token-select:hover {
                    background: #2a2a4a;
                }

                .token-logo-sm {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                }

                .token-symbol-sm {
                    color: #fff;
                    font-weight: 600;
                    font-size: 16px;
                }

                .token-arrow {
                    color: #8892b0;
                    font-size: 14px;
                }

                .swap-btn {
                    background: #1a1a2e;
                    border: none;
                    color: #8892b0;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .swap-btn:hover {
                    background: #2a2a4a;
                    color: #fff;
                }

                .amount-inputs {
                    margin-top: 12px;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .amount-group {
                    display: flex;
                    align-items: center;
                    background: #0d0d1a;
                    padding: 8px 12px;
                    border-radius: 12px;
                    gap: 8px;
                }

                .amount-label {
                    color: #8892b0;
                    font-weight: 600;
                    font-size: 14px;
                    min-width: 40px;
                }

                .amount-input {
                    flex: 1;
                    background: transparent;
                    border: none;
                    color: #fff;
                    font-size: 18px;
                    font-weight: 500;
                    outline: none;
                    padding: 4px 0;
                }

                .amount-input::placeholder {
                    color: #2a2a4a;
                }

                .amount-input::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                }

                .max-btn {
                    color: #1fc7d4;
                    font-size: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    padding: 2px 8px;
                    border-radius: 4px;
                    transition: all 0.2s;
                }

                .max-btn:hover {
                    background: rgba(31, 199, 212, 0.1);
                }

                .pool-info {
                    margin-top: 12px;
                    background: #0d0d1a;
                    padding: 12px 16px;
                    border-radius: 12px;
                }

                .info-row {
                    display: flex;
                    justify-content: space-between;
                    color: #8892b0;
                    font-size: 13px;
                    padding: 4px 0;
                }

                .info-row span:last-child {
                    color: #fff;
                }

                .address {
                    font-family: monospace;
                    color: #1fc7d4 !important;
                }

                .status-active {
                    color: #4ade80 !important;
                }

                .status-inactive {
                    color: #f87171 !important;
                }

                .error-msg {
                    color: #f87171;
                    font-size: 13px;
                    margin-top: 8px;
                    padding: 8px 12px;
                    background: rgba(248, 113, 113, 0.1);
                    border-radius: 8px;
                }

                .success-msg {
                    color: #4ade80;
                    font-size: 13px;
                    margin-top: 8px;
                    padding: 8px 12px;
                    background: rgba(74, 222, 128, 0.1);
                    border-radius: 8px;
                }

                .filter-group {
                    position: relative;
                    background: #0d0d1a;
                    border-radius: 12px;
                    cursor: pointer;
                }

                .filter-display {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 16px;
                    color: #8892b0;
                    font-size: 14px;
                }

                .filter-display span {
                    color: #fff;
                }

                .filter-dropdown {
                    position: absolute;
                    top: calc(100% + 4px);
                    left: 0;
                    right: 0;
                    background: #1a1a2e;
                    border-radius: 12px;
                    border: 1px solid #2a2a4a;
                    padding: 4px;
                    z-index: 10;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
                }

                .filter-item {
                    padding: 10px 16px;
                    border-radius: 8px;
                    color: #8892b0;
                    font-size: 14px;
                    transition: all 0.2s;
                }

                .filter-item:hover {
                    background: #2a2a4a;
                    color: #fff;
                }

                .filter-item.active {
                    background: rgba(31, 199, 212, 0.1);
                    color: #1fc7d4;
                }

                .next-btn {
                    width: 100%;
                    padding: 14px;
                    border: none;
                    border-radius: 16px;
                    background: #1fc7d4;
                    color: #fff;
                    font-size: 16px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s;
                    margin-top: 8px;
                }

                .next-btn:hover:not(:disabled) {
                    opacity: 0.8;
                    transform: scale(0.98);
                }

                .next-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .spinner {
                    animation: spin 1s linear infinite;
                    margin-right: 8px;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 100;
                    backdrop-filter: blur(8px);
                }

                .modal-content {
                    background: #1a1a2e;
                    border-radius: 24px;
                    padding: 24px;
                    width: 400px;
                    max-width: 90vw;
                    max-height: 80vh;
                    border: 1px solid #2a2a4a;
                    overflow-y: auto;
                }

                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 16px;
                }

                .modal-header h3 {
                    color: #fff;
                    font-size: 18px;
                }

                .modal-close {
                    background: none;
                    border: none;
                    color: #8892b0;
                    font-size: 20px;
                    cursor: pointer;
                    padding: 4px 8px;
                }

                .modal-search {
                    margin-bottom: 16px;
                }

                .search-input {
                    width: 100%;
                    padding: 12px 16px;
                    background: #0d0d1a;
                    border: 1px solid #2a2a4a;
                    border-radius: 12px;
                    color: #fff;
                    font-size: 14px;
                    outline: none;
                }

                .search-input:focus {
                    border-color: #1fc7d4;
                }

                .token-list {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .token-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 10px 12px;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .token-item:hover {
                    background: #2a2a4a;
                }

                .token-logo {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                }

                .token-info {
                    flex: 1;
                }

                .token-symbol {
                    display: block;
                    color: #fff;
                    font-weight: 600;
                    font-size: 14px;
                }

                .token-name {
                    display: block;
                    color: #8892b0;
                    font-size: 12px;
                }

                .token-balance {
                    color: #8892b0;
                    font-size: 13px;
                }

                @media (max-width: 600px) {
                    .liquidity-provider {
                        padding: 0 8px;
                        margin: 10px auto;
                    }
                    
                    .liquidity-card {
                        padding: 16px;
                    }

                    .wallet-bar {
                        padding: 10px 16px;
                    }

                    .wallet-info {
                        gap: 10px;
                    }

                    .wallet-address {
                        font-size: 12px;
                    }

                    .wallet-balance {
                        font-size: 12px;
                    }
                    
                    .tab-btn {
                        font-size: 12px;
                        padding: 6px 0;
                    }
                    
                    .token-select {
                        padding: 4px 8px 4px 6px;
                    }
                    
                    .token-symbol-sm {
                        font-size: 14px;
                    }
                    
                    .modal-content {
                        padding: 16px;
                        width: 95vw;
                    }
                }
            `}</style>
        </div>
    );
};

export default LiquidityForm;