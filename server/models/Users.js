import crypto from "crypto";

// Hardcoding 3 users
const Users = {
	Username1: {
		email: "user1@gmail.com",
		password: "password1",
		id: crypto.randomBytes(16).toString("hex"),
		address: "sample",
	},
	Username2: {
		email: "user2@gmail.com",
		password: "password2",
		id: crypto.randomBytes(16).toString("hex"),
		address: "sample",
	},
	Username3: {
		email: "user3@gmail.com",
		password: "password3",
		id: crypto.randomBytes(16).toString("hex"),
		address: "sample",
	},
};

export function getUser(username) {
	return Users[username];
}

// Fuctions to check if user exists
export function checkUserExists(username) {
	return Users[username] !== undefined;
}
