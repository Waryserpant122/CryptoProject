import express from "express";
import { getUserController, handleBetController } from "../controllers/gameController.js";

const router = express.Router();

// Login route
router.get("/:id", getUserController);

router.post("/bet", handleBetController);

export default router;
