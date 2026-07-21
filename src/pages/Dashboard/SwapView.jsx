import React, { useState } from 'react';

export const info = () => {
    const [fromAmount, setFromAmount] = useState('');
    const [toAmount, setToAmount] = useState('');
    const [fromToken, setFromToken] = useState('USDT');
    const [toToken, setToToken] = useState('FRT');
    const [isConnected, setIsConnected] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    // Mock balances
    const balances = {
        USDT: 1250.50,
        FRT: 850.75,
        BNB: 2.35,
    };

    // Mock prices
    const prices = {
        USDT: 1,
        FRT: 0.0042,
        BNB: 320,
    };



    const handleFromAmountChange = (e) => {
        const value = e.target.value;
        setFromAmount(value);
        if (value && parseFloat(value) > 0) {
            const rate = prices[fromToken] / prices[toToken];
            setToAmount((parseFloat(value) * rate).toFixed(6));
        } else {
            setToAmount('');
        }
    };

    // ============================================================
    // STYLES
    // ============================================================

    const styles = {
        
        swapTable: {
            borderRadius: '16px',
            border: '1px solid #27272a',  
            padding: '24px',
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
        },
        welcomeText: {
            color: '#ffffff',
            fontSize: '22px',
            fontWeight: '600',
        },
        networkBadge: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '20px',
            backgroundColor: '#1a1a1e',
            border: '1px solid #27272a',
            fontSize: '12px',
            color: '#a1a1aa',
        },
        networkDot: {
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: isConnected ? '#4ade80' : '#f87171',
            display: 'inline-block',
        },
        balanceContainer: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '20px',
        },
        balanceCard: {
            background: 'rgba(147, 146, 146, 0.094)',
            borderRadius: '12px',
            padding: '12px 16px',
            border: '1px solid #27272a',
        },
        balanceLabel: {
            fontSize: '11px',
            color: 'rgb(250, 204, 21)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
        },
        balanceValue: {
            fontSize: '18px',
            fontWeight: '600',
            color: '#ffffff',
            marginTop: '2px',
        },
        balanceToken: {
            fontSize: '11px',
            color: '#71717a',          
            marginLeft: '4px',
        },
        swapBox: {
            background: 'rgba(147, 146, 146, 0.094)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid #27272a',
            marginBottom: '12px',
        },

    };

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <div className='swaptable' style={{borderRadius: "20px"}}>
            <div style={styles.swapTable}>
                {/* Header */}
                <div style={styles.header}>
                    <span style={styles.welcomeText}> Welcome back FRT</span>
                    <div style={styles.networkBadge}>
                        <span style={styles.networkDot}></span>
                        {isConnected ? 'Connected' : 'Disconnected'}
                    </div>
                </div>
              {/* Balances */}
                <div style={styles.balanceContainer}>
                    <div style={styles.balanceCard}>
                        <div style={styles.balanceLabel}>USDT Balance</div>
                        <div style={styles.balanceValue}>
                            ${balances.USDT.toFixed(3)}
                            <span style={styles.balanceToken}>USDT</span>
                        </div>
                    </div>
                    <div style={styles.balanceCard}>
                        <div style={styles.balanceLabel}>FRT Balance</div>
                        <div style={styles.balanceValue}>
                            {balances.FRT.toFixed(3)}
                            <span style={styles.balanceToken}>FRT</span>
                        </div>
                    </div>
                </div>


                {/* Wallet Info */}
                <div style={styles.swapBox}>
                    <div style={styles.infoRow}>
                        <span style={{color: "rgb(250, 204, 21)"}}>Wallet ID:</span>
                        <span className='text-emerald-400'> 0x123456...021024</span>
                    </div>
                </div>


                <div style={styles.swapBox}>
                    <div style={styles.infoRow}>
                        <span style={{color: "rgb(250, 204, 21)"}}> Sponsor ID:</span>
                        <span className='text-emerald-400'> 0x123456...102452</span>
                    </div>
                </div>

                         <div style={styles.swapBox}>
                    <div style={styles.infoRow}>
                        <span style={{color: "rgb(250, 204, 21)"}}> Investment:</span>
                        <span className='text-emerald-400'>  0.00</span>
                    </div>
                </div>

                
            </div>

            {/* Global Animation Styles */}
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                input[type="number"]::-webkit-inner-spin-button,
                input[type="number"]::-webkit-outer-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
                input[type="number"] {
                    -moz-appearance: textfield;
                }
            `}</style>
        </div>
    );
};

export default info;