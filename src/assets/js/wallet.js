// src/assets/js/wallet.js

let provider = null;
let signer = null;
let account = "";

let frt = null;
let usdt = null;
let registration = null;
let staking = null;
let treasury = null;
let swap = null;

function log(message) {
    const box = document.getElementById("console");
    if (!box) return;
    const time = new Date().toLocaleTimeString();
    box.value += "[" + time + "] " + message + "\n";
    box.scrollTop = box.scrollHeight;
}

function toast(message) {
    const toastEl = document.getElementById("liveToast");
    if (!toastEl) return;
    document.getElementById("toastMessage").innerHTML = message;
    new bootstrap.Toast(toastEl).show();
}

function showLoading() {
    const overlay = document.getElementById("loadingOverlay");
    if (overlay) overlay.classList.remove("d-none");
}

function hideLoading() {
    const overlay = document.getElementById("loadingOverlay");
    if (overlay) overlay.classList.add("d-none");
}

function setProgress(value) {
    const p = document.getElementById("buyProgress");
    if (!p) return;
    p.style.width = value + "%";
    p.innerHTML = value + "%";
}

//---------------------------------------------------------
// Connect Wallet
//---------------------------------------------------------

async function connectWallet() {
    if (!window.ethereum) {
        alert("MetaMask Not Installed");
        return;
    }

    provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();
    account = await signer.getAddress();

    const network = await provider.getNetwork();
    if (Number(network.chainId) !== REQUIRED_CHAIN_ID) {
        try {
            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: REQUIRED_CHAIN_HEX }]
            });
        } catch {
            alert("Switch MetaMask to BSC Mainnet");
            return;
        }
    }

    // Update UI
    const walletEl = document.getElementById("wallet");
    if (walletEl) walletEl.value = account;
    
    const networkEl = document.getElementById("network");
    if (networkEl) networkEl.value = "BSC Mainnet";

    // Initialize Contracts
    frt = new ethers.Contract(CONTRACTS.FRT, FRT_ABI, signer);
    usdt = new ethers.Contract(CONTRACTS.USDT, ERC20_ABI, signer);
    registration = new ethers.Contract(CONTRACTS.REGISTRATION, REGISTRATION_ABI, signer);
    staking = new ethers.Contract(CONTRACTS.STAKING, STAKING_ABI, signer);
    treasury = new ethers.Contract(CONTRACTS.TREASURY, TREASURY_ABI, signer);
    swap = new ethers.Contract(CONTRACTS.SWAP, SWAPMANAGER_ABI, signer);

    // Load Data
    await loadBalances();
    await loadDashboard();
    await loadStakeTable();
    await loadAllowance();
    await loadGas();

    log("Wallet Connected");
    log(account);

    // ✅ Check Registration - Auto open modal if not registered
    setTimeout(async () => {
        const registered = await checkRegistration();
        if (!registered && account) {
            setTimeout(() => {
                showRegistrationModal();
            }, 1500);
        }
    }, 2000);
}

//---------------------------------------------------------
// Load Balances
//---------------------------------------------------------

async function loadBalances() {
    try {
        const ubal = await usdt.balanceOf(account);
        const fbal = await frt.balanceOf(account);
        
        const usdtEl = document.getElementById("usdt");
        if (usdtEl) usdtEl.value = ethers.formatUnits(ubal, 18);
        
        const frtEl = document.getElementById("frt");
        if (frtEl) frtEl.value = ethers.formatUnits(fbal, 18);
    } catch (ex) {
        console.error(ex);
    }
}

//---------------------------------------------------------
// Load Allowance
//---------------------------------------------------------

async function loadAllowance() {
    try {
        const allowance = await usdt.allowance(account, CONTRACTS.SWAP);
        const statusEl = document.getElementById("allowanceStatus");
        if (!statusEl) return;
        
        if (allowance > 0) {
            statusEl.className = "badge bg-success";
            statusEl.innerHTML = "Approved";
        } else {
            statusEl.className = "badge bg-danger";
            statusEl.innerHTML = "Not Approved";
        }
    } catch (ex) {
        console.log(ex);
    }
}

//---------------------------------------------------------
// Load Gas
//---------------------------------------------------------

async function loadGas() {
    try {
        const fee = await provider.getFeeData();
        const gasEl = document.getElementById("gasPrice");
        if (!gasEl) return;
        
        gasEl.innerHTML = Number(
            ethers.formatUnits(fee.gasPrice, "gwei")
        ).toFixed(2) + " Gwei";
    } catch (ex) {
        console.log(ex);
    }
}

//---------------------------------------------------------
// Load Dashboard
//---------------------------------------------------------

async function loadDashboard() {
    try {
        // Registration Status
        const registered = await registration.isRegistered(account);
        const statusEl = document.getElementById("registrationStatus");
        if (statusEl) {
            statusEl.innerHTML = registered ?
                "<span class='text-success'>✅ Registered</span>" :
                "<span class='text-danger'>❌ Not Registered</span>";
        }

        // Stake Count
        const count = await staking.getStakeCount(account);
        const countEl = document.getElementById("stakeCount");
        if (countEl) countEl.innerHTML = count;

        // Treasury Balance
        const treasuryBal = await treasury.treasuryBalance();
        const balEl = document.getElementById("treasuryBalance");
        if (balEl) balEl.innerHTML = ethers.formatUnits(treasuryBal, 18);

    } catch (ex) {
        console.error(ex);
        log(ex.shortMessage || ex.message);
    }
}

//---------------------------------------------------------
// Event Listeners
//---------------------------------------------------------

if (window.ethereum) {
    window.ethereum.on("accountsChanged", async function (accounts) {
        log("Account Changed");
        if (accounts.length === 0) {
            location.reload();
            return;
        }
        await connectWallet();
    });

    window.ethereum.on("chainChanged", async function () {
        log("Network Changed");
        await connectWallet();
    });
}

// Auto-refresh every 10 seconds
setInterval(async () => {
    if (account != "") {
        await loadBalances();
        await loadDashboard();
        await loadStakeTable();
        await loadAllowance();
        await loadGas();
    }
}, 10000);