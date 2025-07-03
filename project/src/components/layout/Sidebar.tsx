import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  FileText, 
  Users, 
  BarChart3, 
  Settings, 
  Bell,
  LogOut,
  DollarSign,
  CheckSquare,
  UserCheck,
  Plus,
  FolderOpen,
  TrendingUp,
  Shield,
  X
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types';
import { Logo } from '../ui/Logo';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
  onNavigate: (path: string) => void;
}

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  roles: UserRole[];
  badge?: string;
}

const menuItems: MenuItem[] = [
  {
    icon: <Home size={20} />,
    label: 'Tableau de bord',
    path: '/dashboard',
    roles: ['agent', 'chef_departement', 'direction', 'recteur', 'auditeur', 'admin']
  },
  {
    icon: <FileText size={20} />,
    label: 'Mes demandes',
    path: '/requests',
    roles: ['agent']
  },
  {
    icon: <Plus size={20} />,
    label: 'Nouvelle demande',
    path: '/new-request',
    roles: ['agent']
  },
  {
    icon: <FolderOpen size={20} />,
    label: 'Gestion Département',
    path: '/department',
    roles: ['chef_departement']
  },
  {
    icon: <CheckSquare size={20} />,
    label: 'Validation Demandes',
    path: '/validation',
    roles: ['chef_departement', 'direction']
  },
  {
    icon: <DollarSign size={20} />,
    label: 'Budget Global',
    path: '/budget',
    roles: ['direction', 'recteur']
  },
  {
    icon: <UserCheck size={20} />,
    label: 'Approbation Rectorale',
    path: '/approval',
    roles: ['recteur']
  },
  {
    icon: <TrendingUp size={20} />,
    label: 'Exécution Budgétaire',
    path: '/execution',
    roles: ['direction', 'recteur', 'admin']
  },
  {
    icon: <BarChart3 size={20} />,
    label: 'Rapports et Analyses',
    path: '/reports',
    roles: ['direction', 'recteur', 'auditeur']
  },
  {
    icon: <Shield size={20} />,
    label: 'Interface Audit',
    path: '/audit',
    roles: ['auditeur']
  },
  {
    icon: <Users size={20} />,
    label: 'Gestion Utilisateurs',
    path: '/users',
    roles: ['admin']
  },
  {
    icon: <Settings size={20} />,
    label: 'Paramètres Système',
    path: '/settings',
    roles: ['admin']
  }
];

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  currentPath,
  onNavigate
}) => {
  const { user, logout } = useAuth();

  const availableMenuItems = menuItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  const handleBackToHome = () => {
    logout();
    window.location.reload();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative left-0 top-0 h-full w-80 bg-white shadow-2xl z-50 
        transform transition-all duration-300 ease-in-out
        lg:transform-none lg:shadow-xl lg:border-r border-gray-200
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800">
            <div className="flex items-center justify-between">
              <motion.button
                onClick={handleBackToHome}
                className="flex items-center text-left group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Logo size="md" variant="full" className="text-white" />
              </motion.button>
              
              {/* Close button for mobile */}
              <button
                onClick={onClose}
                className="lg:hidden p-2 rounded-xl text-white hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* User info */}
          {user && (
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-semibold">
                    {user.firstName[0]}{user.lastName[0]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-600 capitalize">
                    {user.role.replace('_', ' ')}
                  </p>
                  {user.department && (
                    <p className="text-xs text-blue-600 font-medium">
                      Dép. {user.department}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
            {availableMenuItems.map((item) => (
              <motion.button
                key={item.path}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                  currentPath === item.path
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <div className={`${
                  currentPath === item.path 
                    ? 'text-white' 
                    : 'text-gray-500'
                }`}>
                  {item.icon}
                </div>
                <span className="font-medium flex-1">{item.label}</span>
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    {item.badge}
                  </span>
                )}
              </motion.button>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 space-y-3 bg-gray-50">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-white hover:text-gray-900 transition-all duration-200">
              <Bell size={20} className="text-gray-500" />
              <span className="font-medium">Notifications</span>
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-auto font-medium">
                3
              </span>
            </button>
            
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200"
            >
              <LogOut size={20} />
              <span className="font-medium">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};