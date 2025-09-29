import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import resultController from "../controllers/resultController";

const router = Router();

// All routes are protected and use req.user.id for security
router.get("/:monitorId/results", authenticate, resultController.getResultsByMonitorId);
router.get("/:monitorId/results/latest", authenticate, resultController.getLatestResult);
router.delete("/:monitorId/results/cleanup", authenticate, resultController.deleteOldResults);

export default router;

