
Project Documentation: Decentralized Digital Identity Management System


Version: 1.1
Date: May 16, 2024
Author(s): Abdelrahman Ayman, Abdelrahman Elkady, Youssef Bayoumy, Youssef Nader, Marwan Hamdy, Marzie Micheal, Abdelrahman Waleed.
Repository: [Link to your Git repository, if applicable]

--------------------------------------------------------------------------------
1. OVERVIEW
--------------------------------------------------------------------------------

1.1. Introduction and Project Goal
-----------------------------------
This document details the design, architecture, implementation, and deployment
of a decentralized Digital Identity Management System. The primary goal of this
project is to create a foundational DApp (Decentralized Application) that
allows users to associate a simple digital identity (consisting of a name and
email address) with their unique Ethereum wallet address. This identity is
recorded and managed on an Ethereum-compatible blockchain, ensuring data
immutability, transparency (for public data), and user control over their
identity information.

The system aims to demonstrate core blockchain concepts such as smart contract
interactions, wallet integration, transaction signing, and decentralized data
storage for a practical use case.

1.2. Core Features
-------------------
The DApp provides the following key functionalities:

*   **Wallet Integration:** Users can connect their existing Ethereum-compatible
    wallets (e.g., MetaMask) to interact with the application. The connected
    wallet address serves as the primary identifier for the user within the
    system.
*   **Identity Registration:** A user can register a unique digital identity by
    providing their name and email. This identity is then immutably linked to
    their wallet address on the blockchain. The system prevents an address from
    registering more than one identity.
*   **Identity Update:** Users who have already registered an identity can update
    their associated name and/or email address. Only the owner of the Ethereum
    address linked to an identity can perform updates.
*   **Identity Viewing:** Any user (or external service) can query the blockchain
    to view the registered name and email associated with a given Ethereum
    address, provided an identity has been registered for that address.
*   **Decentralized Data Persistence:** All identity data is stored directly on
    the blockchain within the smart contract's storage, leveraging the
    security and immutability features of the distributed ledger.
*   **Event Emission:** The smart contract emits events upon successful identity
    registration and updates, allowing off-chain services or frontends to
    listen and react to these changes.

1.3. Technology Stack
----------------------
The project utilizes the following technologies:

*   **Blockchain Platform:** Ethereum (simulated locally using Ganache)
    *   Ganache: Personal blockchain for Ethereum development, providing local
      test accounts and a simulated network environment.
*   **Smart Contract Development:**
    *   Language: Solidity (version 0.8.18)
    *   Framework: Truffle Suite (for compilation, deployment, testing, and
      artifact management)
*   **Frontend Development:**
    *   Structure: HTML5
    *   Styling: CSS3 (custom styling for a modern UI)
    *   Logic: JavaScript (ES6+)
    *   Blockchain Interaction Library: Ethers.js (version 6.x)
    *   Build Tool/Development Server: Vite
*   **Wallet Integration:**
    *   MetaMask: Browser extension acting as the user's wallet and interface
      for signing transactions and interacting with the DApp.
*   **Development Environment:**
    *   Node.js: JavaScript runtime environment (LTS version recommended).
    *   npm (Node Package Manager): For managing project dependencies.
    *   Code Editor: Visual Studio Code (VS Code) is recommended with Solidity
      and JavaScript extensions.
      
--------------------------------------------------------------------------------
2. ARCHITECTURE
--------------------------------------------------------------------------------

2.1. System Components Diagram
-----------------------------
(While a visual diagram would be ideal here, this textual description outlines
the components and their interactions. In a formal document, a flowchart or
component diagram would be inserted.)

   +-----------------+      +-----------------+      +----------------------+
   |  User's Browser |----->|    Frontend     |<---->|  MetaMask Extension  |
   | (HTML/CSS/JS)   |      | (Vite, Ethers.js)|      | (Wallet, Signer)     |
   +-----------------+      +-----------------+      +----------+-----------+
                                    ^                             |
                                    | (RPC Calls)                 | (Signed Tx)
                                    |                             |
                                    v                             v
                             +-------------------------------------+
                             |    Ganache Local Blockchain         |
                             | (Ethereum Node, EVM)                |
                             |      +--------------------------+   |
                             |      | DigitalIdentity Contract |   |
                             |      | (Solidity: State, Logic) |   |
                             |      +--------------------------+   |
                             +-------------------------------------+
                                    ^
                                    | (Deploy, Interact via CLI)
                                    |
                             +-----------------+
                             | Truffle Suite   |
                             | (Compile,Migrate|
                             | Test)           |
                             +-----------------+

2.2. Detailed Component Description
------------------------------------

*   **User's Browser:**
    *   **Role:** Hosts the frontend application and the MetaMask extension.
    *   **Interaction:** Renders the HTML/CSS and executes the JavaScript logic
      of the frontend. Facilitates user input and displays DApp information.

*   **Frontend Application (`digital-identity-frontend-truffle`):**
    *   **Role:** Provides the User Interface (UI) and User Experience (UX) for
      interacting with the digital identity system.
    *   **Technologies:** Built with HTML, CSS, and modern JavaScript. Vite is
      used as a development server and build tool.
    *   **Functionality:**
        *   Renders forms for identity registration and updates.
        *   Displays identity information and system status/errors.
        *   Manages user interactions (button clicks, form submissions).
        *   Uses Ethers.js to communicate with the MetaMask extension and,
          through it, the blockchain.

*   **MetaMask Browser Extension:**
    *   **Role:** Acts as the bridge between the frontend application and the
      Ethereum blockchain (Ganache in this case). It also serves as the user's
      digital wallet.
    *   **Functionality:**
        *   Manages the user's Ethereum accounts and private keys securely.
        *   Injects an Ethereum provider (`window.ethereum`) into the browser,
          which Ethers.js uses to detect the wallet and network.
        *   Prompts the user to approve or reject transactions initiated by the
          frontend.
        *   Signs transactions with the user's private key before they are
          broadcast to the network.
        *   Allows users to switch between different Ethereum networks.

*   **Ethers.js Library:**
    *   **Role:** A comprehensive JavaScript library for interacting with the
      Ethereum blockchain and its ecosystem.
    *   **Usage in Frontend:**
        *   Creating a `Provider` to connect to the Ethereum network via
          MetaMask.
        *   Getting a `Signer` object to represent the user's connected account,
          enabling transaction signing.
        *   Instantiating a `Contract` object using the smart contract's ABI
          and deployed address, allowing for easy interaction with contract
          functions.
        *   Formatting data and handling responses from the blockchain.

*   **Ganache (Local Blockchain):**
    *   **Role:** A personal Ethereum blockchain for local development and
      testing.
    *   **Functionality:**
        *   Simulates the Ethereum Virtual Machine (EVM) environment.
        *   Provides a set of pre-funded test accounts with "fake" ETH.
        *   Processes transactions and executes smart contract code locally,
          allowing for rapid iteration without real gas costs.
        *   Offers an RPC (Remote Procedure Call) endpoint (e.g.,
          `http://127.0.0.1:7545`) for applications like MetaMask and Truffle to
          connect to.
        *   Ganache UI provides a graphical interface to inspect blocks,
          transactions, accounts, and contract state.

