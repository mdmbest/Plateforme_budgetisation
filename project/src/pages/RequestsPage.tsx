import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useBudgetRequests } from '../hooks/useBudgetRequests';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { formatCurrency, formatDateShort } from '../utils/formatters';

export const RequestsPage: React.FC = () => {
  const { user } = useAuth();
  const { requests } = useBudgetRequests();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const userRequests = requests.filter(r => r.agentId === user?.id);

  const filteredRequests = userRequests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    if (status.includes('approved')) return 'success';
    if (status.includes('rejected')) return 'danger';
    if (status.includes('review')) return 'warning';
    return 'default';
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'draft': 'Brouillon',
      'submitted': 'Soumise',
      'chef_review': 'En validation (Chef)',
      'chef_approved': 'Approuvée par le Chef',
      'chef_rejected': 'Rejetée par le Chef',
      'direction_review': 'En validation (Direction)',
      'direction_approved': 'Approuvée par la Direction',
      'direction_rejected': 'Rejetée par la Direction',
      'recteur_review': 'En validation (Recteur)',
      'recteur_approved': 'Approuvée par le Recteur',
      'recteur_rejected': 'Rejetée par le Recteur',
      'executed': 'Exécutée'
    };
    return statusMap[status] || status;
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  const getUrgencyText = (urgency: string) => {
    const urgencyMap: Record<string, string> = {
      'critical': 'Critique',
      'high': 'Élevée',
      'medium': 'Moyenne',
      'low': 'Faible'
    };
    return urgencyMap[urgency] || urgency;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes Demandes Budgétaires</h1>
          <p className="text-gray-600">
            Gérez et suivez l'état de vos demandes budgétaires
          </p>
        </div>
        <Button variant="primary" icon={<Plus size={20} />}>
          Nouvelle Demande
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            title: 'Total Demandes',
            value: userRequests.length.toString(),
            icon: <FileText className="text-blue-600" size={24} />,
            color: 'blue'
          },
          {
            title: 'En Attente',
            value: userRequests.filter(r => r.status.includes('review')).length.toString(),
            icon: <Calendar className="text-yellow-600" size={24} />,
            color: 'yellow'
          },
          {
            title: 'Approuvées',
            value: userRequests.filter(r => r.status.includes('approved')).length.toString(),
            icon: <FileText className="text-green-600" size={24} />,
            color: 'green'
          },
          {
            title: 'Montant Total',
            value: formatCurrency(userRequests.reduce((sum, r) => sum + r.amount, 0)),
            icon: <DollarSign className="text-purple-600" size={24} />,
            color: 'purple'
          }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card hover className="relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-gray-50">
                  {stat.icon}
                </div>
              </div>
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-${stat.color}-500`} />
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Rechercher une demande..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="draft">Brouillon</option>
              <option value="submitted">Soumise</option>
              <option value="chef_review">En validation (Chef)</option>
              <option value="direction_review">En validation (Direction)</option>
              <option value="recteur_review">En validation (Recteur)</option>
              <option value="chef_approved">Approuvée</option>
              <option value="rejected">Rejetée</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <Card className="text-center py-12">
            <FileText className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune demande trouvée
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Aucune demande ne correspond à vos critères de recherche.'
                : 'Vous n\'avez pas encore créé de demande budgétaire.'
              }
            </p>
            <Button variant="primary" icon={<Plus size={20} />}>
              Créer ma première demande
            </Button>
          </Card>
        ) : (
          filteredRequests.map((request) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              layout
            >
              <Card hover className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {request.title}
                        </h3>
                        <p className="text-gray-600 mb-3 line-clamp-2">
                          {request.description}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {formatDateShort(request.createdAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign size={14} />
                            {formatCurrency(request.amount)}
                          </span>
                          <span>Catégorie: {request.category}</span>
                          <span>Code: {request.accountCode}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant={getStatusColor(request.status)}>
                          {getStatusText(request.status)}
                        </Badge>
                        <Badge variant={getUrgencyColor(request.urgency)} size="sm">
                          {getUrgencyText(request.urgency)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <div className="text-sm text-gray-500">
                    Dernière mise à jour: {formatDateShort(request.updatedAt)}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" icon={<Eye size={16} />}>
                      Voir
                    </Button>
                    {(request.status === 'draft' || request.status === 'chef_rejected') && (
                      <Button variant="ghost" size="sm" icon={<Edit size={16} />}>
                        Modifier
                      </Button>
                    )}
                    {request.status === 'draft' && (
                      <Button variant="ghost" size="sm" icon={<Trash2 size={16} />}>
                        Supprimer
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};