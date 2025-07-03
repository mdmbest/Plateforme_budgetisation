import { create } from 'zustand';
import { User, UserRole } from '../types';

interface UsersStore {
  users: User[];
  isLoading: boolean;
  createUser: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<void>;
  updateUser: (userId: string, userData: Partial<User>) => void;
  deleteUser: (userId: string) => void;
  getUsersByRole: (role: UserRole) => User[];
  getUsersByDepartment: (department: string) => User[];
  sendCredentials: (userId: string, method: 'email' | 'sms') => Promise<void>;
}

// Mock users data with expanded list
const mockUsers: User[] = [
  {
    id: 'admin-1',
    email: 'admin@esp.sn',
    firstName: 'Super',
    lastName: 'Administrateur',
    role: 'admin',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '1',
    email: 'agent@esp.sn',
    firstName: 'Amadou',
    lastName: 'Diallo',
    role: 'agent',
    department: 'Informatique',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'chef@esp.sn',
    firstName: 'Fatou',
    lastName: 'Sall',
    role: 'chef_departement',
    department: 'Informatique',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    email: 'direction@esp.sn',
    firstName: 'Ousmane',
    lastName: 'Ba',
    role: 'direction',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    email: 'recteur@esp.sn',
    firstName: 'Professeur',
    lastName: 'Ndiaye',
    role: 'recteur',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    email: 'auditeur@esp.sn',
    firstName: 'Aïcha',
    lastName: 'Mbaye',
    role: 'auditeur',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  }
];

export const useUsers = create<UsersStore>((set, get) => ({
  users: mockUsers,
  isLoading: false,

  createUser: async (userData) => {
    set({ isLoading: true });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    set(state => ({
      users: [...state.users, newUser],
      isLoading: false
    }));
  },

  updateUser: (userId, userData) => {
    set(state => ({
      users: state.users.map(user =>
        user.id === userId ? { ...user, ...userData } : user
      )
    }));
  },

  deleteUser: (userId) => {
    set(state => ({
      users: state.users.filter(user => user.id !== userId)
    }));
  },

  getUsersByRole: (role) => {
    return get().users.filter(user => user.role === role);
  },

  getUsersByDepartment: (department) => {
    return get().users.filter(user => user.department === department);
  },

  sendCredentials: async (userId, method) => {
    const user = get().users.find(u => u.id === userId);
    if (!user) return;

    // Simulate sending credentials
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (method === 'email') {
      console.log(`Credentials sent to ${user.email}`);
    } else {
      console.log(`Credentials sent via SMS to user ${user.firstName} ${user.lastName}`);
    }
  }
}));