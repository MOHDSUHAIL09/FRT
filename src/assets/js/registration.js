// src/assets/js/registration.js

let modalInstance = null;
let isRegistered = false;

//---------------------------------------------------------
// Check Registration
//---------------------------------------------------------

async function checkRegistration() {
    try {
        if (!registration) {
            console.log('Registration contract not loaded');
            return false;
        }

        const registered = await registration.isRegistered(account);
        isRegistered = registered;
        
        const statusEl = document.getElementById('registrationStatus');
        if (statusEl) {
            statusEl.innerHTML = registered ? 
                '<span class="text-success">✅ Registered</span>' : 
                '<span class="text-danger">❌ Not Registered</span>';
        }

        return registered;
    } catch (err) {
        console.error(err);
        return false;
    }
}

//---------------------------------------------------------
// Show Registration Modal
//---------------------------------------------------------

function showRegistrationModal() {
    if (!account) {
        toast('Please connect wallet first');
        return;
    }

    // Check if already registered
    checkRegistration();

    const walletEl = document.getElementById('modalWallet');
    if (walletEl) walletEl.value = account;
    
    const sponsorEl = document.getElementById('modalSponsor');
    if (sponsorEl) sponsorEl.value = '';
    
    const statusEl = document.getElementById('modalStatus');
    if (statusEl) statusEl.innerHTML = '';

    if (!modalInstance) {
        modalInstance = new bootstrap.Modal(
            document.getElementById('registrationModal'),
            { backdrop: 'static', keyboard: false }
        );
    }
    modalInstance.show();
}

//---------------------------------------------------------
// Copy Address
//---------------------------------------------------------

function copyAddress() {
    const wallet = document.getElementById('modalWallet').value;
    if (wallet) {
        navigator.clipboard.writeText(wallet);
        toast('Address copied!');
    }
}

//---------------------------------------------------------
// Register User
//---------------------------------------------------------

async function registerUser() {
    try {
        if (!registration) {
            log('Registration Contract Not Loaded');
            toast('Registration contract not loaded');
            return;
        }

        const sponsor = document.getElementById('modalSponsor').value.trim();
        const statusEl = document.getElementById('modalStatus');

        // Validations
        if (!sponsor) {
            statusEl.innerHTML = '<div class="alert alert-danger">Please enter sponsor address</div>';
            return;
        }

        if (!sponsor.startsWith('0x') || sponsor.length !== 42) {
            statusEl.innerHTML = '<div class="alert alert-danger">Invalid sponsor address. Must be a valid Ethereum address</div>';
            return;
        }

        if (sponsor.toLowerCase() === account.toLowerCase()) {
            statusEl.innerHTML = '<div class="alert alert-danger">You cannot be your own sponsor</div>';
            return;
        }

        // Generate randomId (uint64)
        const randomId = Math.floor(Math.random() * 10000000) + 1;

        showLoading();
        setProgress(20);

        log(`📝 Registering with sponsor: ${sponsor}, randomId: ${randomId}`);

        const tx = await registration.register(
            sponsor,
            BigInt(randomId)
        );

        log(`📝 Transaction submitted: ${tx.hash}`);
        setProgress(60);

        statusEl.innerHTML = '<div class="alert alert-info">⏳ Transaction submitted. Waiting for confirmation...</div>';

        await tx.wait();

        setProgress(100);
        hideLoading();

        log('✅ Registration Successful!');
        statusEl.innerHTML = '<div class="alert alert-success">✅ Registration Successful! 🎉</div>';

        toast('Registration Successful');

        // Update registration status
        await checkRegistration();

        // Reload dashboard
        await loadDashboard();

        // Close modal after success
        setTimeout(() => {
            if (modalInstance) {
                modalInstance.hide();
            }
            setProgress(0);
        }, 2000);

    } catch (err) {
        hideLoading();
        console.error(err);
        
        const statusEl = document.getElementById('modalStatus');
        statusEl.innerHTML = `<div class="alert alert-danger">❌ ${err.reason || err.shortMessage || err.message}</div>`;
        
        log(`❌ Registration failed: ${err.reason || err.shortMessage || err.message}`);
        setProgress(0);
    }
}

//---------------------------------------------------------
// Event Listeners
//---------------------------------------------------------

document.addEventListener('DOMContentLoaded', function() {
    // Register button in modal
    const btnRegister = document.getElementById('btnModalRegister');
    if (btnRegister) {
        btnRegister.addEventListener('click', registerUser);
    }

    // Open registration button
    const btnOpen = document.getElementById('btnOpenRegistration');
    if (btnOpen) {
        btnOpen.addEventListener('click', showRegistrationModal);
    }

    // Auto-show modal on page load if wallet connected
    setTimeout(async () => {
        if (account) {
            await checkRegistration();
            if (!isRegistered) {
                setTimeout(() => {
                    showRegistrationModal();
                }, 2000);
            }
        }
    }, 3000);
});

// Export for use in other files
window.showRegistrationModal = showRegistrationModal;
window.checkRegistration = checkRegistration;
window.registerUser = registerUser;
window.copyAddress = copyAddress;