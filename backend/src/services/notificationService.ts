import prisma from '../utils/database';
import { Notification, CreateNotificationRequest, ApiResponse } from '../types';

export class NotificationService {
  // Créer une nouvelle notification
  static async createNotification(notificationData: CreateNotificationRequest): Promise<ApiResponse<Notification>> {
    try {
      const newNotification = await prisma.notification.create({
        data: {
          userId: notificationData.userId,
          type: notificationData.type,
          title: notificationData.title,
          message: notificationData.message,
          actionUrl: notificationData.actionUrl,
        },
      });

      return {
        success: true,
        data: {
          id: newNotification.id,
          userId: newNotification.userId,
          type: newNotification.type,
          title: newNotification.title,
          message: newNotification.message,
          isRead: newNotification.isRead,
          actionUrl: newNotification.actionUrl,
          createdAt: newNotification.createdAt.toISOString(),
        },
        message: 'Notification créée avec succès',
      };
    } catch (error) {
      console.error('Erreur lors de la création de la notification:', error);
      return {
        success: false,
        error: 'Erreur interne du serveur',
      };
    }
  }

  // Récupérer les notifications d'un utilisateur
  static async getUserNotifications(userId: string, isRead?: boolean): Promise<ApiResponse<Notification[]>> {
    try {
      const where: any = { userId };
      if (isRead !== undefined) {
        where.isRead = isRead;
      }

      const notifications = await prisma.notification.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
      });

      return {
        success: true,
        data: notifications.map(notification => ({
          id: notification.id,
          userId: notification.userId,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          isRead: notification.isRead,
          actionUrl: notification.actionUrl,
          createdAt: notification.createdAt.toISOString(),
        })),
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error);
      return {
        success: false,
        error: 'Erreur interne du serveur',
      };
    }
  }

  // Marquer une notification comme lue
  static async markAsRead(notificationId: string): Promise<ApiResponse<Notification>> {
    try {
      const notification = await prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true },
      });

      return {
        success: true,
        data: {
          id: notification.id,
          userId: notification.userId,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          isRead: notification.isRead,
          actionUrl: notification.actionUrl,
          createdAt: notification.createdAt.toISOString(),
        },
        message: 'Notification marquée comme lue',
      };
    } catch (error) {
      console.error('Erreur lors du marquage de la notification:', error);
      return {
        success: false,
        error: 'Erreur interne du serveur',
      };
    }
  }

  // Marquer toutes les notifications d'un utilisateur comme lues
  static async markAllAsRead(userId: string): Promise<ApiResponse<void>> {
    try {
      await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
      });

      return {
        success: true,
        message: 'Toutes les notifications marquées comme lues',
      };
    } catch (error) {
      console.error('Erreur lors du marquage des notifications:', error);
      return {
        success: false,
        error: 'Erreur interne du serveur',
      };
    }
  }

  // Supprimer une notification
  static async deleteNotification(notificationId: string): Promise<ApiResponse<void>> {
    try {
      await prisma.notification.delete({
        where: { id: notificationId },
      });

      return {
        success: true,
        message: 'Notification supprimée avec succès',
      };
    } catch (error) {
      console.error('Erreur lors de la suppression de la notification:', error);
      return {
        success: false,
        error: 'Erreur interne du serveur',
      };
    }
  }

  // Supprimer toutes les notifications d'un utilisateur
  static async deleteAllUserNotifications(userId: string): Promise<ApiResponse<void>> {
    try {
      await prisma.notification.deleteMany({
        where: { userId },
      });

      return {
        success: true,
        message: 'Toutes les notifications supprimées',
      };
    } catch (error) {
      console.error('Erreur lors de la suppression des notifications:', error);
      return {
        success: false,
        error: 'Erreur interne du serveur',
      };
    }
  }

  // Compter les notifications non lues d'un utilisateur
  static async getUnreadCount(userId: string): Promise<ApiResponse<number>> {
    try {
      const count = await prisma.notification.count({
        where: {
          userId,
          isRead: false,
        },
      });

      return {
        success: true,
        data: count,
      };
    } catch (error) {
      console.error('Erreur lors du comptage des notifications:', error);
      return {
        success: false,
        error: 'Erreur interne du serveur',
      };
    }
  }

  // Créer une notification pour tous les utilisateurs d'un rôle
  static async createNotificationForRole(
    role: string,
    notificationData: Omit<CreateNotificationRequest, 'userId'>
  ): Promise<ApiResponse<void>> {
    try {
      // Récupérer tous les utilisateurs avec ce rôle
      const users = await prisma.user.findMany({
        where: { role },
        select: { id: true },
      });

      // Créer une notification pour chaque utilisateur
      const notifications = users.map(user => ({
        userId: user.id,
        type: notificationData.type,
        title: notificationData.title,
        message: notificationData.message,
        actionUrl: notificationData.actionUrl,
      }));

      await prisma.notification.createMany({
        data: notifications,
      });

      return {
        success: true,
        message: `Notifications créées pour ${users.length} utilisateurs`,
      };
    } catch (error) {
      console.error('Erreur lors de la création des notifications par rôle:', error);
      return {
        success: false,
        error: 'Erreur interne du serveur',
      };
    }
  }

  // Créer une notification pour tous les utilisateurs d'un département
  static async createNotificationForDepartment(
    department: string,
    notificationData: Omit<CreateNotificationRequest, 'userId'>
  ): Promise<ApiResponse<void>> {
    try {
      // Récupérer tous les utilisateurs du département
      const users = await prisma.user.findMany({
        where: { department },
        select: { id: true },
      });

      // Créer une notification pour chaque utilisateur
      const notifications = users.map(user => ({
        userId: user.id,
        type: notificationData.type,
        title: notificationData.title,
        message: notificationData.message,
        actionUrl: notificationData.actionUrl,
      }));

      await prisma.notification.createMany({
        data: notifications,
      });

      return {
        success: true,
        message: `Notifications créées pour ${users.length} utilisateurs du département`,
      };
    } catch (error) {
      console.error('Erreur lors de la création des notifications par département:', error);
      return {
        success: false,
        error: 'Erreur interne du serveur',
      };
    }
  }
} 