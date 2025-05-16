// truffle-config.js
module.exports = {
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a managed Ganache instance for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */

  networks: {
    // Useful for testing. The `development` name is special - truffle uses it by default
    // if it's defined here and no network is specified at the command line.
    // You should run a client (like ganache, geth, or parity) in a separate terminal
    // session if you use this network.
    development: { // This network will be used by default if you run `truffle migrate`
     host: "127.0.0.1",     // Localhost (default: none)
     port: 7545,            // Standard Ganache UI port. Change to 8545 for Ganache CLI if needed.
     network_id: "1337",       // Any network (default: none). Or specify your Ganache's Network ID, e.g., 5777 or 1337
     // from: <address>,    // Account to send transactions from (default: accounts[0])
     // gas: <gasLimit>,      // Gas limit used for deploys.
     // gasPrice: <gasPrice>  // Gas price used for deploys.
    },

    // Another network with more advanced options...
    // advanced: {
    //   port: 8777,             // Custom port
    //   network_id: 1342,       // Custom network
    //   gas: 8500000,           // Gas sent with each transaction (default: ~6700000)
    //   gasPrice: 20000000000,  // 20 gwei (in wei) (default: 100 gwei)
    //   from: <address>,        // Account to send txs from (default: accounts[0])
    //   websocket: true         // Enable EventEmitter interface for web3 (default: false)
    // },
    //
    // Useful for deploying to a public network.
    // Note: It's important to wrap the provider as a function to ensure truffle uses a new provider instance.
    // sepolia: {
    //   provider: () => new HDWalletProvider(MNEMONIC, `https://sepolia.infura.io/v3/YOUR_PROJECT_ID`),
    //   network_id: 11155111,       // Sepolia's id
    //   confirmations: 2,    // # of confirmations to wait between deployments. (default: 0)
    //   timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
    //   skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    // },
  },

  // Set default mocha options here, use special reporters, etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.18",      // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {          // See the solidity docs for advice about optimization and evmVersion
       optimizer: {
         enabled: false,   // Set to true to enable optimizer
         runs: 200
       },
      //  evmVersion: "byzantium" // Default is "istanbul" with Truffle
      }
    }
  }
};