*   **DigitalIdentity Smart Contract (`DigitalIdentity.sol`):**
    *   **Role:** The backend logic and data store of the DApp, deployed on the
      Ganache blockchain.
    *   **Functionality:**
        *   Defines the data structure (`Identity` struct) for storing user
          identities.
        *   Implements functions for `registerIdentity`, `updateIdentity`, and
          `getIdentity`.
        *   Manages state variables (the `identities` mapping).
        *   Enforces business rules (e.g., one identity per address, owner-only
          updates) using modifiers and `require` statements.
        *   Emits events for significant actions.

*   **Truffle Suite:**
    *   **Role:** A development environment, testing framework, and asset pipeline
      for Ethereum smart contracts.
    *   **Functionality:**
        *   **Compilation:** Compiles Solidity (`.sol`) smart contracts into EVM
          bytecode and generates Application Binary Interfaces (ABIs).
        *   **Migration (Deployment):** Provides a system for scripting
          deployments of smart contracts to various Ethereum networks (including
          Ganache).
        *   **Testing:** Facilitates writing automated tests for smart contracts
          in JavaScript or Solidity.
        *   **Artifact Management:** Stores compiled contract information (ABI,
          bytecode, deployed addresses) in `build/contracts/` JSON files.

2.3. Data and Control Flow
---------------------------

*   **User Connecting Wallet:**
    1.  User clicks "Connect Wallet" on the frontend.
    2.  Frontend (`main.js`) calls `provider.send("eth_requestAccounts", [])` via
        Ethers.js.
    3.  MetaMask prompts the user to select an account and approve the
        connection.
    4.  If approved, MetaMask provides the selected account address to the
        frontend.
    5.  Frontend updates the UI and initializes the Ethers.js `Signer` and
        `Contract` objects.

*   **Registering/Updating an Identity (Write Operation):**
    1.  User fills the form and clicks "Register" or "Update".
    2.  Frontend gathers input data.
    3.  Frontend calls the corresponding smart contract function (e.g.,
        `contract.registerIdentity(name, email)`) using the Ethers.js `Contract`
        object (which uses the `Signer`).
    4.  Ethers.js prepares the transaction data.
    5.  MetaMask pops up, displaying transaction details (including estimated gas)
        and prompts the user for confirmation.
    6.  User confirms and signs the transaction in MetaMask.
    7.  MetaMask submits the signed transaction to the connected Ganache RPC
        endpoint.
    8.  Ganache receives the transaction, validates it, and includes it in a new
        block (if valid).
    9.  The `DigitalIdentity` smart contract function is executed by the EVM on
        Ganache, potentially changing the contract's state (e.g., adding/updating
        an entry in the `identities` mapping).
    10. The smart contract may emit an event (e.g., `IdentityRegistered`).
    11. Frontend receives a transaction hash and can `await tx.wait()` for
        confirmation that the transaction has been mined.
    12. Frontend updates the UI to reflect the success or failure.

