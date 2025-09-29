import { Router } from "express";
import authController from "../controllers/authController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/profile', authenticate, authController.getProfile);

export default router;

