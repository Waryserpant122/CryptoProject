import crypto from "crypto";
import { getAccounts, getBalance, increaseFunds } from "../ethcontract.js";

let Users = {};
let bankAddress;
getAccounts().then((accounts) => {
	bankAddress = accounts[0];
	Users = {
		Username1: {
			name: "Name1",
			email: "user1@gmail.com",
			password: "password1",
			id: 1001,
			address: accounts[1],
			balance: getBalance(accounts[1]),
		},
		Username2: {
			name: "Name2",
			email: "user2@gmail.com",
			password: "password2",
			id: 1002,
			address: accounts[2],
			balance: getBalance(accounts[2]),
		},
		Username3: {
			name: "Name3",
			email: "user3@gmail.com",
			password: "password3",
			id: 1003,
			address: accounts[3],
			balance: getBalance(accounts[3]),
		},
	};
});
// Hardcoding 3 users

export async function getUser(username) {
	let user = Users[username];
	const bal = await getBalance(user.address);
	user.balance = bal;
	return user;
}

// Fuctions to check if user exists
export function checkUserExists(username) {
	return Users[username] !== undefined;
}

export function getUserFromId(id) {
	for (let key in Users) {
		if (Users[key].id == id) {
			return Users[key];
		}
	}
}

export function getBankAddress() {
	return bankAddress;
}
