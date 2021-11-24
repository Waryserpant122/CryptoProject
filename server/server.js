import express from "express";
import Web3 from "web3";
import contract from "truffle-contract";
import { readFile } from "fs/promises";

import loginRouter from "./routes/loginRouter.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

// Importing Routes
app.use("/api/login", loginRouter);

app.get("/", async (req, res) => {
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

	const acc = await getAccounts();

	const blocks = await web3.eth.getBlockNumber();
	const arrayBlocks = [];
	for (let i = 0; i < blocks; i++) {
		let k = await web3.eth.getBlock(i);
		arrayBlocks.push(k);
	}
	res.send(arrayBlocks);
});

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
