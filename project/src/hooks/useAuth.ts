import { create } from 'zustand';
import { User, UserRole } from '../types';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

// Mock users for demonstration - Including default super admin
const mockUsers: Record<string, { password: string; user: User }> = {
  // Super Admin par défaut - OBLIGATOIRE pour l'initialisation
  'admin@esp.sn': {
    password: 'admin123',
    user: {
      id: 'admin-1',
      email: 'admin@esp.sn',
      firstName: 'Super',
      lastName: 'Administrateur',
      role: 'admin',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z'
    }
  },
  // Comptes de démonstration pour chaque rôle
  'agent@esp.sn': {
    password: 'agent123',
    user: {
      id: '1',
      email: 'agent@esp.sn',
      firstName: 'Amadou',
      lastName: 'Diallo',
      role: 'agent',
      department: 'Informatique',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z'
    }
  },
  'chef@esp.sn': {
    password: 'chef123',
    user: {
      id: '2',
      email: 'chef@esp.sn',
      firstName: 'Fatou',
      lastName: 'Sall',
      role: 'chef_departement',
      department: 'Informatique',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z'
    }
  },
  'direction@esp.sn': {
    password: 'direction123',
    user: {
      id: '3',
      email: 'direction@esp.sn',
      firstName: 'Ousmane',
      lastName: 'Ba',
      role: 'direction',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z'
    }
  },
  'recteur@esp.sn': {
    password: 'recteur123',
    user: {
      id: '4',
      email: 'recteur@esp.sn',
      firstName: 'Professeur',
      lastName: 'Ndiaye',
      role: 'recteur',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z'
    }
  },
  'auditeur@esp.sn': {
    password: 'audit123',
    user: {
      id: '5',
      email: 'auditeur@esp.sn',
      firstName: 'Aïcha',
      lastName: 'Mbaye',
      role: 'auditeur',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z'
    }
  }
};

export const useAuth = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser = mockUsers[email];
    if (mockUser && mockUser.password === password) {
      const user = { ...mockUser.user, lastLogin: new Date().toISOString() };
      set({ user, isAuthenticated: true, isLoading: false });
      localStorage.setItem('esp_user', JSON.stringify(user));
    } else {
      set({ isLoading: false });
      throw new Error('Identifiants invalides. Vérifiez votre email et mot de passe.');
    }
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
    localStorage.removeItem('esp_user');
  },

  updateUser: (userData) => {
    const currentUser = get().user;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      set({ user: updatedUser });
      localStorage.setItem('esp_user', JSON.stringify(updatedUser));
    }
  }
}));

// Initialize auth state from localStorage
const storedUser = localStorage.getItem('esp_user');
if (storedUser) {
  try {
    const user = JSON.parse(storedUser);
    useAuth.setState({ user, isAuthenticated: true });
  } catch (error) {
    localStorage.removeItem('esp_user');
  }
}