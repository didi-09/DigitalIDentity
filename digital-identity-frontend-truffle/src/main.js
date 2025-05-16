import { ethers } from "ethers";
import DigitalIdentityABI from './DigitalIdentityABI.json'; // Import the ABI

// --- Configuration ---
const CONTRACT_ADDRESS = "0x2a53e3679387DCd17dd62a582898F229198B393a";
const TARGET_NETWORK_ID = "1337"; 

// --- UI Elements ---
//const connectWalletBtn = document.getElementById('connectWalletBtn');
const walletActionsSpan = document.getElementById('walletActions');
const accountAddressSpan = document.getElementById('accountAddress');
const contractAddressDisplaySpan = document.getElementById('contractAddressDisplay');
const networkIdDisplaySpan = document.getElementById('networkIdDisplay');


const regNameInput = document.getElementById('regName');
const regEmailInput = document.getElementById('regEmail');
const registerBtn = document.getElementById('registerBtn');

const updateNameInput = document.getElementById('updateName');
const updateEmailInput = document.getElementById('updateEmail');
const updateBtn = document.getElementById('updateBtn');

const viewAddressInput = document.getElementById('viewAddress');
const viewIdentityBtn = document.getElementById('viewIdentityBtn');
const identityInfoDiv = document.getElementById('identityInfo');

const statusDiv = document.getElementById('status');
const errorLogDiv = document.getElementById('errorLog');

// --- Application State ---
let provider;
let signer;
let contract;
let currentAccount = null;

// --- Initialization ---
async function init() {
    contractAddressDisplaySpan.textContent = CONTRACT_ADDRESS;
    networkIdDisplaySpan.textContent = TARGET_NETWORK_ID;

    if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === "0xYourDeployedContractAddressOnGanache") {
        showError("CONTRACT_ADDRESS is not set in main.js. Please update it with your deployed contract address from Truffle migration.");
        updateWalletActionButtons(); //show connect button
        return;
    }
     if (!TARGET_NETWORK_ID) {
        showError("TARGET_NETWORK_ID is not set in main.js. Please update it with your Ganache's Network ID.");
        updateWalletActionButtons(); 
        return;
    }


    // Check if MetaMask is installed
    if (typeof window.ethereum !== 'undefined') {
        provider = new ethers.BrowserProvider(window.ethereum);
        showStatus("MetaMask is available. Please connect your wallet and ensure you are on the correct Ganache network (ID: " + TARGET_NETWORK_ID + ").");

        // Handle initial account connection if already permitted
        try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                const network = await provider.getNetwork();
                if (network.chainId.toString() === TARGET_NETWORK_ID) {
                    await handleConnection(accounts[0]); // Connect if already authorized
            } else {
                updateWalletActionButtons(); // Show connect button, user needs to switch network
            }
        } else {
            updateWalletActionButtons(); // No accounts authorized, show connect button
        }
        } catch (err) {
            console.warn("Could not automatically connect wallet:", err);
            updateWalletActionButtons();
        }

    } else {
        showError("MetaMask is not installed. Please install it to use this DApp.");
        updateWalletActionButtons();
    }
}


function updateWalletActionButtons() {
    walletActionsSpan.innerHTML = ''; // Clear previous buttons

    if (currentAccount) { // If an account is connected
        const disconnectBtn = document.createElement('button');
        disconnectBtn.id = 'disconnectWalletBtn';
        disconnectBtn.textContent = 'Disconnect Wallet';
        disconnectBtn.className = 'btn btn-danger';
        disconnectBtn.addEventListener('click', disconnectWallet);
        walletActionsSpan.appendChild(disconnectBtn);
    } else { // If no account is connected
        const connBtn = document.createElement('button');
        connBtn.id = 'connectWalletBtn';
        connBtn.textContent = 'Connect Wallet';
        connBtn.className = 'btn btn-primary';
        connBtn.addEventListener('click', connectWallet);
        if (typeof window.ethereum === 'undefined') { // Disable if no MetaMask
            connBtn.disabled = true;
        }
        walletActionsSpan.appendChild(connBtn);
    }
}

