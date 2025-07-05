import prisma from '../utils/database';
import { hashPassword } from '../utils/auth';
import { User, CreateUserRequest, UserFilters, ApiResponse, PaginatedResponse } from '../types';

export class UserService {
  // Récupérer tous les utilisateurs avec filtres et pagination
  static async getUsers(
    filters: UserFilters = {},
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<PaginatedResponse<User>>> {
    try {
      const skip = (page - 1) * limit;
      
      // Construire les filtres Prisma
      const where: any = {};
      
      if (filters.role) where.role = filters.role;
      if (filters.department) where.department = filters.department;
      if (filters.isActive !== undefined) where.isActive = filters.isActive;

      // Compter le total
      const total = await prisma.user.count({ where });
      
      // Récupérer les utilisateurs
      const users = await prisma.user.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      });

      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        data: {
          data: users.map(user => ({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            department: user.department || undefined,
            isActive: user.isActive,
            createdAt: user.createdAt.toISOString(),
            lastLogin: user.lastLogin?.toISOString(),
          })),
          pagination: {
            page,
            limit,
            total,
            totalPages,
          },
        },
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      return {
        success: false,
        error: 'Erreur interne du serveur',
      };
    }
  }

  // Récupérer un utilisateur par ID
  static async getUserById(userId: string): Promise<ApiResponse<User>> {
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
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      return {
        success: false,
        error: 'Erreur interne du serveur',
      };
    }
  }

  // Créer un nouvel utilisateur
  static async createUser(userData: CreateUserRequest): Promise<any> {
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

      // Vérifier qu'un mot de passe est fourni
      if (!password) {
        return {
          success: false,
          error: 'Un mot de passe est requis pour créer un utilisateur',
        };
      }

      // Hasher le mot de passe
      const hashedPassword = await hashPassword(password);

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
        // Retourner le mot de passe en clair pour que le super admin puisse le communiquer
        tempPassword: password,
      };
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      return {
        success: false,
        error: 'Erreur interne du serveur',
      };
    }
  }

  // Mettre à jour un utilisateur
  static async updateUser(userId: string, updates: Partial<User & { password?: string }>): Promise<ApiResponse<User>> {
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
        message: 'Utilisateur mis à jour avec succès',
      };
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      return {
        success: false,
        error: 'Erreur interne du serveur',
      };
    }
  }

  // Supprimer un utilisateur
  static async deleteUser(userId: string): Promise<ApiResponse<void>> {
    try {
      // Vérifier si l'utilisateur existe
      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!existingUser) {
        return {
          success: false,
          error: 'Utilisateur non trouvé',
        };
      }

      // Supprimer l'utilisateur
      await prisma.user.delete({
        where: { id: userId },
      });

      return {
        success: true,
        message: 'Utilisateur supprimé avec succès',
      };
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      return {
        success: false,
        error: 'Erreur interne du serveur',
      };
    }
  }

  // Récupérer les utilisateurs par rôle
  static async getUsersByRole(role: string): Promise<ApiResponse<User[]>> {
    try {
      const users = await prisma.user.findMany({
        where: { role: role as any },
        orderBy: {
          firstName: 'asc',
        },
      });

      return {
        success: true,
        data: users.map(user => ({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          department: user.department || undefined,
          isActive: user.isActive,
          createdAt: user.createdAt.toISOString(),
          lastLogin: user.lastLogin?.toISOString(),
        })),
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs par rôle:', error);
      return {
        success: false,
        error: 'Erreur interne du serveur',
      };
    }
  }

  // Récupérer les utilisateurs par département
  static async getUsersByDepartment(department: string): Promise<ApiResponse<User[]>> {
    try {
      const users = await prisma.user.findMany({
        where: { department },
        orderBy: {
          firstName: 'asc',
        },
      });

      return {
        success: true,
        data: users.map(user => ({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          department: user.department || undefined,
          isActive: user.isActive,
          createdAt: user.createdAt.toISOString(),
          lastLogin: user.lastLogin?.toISOString(),
        })),
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs par département:', error);
      return {
        success: false,
        error: 'Erreur interne du serveur',
      };
    }
  }

  // Activer/Désactiver un utilisateur
  static async toggleUserStatus(userId: string): Promise<ApiResponse<User>> {
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

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { isActive: !user.isActive },
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
        message: `Utilisateur ${updatedUser.isActive ? 'activé' : 'désactivé'} avec succès`,
      };
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
      return {
        success: false,
        error: 'Erreur interne du serveur',
      };
    }
  }

  // Envoyer les identifiants à un utilisateur
  static async sendCredentials(userId: string, method: 'email' | 'sms'): Promise<ApiResponse<void>> {
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

      // Simuler l'envoi des identifiants
      console.log(`Identifiants envoyés via ${method} à ${user.email}`);
      
      return {
        success: true,
        message: `Identifiants envoyés via ${method} avec succès`,
      };
    } catch (error) {
      console.error('Erreur lors de l\'envoi des identifiants:', error);
      return {
        success: false,
        error: 'Erreur interne du serveur',
      };
    }
  }
} 