import { Router } from 'express';
import { BudgetRequestController } from '../controllers/budgetRequestController';
import { authenticateToken, requireRole } from '../utils/auth';

const router = Router();

// Toutes les routes nécessitent une authentification
router.use(authenticateToken);

// Routes pour tous les utilisateurs authentifiés
router.get('/', BudgetRequestController.getRequests);
router.get('/stats', BudgetRequestController.getRequestStats);
router.get('/:id', BudgetRequestController.getRequestById);

// Routes pour les agents et plus
router.post('/', requireRole(['agent', 'admin']), BudgetRequestController.createRequest);
router.put('/:id', BudgetRequestController.updateRequest);
router.delete('/:id', BudgetRequestController.deleteRequest);

// Route pour mettre à jour le statut (tous les rôles peuvent l'utiliser selon leurs permissions)
router.patch('/:id/status', BudgetRequestController.updateRequestStatus);

export default router; 