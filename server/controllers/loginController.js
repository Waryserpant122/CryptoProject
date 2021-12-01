import { checkUserExists, getUser } from "../models/Users.js";

export async function loginController(req, res) {
	const { username, password } = req.body;
	if (!checkUserExists(username)) {
		return res.status(400).send("User does not exist");
	}
	const user = await getUser(username);
	if (user.password !== password) {
		return res.status(400).send("Incorrect password");
	}

	const { id, address, balance } = user;

	return res.status(200).send({ msg: "Login Successful", id, address, balance });
}