async function handleConnection(account) {
    currentAccount = account;
    signer = await provider.getSigner(account);
    accountAddressSpan.textContent = currentAccount;
    updateWalletActionButtons(); // Crucial: Update buttons to show "Disconnect"
    showStatus(`Wallet connected: ${currentAccount}`);

    try {
        contract = new ethers.Contract(CONTRACT_ADDRESS, DigitalIdentityABI, signer);
        showStatus("Contract instance created.");
        loadCurrentUserIdentity();
    } catch (contractError) {
        showError(`Error creating contract instance: ${contractError.message}`);
        handleContractError(contractError, "Contract Initialization Failed");
    }
}
// Centralized function to reset DApp state (on disconnect or error)
function resetDappState() {
    currentAccount = null;
    signer = null;
    contract = null;
    accountAddressSpan.textContent = "Not Connected";
    updateNameInput.value = '';
    updateEmailInput.value = '';
    identityInfoDiv.innerHTML = '<p>Identity details will appear here.</p>';
    updateWalletActionButtons(); // Crucial: Update buttons to show "Connect"
}

async function connectWallet() {
    if (!provider) {
        showError("Provider not initialized. Is MetaMask installed?");
        return;
    }
    try {
        const network = await provider.getNetwork();
        if (network.chainId.toString() !== TARGET_NETWORK_ID) {
            showError(`Please connect MetaMask to the correct Ganache network (Network ID: ${TARGET_NETWORK_ID}). Current network ID: ${network.chainId}`);
            return;
        }

        const accounts = await provider.send("eth_requestAccounts", []); // Request accounts
        if (accounts.length > 0) {
            await handleConnection(accounts[0]);
        } else {
            resetDappState();
            showError("No accounts found after request. Please ensure your wallet is set up.");
        }
    } catch (err) {
        showError(`Error connecting wallet: ${err.message}`);
        console.error("Connect Wallet Error:", err);
        resetDappState();
    }
}
function disconnectWallet() {
    showStatus("Wallet disconnected by DApp.");
    resetDappState();
}

// --- Event Listeners for Contract Interactions --- (These should be fine)
registerBtn.addEventListener('click', async () => {
    if (!contract || !signer) {
        showError("Please connect your wallet first.");
        return;
    }
    const name = regNameInput.value;
    const email = regEmailInput.value;
    if (!name || !email) {
        showError("Name and Email are required for registration.");
        return;
    }

    showStatus("Sending registration transaction...");
    try {
        const tx = await contract.registerIdentity(name, email);
        showStatus(`Transaction sent: ${tx.hash}. Waiting for confirmation...`);
        await tx.wait();
        showStatus(`Identity registered successfully for ${name} (${email})!`);
        regNameInput.value = '';
        regEmailInput.value = '';
        loadCurrentUserIdentity();
    } catch (err) {
        handleContractError(err, "Registration failed");
    }
});

function updateConnectUI(disableConnect = false) {
    walletActionsSpan.innerHTML = ''; // Clear
    const connBtn = document.createElement('button');
    connBtn.id = 'connectWalletBtn';
    connBtn.textContent = 'Connect Wallet';
    connBtn.className = 'btn btn-primary';
    connBtn.addEventListener('click', connectWallet);
    connBtn.disabled = disableConnect;
    walletActionsSpan.appendChild(connBtn);
}



// --- Event Listeners for Contract Interactions ---
registerBtn.addEventListener('click', async () => {
    if (!contract || !signer) {
        showError("Please connect your wallet first.");
        return;
    }
    const name = regNameInput.value;
    const email = regEmailInput.value;
    if (!name || !email) {
        showError("Name and Email are required for registration.");
        return;
    }

    showStatus("Sending registration transaction...");
    try {
        const tx = await contract.registerIdentity(name, email);
        showStatus(`Transaction sent: ${tx.hash}. Waiting for confirmation...`);
        await tx.wait();
        showStatus(`Identity registered successfully for ${name} (${email})!`);
        regNameInput.value = '';
        regEmailInput.value = '';
        loadCurrentUserIdentity();
    } catch (err) {
        handleContractError(err, "Registration failed");
    }
});

