import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { LoginRequest, CreateUserRequest } from '../types';

export class AuthController {
  // Connexion utilisateur
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const loginData: LoginRequest = req.body;

      // Validation des données
      if (!loginData.email || !loginData.password) {
        res.status(400).json({
          success: false,
          error: 'Email et mot de passe requis',
        });
        return;
      }

      const result = await AuthService.login(loginData);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(401).json(result);
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur',
      });
    }
  }

  // Création d'un nouvel utilisateur
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const userData: CreateUserRequest = req.body;

      // Validation des données
      if (!userData.email || !userData.firstName || !userData.lastName || !userData.role) {
        res.status(400).json({
          success: false,
          error: 'Tous les champs obligatoires doivent être remplis',
        });
        return;
      }

      const result = await AuthService.createUser(userData);

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

  // Récupération du profil utilisateur
  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Utilisateur non authentifié',
        });
        return;
      }

      const result = await AuthService.getUserProfile(userId);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur',
      });
    }
  }

  // Mise à jour du profil utilisateur
  static async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const updates = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Utilisateur non authentifié',
        });
        return;
      }

      const result = await AuthService.updateUserProfile(userId, updates);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur',
      });
    }
  }

  // Changement de mot de passe
  static async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { currentPassword, newPassword } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Utilisateur non authentifié',
        });
        return;
      }

      if (!currentPassword || !newPassword) {
        res.status(400).json({
          success: false,
          error: 'Ancien et nouveau mot de passe requis',
        });
        return;
      }

      const result = await AuthService.changePassword(userId, currentPassword, newPassword);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur',
      });
    }
  }

  // Déconnexion (côté client, mais on peut logger l'action)
  static async logout(req: Request, res: Response): Promise<void> {
    try {
      // En production, on pourrait invalider le token côté serveur
      // Pour l'instant, on retourne juste un succès
      res.status(200).json({
        success: true,
        message: 'Déconnexion réussie',
      });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur',
      });
    }
  }

  // Vérifier si l'utilisateur est authentifié
  static async verifyAuth(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;

      if (!user) {
        res.status(401).json({
          success: false,
          error: 'Utilisateur non authentifié',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
          },
        },
        message: 'Utilisateur authentifié',
      });
    } catch (error) {
      console.error('Erreur lors de la vérification d\'authentification:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur',
      });
    }
  }
} 