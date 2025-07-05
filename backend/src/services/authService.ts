import prisma from '../utils/database';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';
import { User, LoginRequest, CreateUserRequest, ApiResponse } from '../types';

export class AuthService {
  // Connexion utilisateur
  static async login(loginData: LoginRequest): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      const { email, password } = loginData;

      // Vérifier si l'utilisateur existe
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return {
          success: false,
          error: 'Email ou mot de passe incorrect',
        };
      }

      // Vérifier si l'utilisateur est actif
      if (!user.isActive) {
        return {
          success: false,
          error: 'Compte désactivé. Contactez l\'administrateur.',
        };
      }

      // Vérifier le mot de passe
      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        return {
          success: false,
          error: 'Email ou mot de passe incorrect',
        };
      }

      // Mettre à jour la dernière connexion
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
      });

      // Générer le token
      const token = generateToken({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        department: user.department || undefined,
        isActive: user.isActive,
        createdAt: user.createdAt.toISOString(),
        lastLogin: user.lastLogin?.toISOString(),
      });

      return {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            department: user.department || undefined,
            isActive: user.isActive,
            createdAt: user.createdAt.toISOString(),
            lastLogin: user.lastLogin?.toISOString(),
          },
          token,
        },
        message: 'Connexion réussie',
      };
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      return {
        success: false,
        error: 'Erreur interne du serveur',
      };
    }
  }

  // Création d'un nouvel utilisateur
  static async createUser(userData: CreateUserRequest): Promise<ApiResponse<User>> {
    try {
      const { email, firstName, lastName, role, department, password } = userData;

      // Vérifier si l'email existe déjà
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return {
          success: false,
          error: 'Un utilisateur avec cet email existe déjà',
        };
      }

      // Générer un mot de passe par défaut si non fourni
      const defaultPassword = password || 'password123';
      const hashedPassword = await hashPassword(defaultPassword);

      // Créer l'utilisateur
      const newUser = await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          role,
          department,
          password: hashedPassword,
        },
      });

      return {
        success: true,
        data: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          role: newUser.role,
          department: newUser.department || undefined,
          isActive: newUser.isActive,
          createdAt: newUser.createdAt.toISOString(),
        },
        message: 'Utilisateur créé avec succès',
      };
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      return {
        success: false,
        error: 'Erreur interne du serveur',
      };
    }
  }

  // Récupération du profil utilisateur
  static async getUserProfile(userId: string): Promise<ApiResponse<User>> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return {
          success: false,
          error: 'Utilisateur non trouvé',
        };
      }

      return {
        success: true,
        data: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          department: user.department || undefined,
          isActive: user.isActive,
          createdAt: user.createdAt.toISOString(),
          lastLogin: user.lastLogin?.toISOString(),
        },
      };
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      return {
        success: false,
        error: 'Erreur interne du serveur',
      };
    }
  }

  // Mise à jour du profil utilisateur
  static async updateUserProfile(userId: string, updates: Partial<User & { password?: string }>): Promise<ApiResponse<User>> {
    try {
      const { password, ...updateData } = updates;

      const updatePayload: any = { ...updateData };

      // Si un nouveau mot de passe est fourni, le hasher
      if (password) {
        updatePayload.password = await hashPassword(password);
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updatePayload,
      });

      return {
        success: true,
        data: {
          id: updatedUser.id,
          email: updatedUser.email,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          role: updatedUser.role,
          department: updatedUser.department || undefined,
          isActive: updatedUser.isActive,
          createdAt: updatedUser.createdAt.toISOString(),
          lastLogin: updatedUser.lastLogin?.toISOString(),
        },
        message: 'Profil mis à jour avec succès',
      };
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      return {
        success: false,
        error: 'Erreur interne du serveur',
      };
    }
  }

  // Changement de mot de passe
  static async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<ApiResponse<void>> {
    try {
      // Récupérer l'utilisateur
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return {
          success: false,
          error: 'Utilisateur non trouvé',
        };
      }

      // Vérifier l'ancien mot de passe
      const isCurrentPasswordValid = await comparePassword(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return {
          success: false,
          error: 'Mot de passe actuel incorrect',
        };
      }

      // Hasher le nouveau mot de passe
      const hashedNewPassword = await hashPassword(newPassword);

      // Mettre à jour le mot de passe
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedNewPassword },
      });

      return {
        success: true,
        message: 'Mot de passe changé avec succès',
      };
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      return {
        success: false,
        error: 'Erreur interne du serveur',
      };
    }
  }
} 