*   **Viewing an Identity (Read Operation):**
    1.  User enters an Ethereum address and clicks "View Identity".
    2.  Frontend calls the `contract.getIdentity(addressToView)` function using the
        Ethers.js `Contract` object (can use a `Provider` or `Signer` for read
        calls).
    3.  Ethers.js sends a JSON-RPC `eth_call` request to the Ganache RPC endpoint
        (via MetaMask's provider).
    4.  Ganache executes the `getIdentity` view function locally (without creating
        a new transaction or block) and returns the requested data.
    5.  Frontend receives the identity data (name, email, registration status).
    6.  Frontend updates the UI to display the information.

*   **Smart Contract Deployment (via Truffle):**
    1.  Developer runs `truffle compile`. Truffle compiles `DigitalIdentity.sol`
        into bytecode and ABI, saving them in `build/contracts/`.
    2.  Developer runs `truffle migrate --network <ganache_network_name>`.
    3.  Truffle reads the migration script (e.g.,
        `2_deploy_digital_identity.js`).
    4.  Truffle connects to the Ganache instance specified in
        `truffle-config.js`.
    5.  Truffle sends a transaction to Ganache to deploy the `DigitalIdentity`
        contract bytecode.
    6.  Ganache creates the contract on its blockchain and returns the contract
        address.
    7.  Truffle records the deployment and updates the artifact JSON file in
        `build/contracts/` with the deployed address on that network.
--------------------------------------------------------------------------------
3. SMART CONTRACT (`DigitalIdentity.sol`) DEEP DIVE
--------------------------------------------------------------------------------

3.1. File Location and Purpose
-------------------------------
*   **File Path:** `truffle-digital-identity/contracts/DigitalIdentity.sol`
*   **Purpose:** This Solidity smart contract forms the backend logic of the DApp. It manages user identity data (name, email) on the blockchain, linking it to Ethereum addresses, and defines the rules for interaction.

3.2. Compiler Directives
-------------------------
    3.2.1. SPDX License Identifier
        ```solidity
        // SPDX-License-Identifier: MIT
        ```
        *   **Purpose:** Specifies the open-source license (MIT License) for the contract code.

    3.2.2. Pragma Version
        ```solidity
        pragma solidity ^0.8.18;
        ```
        *   **Purpose:** Declares compiler version compatibility (0.8.18 and compatible patch versions).

3.3. Contract Definition
-------------------------
    ```solidity
    contract DigitalIdentity {
        // Contract body
    }
    ```
    *   **Purpose:** Encapsulates all state and functions for the digital identity system.

3.4. Data Structures
---------------------
    3.4.1. `Identity` Struct
        ```solidity
        struct Identity {
            address owner;
            string name;
            string email;
            bool isRegistered;
        }
        ```
        *   **Purpose:** Defines the schema for storing a user's identity.
        *   **Fields:**
            *   `owner (address)`: The Ethereum address of the identity holder.
            *   `name (string)`: The user's registered name.
            *   `email (string)`: The user's registered email.
            *   `isRegistered (bool)`: Flag indicating if an identity is active for the owner.

3.5. State Variables
---------------------
    3.5.1. `identities` Mapping
        ```solidity
        mapping(address => Identity) public identities;
        ```
        *   **Purpose:** The primary storage for all registered identities.
        *   **Behavior:** Maps an Ethereum address (key) to its `Identity` struct (value).
        *   **Getter:** `public` visibility auto-generates a getter function `identities(address)` to retrieve an `Identity` struct.

3.6. Events
------------
    3.6.1. `IdentityRegistered` Event
        ```solidity
        event IdentityRegistered(
            address indexed owner,
            string name,
            string email
        );
        ```
        *   **Purpose:** Emitted when `registerIdentity` is successfully called.
        *   **Parameters:** `owner` (indexed), `name`, `email`.

    3.6.2. `IdentityUpdated` Event
        ```solidity
        event IdentityUpdated(
            address indexed owner,
            string newName,
            string newEmail
        );
        ```
        *   **Purpose:** Emitted when `updateIdentity` is successfully called.
        *   **Parameters:** `owner` (indexed), `newName`, `newEmail`.

3.7. Modifiers
---------------
    3.7.1. `notAlreadyRegistered` Modifier
        ```solidity
        modifier notAlreadyRegistered() {
            require(!identities[msg.sender].isRegistered, "Identity: Address already registered.");
            _;
        }
        ```
        *   **Purpose:** Prevents an already registered address from calling the modified function.
        *   **Check:** `identities[msg.sender].isRegistered` must be `false`.

    3.7.2. `isRegistered` Modifier
        ```solidity
        modifier isRegistered() {
            require(identities[msg.sender].isRegistered, "Identity: Address not registered.");
            _;
        }
        ```
        *   **Purpose:** Ensures only registered addresses can call the modified function.
        *   **Check:** `identities[msg.sender].isRegistered` must be `true`.

3.8. Functions (Public Interface)
----------------------------------
    3.8.1. `registerIdentity(string memory _name, string memory _email)`
        ```solidity
        function registerIdentity(string memory _name, string memory _email)
            public
            notAlreadyRegistered
        {
            identities[msg.sender] = Identity({
                owner: msg.sender,
                name: _name,
                email: _email,
                isRegistered: true
            });
            emit IdentityRegistered(msg.sender, _name, _email);
        }
        ```
        *   **Purpose:** Allows `msg.sender` to register their identity.
        *   **Modifiers:** `notAlreadyRegistered`.
        *   **Action:** Creates and stores a new `Identity` struct for `msg.sender`; emits `IdentityRegistered`.
        *   **State Change:** Yes (writes to storage).

    3.8.2. `updateIdentity(string memory _newName, string memory _newEmail)`
        ```solidity
        function updateIdentity(string memory _newName, string memory _newEmail)
            public
            isRegistered
        {
            identities[msg.sender].name = _newName;
            identities[msg.sender].email = _newEmail;
            emit IdentityUpdated(msg.sender, _newName, _newEmail);
        }
        ```
        *   **Purpose:** Allows `msg.sender` to update their existing identity.
        *   **Modifiers:** `isRegistered`.
        *   **Action:** Updates `name` and `email` for `msg.sender`'s identity; emits `IdentityUpdated`.
        *   **State Change:** Yes.

    3.8.3. `getIdentity(address _owner)`
        ```solidity
        function getIdentity(address _owner)
            public
            view
            returns (
                string memory name,
                string memory email,
                bool isRegistered_
            )
        {
            Identity storage id = identities[_owner];
            return (id.name, id.email, id.isRegistered);
        }
        ```
        *   **Purpose:** Retrieves identity details for `_owner`.
        *   **Returns:** `name`, `email`, `isRegistered_` status.
        *   **State Change:** No (`view` function).

    3.8.4. `isIdentityRegistered(address _owner)`
        ```solidity
        function isIdentityRegistered(address _owner) public view returns (bool) {
            return identities[_owner].isRegistered;
        }
        ```
        *   **Purpose:** Checks if an identity is registered for `_owner`.
        *   **Returns:** `bool` (true if registered, false otherwise).
        *   **State Change:** No (`view` function).


--------------------------------------------------------------------------------
4. TRUFFLE PROJECT SETUP & CONFIGURATION
--------------------------------------------------------------------------------

4.1. Overview of Truffle Suite
-------------------------------
*   **Purpose:** Truffle is a development environment, testing framework, and asset
    pipeline for Ethereum smart contracts. It simplifies compilation, deployment,
    and testing.
*   **Role in Project:** Used to manage the `DigitalIdentity.sol` smart contract's
    lifecycle.

4.2. Project Initialization and Directory Structure
----------------------------------------------------
*   **Initialization Command:** `truffle init` (executed in a new project folder, e.g., `truffle-digital-identity`).
*   **Standard Directory Layout:**
    `truffle-digital-identity/`
    ├── `build/contracts/`          ► Stores compiled contract artifacts (JSON: ABI, bytecode, etc.).
    │   └── `DigitalIdentity.json`
    ├── `contracts/`                ► Contains Solidity source files.
    │   └── `DigitalIdentity.sol`
    ├── `migrations/`               ► Holds JavaScript deployment scripts.
    │   ├── `1_initial_migration.js`  (Optional, Truffle's default)
    │   └── `2_deploy_digital_identity.js` (Custom script for DigitalIdentity)
    ├── `test/`                     ► For smart contract test files.
    └── `truffle-config.js`         ► Main Truffle project configuration file.

4.3. Truffle Configuration (`truffle-config.js`)
-------------------------------------------------
*   **Purpose:** Configures network connections, compiler settings, and other
    project options for Truffle.
*   **Key Sections:**
    *   **`networks` Object:** Defines connection parameters for different Ethereum
        blockchains.
        *   **`development` Network (Example for Ganache):**
            ```javascript
            development: {
              host: "127.0.0.1",       // IP for Ganache
              port: 7545,              // Port for Ganache UI (default: 7545, CLI: 8545). MUST MATCH.
              network_id: "*",         // Matches any network ID. Can be specific (e.g., 5777 or 1337).
            }
            ```
            *   `host`: IP address of the Ganache RPC server.
            *   `port`: Port number of the Ganache RPC server.
            *   `network_id`: Identifier of the Ganache instance.

    *   **`compilers.solc` Object:** Configures the Solidity compiler.
        ```javascript
        compilers: {
          solc: {
            version: "0.8.18",      // Solidity compiler version. MUST MATCH PRAGMA.
            settings: {
              optimizer: {
                enabled: false,   // true for production (reduces gas)
                runs: 200
              },
            }
          }
        }
        ```
        *   `version`: Specifies the `solc` version.
        *   `settings.optimizer`: Configures bytecode optimization (recommended for
            production).

4.4. Deployment (Migration) Scripts
------------------------------------
*   **Purpose:** JavaScript files in the `migrations/` directory that automate the
    deployment of smart contracts. Executed in numerical order.
*   **Example Script (`migrations/2_deploy_digital_identity.js`):**
    ```javascript
    const DigitalIdentity = artifacts.require("DigitalIdentity");

    module.exports = function (deployer, network, accounts) {
      deployer.deploy(DigitalIdentity)
        .then(() => {
          console.log("\n🚀 DigitalIdentity Contract Deployed Successfully!");
          console.log("   Network         : " + network);
          console.log("   Contract Address: " + DigitalIdentity.address);
          console.log("   Deployed By     : " + accounts[0] + "\n");
        })
        .catch(error => {
          console.error("🚨 Deployment Failed:", error);
        });
    };
    ```
    *   **`artifacts.require("DigitalIdentity")`**: Loads the contract abstraction
        (ABI, bytecode).
    *   **`module.exports = function (deployer, network, accounts)`**: Standard
        migration function signature. Truffle injects `deployer` (for deployment
        actions), `network` name, and available `accounts`.
    *   **`deployer.deploy(DigitalIdentity)`**: Instructs Truffle to deploy the
        contract. Returns a Promise.
    *   **`.then(...)`**: Executes after successful deployment, typically used for
        logging the contract address.
    *   **`.catch(...)`**: Handles deployment errors.
    
    --------------------------------------------------------------------------------
5. FRONTEND APPLICATION
--------------------------------------------------------------------------------

5.1. Purpose and Overview
--------------------------
*   **Purpose:** The frontend application provides the user interface (UI) for
    interacting with the `DigitalIdentity` smart contract deployed on the Ganache
    blockchain.
*   **Technology:** A Single Page Application (SPA) built with HTML, CSS, and
    JavaScript, utilizing Vite for development serving and Ethers.js for
    blockchain communication.
*   **Location:** Resides in a separate directory (e.g.,
    `digital-identity-frontend-truffle`), which can be a sibling to or nested
    within the Truffle project directory.

5.2. Project Structure and Key Files
-------------------------------------
*   **Directory:** `digital-identity-frontend-truffle/`
*   **Key Files:**
    *   **`index.html`**: The main HTML file defining the structure and layout of
        the DApp.
    *   **`src/style.css`**: Contains all CSS rules for the visual presentation and
        modern styling of the application.
    *   **`src/main.js`**: The core JavaScript file containing the DApp's logic,
        including wallet connection, smart contract interaction via Ethers.js,
        and UI updates.
    *   **`src/DigitalIdentityABI.json`**: A JSON file storing only the ABI array
        of the `DigitalIdentity` smart contract, copied from the Truffle build
        artifacts.
    *   **`package.json`**: Manages frontend project dependencies (like Vite and
        Ethers.js) and defines npm scripts (e.g., `npm run dev`).
    *   **`vite.config.js`**: (Optional, often not needed for basic setups) Vite
        configuration file.

5.3. Core Frontend Logic (`src/main.js`)
-----------------------------------------
    5.3.1. Constants and Imports:
        *   Imports `ethers` from the Ethers.js library.
        *   Imports `DigitalIdentityABI` from `./DigitalIdentityABI.json`.
        *   **`CONTRACT_ADDRESS`**: A JavaScript constant holding the deployed
            address of the `DigitalIdentity` smart contract on Ganache. This
            **must be updated manually** after each new deployment/migration.
        *   **`TARGET_NETWORK_ID`**: A JavaScript constant specifying the Chain ID
            of the target Ganache network (e.g., "5777" or "1337"). This **must
            match** the actual Chain ID of the running Ganache instance.

    5.3.2. UI Element DOM Selection:
        *   Uses `document.getElementById()` to get references to all interactive
            HTML elements (buttons, input fields, display areas).

    5.3.3. Application State Variables:
        *   `provider`: Stores the Ethers.js `BrowserProvider` instance, connected
            via `window.ethereum` (MetaMask).
        *   `signer`: Stores the Ethers.js `Signer` object representing the
            user's connected account, used for sending transactions.
        *   `contract`: Stores the Ethers.js `Contract` instance, representing the
            `DigitalIdentity` smart contract.

    5.3.4. Initialization (`init()` function):
        *   **Trigger:** Called when the DOM is fully loaded (`DOMContentLoaded`).
        *   **Actions:**
            *   Displays the hardcoded `CONTRACT_ADDRESS` and `TARGET_NETWORK_ID`
                on the UI.
            *   Checks if MetaMask (`window.ethereum`) is available.
            *   Initializes the `provider` using `new ethers.BrowserProvider(window.ethereum)`.
            *   Attempts to pre-connect if the wallet has previously granted
                permissions.

    5.3.5. Wallet Connection (`connectWallet()` function):
        *   **Trigger:** Called by the "Connect Wallet" button click or during
            initialization.
        *   **Actions:**
            *   Verifies that the current network selected in MetaMask matches
                `TARGET_NETWORK_ID`.
            *   Requests account access from MetaMask using
                `provider.send("eth_requestAccounts", [])`.
            *   Retrieves the `signer` for the connected account using
                `provider.getSigner()`.
            *   Creates the `contract` instance:
                `new ethers.Contract(CONTRACT_ADDRESS, DigitalIdentityABI, signer)`.
            *   Updates UI with connected account details.
            *   Calls `loadCurrentUserIdentity()` to fetch and display the user's
                data if registered.

    5.3.6. Smart Contract Interaction Functions:
        *   **Event Listeners:** Attached to "Register", "Update", and "View Identity"
            buttons.
        *   **General Flow for Write Operations (Register, Update):**
            1.  Validate user input.
            2.  Call the corresponding method on the `contract` object (e.g.,
                `contract.registerIdentity(name, email)`).
            3.  The call returns a transaction response object (`tx`).
            4.  Wait for the transaction to be mined using `await tx.wait()`.
            5.  Update UI with success message or handle errors.
        *   **General Flow for Read Operations (View Identity, Load Current User):**
            1.  Call the corresponding `view` method on the `contract` object (e.g.,
                `contract.getIdentity(addressToView)`).
            2.  The call directly returns the data from the contract.
            3.  Update UI with the retrieved data or handle errors.

    5.3.7. UI Update and Helper Functions:
        *   `loadCurrentUserIdentity()`: Fetches and displays the connected user's
            identity in the "Update" form.
        *   `showStatus(message)`: Displays status messages to the user.
        *   `showError(message)`: Displays error messages.
        *   `handleContractError(error, prefix)`: Formats and displays errors from
            contract interactions or MetaMask.

    5.3.8. MetaMask Event Listeners:
        *   `window.ethereum.on('accountsChanged', ...)`: Handles scenarios where the
            user switches accounts in MetaMask. Typically re-initializes the
            connection with the new account.
        *   `window.ethereum.on('chainChanged', ...)`: Handles scenarios where the
            user switches networks in MetaMask. Validates if the new network is the
            `TARGET_NETWORK_ID` and updates UI/state accordingly.

5.4. User Interface (`index.html` and `src/style.css`)
-------------------------------------------------------
*   **`index.html` Structure:**
    *   Semantic HTML structure with `<header>`, `<main>`, `<footer>`, and
        `<section>` tags.
    *   Forms with `<label>` and `<input>` elements for identity registration,
        update, and viewing.
    *   Buttons for triggering actions ("Connect Wallet", "Register", "Update",
        "View Identity").
    *   Designated `<span>` and `<div>` elements to display dynamic information
        (account address, contract address, identity details, status/error messages).
    *   Links to Google Fonts for modern typography and to `src/style.css` and
        `src/main.js`.
*   **`src/style.css` Styling:**
    *   Provides a modern, clean, and user-friendly visual design.
    *   Uses a consistent color palette and typography (Inter font).
    *   Implements card-based layouts for content sections.
    *   Styles form elements and buttons for better usability and visual appeal,
        including hover and focus states.
    *   Includes basic responsive design principles to ensure readability and
        functionality on smaller screens.
    *   Clearly distinguishes status messages from error messages.

5.5. Serving the Frontend (Vite)
---------------------------------
*   **Development Server:** Vite is used to serve the frontend during development.
*   **Command:** `npm run dev` (defined in `frontend/package.json`).
*   **Functionality:** Provides fast Hot Module Replacement (HMR), serves static
    assets, and bundles the application for production (`npm run build`).

--------------------------------------------------------------------------------
6. DEVELOPMENT ENVIRONMENT SETUP
--------------------------------------------------------------------------------

6.1. Prerequisites
-------------------
*   **6.1.1. Node.js and npm (Node Package Manager):**
    *   **Requirement:** Essential for running JavaScript code, managing project
        dependencies (like Truffle, Vite, Ethers.js), and executing scripts.
    *   **Recommendation:** Install the latest Long-Term Support (LTS) version
        from [https://nodejs.org/](https://nodejs.org/).
    *   **Version Management (Recommended):** Use a Node Version Manager like
        [NVM](https://github.com/nvm-sh/nvm) to easily switch between different
        Node.js versions if required by various projects.
        *   NVM Installation (Linux/macOS):
            ```bash
            curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
            # Close and reopen terminal or source ~/.bashrc / ~/.zshrc
            nvm install --lts
            nvm use --lts
            ```
    *   **Verification:**
        ```bash
        node -v
        npm -v
        ```

*   **6.1.2. Truffle Suite:**
    *   **Requirement:** The development framework for compiling, deploying, and
        testing the smart contract.
    *   **Installation (Global Recommended for ease of use):**
        ```bash
        npm install -g truffle
        ```
    *   **Verification:**
        ```bash
        truffle version
        ```

*   **6.1.3. Ganache:**
    *   **Requirement:** A personal blockchain for local Ethereum development,
        providing test accounts and a simulated network.
    *   **Options:**
        *   **Ganache UI (Graphical):** Download from the [Truffle Suite website](https://trufflesuite.com/ganache/). Provides a user-friendly interface.
        *   **Ganache CLI (Command Line):** Install via npm:
            ```bash
            npm install -g ganache
            # or previously 'ganache-cli'
            ```
    *   **Choice:** Either UI or CLI can be used. Ensure settings (RPC port,
        Network ID) are consistently used in Truffle and MetaMask configurations.

*   **6.1.4. MetaMask:**
    *   **Requirement:** A browser extension that functions as an Ethereum wallet
        and allows web applications to interact with the blockchain.
    *   **Installation:** Install from the official website ([https://metamask.io/](https://metamask.io/))
        for your preferred browser (Chrome, Firefox, Brave, Edge).
    *   **Setup:** Create a wallet or import an existing one. For development, you
        will later import accounts from Ganache.

*   **6.1.5. Code Editor:**
    *   **Recommendation:** Visual Studio Code (VS Code) is highly recommended due
        to its excellent support for JavaScript, Solidity (with extensions like
        Juan Blanco's "Solidity"), and terminal integration.
    *   **Download:** [https://code.visualstudio.com/](https://code.visualstudio.com/)

6.2. Project Initialization
----------------------------

    6.2.1. Truffle Project (Backend - `truffle-digital-identity`):
    1.  **Create Project Directory:**
        Open your terminal and navigate to your desired workspace.
        ```bash
        mkdir truffle-digital-identity
        cd truffle-digital-identity
        ```
    2.  **Initialize Truffle Project:**
        ```bash
        truffle init
        ```
        This command scaffolds the standard Truffle project structure (directories
        for `contracts`, `migrations`, `test`, and `truffle-config.js`).
    3.  **Add Smart Contract:**
        Create the `DigitalIdentity.sol` file within the `contracts/` directory
        and paste the Solidity code (as detailed in Section 3).
    4.  **Create Migration Script:**
        Create the `2_deploy_digital_identity.js` (or `1_...`) file within the
        `migrations/` directory and paste the deployment script code (as detailed
        in Section 4.4).
    5.  **Configure Truffle:**
        Edit `truffle-config.js` to specify the Solidity compiler version and
        network settings for Ganache (as detailed in Section 4.3).

    6.2.2. Frontend Project (UI - `digital-identity-frontend-truffle`):
    1.  **Create Project Directory:**
        (This can be a sibling directory to `truffle-digital-identity` or nested
        within it, though sibling is often cleaner for separation of concerns).
        From the parent of `truffle-digital-identity`:
        ```bash
        mkdir digital-identity-frontend-truffle
        cd digital-identity-frontend-truffle
        ```
    2.  **Initialize npm Project:**
        ```bash
        npm init -y
        ```
        This creates a `package.json` file to manage frontend dependencies and
        scripts.
    3.  **Install Dependencies:**
        *   **Vite (Development Server & Build Tool):**
            ```bash
            npm install --save-dev vite
            ```
        *   **Ethers.js (Blockchain Interaction Library):**
            ```bash
            npm install ethers
            ```
    4.  **Configure `package.json` Scripts:**
        Edit `digital-identity-frontend-truffle/package.json` to include Vite
        scripts:
        ```json
        "scripts": {
          "dev": "vite",
          "build": "vite build",
          "preview": "vite preview"
        },
        ```
    5.  **Create Frontend Files:**
        *   Create `index.html` in the root of the frontend project.
        *   Create the `src/` directory.
        *   Inside `src/`, create `main.js`, `style.css`, and
            `DigitalIdentityABI.json`. Populate these with the respective code
            (as detailed in Section 5 and previous instructions for the ABI).

--------------------------------------------------------------------------------
7. DEPLOYMENT & RUNNING THE DAPP
--------------------------------------------------------------------------------

This section outlines the steps to compile, deploy the smart contract to Ganache,
configure MetaMask, and run the frontend application to interact with the DApp.

7.1. Starting Ganache (Local Blockchain)
-----------------------------------------
*   **7.1.1. Action:** Launch your Ganache instance.
    *   **Ganache UI:** Open the application and ensure your desired workspace is
        active or create a new one.
    *   **Ganache CLI:** Open a terminal and run the command `ganache`.
*   **7.1.2. Verify Details:** Once Ganache is running, confirm and note down:
    *   **RPC Server URL:** This is the endpoint your DApp and Truffle will use to
        connect to Ganache.
        *   Ganache UI Default: `http://127.0.0.1:7545`
        *   Ganache CLI Default: `http://127.0.0.1:8545`
    *   **Network ID (Chain ID):** The unique identifier for this Ganache blockchain
        instance.
        *   Ganache UI Default (for new workspaces): `5777`
        *   Ganache CLI Default: `1337`
    *   **Available Accounts & Private Keys:** Ganache provides a list of
        pre-funded accounts. You will need a private key from one of these to
        import into MetaMask.

7.2. Compiling & Migrating the Smart Contract (Truffle)
--------------------------------------------------------
*   **7.2.1. Navigate to Truffle Project:**
    Open a terminal and change to the root directory of your Truffle project:
    ```bash
    cd path/to/your/truffle-digital-identity
    ```
*   **7.2.2. Configure `truffle-config.js` (If not already done):**
    Ensure the `networks.development` (or your named Ganache network) section in
    `truffle-config.js` correctly points to your running Ganache instance's
    RPC URL (host and port) and is compatible with its Network ID.
*   **7.2.3. Compile Smart Contracts:**
    Execute the Truffle compile command:
    ```bash
    truffle compile
    ```
    *   **Outcome:** This compiles `DigitalIdentity.sol` (and any other contracts
        in the `contracts/` directory). Successful compilation will create or
        update JSON artifact files (containing ABI, bytecode, etc.) in the
        `build/contracts/` directory.
*   **7.2.4. Migrate (Deploy) Smart Contracts:**
    Execute the Truffle migrate command, specifying your Ganache network if it's
    not the default:
    ```bash
    truffle migrate --network development
    # Or, if 'development' is the only active network or default:
    # truffle migrate
    # If you have reset Ganache and want to redeploy from scratch:
    # truffle migrate --reset --network development
    ```
    *   **Outcome:** Truffle will execute the migration scripts (e.g.,
        `2_deploy_digital_identity.js`) in order. The `DigitalIdentity` contract
        will be deployed to your Ganache instance.
    *   **Note Important Information:** The console output will display the
        **deployed contract address** for `DigitalIdentity`. Copy this address.
        Example: `Contract Address: 0xAbcDeF1234567890...`

7.3. Preparing Frontend with Contract Artifacts
------------------------------------------------
*   **7.3.1. Copy Contract ABI:**
    1.  Locate the compiled artifact for your contract:
        `truffle-digital-identity/build/contracts/DigitalIdentity.json`.
    2.  Open this JSON file.
    3.  Find the `"abi": [...]` key.
    4.  Carefully copy **only the array value** (starting with `[` and ending
        with `]`) associated with the `abi` key.
    5.  Navigate to your frontend project:
        `cd path/to/your/digital-identity-frontend-truffle`
    6.  Open (or create) the file `src/DigitalIdentityABI.json`.
    7.  Paste the copied ABI array into this file and save it. Ensure it's just
        the array.
*   **7.3.2. Update Frontend Configuration (`src/main.js`):**
    1.  Open `digital-identity-frontend-truffle/src/main.js`.
    2.  Locate the `CONTRACT_ADDRESS` constant. Update its value with the deployed
        contract address you noted from the `truffle migrate` output.
        ```javascript
        const CONTRACT_ADDRESS = "0xYourDeployedContractAddressOnGanache"; // PASTE ADDRESS HERE
        ```
    3.  Locate the `TARGET_NETWORK_ID` constant. Ensure its value matches the
        **Network ID (Chain ID)** of your running Ganache instance.
        ```javascript
        const TARGET_NETWORK_ID = "1337"; // e.g., 5777 for Ganache UI, 1337 for CLI. MATCH YOURS.
        ```

7.4. Configuring MetaMask
--------------------------
*   **7.4.1. Add Ganache as a Custom Network:**
    1.  Open MetaMask in your browser.
    2.  Click the network dropdown (top of MetaMask panel).
    3.  Select "Add network".
    4.  Choose "Add a network manually".
    5.  Fill in the details:
        *   **Network Name:** A descriptive name, e.g., `Ganache Local (5777)` or
            `My Dev Chain`.
        *   **New RPC URL:** The RPC Server URL of your running Ganache instance
            (from step 7.1.2).
        *   **Chain ID:** The Network ID (Chain ID) of your running Ganache instance
            (from step 7.1.2). This **must** match `TARGET_NETWORK_ID` in
            `main.js`.
        *   **Currency Symbol (Optional):** `ETH`
        *   **Block explorer URL (Optional):** Leave blank for local Ganache.
    6.  Click "Save". MetaMask should now be connected to your Ganache instance.
*   **7.4.2. Import a Ganache Account:**
    1.  In Ganache (UI or CLI), copy the **private key** of one of its
        pre-funded accounts.
    2.  In MetaMask, ensure your Ganache network is selected.
    3.  Click the account avatar (circle icon, top right) -> "Import account".
    4.  Paste the private key and click "Import".
    5.  This account, now in MetaMask, will have the "fake" ETH from Ganache needed
        to pay for gas fees when interacting with your DApp.

7.5. Running the Frontend Application
--------------------------------------
*   **7.5.1. Navigate to Frontend Project:**
    Open a terminal and change to the root directory of your frontend project:
    ```bash
    cd path/to/your/digital-identity-frontend-truffle
    ```
*   **7.5.2. Start the Vite Development Server:**
    Run the npm script:
    ```bash
    npm run dev
    ```
    *   **Outcome:** Vite will compile the frontend application and start a local
        development server. The console will typically display a URL like
        `http://localhost:5173`.
*   **7.5.3. Access the DApp in Browser:**
    1.  Open your web browser and navigate to the URL provided by Vite (e.g.,
        `http://localhost:5173`).
    2.  Ensure MetaMask is unlocked and connected to your configured Ganache
        network, with an imported Ganache account selected.
*   **7.5.4. Interact with the DApp:**
    *   Click "Connect Wallet" to link MetaMask to the DApp.
    *   Use the forms to register, update, or view identities.
    *   MetaMask will prompt you to confirm any transactions that modify the
        blockchain state (register, update). These transactions will use the "fake"
        ETH from your imported Ganache account.

You should now have the full DApp running locally, with the frontend interacting
with the smart contract on your Ganache blockchain via MetaMask.
--------------------------------------------------------------------------------
8. FUTURE ENHANCEMENTS & CONSIDERATIONS
--------------------------------------------------------------------------------

While the current Digital Identity DApp provides a foundational implementation,
numerous enhancements and considerations can be explored to expand its
functionality, security, and user experience for more robust or production-ready
scenarios.

8.1. Smart Contract Enhancements
---------------------------------
*   **8.1.1. More Granular Access Control:**
    *   Implement role-based access control if different types of users or
        administrators need specific permissions beyond simple ownership.
    *   Consider functions that only a contract owner (deployer) can call for
        administrative tasks (e.g., pausing the contract in emergencies).
*   **8.1.2. Richer Identity Attributes:**
    *   Extend the `Identity` struct to include more fields like:
        *   Profile Picture (e.g., storing an IPFS CID).
        *   Social media links or other public identifiers.
        *   Physical address (consider privacy implications carefully).
        *   Custom key-value attributes.
*   **8.1.3. Off-Chain Data References:**
    *   For sensitive or large data (like PII or documents), store the actual data
        off-chain (e.g., encrypted on a private server, IPFS, or a decentralized
        storage network like Arweave or Sia).
    *   Store only a hash or a content identifier (CID) of the off-chain data on
        the blockchain for verification and integrity.
*   **8.1.4. Attestations and Verifiable Credentials (VCs):**
    *   Allow trusted third parties (attestors) to issue on-chain or off-chain
        attestations about specific claims within an identity (e.g., KYC
        completion, educational qualifications).
    *   Integrate with W3C DID (Decentralized Identifiers) and VC standards for
        interoperability.
*   **8.1.5. Key Management and Social Recovery:**
    *   Implement mechanisms for users to recover access to their identity if they
        lose their primary wallet key, such as:
        *   Multi-signature control with trusted guardians.
        *   Social recovery schemes.
*   **8.1.6. Contract Upgradability:**
    *   Implement an upgrade pattern (e.g., Transparent Upgradeable Proxy, UUPS
        Proxy) to allow for future modifications to the contract logic without
        requiring a full data migration from an old contract to a new one. This
        is crucial for long-term maintainability.
*   **8.1.7. Gas Optimization:**
    *   Further review and optimize contract functions to minimize gas consumption,
        especially for frequently called write operations. This involves careful
        use of storage, efficient data structures, and avoiding unnecessary
        computations.
*   **8.1.8. Batch Operations:**
    *   Consider functions for batch registration or updates by an authorized
        entity, if applicable to the use case (e.g., an organization managing
        identities for its members).

8.2. Frontend and User Experience (UX) Enhancements
----------------------------------------------------
*   **8.2.1. Advanced Frontend Framework:**
    *   Migrate the frontend to a more robust JavaScript framework like React, Vue,
        or Svelte for better state management, component reusability, routing,
        and maintainability for larger applications.
*   **8.2.2. Real-time Event Listening:**
    *   Implement listeners for smart contract events (`IdentityRegistered`,
        `IdentityUpdated`) directly in the frontend. This allows the UI to update
        dynamically when relevant on-chain events occur, without requiring manual
        refreshes.
*   **8.2.3. Improved User Feedback:**
    *   Provide more granular feedback during transaction processing (e.g.,
        "Transaction submitted to network...", "Waiting for 1st confirmation...",
        "Transaction confirmed!").
    *   Use visual cues like loading spinners or progress bars.
*   **8.2.4. Enhanced Error Handling:**
    *   Parse common blockchain error messages (e.g., revert reasons) to display
        more user-friendly error explanations rather than raw technical errors.
*   **8.2.5. Input Validation:**
    *   Implement more comprehensive client-side validation for form inputs
        (e.g., email format, name length) before submitting transactions.
*   **8.2.6. Internationalization (i18n) and Localization (l10n):**
    *   Support multiple languages in the UI if targeting a global audience.
*   **8.2.7. Accessibility (a11y):**
    *   Ensure the frontend adheres to web accessibility standards (WCAG) to make
        it usable by people with disabilities.
*   **8.2.8. User Profile Pages:**
    *   If identity attributes become richer, develop dedicated user profile pages
        where users can view and manage their complete identity information.
*   **8.2.9. ENS/Lens Protocol Integration:**
    *   Allow users to associate their Ethereum Name Service (ENS) names or Lens
        Protocol profiles with their digital identity.
    *   Display ENS names instead of raw addresses where appropriate.

8.3. Security Considerations
-----------------------------
*   **8.3.1. Smart Contract Audits:**
    *   For any deployment to a public testnet or mainnet, a thorough security
        audit by reputable third-party auditors is **essential** to identify
        vulnerabilities, gas inefficiencies, and deviations from best practices.
*   **8.3.2. Reentrancy Protection (If applicable):**
    *   While not directly apparent in the current simple contract, ensure any
        functions involving external calls or ETH transfers are protected against
        reentrancy attacks (e.g., using the Checks-Effects-Interactions pattern or
        ReentrancyGuard).
*   **8.3.3. Integer Overflow/Underflow Protection:**
    *   Solidity 0.8.x and later have built-in protection against
        overflow/underflow for arithmetic operations. If using older versions or
        complex arithmetic, use libraries like SafeMath.
*   **8.3.4. Access Control Thoroughness:**
    *   Rigorously review all functions that modify state to ensure proper access
        control is in place (e.g., only identity owners can update their data).
*   **8.3.5. Private Key Management for Deployment:**
    *   When deploying to public networks, never hardcode private keys or mnemonics
        in configuration files. Use environment variables (e.g., via `.env`
        files, which are gitignored) and tools like `@truffle/hdwallet-provider`.
        Consider using hardware wallets or Gnosis Safe for mainnet deployments.
*   **8.3.6. Denial of Service (DoS) Vectors:**
    *   Be mindful of patterns that could lead to DoS, such as unbounded loops or
        operations that become increasingly expensive as data grows (though less
        of a concern with the current simple mapping).

8.4. Testing and Quality Assurance
-----------------------------------
*   **8.4.1. Comprehensive Smart Contract Testing:**
    *   Write extensive unit tests for all public and internal functions of the
        smart contract using Truffle's testing framework (JavaScript/Mocha/Chai
        or Solidity tests). Cover success cases, failure cases (revert conditions),
        and edge cases.
*   **8.4.2. Frontend Testing:**
    *   Implement unit tests for frontend components/logic and end-to-end tests
        (e.g., using Cypress, Playwright, or Jest with Testing Library) to
        simulate user flows and interactions with the DApp.
*   **8.4.3. Test Coverage:**
    *   Aim for high test coverage for both smart contract and frontend code.
*   **8.4.4. Continuous Integration/Continuous Deployment (CI/CD):**
    *   Set up a CI/CD pipeline to automate testing and deployment processes.

8.5. Scalability and Performance
---------------------------------
*   **8.5.1. Gas Costs on Mainnet:**
    *   Be aware that storing strings (like name and email) directly on Ethereum
        mainnet can be expensive. For mainnet applications, off-chain storage with
        on-chain hashes (see 8.1.3) is often preferred.
*   **8.5.2. Layer 2 Solutions:**
    *   Consider deploying to Ethereum Layer 2 scaling solutions (e.g., Polygon,
        Arbitrum, Optimism) to benefit from lower transaction fees and faster
        confirmation times while still leveraging Ethereum's security.
*   **8.5.3. Read Performance:**
    *   For DApps with high read volume, consider using indexing services like
        The Graph to create efficient GraphQL APIs for querying blockchain data,
        rather than relying solely on direct RPC calls for all reads.

8.6. Legal and Privacy
-----------------------
*   **8.6.1. Data Privacy (GDPR, CCPA, etc.):**
    *   Storing Personally Identifiable Information (PII) like email addresses
        directly on a public, immutable blockchain has significant privacy
        implications and may conflict with data protection regulations.
    *   Strongly consider encryption, off-chain storage for PII, or designs that
        allow users to control the visibility/revocation of their data.
*   **8.6.2. "Right to be Forgotten":**
    *   This is challenging on immutable blockchains. Designs might need to allow
        for "logical deletion" (e.g., marking an identity as inactive or clearing
        data fields) rather than true deletion.
        --------------------------------------------------------------------------------
9. TROUBLESHOOTING
--------------------------------------------------------------------------------

This section provides guidance on common issues that may arise during the setup,
deployment, or operation of the Digital Identity DApp.

9.1. MetaMask Connection & Network Issues
------------------------------------------
*   **9.1.1. Error: "The RPC URL you have entered returned a different chain ID (X). Please change the Chain ID to X."**
    *   **Cause:** The "Chain ID" entered in MetaMask's custom network settings does
        not match the actual Chain ID of the Ganache instance at the specified
        "New RPC URL".
    *   **Solution:**
        1.  Verify the **Network ID (Chain ID)** directly from your running Ganache
            instance (UI: usually displayed prominently; CLI: shown on startup).
        2.  Verify the **RPC URL** your Ganache instance is using.
        3.  In MetaMask (Settings -> Networks), edit your Ganache network entry.
        4.  Ensure the "Chain ID" field in MetaMask **exactly matches** Ganache's
            Network ID.
        5.  Ensure the "New RPC URL" in MetaMask **exactly matches** Ganache's RPC
            URL.
        6.  Close any other Ethereum nodes (Hardhat node, other Ganache instances)
            that might be running on the same port and causing a conflict.

*   **9.1.2. Error: "Could not fetch chain ID. Is your RPC URL correct?" or Connection Fails**
    *   **Cause:** MetaMask cannot establish a connection with an Ethereum node at
        the "New RPC URL" provided.
    *   **Solution:**
        1.  **Ensure Ganache is running:** The Ganache UI application must be open
            and the workspace active, or the `ganache` CLI command must be running
            in a terminal.
        2.  **Verify RPC URL:** Double-check the RPC URL in MetaMask for typos,
            correct protocol (`http`), IP address (`127.0.0.1`), and port number
            (e.g., `7545` or `8545`).
        3.  **Firewall:** Check if any local firewall software is blocking
            connections to the Ganache port.
        4.  **Conflicting Processes:** Ensure no other application is already using
            the port Ganache is trying to use. If so, stop the conflicting
            application or change Ganache's port.

*   **9.1.3. No Accounts or Zero Balance Shown in MetaMask for Ganache Network:**
    *   **Cause:** You might not have imported a Ganache-provided account into
        MetaMask, or you are viewing an account that is not part of the Ganache
        HD wallet.
    *   **Solution:**
        1.  In Ganache (UI or CLI), copy the **private key** of one of the
            pre-funded accounts.
        2.  In MetaMask, ensure your Ganache network is selected.
        3.  Click the account avatar -> "Import account" -> Paste the private key.
        4.  The imported account should show a balance of ETH (e.g., 100 ETH).

*   **9.1.4. MetaMask Stuck on "Connecting..." or Unresponsive:**
    *   **Solution:**
        1.  Try restarting Ganache.
        2.  Try restarting your web browser.
        3.  Remove and re-add the Ganache network in MetaMask.
        4.  Check for browser extension conflicts: try in an incognito/private
            window with only MetaMask enabled.

9.2. Truffle Compilation & Migration Issues
--------------------------------------------
*   **9.2.1. Error: Compiler version mismatch / Pragma error:**
    *   **Cause:** The Solidity compiler version specified in
        `truffle-config.js` (under `compilers.solc.version`) is not compatible
        with the `pragma solidity ...` statement in `DigitalIdentity.sol`.
    *   **Solution:** Ensure the `version` in `truffle-config.js` matches or is
        within the range specified by the pragma (e.g., if pragma is `^0.8.18`,
        config version should be `"0.8.18"`).

*   **9.2.2. Error during `truffle migrate`: Network not configured / Cannot connect:**
    *   **Cause:** Truffle cannot connect to the Ganache instance defined in
        `truffle-config.js` for the specified network (e.g., `development`).
    *   **Solution:**
        1.  Ensure Ganache is running.
        2.  Verify that the `host`, `port`, and `network_id` (if specified) in
            `truffle-config.js` for your Ganache network correctly match your
            running Ganache instance.

*   **9.2.3. Error: "insufficient funds for gas * price + value" during `truffle migrate`:**
    *   **Cause:** The account Truffle is using for deployment (by default,
        `accounts[0]` from Ganache) does not have enough ETH. This is rare with
        default Ganache settings.
    *   **Solution:**
        1.  Restart Ganache to reset accounts to their default high balances.
        2.  Ensure your `truffle-config.js` is not specifying a different `from`
            account that might be empty.

*   **9.2.4. Contract deployment address is not logged or is undefined:**
    *   **Cause:** The migration script might have an error, or the deployment
        promise was not handled correctly.
    *   **Solution:** Review the migration script (`2_deploy_digital_identity.js`)
        to ensure `DigitalIdentity.address` is accessed correctly within the
        `.then()` block after `deployer.deploy()`. Check for any errors logged
        during migration.

9.3. Frontend DApp Interaction Issues
--------------------------------------
*   **9.3.1. `CONTRACT_ADDRESS` is incorrect or `DigitalIdentityABI.json` is missing/malformed:**
    *   **Cause:** The frontend cannot correctly instantiate the Ethers.js `Contract`
        object.
    *   **Solution:**
        1.  **Verify `CONTRACT_ADDRESS`:** In `src/main.js`, ensure the
            `CONTRACT_ADDRESS` constant holds the exact address output by
            `truffle migrate` for the `DigitalIdentity` contract on your Ganache
            network.
        2.  **Verify `DigitalIdentityABI.json`:**
            *   Ensure the file exists at `src/DigitalIdentityABI.json`.
            *   Confirm it contains **only the ABI array**, correctly copied from
                the `abi` field in
                `truffle-digital-identity/build/contracts/DigitalIdentity.json`.
                It should start with `[` and end with `]`, not be wrapped in an
                outer object like `{"abi": [...]}`.

*   **9.3.2. Transactions Fail Silently, Revert, or Get Stuck Pending:**
    *   **Solution:**
        1.  **Open Browser Developer Console (F12):** Check the "Console" tab for
            JavaScript errors from Ethers.js or MetaMask. Check the "Network"
            tab for failed RPC requests.
        2.  **Inspect Ganache:**
            *   **Ganache UI:** Go to the "Transactions" tab to see the transaction
                list. Click on a failed transaction to see details, including
                any revert reason if provided. Check the "Logs" tab in Ganache for
                more detailed output.
            *   **Ganache CLI:** The terminal running Ganache will log transaction
                hashes and often revert reasons.
        3.  **Common Revert Reasons:**
            *   Violating a `require` statement in a smart contract modifier (e.g.,
                `Identity: Address already registered.` when trying to re-register).
            *   Incorrect arguments passed to a contract function.
            *   User rejected the transaction in MetaMask.
            *   (Less common on Ganache) Out of gas, though Ganache usually has
                high block gas limits.

*   **9.3.3. Frontend UI does not update after a transaction:**
    *   **Cause:** The JavaScript logic might not be correctly re-fetching data or
        updating the DOM after a successful transaction.
    *   **Solution:** Ensure that after `await tx.wait()` for a successful write
        operation, you call functions to refresh relevant UI parts (e.g.,
        `loadCurrentUserIdentity()` or re-fetch data for the view section).

*   **9.3.4. Error: `npm run dev` reports "Missing script: dev":**
    *   **Cause:** `npm` cannot find the "dev" script in the `package.json` of
        the current directory.
    *   **Solution:**
        1.  Ensure you are in the correct frontend project directory (e.g.,
            `digital-identity-frontend-truffle`) when running the command.
        2.  Verify that `digital-identity-frontend-truffle/package.json` contains
            `"scripts": { "dev": "vite", ... }`.
        3.  Confirm Vite is installed as a dev dependency in that project
            (`npm list vite`).

*   **9.3.5. CSS styles are not applied or look incorrect:**
    *   **Solution:**
        1.  Verify the link in `index.html`:
            `<link rel="stylesheet" href="/src/style.css">`.
        2.  Check for typos in CSS class names between your HTML and `style.css`.
        3.  Use browser developer tools (Elements/Inspector tab) to inspect CSS
            rules being applied to elements.
        4.  Try a hard refresh (Ctrl+Shift+R or Cmd+Shift+R) or clear browser
            cache.

9.4. General Debugging Tips
----------------------------
*   **`console.log()` is your friend:** Add `console.log()` statements liberally in
    your JavaScript (`src/main.js`) to trace variable values, function execution,
    and the content of objects received from Ethers.js or MetaMask.
*   **Browser Developer Tools:** Use the "Console", "Network", "Sources" (for
    JavaScript debugging), and "Elements" tabs extensively.
*   **Ganache Logs:** The Ganache UI "Logs" tab or the Ganache CLI terminal output
    provides valuable information about incoming RPC requests, transaction
    processing, and errors.
*   **Isolate the Problem:** If an interaction fails, try to determine if the issue
    is in the frontend logic, the connection to MetaMask, the smart contract
    logic, or the Truffle/Ganache setup.
*   **Simplify and Test Incrementally:** When building or debugging, test small
    pieces of functionality individually.
*   **Restart Components:** Sometimes, simply restarting Ganache, the Vite dev
    server, and your browser can resolve transient issues.
