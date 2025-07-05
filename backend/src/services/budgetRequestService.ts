import prisma from '../utils/database';
import { 
  BudgetRequest, 
  CreateBudgetRequestRequest, 
  UpdateBudgetRequestRequest, 
  UpdateRequestStatusRequest,
  BudgetRequestFilters,
  ApiResponse,
  PaginatedResponse,
  RequestStatus
} from '../types';
import config from '../config';

export class BudgetRequestService {
  // Créer une nouvelle demande de budget
  static async createRequest(requestData: CreateBudgetRequestRequest): Promise<ApiResponse<BudgetRequest>> {
    try {
      const { items, ...requestInfo } = requestData;

      console.log('Données reçues dans le service:', requestInfo);
      console.log('Items:', items);

      // Créer la demande avec les éléments
      const newRequest = await prisma.budgetRequest.create({
        data: {
          ...requestInfo,
          status: 'draft',
          items: {
            create: items?.map(item => ({
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice,
            })) || [],
          },
        },
        include: {
          items: true,
          comments: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      });

      console.log('Demande créée avec succès:', newRequest.id);

      return {
        success: true,
        data: {
          id: newRequest.id,
          agentId: newRequest.agentId,
          agentName: newRequest.agentName,
          department: newRequest.department,
          category: newRequest.category,
          title: newRequest.title,
          description: newRequest.description,
          amount: newRequest.amount,
          justification: newRequest.justification,
          urgency: newRequest.urgency,
          accountCode: newRequest.accountCode ?? undefined,
          attachments: newRequest.attachments,
          status: newRequest.status,
          comments: newRequest.comments.map(comment => ({
            id: comment.id,
            userId: comment.userId,
            userName: `${comment.user.firstName} ${comment.user.lastName}`,
            content: comment.content,
            createdAt: comment.createdAt.toISOString(),
          })),
          items: newRequest.items.map(item => ({
            id: item.id,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
          })),
          createdAt: newRequest.createdAt.toISOString(),
          updatedAt: newRequest.updatedAt.toISOString(),
          validatedBy: newRequest.validatedBy || undefined,
          validatedAt: newRequest.validatedAt?.toISOString(),
        },
        message: 'Demande de budget créée avec succès',
      };
    } catch (error) {
      console.error('Erreur détaillée lors de la création de la demande:', error);
      return {
        success: false,
        error: 'Erreur interne du serveur',
      };
    }
  }

  // Récupérer une demande par ID
  static async getRequestById(requestId: string): Promise<ApiResponse<BudgetRequest>> {
    try {
      const request = await prisma.budgetRequest.findUnique({
        where: { id: requestId },
        include: {
          items: true,
          comments: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
          agent: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          validator: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      if (!request) {
        return {
          success: false,
          error: 'Demande non trouvée',
        };
      }

      return {
        success: true,
        data: {
          id: request.id,
          agentId: request.agentId,
          agentName: request.agentName,
          department: request.department,
          category: request.category,
          title: request.title,
          description: request.description,
          amount: request.amount,
          justification: request.justification,
          urgency: request.urgency,
          accountCode: request.accountCode ?? undefined,
          attachments: request.attachments,
          status: request.status,
          comments: request.comments.map(comment => ({
            id: comment.id,
            userId: comment.userId,
            userName: `${comment.user.firstName} ${comment.user.lastName}`,
            content: comment.content,
            createdAt: comment.createdAt.toISOString(),
          })),
          items: request.items.map(item => ({
            id: item.id,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
          })),
          createdAt: request.createdAt.toISOString(),
          updatedAt: request.updatedAt.toISOString(),
          validatedBy: request.validatedBy || undefined,
          validatedAt: request.validatedAt?.toISOString(),
        },
      };
    } catch (error) {
      console.error('Erreur lors de la récupération de la demande:', error);
      return {
        success: false,
        error: 'Erreur interne du serveur',
      };
    }
  }

  // Récupérer les demandes avec filtres et pagination
  static async getRequests(
    filters: BudgetRequestFilters = {},
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<PaginatedResponse<BudgetRequest>>> {
    try {
      const skip = (page - 1) * limit;
      
      // Construire les filtres Prisma
      const where: any = {};
      
      if (filters.status) where.status = filters.status;
      if (filters.department) where.department = filters.department;
      if (filters.agentId) where.agentId = filters.agentId;
      if (filters.urgency) where.urgency = filters.urgency;
      if (filters.amountMin || filters.amountMax) {
        where.amount = {};
        if (filters.amountMin) where.amount.gte = filters.amountMin;
        if (filters.amountMax) where.amount.lte = filters.amountMax;
      }
      if (filters.dateFrom || filters.dateTo) {
        where.createdAt = {};
        if (filters.dateFrom) where.createdAt.gte = new Date(filters.dateFrom);
        if (filters.dateTo) where.createdAt.lte = new Date(filters.dateTo);
      }

      // Compter le total
      const total = await prisma.budgetRequest.count({ where });
      
      // Récupérer les demandes
      const requests = await prisma.budgetRequest.findMany({
        where,
        include: {
          items: true,
          comments: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
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
          data: requests.map(request => ({
            id: request.id,
            agentId: request.agentId,
            agentName: request.agentName,
            department: request.department,
            category: request.category,
            title: request.title,
            description: request.description,
            amount: request.amount,
            justification: request.justification,
            urgency: request.urgency,
            accountCode: request.accountCode ?? undefined,
            attachments: request.attachments,
            status: request.status,
            comments: request.comments.map(comment => ({
              id: comment.id,
              userId: comment.userId,
              userName: `${comment.user.firstName} ${comment.user.lastName}`,
              content: comment.content,
              createdAt: comment.createdAt.toISOString(),
            })),
            items: request.items.map(item => ({
              id: item.id,
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice,
            })),
            createdAt: request.createdAt.toISOString(),
            updatedAt: request.updatedAt.toISOString(),
            validatedBy: request.validatedBy || undefined,
            validatedAt: request.validatedAt?.toISOString(),
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
      console.error('Erreur lors de la récupération des demandes:', error);
      return {
        success: false,
        error: 'Erreur interne du serveur',
      };
    }
  }

  // Mettre à jour une demande
  static async updateRequest(
    requestId: string, 
    updates: UpdateBudgetRequestRequest
  ): Promise<ApiResponse<BudgetRequest>> {
    try {
      const { items, ...updateData } = updates;

      // Vérifier si la demande existe
      const existingRequest = await prisma.budgetRequest.findUnique({
        where: { id: requestId },
      });

      if (!existingRequest) {
        return {
          success: false,
          error: 'Demande non trouvée',
        };
      }

      // Vérifier si la demande peut être modifiée
      if (existingRequest.status !== 'draft' && existingRequest.status !== 'submitted') {
        return {
          success: false,
          error: 'Cette demande ne peut plus être modifiée',
        };
      }

      // Mettre à jour la demande
      const updatedRequest = await prisma.budgetRequest.update({
        where: { id: requestId },
        data: {
          ...updateData,
          updatedAt: new Date(),
        },
        include: {
          items: true,
          comments: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      });

      // Mettre à jour les éléments si fournis
      if (items) {
        // Supprimer les anciens éléments
        await prisma.requestItem.deleteMany({
          where: { requestId },
        });

        // Créer les nouveaux éléments
        await prisma.requestItem.createMany({
          data: items.map(item => ({
            requestId,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
          })),
        });

        // Récupérer les éléments mis à jour
        const updatedItems = await prisma.requestItem.findMany({
          where: { requestId },
        });

        updatedRequest.items = updatedItems;
      }

      return {
        success: true,
        data: {
          id: updatedRequest.id,
          agentId: updatedRequest.agentId,
          agentName: updatedRequest.agentName,
          department: updatedRequest.department,
          category: updatedRequest.category,
          title: updatedRequest.title,
          description: updatedRequest.description,
          amount: updatedRequest.amount,
          justification: updatedRequest.justification,
          urgency: updatedRequest.urgency,
          accountCode: updatedRequest.accountCode ?? undefined,
          attachments: updatedRequest.attachments,
          status: updatedRequest.status,
          comments: updatedRequest.comments.map(comment => ({
            id: comment.id,
            userId: comment.userId,
            userName: `${comment.user.firstName} ${comment.user.lastName}`,
            content: comment.content,
            createdAt: comment.createdAt.toISOString(),
          })),
          items: updatedRequest.items.map(item => ({
            id: item.id,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
          })),
          createdAt: updatedRequest.createdAt.toISOString(),
          updatedAt: updatedRequest.updatedAt.toISOString(),
          validatedBy: updatedRequest.validatedBy || undefined,
          validatedAt: updatedRequest.validatedAt?.toISOString(),
        },
        message: 'Demande mise à jour avec succès',
      };
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la demande:', error);
      return {
        success: false,
        error: 'Erreur interne du serveur',
      };
    }
  }

  // Mettre à jour le statut d'une demande
  static async updateRequestStatus(
    requestId: string,
    statusUpdate: UpdateRequestStatusRequest,
    userId: string
  ): Promise<ApiResponse<BudgetRequest>> {
    try {
      const { status, comment } = statusUpdate;

      // Vérifier si la demande existe
      const existingRequest = await prisma.budgetRequest.findUnique({
        where: { id: requestId },
      });

      if (!existingRequest) {
        return {
          success: false,
          error: 'Demande non trouvée',
        };
      }

      // Vérifier si la transition de statut est valide
      const validTransitions = config.workflow.statusFlow[existingRequest.status as keyof typeof config.workflow.statusFlow] || [];
      const isValidTransition = validTransitions.length === 0 || (validTransitions as string[]).includes(status);
      if (!isValidTransition) {
        return {
          success: false,
          error: 'Transition de statut non autorisée',
        };
      }

      // Mettre à jour le statut
      const updateData: any = {
        status,
        updatedAt: new Date(),
      };

      // Si le statut implique une validation, ajouter les informations de validation
      if (status.includes('approved') || status.includes('rejected')) {
        updateData.validatedBy = userId;
        updateData.validatedAt = new Date();
      }

      const updatedRequest = await prisma.budgetRequest.update({
        where: { id: requestId },
        data: updateData,
        include: {
          items: true,
          comments: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      });

      // Ajouter un commentaire si fourni
      if (comment) {
        const user = await prisma.user.findUnique({
          where: { id: userId },
        });

        await prisma.comment.create({
          data: {
            requestId,
            userId,
            userName: `${user?.firstName} ${user?.lastName}`,
            content: comment,
          },
        });
      }

      return {
        success: true,
        data: {
          id: updatedRequest.id,
          agentId: updatedRequest.agentId,
          agentName: updatedRequest.agentName,
          department: updatedRequest.department,
          category: updatedRequest.category,
          title: updatedRequest.title,
          description: updatedRequest.description,
          amount: updatedRequest.amount,
          justification: updatedRequest.justification,
          urgency: updatedRequest.urgency,
          accountCode: updatedRequest.accountCode ?? undefined,
          attachments: updatedRequest.attachments,
          status: updatedRequest.status,
          comments: updatedRequest.comments.map(comment => ({
            id: comment.id,
            userId: comment.userId,
            userName: `${comment.user.firstName} ${comment.user.lastName}`,
            content: comment.content,
            createdAt: comment.createdAt.toISOString(),
          })),
          items: updatedRequest.items.map(item => ({
            id: item.id,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
          })),
          createdAt: updatedRequest.createdAt.toISOString(),
          updatedAt: updatedRequest.updatedAt.toISOString(),
          validatedBy: updatedRequest.validatedBy || undefined,
          validatedAt: updatedRequest.validatedAt?.toISOString(),
        },
        message: 'Statut de la demande mis à jour avec succès',
      };
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      return {
        success: false,
        error: 'Erreur interne du serveur',
      };
    }
  }

  // Supprimer une demande
  static async deleteRequest(requestId: string): Promise<ApiResponse<void>> {
    try {
      // Vérifier si la demande existe
      const existingRequest = await prisma.budgetRequest.findUnique({
        where: { id: requestId },
      });

      if (!existingRequest) {
        return {
          success: false,
          error: 'Demande non trouvée',
        };
      }

      // Vérifier si la demande peut être supprimée
      if (existingRequest.status !== 'draft') {
        return {
          success: false,
          error: 'Seules les demandes en brouillon peuvent être supprimées',
        };
      }

      // Supprimer la demande (les éléments et commentaires seront supprimés automatiquement via CASCADE)
      await prisma.budgetRequest.delete({
        where: { id: requestId },
      });

      return {
        success: true,
        message: 'Demande supprimée avec succès',
      };
    } catch (error) {
      console.error('Erreur lors de la suppression de la demande:', error);
      return {
        success: false,
        error: 'Erreur interne du serveur',
      };
    }
  }
} 