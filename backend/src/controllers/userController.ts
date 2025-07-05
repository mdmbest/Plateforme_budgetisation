import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { CreateUserRequest } from '../types';

export class UserController {
  // Récupérer tous les utilisateurs
  static async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filters: any = {};

      // Appliquer les filtres selon les paramètres de requête
      if (req.query.role) filters.role = req.query.role;
      if (req.query.department) filters.department = req.query.department;
      if (req.query.isActive !== undefined) {
        filters.isActive = req.query.isActive === 'true';
      }

      const result = await UserService.getUsers(filters, page, limit);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur',
      });
    }
  }

  // Récupérer un utilisateur par ID
  static async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      const result = await UserService.getUserById(userId);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur',
      });
    }
  }

  // Créer un nouvel utilisateur
  static async createUser(req: Request, res: Response): Promise<void> {
    try {
      const userData: CreateUserRequest = req.body;

      // Validation des données
      if (!userData.email || !userData.firstName || !userData.lastName || !userData.role || !userData.password) {
        res.status(400).json({
          success: false,
          error: 'Tous les champs obligatoires doivent être remplis (email, prénom, nom, rôle, mot de passe)',
        });
        return;
      }

      const result = await UserService.createUser(userData);

      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur',
      });
    }
  }

  // Mettre à jour un utilisateur
  static async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const updates = req.body;

      const result = await UserService.updateUser(userId, updates);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur',
      });
    }
  }

  // Supprimer un utilisateur
  static async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      const result = await UserService.deleteUser(userId);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur',
      });
    }
  }

  // Récupérer les utilisateurs par rôle
  static async getUsersByRole(req: Request, res: Response): Promise<void> {
    try {
      const { role } = req.params;

      const result = await UserService.getUsersByRole(role);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs par rôle:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur',
      });
    }
  }

  // Récupérer les utilisateurs par département
  static async getUsersByDepartment(req: Request, res: Response): Promise<void> {
    try {
      const { department } = req.params;

      const result = await UserService.getUsersByDepartment(department);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs par département:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur',
      });
    }
  }

  // Activer/Désactiver un utilisateur
  static async toggleUserStatus(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      const result = await UserService.toggleUserStatus(userId);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur',
      });
    }
  }

  // Envoyer les identifiants à un utilisateur
  static async sendCredentials(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { method } = req.body;

      if (!method || !['email', 'sms'].includes(method)) {
        res.status(400).json({
          success: false,
          error: 'Méthode d\'envoi invalide (email ou sms)',
        });
        return;
      }

      const result = await UserService.sendCredentials(userId, method);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi des identifiants:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur',
      });
    }
  }

  // Réinitialiser le mot de passe d'un utilisateur
  static async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { newPassword } = req.body;

      if (!newPassword) {
        res.status(400).json({
          success: false,
          error: 'Nouveau mot de passe requis',
        });
        return;
      }

      const result = await UserService.updateUser(userId, { password: newPassword });

      if (result.success) {
        res.status(200).json({
          success: true,
          message: 'Mot de passe réinitialisé avec succès',
        });
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Erreur lors de la réinitialisation du mot de passe:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur',
      });
    }
  }
} 