/*=========================================
        FRT Configuration
        Direct Values (No .env)
=========================================*/

// ✅ Network Configuration
const REQUIRED_CHAIN_ID = 56;
const REQUIRED_CHAIN_HEX = "0x38";
const NETWORK_NAME = "BSC Mainnet";

// ✅ Contract Addresses - Direct Values
const CONTRACTS = {
    ADMIN: "0x2fcCB1EDCA2DD368BF49EaaE9f6E9722107A70ba",
    ROUTER: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
    USDT: "0x55d398326f99059fF775485246999027B3197955",
    FRT: "0x484d64d137E17bd032AE044523AD017772b11DFD",
    TREASURY: "0xCe52D97F158DDc9bdd8A968C144Eb6Eb6A146EaD",
    STAKING: "0x73De3Bb4D3e1601163B2933e7E9C77a7b4738e01",
    SWAP: "0x63555e0Af57DAaa3e06a3E9C9442837f81054Fa5",
    REGISTRATION: "0xf8D1615a0Db38BcEf280B5DE5cb5036E2f2aDF11"
};

// ✅ API Configuration
const API_CONFIG = {
    BASE_URL: "http://localhost:3000/api",
    TIMEOUT: 30000,
};

// ✅ App Configuration
const APP_CONFIG = {
    NAME: "FRT DeFi v2",
    VERSION: "2.0.0",
    TEST_MODE: true,
    MAINTENANCE: false,
};

// ❌ Remove Private Keys from here!
// Private keys should NEVER be in frontend code
// TEST_SIGNER_PRIVATE_KEY - REMOVED
// TEST_SIGNER - REMOVED

// ✅ Export for Browser (window object)
if (typeof window !== 'undefined') {
    window.REQUIRED_CHAIN_ID = REQUIRED_CHAIN_ID;
    window.REQUIRED_CHAIN_HEX = REQUIRED_CHAIN_HEX;
    window.NETWORK_NAME = NETWORK_NAME;
    window.CONTRACTS = CONTRACTS;
    window.API_CONFIG = API_CONFIG;
    window.APP_CONFIG = APP_CONFIG;
    
    console.log('🔧 FRT Config Loaded:');
    console.log('  📡 Network:', NETWORK_NAME);
    console.log('  📋 Contracts:', Object.keys(CONTRACTS).length);
    console.log('  📦 Version:', APP_CONFIG.VERSION);
}

// ✅ Export for ES Modules (React/Vite)
export {
    REQUIRED_CHAIN_ID,
    REQUIRED_CHAIN_HEX,
    NETWORK_NAME,
    CONTRACTS,
    API_CONFIG,
    APP_CONFIG
};

// ✅ Export for CommonJS (Node.js)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        REQUIRED_CHAIN_ID,
        REQUIRED_CHAIN_HEX,
        NETWORK_NAME,
        CONTRACTS,
        API_CONFIG,
        APP_CONFIG
    };
}