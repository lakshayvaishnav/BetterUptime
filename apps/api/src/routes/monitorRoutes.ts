import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import userController from "../controllers/userController";

const router = Router();

router.post("/createMonitor",authenticate)