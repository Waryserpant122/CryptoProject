const Roulette = artifacts.require("Roulette");

module.exports = async function (deployer, network, accounts) {
	// Deploy the Migrations contract as our only task
	await deployer.deploy(Roulette);
};