updateBtn.addEventListener('click', async () => {
    if (!contract || !signer) {
        showError("Please connect your wallet first.");
        return;
    }
    const newName = updateNameInput.value;
    const newEmail = updateEmailInput.value;
    if (!newName || !newEmail) {
        showError("New Name and New Email are required for update.");
        return;
    }

    showStatus("Sending update transaction...");
    try {
        const tx = await contract.updateIdentity(newName, newEmail);
        showStatus(`Transaction sent: ${tx.hash}. Waiting for confirmation...`);
        await tx.wait();
        showStatus("Identity updated successfully!");
        loadCurrentUserIdentity();
    } catch (err) {
        handleContractError(err, "Update failed");
    }
});

viewIdentityBtn.addEventListener('click', async () => {
    if (!CONTRACT_ADDRESS || !DigitalIdentityABI) {
         showError("Contract info not loaded properly.");
         identityInfoDiv.innerHTML = `<p>Error: Contract info not loaded.</p>`; // Update UI
         return;
    }
    const addressToView = viewAddressInput.value;
    if (!ethers.isAddress(addressToView)) {
        showError("Invalid Ethereum address provided for viewing.");
        identityInfoDiv.innerHTML = `<p>Error: Invalid address.</p>`; // Update UI
        return;
    }

    console.log("Attempting to view identity for:", addressToView);
    console.log("Using CONTRACT_ADDRESS:", CONTRACT_ADDRESS);

    showStatus(`Fetching identity for ${addressToView}...`);
    identityInfoDiv.innerHTML = `<p>Fetching data for ${addressToView}...</p>`; // Initial UI update

    try {
        const readProvider = provider;
        const readOnlyContract = new ethers.Contract(CONTRACT_ADDRESS, DigitalIdentityABI, readProvider);

        const identity = await readOnlyContract.getIdentity(addressToView);
        console.log("Raw identity data received:", identity); // Log the whole Result object

        // Ethers.js v6 returns struct values as an array-like object with named properties
        // Access them by name for clarity
        const name = identity.name;
        const email = identity.email;
        const isRegistered = identity.isRegistered_; // Matches the return name in Solidity

        console.log(`Fetched - Name: "${name}", Email: "${email}", Registered: ${isRegistered}`);

        if (isRegistered) {
            identityInfoDiv.innerHTML = `
                <p><strong>Owner:</strong> ${addressToView}</p>
                <p><strong>Name:</strong> ${name || "(Not set)"}</p> 
                <p><strong>Email:</strong> ${email || "(Not set)"}</p>
                <p><strong>Registered:</strong> Yes</p>
            `;
        } else {
             identityInfoDiv.innerHTML = `<p>No identity registered for ${addressToView}.</p>`;
        }
        showStatus("Identity information displayed.");

    } catch (err) {
        console.error("Full error from getIdentity call:", err);
        handleContractError(err, "Failed to fetch identity");
        identityInfoDiv.innerHTML = `<p>Error fetching identity for ${addressToView}. See console.</p>`; // Update UI on error
    }
});

// --- Helper Functions ---
async function loadCurrentUserIdentity() {
    if (!contract || !signer || !currentAccount) return;
    try {
        const identity = await contract.getIdentity(currentAccount);
        if (identity.isRegistered) {
            updateNameInput.value = identity.name;
            updateEmailInput.value = identity.email;
            showStatus("Your current identity loaded into update form.");
        } else {
            updateNameInput.value = '';
            updateEmailInput.value = '';
            showStatus("You have not registered an identity yet.");
        }
    } catch (err) {
        // Check if the error is specifically 'Address not registered' before clearing
        let isNotRegisteredError = false;
        if (err.reason && err.reason.includes("Identity: Address not registered")) isNotRegisteredError = true;
        if (err.data && typeof err.data === 'string' && err.data.includes("Identity: Address not registered")) isNotRegisteredError = true; // For some revert data formats
        if (err.message && err.message.includes("Identity: Address not registered")) isNotRegisteredError = true;


        if (isNotRegisteredError) {
             updateNameInput.value = '';
             updateEmailInput.value = '';
             showStatus("You have not registered an identity yet.");
        } else {
            handleContractError(err, "Failed to load current user identity");
        }
    }
}


