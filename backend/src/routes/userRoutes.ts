import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticateToken, requireRole } from '../utils/auth';

const router = Router();

// Routes protégées - nécessitent une authentification
router.use(authenticateToken);

// Routes pour la gestion des utilisateurs
router.get('/', requireRole(['admin']), UserController.getUsers);
router.get('/:userId', requireRole(['admin']), UserController.getUserById);
router.post('/', requireRole(['admin']), UserController.createUser);
router.put('/:userId', requireRole(['admin']), UserController.updateUser);
router.delete('/:userId', requireRole(['admin']), UserController.deleteUser);

// Routes pour les utilisateurs par rôle/département
router.get('/role/:role', requireRole(['admin']), UserController.getUsersByRole);
router.get('/department/:department', requireRole(['admin']), UserController.getUsersByDepartment);

// Routes pour la gestion des utilisateurs
router.patch('/:userId/status', requireRole(['admin']), UserController.toggleUserStatus);
router.post('/:userId/credentials', requireRole(['admin']), UserController.sendCredentials);

// Route pour réinitialiser le mot de passe
router.post('/:userId/reset-password', requireRole(['admin']), UserController.resetPassword);

export default router; 