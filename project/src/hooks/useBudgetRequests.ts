import { create } from 'zustand';
import { BudgetRequest, RequestStatus, RequestItem } from '../types';

interface BudgetRequestStore {
  requests: BudgetRequest[];
  isLoading: boolean;
  addRequest: (request: Omit<BudgetRequest, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => void;
  updateRequestStatus: (requestId: string, status: RequestStatus, comment?: string) => void;
  getRequestsByUser: (userId: string) => BudgetRequest[];
  getRequestsByDepartment: (department: string) => BudgetRequest[];
  getRequestsByStatus: (status: RequestStatus) => BudgetRequest[];
  updateRequest: (requestId: string, updates: Partial<BudgetRequest>) => void;
  deleteRequest: (requestId: string) => void;
}

// Mock data for demonstration with items
const mockRequests: BudgetRequest[] = [
  {
    id: '1',
    agentId: '1',
    agentName: 'Amadou Diallo',
    department: 'Informatique',
    category: 'Équipement',
    title: 'Ordinateurs portables pour laboratoire',
    description: 'Achat de 10 ordinateurs portables pour le laboratoire d\'informatique',
    amount: 5000000,
    justification: 'Les anciens ordinateurs sont obsolètes et ne supportent plus les logiciels récents',
    urgency: 'high',
    accountCode: '2441001',
    status: 'chef_review',
    comments: [],
    items: [
      {
        id: '1',
        description: 'Ordinateur portable HP EliteBook',
        quantity: 10,
        unitPrice: 500000,
        totalPrice: 5000000
      }
    ],
    createdAt: '2024-12-01T10:00:00Z',
    updatedAt: '2024-12-01T10:00:00Z'
  },
  {
    id: '2',
    agentId: '1',
    agentName: 'Amadou Diallo',
    department: 'Informatique',
    category: 'Formation',
    title: 'Formation en cybersécurité',
    description: 'Formation des enseignants en cybersécurité et sécurité informatique',
    amount: 2000000,
    justification: 'Mise à niveau des compétences pour enseigner les nouvelles technologies',
    urgency: 'medium',
    accountCode: '6241001',
    status: 'submitted',
    comments: [],
    items: [
      {
        id: '2',
        description: 'Formation cybersécurité - 5 jours',
        quantity: 1,
        unitPrice: 2000000,
        totalPrice: 2000000
      }
    ],
    createdAt: '2024-12-02T14:30:00Z',
    updatedAt: '2024-12-02T14:30:00Z'
  }
];

export const useBudgetRequests = create<BudgetRequestStore>((set, get) => ({
  requests: mockRequests,
  isLoading: false,

  addRequest: (requestData) => {
    const newRequest: BudgetRequest = {
      ...requestData,
      id: Date.now().toString(),
      status: requestData.status || 'draft',
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    set(state => ({
      requests: [...state.requests, newRequest]
    }));
  },

  updateRequestStatus: (requestId, status, comment) => {
    set(state => ({
      requests: state.requests.map(request => {
        if (request.id === requestId) {
          const updatedRequest = {
            ...request,
            status,
            updatedAt: new Date().toISOString()
          };

          if (comment) {
            updatedRequest.comments = [
              ...request.comments,
              {
                id: Date.now().toString(),
                userId: 'current-user',
                userName: 'Current User',
                content: comment,
                createdAt: new Date().toISOString()
              }
            ];
          }

          return updatedRequest;
        }
        return request;
      })
    }));
  },

  updateRequest: (requestId, updates) => {
    set(state => ({
      requests: state.requests.map(request =>
        request.id === requestId
          ? { ...request, ...updates, updatedAt: new Date().toISOString() }
          : request
      )
    }));
  },

  deleteRequest: (requestId) => {
    set(state => ({
      requests: state.requests.filter(request => request.id !== requestId)
    }));
  },

  getRequestsByUser: (userId) => {
    return get().requests.filter(request => request.agentId === userId);
  },

  getRequestsByDepartment: (department) => {
    return get().requests.filter(request => request.department === department);
  },

  getRequestsByStatus: (status) => {
    return get().requests.filter(request => request.status === status);
  }
}));