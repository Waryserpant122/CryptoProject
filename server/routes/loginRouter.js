import express from "express";
import { checkUserExists, getUser } from "../models/Users.js";

const router = express.Router();

// Login route
router.get("/", (req, res) => {
	res.send("login");
});

// Login route
router.post("/", (req, res) => {
	const { username, password } = req.body;
	if (!checkUserExists(username)) {
		return res.status(400).send("User does not exist");
	}
	const user = getUser(username);
	if (user.password !== password) {
		return res.status(400).send("Incorrect password");
	}
	return res.status(200).send({ msg: "Login Successful", id: user.id });
});

export default router;
