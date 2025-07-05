import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticateToken } from '../utils/auth';

const router = Router();

// Routes publiques
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);

// Routes protégées
router.get('/profile', authenticateToken, AuthController.getProfile);
router.put('/profile', authenticateToken, AuthController.updateProfile);
router.post('/change-password', authenticateToken, AuthController.changePassword);
router.post('/logout', authenticateToken, AuthController.logout);
router.get('/verify', authenticateToken, AuthController.verifyAuth);

export default router; 