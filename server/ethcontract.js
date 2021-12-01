import Web3 from "web3";
import contract from "truffle-contract";
import { readFile } from "fs/promises";
import { getBankAddress } from "./models/Users.js";
import sha3 from "solidity-sha3";

const provider = new Web3.providers.HttpProvider("http://127.0.0.1:8545");
const web3 = new Web3(provider);

const RouletteArtifact = JSON.parse(
	await readFile(new URL("../build/contracts/Roulette.json", import.meta.url))
);

const rouletteContract = contract(RouletteArtifact);

export async function getAccounts() {
	const provider = new Web3.providers.HttpProvider("http://127.0.0.1:8545");
	const web3 = new Web3(provider);

	const accounts = await web3.eth.getAccounts();
	return accounts;
}

export async function withdrawMoney(userAccount) {
	rouletteContract.setProvider(provider);
	const res = rouletteContract
		.deployed()
		.then(async (instance) => {
			await instance.withdrawMoney({ from: userAccount });
		})
		.catch((err) => {
			console.log(err);
		});
	return res;
}

export async function increaseFunds(userAccount, amount) {
	rouletteContract.setProvider(provider);
	const res = rouletteContract
		.deployed()
		.then(async (instance) => {
			const res = await instance.increaseFunds({ from: userAccount, value: amount });
		})
		.catch((err) => {
			console.log(err);
		});
	return res;
}

export function getBalance(userAccount) {
	let r = 0;
	rouletteContract.setProvider(provider);
	const res = rouletteContract
		.deployed()
		.then(async (instance) => {
			const res = await instance.getBalance({ from: userAccount });
			return res.words[0];
		})
		.catch((err) => {
			console.log(err);
		});

	return res;
}

export async function createHash() {
	const rand = Math.floor(Math.random() * 1000000000000);
	const hash = sha3.default(rand);
	return [rand, hash];
}

export function setBankHash(bankHash, userAccount) {
	let r = 0;
	rouletteContract.setProvider(provider);
	const res = rouletteContract
		.deployed()
		.then(async (instance) => {
			const res = await instance.setInitialBankHash(bankHash, userAccount, {
				from: getBankAddress(),
			});
		})
		.catch((err) => {
			console.log(err);
		});

	return res;
}

export function placeBetFunction(betOnRed, userValue, betAmt, userAddress) {
	let val = userValue;
	let uint256Val = web3.eth.abi.encodeParameter("uint256", val);
	rouletteContract.setProvider(provider);
	const res = rouletteContract
		.deployed()
		.then(async (instance) => {
			const res = await instance.placeBet(betOnRed, uint256Val, betAmt, {
				from: userAddress,
			});
		})
		.catch((err) => {
			console.log(err);
		});

	return res;
}

export function sendBankSecretValueFunction(secret, userAddress) {
	let val = secret;
	let uint256Val = web3.eth.abi.encodeParameter("uint256", val);
	rouletteContract.setProvider(provider);

	const res = rouletteContract
		.deployed()
		.then(async (instance) => {
			const res = await instance.sendBankSecretValue(uint256Val, userAddress, {
				from: getBankAddress(),
			});
			return res;
		})
		.catch((err) => {
			console.log(err);
		});

	return res;
}

export async function getBlock(number) {
	return await web3.eth.getBlock(number);
}
//initializeGame();
