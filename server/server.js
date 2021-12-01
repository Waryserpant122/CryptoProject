import express from "express";
import Web3 from "web3";
import contract from "truffle-contract";
import { readFile } from "fs/promises";

import loginRouter from "./routes/loginRouter.js";
import gameRouter from "./routes/gameRouter.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

// Importing Routes
app.use("/api/login", loginRouter);
app.use("/api/game", gameRouter);

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
