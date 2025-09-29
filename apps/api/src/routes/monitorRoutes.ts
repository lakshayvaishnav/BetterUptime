import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import userController from "../controllers/userController";
import monitorController from "../controllers/monitorController";

const router = Router();

router.post("/createMonitor", authenticate, monitorController.createUserMonitor);
router.delete("/monitor/:monitorId", authenticate, monitorController.deleteUserMonitor);
router.delete("/monitors", authenticate, monitorController.deleteAllUserMonitor);
router.get("/monitors", authenticate, monitorController.getAllUserMonitors);
router.get("/monitors/:monitorId", authenticate, monitorController.getMonitorById);

export default router;