import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import userController from "../controllers/userController";

const router = Router();

// to check all the monitors of the user. # protected
router.get("/dashboard",authenticate,userController.getUserMonitor);


export default router;