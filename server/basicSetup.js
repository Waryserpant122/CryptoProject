import { getAccounts, getBalance, increaseFunds, withdrawMoney } from "./ethcontract.js";

getAccounts().then((accounts) => {
	increaseFunds(accounts[0], 100000);

	async function setBalance() {
		for (let i = 1; i < 4; i++) {
			await withdrawMoney(accounts[i]);
			await increaseFunds(accounts[i], 1000);
		}
	}
	setBalance();
});
