import {
	createHash,
	getBalance,
	placeBetFunction,
	sendBankSecretValueFunction,
	setBankHash,
} from "../ethcontract.js";
import { getUserFromId } from "../models/Users.js";

export async function getUserController(req, res) {
	const id = req.params.id;
	const user = getUserFromId(id);
	return res.status(200).send(user);
}

export async function handleBetController(req, res) {
	const { id, betAmt, betType } = req.body;
	const user = getUserFromId(id);

	if (user.balance < betAmt) {
		return res.status(400).send("Insufficient funds");
	}

	const [randomNumber, bankHash] = await createHash();

	const userRand = Math.floor(Math.random() * 1000000000);

	await setBankHash(bankHash, user.address);
	await placeBetFunction(betType, userRand, betAmt, user.address);
	const transRes = await sendBankSecretValueFunction(randomNumber, user.address);

	const log = transRes.logs[1];
	const args = log.args;
	const winner = args.winnner;
	const number = args.number.toString();

	let isWinner = false;
	if (winner == user.address) {
		isWinner = true;
	}
	user.balance = await getBalance(user.address);
	return res.status(200).send({ user, number, isWinner });
}
