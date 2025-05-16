import { ethers } from "ethers";
import DigitalIdentityABI from './DigitalIdentityABI.json'; // Import the ABI

// --- Configuration ---
// PASTE THE DEPLOYED CONTRACT ADDRESS FROM YOUR TRUFFLE MIGRATION HERE:
const CONTRACT_ADDRESS = "0x7696Cc1dD62F32dCe1898bC9A81a45eB96e8BDD3";
// SET YOUR GANACHE'S NETWORK ID (Chain ID) HERE:
// Ganache UI typically defaults to 5777 for new workspaces.
// Ganache CLI typically defaults to 1337.
// Check your Ganache instance! This is important for MetaMask to connect correctly.
const TARGET_NETWORK_ID = "1337"; // Example for Ganache UI, change if needed

// --- UI Elements ---
const connectWalletBtn = document.getElementById('connectWalletBtn');
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

// --- Initialization ---
async function init() {
    contractAddressDisplaySpan.textContent = CONTRACT_ADDRESS;
    networkIdDisplaySpan.textContent = TARGET_NETWORK_ID;

    if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === "0xYourDeployedContractAddressOnGanache") {
        showError("CONTRACT_ADDRESS is not set in main.js. Please update it with your deployed contract address from Truffle migration.");
        return;
    }
     if (!TARGET_NETWORK_ID) {
        showError("TARGET_NETWORK_ID is not set in main.js. Please update it with your Ganache's Network ID.");
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
                await connectWallet(); // Connect if already authorized
            }
        } catch (err) {
            console.warn("Could not automatically connect wallet:", err);
        }

    } else {
        showError("MetaMask is not installed. Please install it to use this DApp.");
        connectWalletBtn.disabled = true;
    }
}

async function connectWallet() {
    if (!provider) {
        showError("Provider not initialized. Is MetaMask installed?");
        return;
    }
    try {
        // Check current network
        const network = await provider.getNetwork();
        if (network.chainId.toString() !== TARGET_NETWORK_ID) {
            showError(`Please connect MetaMask to the correct Ganache network (Network ID: ${TARGET_NETWORK_ID}). Current network ID: ${network.chainId}`);
            // You could also try to switch network programmatically here if desired
            // await window.ethereum.request({
            //    method: 'wallet_switchEthereumChain',
            //    params: [{ chainId: ethers.toBeHex(parseInt(TARGET_NETWORK_ID)) }],
            // });
            return;
        }

        const accounts = await provider.send("eth_requestAccounts", []);
        if (accounts.length > 0) {
            signer = await provider.getSigner();
            const address = await signer.getAddress();
            accountAddressSpan.textContent = address;
            connectWalletBtn.textContent = "Wallet Connected";
            connectWalletBtn.disabled = true;
            showStatus(`Wallet connected: ${address} on Network ID ${network.chainId}`);

            contract = new ethers.Contract(CONTRACT_ADDRESS, DigitalIdentityABI, signer);
            showStatus("Contract instance created.");
            loadCurrentUserIdentity();
        }
    } catch (err) {
        showError(`Error connecting wallet: ${err.message}`);
        console.error(err);
    }
}

// --- Wallet Connection ---
connectWalletBtn.addEventListener('click', connectWallet);


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
         return;
    }
    const addressToView = viewAddressInput.value;
    if (!ethers.isAddress(addressToView)) {
        showError("Invalid Ethereum address provided for viewing.");
        return;
    }

    showStatus(`Fetching identity for ${addressToView}...`);
    try {
        // For read-only, we can use provider. Create a temporary contract instance with provider if main one uses signer.
        const readProvider = signer ? provider : new ethers.BrowserProvider(window.ethereum); // ensure we have a provider
        const readOnlyContract = new ethers.Contract(CONTRACT_ADDRESS, DigitalIdentityABI, readProvider);

        const identity = await readOnlyContract.getIdentity(addressToView);
        if (identity.isRegistered) {
            identityInfoDiv.innerHTML = `
                <p><strong>Owner:</strong> ${addressToView}</p>
                <p><strong>Name:</strong> ${identity.name}</p>
                <p><strong>Email:</strong> ${identity.email}</p>
                <p><strong>Registered:</strong> Yes</p>
            `;
        } else {
            identityInfoDiv.innerHTML = `<p>No identity registered for ${addressToView}.</p>`;
        }
        showStatus("Identity information displayed.");
    } catch (err) {
        handleContractError(err, "Failed to fetch identity");
    }
});


// --- Helper Functions ---
async function loadCurrentUserIdentity() {
    if (!contract || !signer) return;
    try {
        const userAddress = await signer.getAddress();
        const identity = await contract.getIdentity(userAddress);
        if (identity.isRegistered) {
            updateNameInput.value = identity.name;
            updateEmailInput.value = identity.email;
            showStatus("Your current identity loaded into update form.");
        } else {
            showStatus("You have not registered an identity yet.");
        }
    } catch (err) {
        if (err.message && err.message.includes("Identity: Address not registered")) {
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
    console.error(prefix, error);
    let displayError = `${prefix}: `;
    if (error.data && error.data.message) {
        displayError += error.data.message;
    } else if (error.reason) {
        displayError += error.reason;
    } else if (error.message) {
        displayError += error.message;
    } else {
        displayError += "An unknown error occurred.";
    }
    if (displayError.includes("Address already registered")) {
        displayError = "Error: This wallet address has already registered an identity.";
    } else if (displayError.includes("Address not registered")) {
        displayError = "Error: This wallet address has not registered an identity yet.";
    }
    showError(displayError);
}

// Listen for account changes in MetaMask
if (window.ethereum) {
    window.ethereum.on('accountsChanged', async (accounts) => {
        showStatus("Account changed in MetaMask.");
        if (accounts.length > 0) {
            await connectWallet(); // Reconnect with the new account
        } else {
            accountAddressSpan.textContent = "Not Connected";
            connectWalletBtn.textContent = "Connect Wallet";
            connectWalletBtn.disabled = false;
            signer = null;
            contract = null;
            showError("Wallet disconnected.");
        }
    });

    window.ethereum.on('chainChanged', (chainIdHex) => {
        const chainId = parseInt(chainIdHex, 16).toString();
        showStatus(`Network changed to ID ${chainId}. Please ensure you are on the correct Ganache network (ID: ${TARGET_NETWORK_ID}).`);
        if (chainId === TARGET_NETWORK_ID) {
            connectWallet(); // Attempt to reconnect if now on correct network
        } else {
             accountAddressSpan.textContent = "Not Connected (Wrong Network)";
            connectWalletBtn.textContent = "Connect Wallet";
            connectWalletBtn.disabled = false;
            signer = null;
            contract = null;
            showError(`Switched to wrong network (ID: ${chainId}). Please switch to network ID ${TARGET_NETWORK_ID}.`);
        }
    });
}

// Initial load
document.addEventListener('DOMContentLoaded', init);