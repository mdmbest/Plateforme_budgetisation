import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  BarChart3, 
  CheckCircle, 
  ArrowRight,
  Shield,
  Clock,
  FileText,
  Book,
  Building,
  Star,
  Award,
  Zap
} from 'lucide-react';
import { TypewriterText } from '../components/home/TypewriterText';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Logo } from '../components/ui/Logo';

interface HomePageProps {
  onLogin: () => void;
  onDocumentation: () => void;
}

const features = [
  {
    icon: <FileText className="text-blue-600" size={24} />,
    title: 'Saisie des Besoins',
    description: 'Interface intuitive pour les agents permettant de saisir leurs besoins budgétaires avec justifications et pièces jointes.'
  },
  {
    icon: <Users className="text-green-600" size={24} />,
    title: 'Workflow de Validation',
    description: 'Circuit de validation automatisé : Agent → Chef Département → Direction → Recteur avec traçabilité complète.'
  },
  {
    icon: <BarChart3 className="text-purple-600" size={24} />,
    title: 'Suivi Temps Réel',
    description: 'Tableaux de bord analytiques avec suivi des budgets, alertes de dépassement et rapports conformes OHADA.'
  },
  {
    icon: <Shield className="text-orange-600" size={24} />,
    title: 'Sécurité Renforcée',
    description: 'Authentification multi-rôles, signature électronique, et journalisation complète de toutes les opérations.'
  }
];

const stats = [
  { label: 'Départements', value: '8+', icon: <Building size={20} />, color: 'blue' },
  { label: 'Utilisateurs', value: '200+', icon: <Users size={20} />, color: 'green' },
  { label: 'Demandes/An', value: '1000+', icon: <FileText size={20} />, color: 'purple' },
  { label: 'Conformité', value: '100%', icon: <CheckCircle size={20} />, color: 'orange' }
];

const benefits = [
  {
    icon: <Zap className="text-yellow-500" size={24} />,
    title: 'Efficacité Maximale',
    description: 'Réduction de 80% du temps de traitement des demandes budgétaires'
  },
  {
    icon: <Shield className="text-green-500" size={24} />,
    title: 'Conformité Totale',
    description: 'Respect intégral des normes OHADA et des procédures institutionnelles'
  },
  {
    icon: <Award className="text-blue-500" size={24} />,
    title: 'Transparence',
    description: 'Traçabilité complète et audit en temps réel de toutes les opérations'
  }
];

export const HomePage: React.FC<HomePageProps> = ({ onLogin, onDocumentation }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo size="md" variant="full" />
            
            <div className="flex items-center gap-3">
              <Button onClick={onDocumentation} variant="outline">
                <Book size={16} />
                Documentation
              </Button>
              <Button onClick={onLogin} variant="primary">
                Se Connecter
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex justify-center mb-8">
                <div className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                  <Star size={16} />
                  Solution Certifiée OHADA
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Plateforme de
                <br />
                <TypewriterText
                  texts={[
                    'Gestion Budgétaire',
                    'Validation Automatisée',
                    'Suivi Financier',
                    'Conformité OHADA'
                  ]}
                />
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Solution complète et sécurisée pour la digitalisation du processus budgétaire 
                de l'École Supérieure Polytechnique. De la collecte des besoins à la signature 
                électronique rectorale.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={onLogin} size="lg" variant="primary">
                  <Users size={20} />
                  Accéder à la Plateforme
                </Button>
                <Button onClick={onDocumentation} size="lg" variant="outline">
                  <Book size={20} />
                  Documentation
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
          >
            {stats.map((stat, index) => (
              <Card key={index} className="text-center" hover>
                <div className={`flex items-center justify-center mb-3 text-${stat.color}-600`}>
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.label}
                </div>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Pourquoi Choisir ESP Budget ?
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Une solution pensée pour l'excellence opérationnelle et la conformité réglementaire
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="text-center h-full bg-white/10 backdrop-blur-sm border-white/20">
                  <div className="flex justify-center mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="font-semibold text-lg text-white mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-blue-100 leading-relaxed">
                    {benefit.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Fonctionnalités Principales
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une plateforme complète couvrant l'ensemble du cycle budgétaire avec 
              traçabilité, sécurité et conformité aux standards OHADA.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card hover className="h-full">
                  <div className="flex items-center mb-4">
                    {feature.icon}
                    <h3 className="font-semibold text-lg text-gray-900 ml-3">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Flow */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Workflow Automatisé
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Circuit de validation optimisé avec traçabilité complète et 
              notifications automatiques à chaque étape.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Agent', desc: 'Saisie des besoins', color: 'blue' },
              { step: '2', title: 'Chef Dept.', desc: 'Consolidation', color: 'green' },
              { step: '3', title: 'Direction', desc: 'Arbitrage global', color: 'purple' },
              { step: '4', title: 'Recteur', desc: 'Approbation finale', color: 'orange' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="text-center"
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-${item.color}-100 flex items-center justify-center`}>
                  <span className={`text-2xl font-bold text-${item.color}-600`}>
                    {item.step}
                  </span>
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.desc}
                </p>
                {index < 3 && (
                  <ArrowRight className="mx-auto mt-4 text-gray-400 hidden md:block" size={20} />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Prêt à Digitaliser Votre Processus Budgétaire ?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Rejoignez la transformation numérique de l'ESP avec une solution 
              sécurisée, conforme et efficace.
            </p>
            <Button onClick={onLogin} size="lg" variant="secondary">
              <Clock size={20} />
              Commencer Maintenant
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <Logo size="md" variant="full" className="mb-4 text-white" />
              <p className="text-gray-400">
                Plateforme de gestion budgétaire pour l'École Supérieure Polytechnique.
                Solution complète, sécurisée et conforme aux standards OHADA.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Fonctionnalités</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Saisie des besoins</li>
                <li>Workflow de validation</li>
                <li>Suivi temps réel</li>
                <li>Rapports OHADA</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Documentation</li>
                <li>Assistance technique</li>
                <li>Formation utilisateurs</li>
                <li>Contact DSI</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 École Supérieure Polytechnique. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};