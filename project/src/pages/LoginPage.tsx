import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Info, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Logo } from '../components/ui/Logo';

interface LoginPageProps {
  onBack: () => void;
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onBack, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showCredentials, setShowCredentials] = useState(false);
  
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      onLoginSuccess();
    } catch (err) {
      setError('Identifiants invalides. Veuillez réessayer.');
    }
  };

  const demoAccounts = [
    { role: 'Super Admin', email: 'admin@esp.sn', password: 'admin123', color: 'red' },
    { role: 'Agent', email: 'agent@esp.sn', password: 'agent123', color: 'blue' },
    { role: 'Chef Département', email: 'chef@esp.sn', password: 'chef123', color: 'green' },
    { role: 'Direction', email: 'direction@esp.sn', password: 'direction123', color: 'purple' },
    { role: 'Recteur', email: 'recteur@esp.sn', password: 'recteur123', color: 'orange' },
    { role: 'Auditeur', email: 'auditeur@esp.sn', password: 'audit123', color: 'indigo' }
  ];

  const quickLogin = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back button */}
        <motion.button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          whileHover={{ x: -4 }}
        >
          <ArrowLeft size={20} />
          Retour à l'accueil
        </motion.button>

        <Card className="w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <Logo size="lg" variant="full" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              Connexion ESP Budget
            </h1>
            <p className="text-sm text-gray-600">
              Accédez à votre espace de gestion budgétaire
            </p>
            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
              <Shield size={16} />
              <span>Connexion sécurisée</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm"
              >
                {error}
              </motion.div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="votre.email@esp.sn"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              Se connecter
            </Button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => setShowCredentials(!showCredentials)}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 mb-4 transition-colors"
            >
              <Info size={16} />
              {showCredentials ? 'Masquer' : 'Voir'} les comptes de démonstration
            </button>
            
            {showCredentials && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-3"
              >
                <p className="text-xs text-gray-600 mb-4">
                  Cliquez sur un compte pour remplir automatiquement les champs :
                </p>
                <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto">
                  {demoAccounts.map((account, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => quickLogin(account.email, account.password)}
                      className="text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 border border-gray-200 hover:border-gray-300"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 bg-${account.color}-500 rounded-full`} />
                        <div>
                          <div className="font-medium text-sm text-gray-900">{account.role}</div>
                          <div className="text-xs text-gray-600">{account.email}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Help text */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Problème de connexion ? Contactez l'administrateur système
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};