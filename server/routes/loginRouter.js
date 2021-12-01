import express from "express";
import { loginController } from "../controllers/loginController.js";
import { getBlock } from "../ethcontract.js";

const router = express.Router();

// Login route
router.get("/", (req, res) => {
	res.send(getBlock(15));
});

// Login route
router.post("/", loginController);

export default router;
