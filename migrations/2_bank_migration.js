const BankOwned = artifacts.require("BankOwned");

module.exports = async function (deployer, network, accounts) {
	// Deploy the Migrations contract as our only task
	await deployer.deploy(BankOwned);
};
