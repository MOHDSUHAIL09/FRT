// src/assets/js/withdraw.js

async function generateTestSignature() {
    // ✅ Use API_CONFIG
    const response = await fetch(`${API_CONFIG.BASE_URL}/generate-signature`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            claimId,
            amount,
            nonce,
            userAddress: account,
            chainId: REQUIRED_CHAIN_ID
        })
    });
}