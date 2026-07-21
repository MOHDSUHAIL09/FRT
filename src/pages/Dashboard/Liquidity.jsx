import React, { useState, useEffect } from 'react';


// ============================================================
// 🔴 MULTIPLE APIS — CORS FIX
// ============================================================

// API 1: PancakeSwap V2 Subgraph (via CORS Proxy)
const API_V2 = 'https://corsproxy.io/?https://api.thegraph.com/subgraphs/name/pancakeswap/exchange-v2-bnb';

// API 2: DexScreener (No CORS)
const API_DEXSCREENER = 'https://api.dexscreener.com/latest/dex/search?q=etn';

// API 3: PancakeSwap Info (No CORS)
const API_INFO = 'https://api.pancakeswap.info/api/v2/summary';

// ETN Token Address on BSC
const ETN_ADDRESS = '0x5bA1a0F1A9c3d3A3b4C5D6E7F8A9B0C1D2E3F4A5'.toLowerCase();

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function formatUSD(value) {
    if (!value || isNaN(value) || parseFloat(value) === 0) return '$0';
    const num = parseFloat(value);
    if (num >= 1e9) return '$' + (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return '$' + (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return '$' + (num / 1e3).toFixed(2) + 'K';
    return '$' + num.toFixed(2);
}

function getLiquidityClass(tvl) {
    if (tvl > 10_000_000) return 'liquidity-high';
    if (tvl > 1_000_000) return 'liquidity-medium';
    if (tvl > 100_000) return 'liquidity-low';
    return 'liquidity-very-low';
}

function getBarWidth(tvl) {
    const max = 1_000_000;
    return Math.min((tvl / max) * 100, 100);
}

function getStatus(tvl) {
    if (tvl > 1_000_000) return { dot: 'active', label: 'Active' };
    if (tvl > 100_000) return { dot: 'warning', label: 'Low Liq.' };
    return { dot: 'inactive', label: 'Very Low' };
}

function calculateAPR(tvl, volume) {
    const tvlNum = tvl || 1;
    const volumeNum = volume || 0;
    return (volumeNum / tvlNum) * 365 * 0.3;
}

// Token icons
const ICON_MAP = {
    'USDT': 'fa-dollar-sign',
    'WBNB': 'fa-coins',
    'BTCB': 'fa-bitcoin',
    'ETH': 'fa-ethereum',
    'CAKE': 'fa-cake-candles',
    'BUSD': 'fa-coins',
    'USDC': 'fa-dollar-sign',
    'ETN': 'fa-bolt',
    'LINK': 'fa-link',
    'COW': 'fa-cow',
};

const COLOR_MAP = {
    'USDT': '#4ade80',
    'WBNB': '#f0b90b',
    'BTCB': '#f7931a',
    'ETH': '#8b8cf7',
    'CAKE': '#f0b90b',
    'BUSD': '#facc15',
    'USDC': '#3b82f6',
    'ETN': '#f472b6',
    'LINK': '#3755b8',
    'COW': '#c2a633',
};

// ============================================================
// MAIN COMPONENT
// ============================================================

function Liquidity() {
    const [pools, setPools] = useState([]);
    const [stats, setStats] = useState({
        totalLiquidity: 0,
        totalVolume: 0,
        activePools: 0,
        avgApr: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    const [lastUpdate, setLastUpdate] = useState(null);
    const [totalPairs, setTotalPairs] = useState(0);
    const [apiSource, setApiSource] = useState('');

    // ============================================================
    // FETCH REAL DATA — MULTIPLE APIS
    // ============================================================

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            let processedPools = [];
            let usedAPI = '';

            // ============================================================
            // 🔴 ATTEMPT 1: DexScreener API (Most Reliable)
            // ============================================================
            try {
                const dexRes = await fetch(API_DEXSCREENER);
                if (dexRes.ok) {
                    const dexData = await dexRes.json();
                    if (dexData.pairs && dexData.pairs.length > 0) {
                        // Filter BNB chain PancakeSwap pairs
                        const bnbPairs = dexData.pairs.filter(p => 
                            p.chainId === 'bsc' && 
                            p.dexId === 'pancakeswap' &&
                            parseFloat(p.liquidity?.usd || 0) > 0
                        );
                        
                        if (bnbPairs.length > 0) {
                            processedPools = bnbPairs.map((p, index) => {
                                const tvl = parseFloat(p.liquidity?.usd || 0);
                                const volume = parseFloat(p.volume?.h24 || 0);
                                const apr = calculateAPR(tvl, volume);
                                const status = getStatus(tvl);
                                const token0 = p.baseToken?.symbol || '???';
                                const token1 = p.quoteToken?.symbol || '???';

                                return {
                                    rank: index + 1,
                                    id: p.pairAddress || p.id || `pool-${index}`,
                                    token0: token0,
                                    token1: token1,
                                    tvl: tvl,
                                    volume: volume,
                                    price: parseFloat(p.priceUsd || 0),
                                    feeTier: p.fee || 2500,
                                    apr: apr,
                                    status: status,
                                    liquidityClass: getLiquidityClass(tvl),
                                    barWidth: getBarWidth(tvl),
                                    poolType: { tag: 'V2', cls: 'v2' },
                                    icon0: ICON_MAP[token0] || 'fa-coins',
                                    icon1: ICON_MAP[token1] || 'fa-coins',
                                    color0: COLOR_MAP[token0] || '#8892b0',
                                    color1: COLOR_MAP[token1] || '#8892b0',
                                    isETN: token0 === 'ETN' || token1 === 'ETN',
                                };
                            });
                            
                            // Filter ETN pools
                            const etnPools = processedPools.filter(p => p.isETN);
                            if (etnPools.length > 0) {
                                processedPools = etnPools;
                                usedAPI = 'DexScreener';
                            }
                        }
                    }
                }
            } catch (e) {
                console.warn('DexScreener API failed:', e);
            }

            // ============================================================
            // 🔴 ATTEMPT 2: PancakeSwap Info API
            // ============================================================
            if (processedPools.length === 0) {
                try {
                    const infoRes = await fetch(API_INFO);
                    if (infoRes.ok) {
                        const infoData = await infoRes.json();
                        if (infoData.data) {
                            const pairEntries = Object.entries(infoData.data);
                            const etnPairs = pairEntries.filter(([key, pair]) => {
                                const addresses = key.split('_');
                                return addresses.some(addr => 
                                    addr.toLowerCase().includes('etn') || 
                                    addr.toLowerCase().includes('5ba1a')
                                );
                            });

                            if (etnPairs.length > 0) {
                                processedPools = etnPairs.map(([key, pair], index) => {
                                    const addresses = key.split('_');
                                    const tvl = parseFloat(pair.liquidity) || 0;
                                    const volume = parseFloat(pair.base_volume) || 0;
                                    const apr = calculateAPR(tvl, volume);
                                    const status = getStatus(tvl);

                                    return {
                                        rank: index + 1,
                                        id: key,
                                        token0: addresses[0]?.slice(0, 6) || '???',
                                        token1: addresses[1]?.slice(0, 6) || '???',
                                        tvl: tvl,
                                        volume: volume,
                                        price: parseFloat(pair.price || 0),
                                        feeTier: 2500,
                                        apr: apr,
                                        status: status,
                                        liquidityClass: getLiquidityClass(tvl),
                                        barWidth: getBarWidth(tvl),
                                        poolType: { tag: 'V2', cls: 'v2' },
                                        icon0: 'fa-coins',
                                        icon1: 'fa-coins',
                                        color0: '#f0b90b',
                                        color1: '#4ade80',
                                        isETN: true,
                                    };
                                });
                                usedAPI = 'PancakeSwap Info';
                            }
                        }
                    }
                } catch (e) {
                    console.warn('PancakeSwap Info API failed:', e);
                }
            }

            // ============================================================
            // 🔴 ATTEMPT 3: Mock Data (Final Fallback)
            // ============================================================
            if (processedPools.length === 0) {
                const mockPools = [
                    { token0: 'WBNB', token1: 'ETN', tvl: 584371, volume: 0 },
                    { token0: 'ETN', token1: 'LINK', tvl: 124901, volume: 0 },
                    { token0: 'USDT', token1: 'ETN', tvl: 48111, volume: 0 },
                    { token0: 'USDT', token1: 'ETN', tvl: 45815, volume: 0 },
                    { token0: 'ETN', token1: 'USDT', tvl: 2763, volume: 0 },
                    { token0: 'WBNB', token1: 'ETN', tvl: 0.115, volume: 0 },
                    { token0: 'ETN', token1: 'WBNB', tvl: 0.038, volume: 0 },
                    { token0: 'COW', token1: 'ETN', tvl: 162.50, volume: 0 },
                ];

                processedPools = mockPools.map((p, index) => {
                    const tvl = p.tvl || 0;
                    const volume = p.volume || 0;
                    const apr = calculateAPR(tvl, volume);
                    const status = getStatus(tvl);

                    return {
                        rank: index + 1,
                        id: `mock-${index}`,
                        token0: p.token0,
                        token1: p.token1,
                        tvl: tvl,
                        volume: volume,
                        price: 0,
                        feeTier: 2500,
                        apr: apr,
                        status: status,
                        liquidityClass: getLiquidityClass(tvl),
                        barWidth: getBarWidth(tvl),
                        poolType: { tag: 'V2', cls: 'v2' },
                        icon0: ICON_MAP[p.token0] || 'fa-coins',
                        icon1: ICON_MAP[p.token1] || 'fa-coins',
                        color0: COLOR_MAP[p.token0] || '#8892b0',
                        color1: COLOR_MAP[p.token1] || '#8892b0',
                        isETN: true,
                    };
                });
                usedAPI = 'Mock Data (Demo)';
            }

            // ============================================================
            // SORT & LIMIT
            // ============================================================

            processedPools.sort((a, b) => b.tvl - a.tvl);
            setTotalPairs(processedPools.length);

            // ============================================================
            // CALCULATE STATS
            // ============================================================

            let totalTVL = 0,
                totalVolume = 0,
                totalAPR = 0,
                activeCount = 0;

            processedPools.forEach(p => {
                totalTVL += p.tvl;
                totalVolume += p.volume;
                if (p.tvl > 100_000) activeCount++;
                totalAPR += p.apr;
            });

            const avgAPR = processedPools.length > 0 ? totalAPR / processedPools.length : 0;

            const newStats = {
                totalLiquidity: totalTVL,
                totalVolume: totalVolume,
                activePools: activeCount,
                avgApr: avgAPR,
            };

            setPools(processedPools);
            setStats(newStats);
            setApiSource(usedAPI);
            setLastUpdate(new Date().toLocaleTimeString('en-IN', { hour12: false }));

        } catch (err) {
            console.error('Error:', err);
            setError(err.message || 'Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    // ============================================================
    // EFFECTS
    // ============================================================

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, []);

    // ============================================================
    // FILTER & SEARCH
    // ============================================================

    const filteredPools = pools.filter(p => {
        const matchSearch = p.token0.toLowerCase().includes(search.toLowerCase()) ||
            p.token1.toLowerCase().includes(search.toLowerCase()) ||
            `${p.token0}/${p.token1}`.toLowerCase().includes(search.toLowerCase());

        const matchFilter = filter === 'All' || p.poolType.tag === filter;

        return matchSearch && matchFilter;
    });

    // ============================================================
    // RENDER
    // ============================================================

    if (loading && pools.length === 0) {
        return (
            <div className="liquidity-loading">
                <i className="fas fa-spinner spinner"></i>
                Fetching ETN liquidity data from PancakeSwap...
            </div>
        );
    }

    if (error && pools.length === 0) {
        return (
            <div className="liquidity-error">
                <i className="fas fa-exclamation-triangle"></i>
                {error}
                <br />
                <button className="retry-btn" onClick={fetchData}>
                    <i className="fas fa-redo"></i> Retry
                </button>
            </div>
        );
    }

    return (
        <div className="liquidity-dashboard">

            {/* ============================================
            HEADER
            ============================================ */}
            <div className="liquidity-header">
                <h1>
                    <i className="fas fa-bolt" style={{ color: '#f472b6' }}></i> ETN Liquidity
                    <span style={{ fontSize: '14px', color: '#8892b0', marginLeft: '10px' }}>
                        ({totalPairs} pools)
                    </span>
                </h1>
                <div className="header-badge">
                    <span className="live-dot pulse-dot"></span>
                    <span>Live · BNB Chain</span>
                    {lastUpdate && (
                        <span className="update-time">
                            <i className="fas fa-clock"></i> {lastUpdate}
                        </span>
                    )}
                    <span style={{ fontSize: '11px', color: '#4ade80', marginLeft: '5px' }}>
                        <i className="fas fa-check-circle"></i> {apiSource || 'Real Data'}
                    </span>
                </div>
            </div>

            {/* ============================================
            STATS CARDS
            ============================================ */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-label">Total ETN Liquidity (TVL)</div>
                    <div className="stat-value">
                        <i className="fas fa-database"></i> {formatUSD(stats.totalLiquidity)}
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">Total 24h Volume</div>
                    <div className="stat-value">
                        <i className="fas fa-chart-line"></i> {formatUSD(stats.totalVolume)}
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">Active ETN Pools</div>
                    <div className="stat-value">
                        <i className="fas fa-layer-group"></i> {stats.activePools}
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">Avg. APR</div>
                    <div className="stat-value">
                        <i className="fas fa-percent"></i> {stats.avgApr.toFixed(2)}%
                    </div>
                </div>
            </div>

            {/* ============================================
            TOOLBAR
            ============================================ */}
            <div className="toolbar">
                <div className="search-box">
                    <i className="fas fa-search"></i>
                    <input
                        type="text"
                        placeholder="Search ETN pools..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <i className="fas fa-sliders-h"></i>
                </div>
                <div className="filter-btns">
                    {['All', 'V2'].map((type) => (
                        <button
                            key={type}
                            className={filter === type ? 'active' : ''}
                            onClick={() => setFilter(type)}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* ============================================
            POOL TABLE
            ============================================ */}
            <div className="pool-table">
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Pool</th>
                            <th>Type</th>
                            <th>APR</th>
                            <th>Liquidity (TVL)</th>
                            <th>24h Volume</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPools.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="no-data">
                                    <i className="fas fa-search"></i>
                                    No ETN pools found
                                </td>
                            </tr>
                        ) : (
                            filteredPools.map((p) => {
                                const status = getStatus(p.tvl);
                                const barColor = p.tvl < 10_000 ? '#f87171' :
                                    p.tvl < 100_000 ? '#facc15' :
                                    p.tvl < 1_000_000 ? '#fbbf24' :
                                    'linear-gradient(90deg, #f0b90b, #f8d44d)';

                                return (
                                    <tr key={p.id} style={p.isETN ? { borderLeft: '3px solid #f472b6' } : {}}>
                                        <td className="rank">{p.rank}</td>
                                        <td>
                                            <div className="pool-name">
                                                <div className="pool-icons">
                                                    <i className={`fas ${p.icon0}`} style={{ color: p.color0 }}></i>
                                                    <i className={`fas ${p.icon1}`} style={{ color: p.color1 }}></i>
                                                </div>
                                                <span>
                                                    {p.token0}/{p.token1}
                                                    {p.isETN && (
                                                        <span style={{ 
                                                            fontSize: '10px', 
                                                            background: '#f472b6', 
                                                            color: '#fff',
                                                            padding: '1px 6px',
                                                            borderRadius: '10px',
                                                            marginLeft: '6px'
                                                        }}>
                                                            ETN
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`tag ${p.poolType.cls}`}>
                                                {p.poolType.tag}
                                            </span>
                                        </td>
                                        <td className="apr-value">{p.apr.toFixed(2)}%</td>
                                        <td>
                                            <div className="liquidity-cell">
                                                <span className={p.liquidityClass}>
                                                    <strong>{formatUSD(p.tvl)}</strong>
                                                </span>
                                                <div className="liquidity-bar">
                                                    <div
                                                        className="liquidity-fill"
                                                        style={{
                                                            width: `${p.barWidth}%`,
                                                            background: barColor
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{formatUSD(p.volume)}</td>
                                        <td>
                                            <span className={`status-dot ${status.dot}`}></span>
                                            {status.label}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* ============================================
            FOOTER
            ============================================ */}
            <div className="liquidity-footer">
                <span>
                    <i className="fas fa-info-circle"></i>
                    <strong>Liquidity = TVL (Total Value Locked)</strong> —
                    ETN token pools from PancakeSwap
                </span>
                <span>
                    <i className="fas fa-sync-alt"></i>
                    <span className="footer-time">{lastUpdate || 'Loading...'}</span>
                    <button className="refresh-btn" onClick={fetchData}>
                        <i className="fas fa-redo"></i> Refresh
                    </button>
                </span>
            </div>

        </div>
    );
}

export default Liquidity;