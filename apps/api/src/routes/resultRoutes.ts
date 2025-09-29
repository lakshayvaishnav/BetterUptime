import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import resultController from "../controllers/resultController";

const router = Router();

router.get("/:monitorId/results", authenticate, resultController.getResultsByMonitorId);
router.get("/:monitorId/results/latest", authenticate, resultController.getLatestResult);
router.delete("/:monitorId/results/cleanup", authenticate, resultController.deleteOldResults);


// All routes are protected and use req.user.id for security