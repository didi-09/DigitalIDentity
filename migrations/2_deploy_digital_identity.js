const DigitalIdentity = artifacts.require("DigitalIdentity"); // Gets the contract artifact

module.exports = function (deployer) {
  // Deploy the DigitalIdentity contract
  deployer.deploy(DigitalIdentity)
    .then(() => {
      console.log("DigitalIdentity contract deployed successfully!");
      console.log("DigitalIdentity contract address:", DigitalIdentity.address);
    })
    .catch(error => {
      console.error("Failed to deploy DigitalIdentity contract:", error);
    });
};