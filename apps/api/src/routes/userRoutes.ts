import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import userController from "../controllers/userController";
import monitorController from "../controllers/monitorController";

const router = Router();

// to check all the monitors of the user. # protected
router.get("/monitors",authenticate,userController.getUserMonitor);


export default router;