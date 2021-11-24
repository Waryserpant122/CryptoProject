import Web3 from "web3";
import contract from "truffle-contract";
import { readFile } from "fs/promises";

const provider = new Web3.providers.HttpProvider("http://127.0.0.1:8545");
const web3 = new Web3(provider);

const RouletteArtifact = JSON.parse(
	await readFile(new URL("../build/contracts/Roulette.json", import.meta.url))
);

const rouletteContract = contract(RouletteArtifact);

async function getAccounts() {
	const accounts = await web3.eth.getAccounts();
	return accounts;
}

function initializeGame(bankAccount) {
	rouletteContract.setProvider(provider);
	rouletteContract
		.deployed()
		.then(async (instance) => {
			await instance.initializeGame({ from: bankAccount });
		})
		.catch((err) => {
			console.log(err);
		});
}

function increaseFunds(userAccount, amount) {
	rouletteContract.setProvider(provider);
	rouletteContract
		.deployed()
		.then(async (instance) => {
			console.log("User accout", userAccount);
			const res = await instance.increaseFunds({ from: userAccount, value: amount });
		})
		.catch((err) => {
			console.log(err);
		});
}

getAccounts().then((accounts) => {
	//increaseFunds(accounts[0], 1);
});
