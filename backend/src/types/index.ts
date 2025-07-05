import { Request } from 'express';

// Types de base
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export type UserRole = 'agent' | 'chef_departement' | 'direction' | 'recteur' | 'auditeur' | 'admin';

export interface RequestItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface BudgetRequest {
  id: string;
  agentId: string;
  agentName: string;
  department: string;
  category: string;
  title: string;
  description: string;
  amount: number;
  justification: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  accountCode?: string | null;
  attachments?: string[];
  status: RequestStatus;
  comments: Comment[];
  items?: RequestItem[];
  createdAt: string;
  updatedAt: string;
  validatedBy?: string;
  validatedAt?: string;
}

export type RequestStatus = 'draft' | 'submitted' | 'chef_review' | 'chef_approved' | 'chef_rejected' | 
                           'direction_review' | 'direction_approved' | 'direction_rejected' |
                           'recteur_review' | 'recteur_approved' | 'recteur_rejected' | 'executed';

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  chefId: string;
  chefName: string;
  totalBudget: number;
  usedBudget: number;
}

export interface BudgetSummary {
  totalRequests: number;
  totalAmount: number;
  approvedAmount: number;
  pendingAmount: number;
  rejectedAmount: number;
  executedAmount: number;
}

export interface OhadaAccount {
  code: string;
  name: string;
  category: string;
  description: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

export interface BudgetExecution {
  id: string;
  requestId: string;
  supplierId: string;
  supplierName: string;
  invoiceNumber: string;
  invoiceDate: string;
  amount: number;
  status: 'pending' | 'paid' | 'cancelled';
  paymentDate?: string;
  deliveryDate?: string;
  receivedBy?: string;
}

// Types pour les requêtes API
export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department?: string;
  password?: string;
}

export interface CreateBudgetRequestRequest {
  agentId: string;
  agentName: string;
  department: string;
  category: string;
  title: string;
  description: string;
  amount: number;
  justification: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  accountCode?: string | null;
  items?: Omit<RequestItem, 'id'>[];
}

export interface UpdateBudgetRequestRequest {
  title?: string;
  description?: string;
  amount?: number;
  justification?: string;
  urgency?: 'low' | 'medium' | 'high' | 'critical';
  accountCode?: string;
  items?: Omit<RequestItem, 'id'>[];
}

export interface UpdateRequestStatusRequest {
  status: RequestStatus;
  comment?: string;
}

// Types pour les réponses API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Types pour l'authentification
export interface AuthenticatedRequest extends Request {
  user?: User;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

// Types pour les filtres
export interface BudgetRequestFilters {
  status?: RequestStatus;
  department?: string;
  agentId?: string;
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
  urgency?: 'low' | 'medium' | 'high' | 'critical';
}

export interface UserFilters {
  role?: UserRole;
  department?: string;
  isActive?: boolean;
}

// Types pour les statistiques
export interface DashboardStats {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  totalAmount: number;
  approvedAmount: number;
  pendingAmount: number;
  rejectedAmount: number;
}

export interface DepartmentStats {
  departmentId: string;
  departmentName: string;
  totalRequests: number;
  totalAmount: number;
  approvedAmount: number;
  pendingAmount: number;
  usedBudget: number;
  remainingBudget: number;
}

// Types pour les notifications
export interface CreateNotificationRequest {
  userId: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  actionUrl?: string;
}

// Types pour les logs d'audit
export interface CreateAuditLogRequest {
  userId: string;
  userName: string;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  ipAddress?: string;
} 