function showStatus(message) {
    statusDiv.textContent = message;
    statusDiv.style.display = 'block';
    errorLogDiv.style.display = 'none';
    console.log("Status:", message);
}

function showError(message) {
    errorLogDiv.textContent = message;
    errorLogDiv.style.display = 'block';
    statusDiv.style.display = 'none';
    console.error("Error:", message);
}

function handleContractError(error, prefix) {
    console.error(prefix + " Full Error:", error); // Log the full error object for better debugging
    let displayError = `${prefix}: `;

    // Attempt to get a more specific error message
    if (error.info && error.info.error && error.info.error.message) { // Nested error (Infura/Alchemy style)
        displayError += error.info.error.message;
    } else if (error.reason) { // Ethers v6 specific reason
        displayError += error.reason;
    } else if (error.data && typeof error.data === 'string') { // Raw revert data from node
        // Try to parse common revert string (very basic, for complex errors, more advanced parsing is needed)
        // This is a simplified example. For full decoding, you'd need contract ABI and more logic.
        if (error.data.startsWith('0x08c379a0')) { // Error(string) selector
            try {
                const reason = ethers.toUtf8String('0x' + error.data.substring(10));
                displayError += `Reverted with reason: ${reason}`;
            } catch (e) {
                displayError += "Reverted with undecodable reason.";
            }
        } else {
            displayError += `Reverted with data: ${error.data}`;
        }
    } else if (error.message) { // Generic JS error message
        displayError += error.message;
    } else {
        displayError += "An unknown error occurred.";
    }

    // Fallback to check for known substrings if specific parsing fails
    if (displayError.includes("Address already registered")) {
        displayError = "Error: This wallet address has already registered an identity.";
    } else if (displayError.includes("Address not registered")) {
        displayError = "Error: This wallet address has not registered an identity yet.";
    } else if (displayError.includes("user rejected transaction")) {
        displayError = "Transaction rejected by user in MetaMask.";
    }

    showError(displayError);
}

// Listen for account changes in MetaMask
if (window.ethereum) {
    window.ethereum.on('accountsChanged', async (accounts) => {
        showStatus("Account changed in MetaMask.");
        if (accounts.length > 0) {
            const network = await provider.getNetwork(); // provider should be initialized
            if (network.chainId.toString() === TARGET_NETWORK_ID) {
                await handleConnection(accounts[0]);
            } else {
                resetDappState();
                showError(`Account changed, but on wrong network (ID: ${network.chainId}). Please switch to network ID ${TARGET_NETWORK_ID}.`);
            }
        } else {
            resetDappState();
            showError("Wallet disconnected all accounts in MetaMask.");
        }
    });

    window.ethereum.on('chainChanged', async (chainIdHex) => {
        const chainId = parseInt(chainIdHex, 16).toString();
        showStatus(`Network changed to ID ${chainId}.`);
        if (provider) { // Ensure provider is initialized
            if (chainId === TARGET_NETWORK_ID) {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    await handleConnection(accounts[0]);
                } else {
                    resetDappState();
                    showStatus(`Switched to correct network (ID: ${TARGET_NETWORK_ID}). Please connect your wallet.`);
                }
            } else {
                resetDappState();
                showError(`Switched to wrong network (ID: ${chainId}). Please switch to network ID ${TARGET_NETWORK_ID}.`);
            }
        }
    });
}
// Initial load
document.addEventListener('DOMContentLoaded', init);