import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';

// Configuration
import config from './config';
import { testDatabaseConnection } from './utils/database';

// Routes
import authRoutes from './routes/authRoutes';
import budgetRequestRoutes from './routes/budgetRequestRoutes';
import userRoutes from './routes/userRoutes';

// Charger les variables d'environnement
dotenv.config();

const app = express();

// Middleware de sécurité
app.use(helmet());

// Configuration CORS
app.use(cors({
  origin: config.cors.origin,
  credentials: config.cors.credentials,
}));

// Compression
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: config.security.rateLimitWindowMs,
  max: config.security.rateLimitMaxRequests,
  message: {
    success: false,
    error: 'Trop de requêtes, veuillez réessayer plus tard.',
  },
});
app.use('/api/', limiter);

// Logging
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Parser JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware pour logger les requêtes
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/requests', budgetRequestRoutes);
app.use('/api/users', userRoutes);

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Serveur opérationnel',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// Route racine
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API ESP Budget Platform',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      requests: '/api/requests',
      users: '/api/users',
      health: '/api/health',
    },
  });
});

// Middleware de gestion d'erreurs
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erreur non gérée:', err);
  
  res.status(500).json({
    success: false,
    error: config.nodeEnv === 'development' ? err.message : 'Erreur interne du serveur',
  });
});

// Middleware pour les routes non trouvées
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route non trouvée',
  });
});

// Fonction de démarrage du serveur
const startServer = async () => {
  try {
    // Tester la connexion à la base de données
    const dbConnected = await testDatabaseConnection();
    if (!dbConnected) {
      console.error('❌ Impossible de se connecter à la base de données');
      process.exit(1);
    }

    // Démarrer le serveur
    const PORT = config.port;
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
      console.log(`📊 Environnement: ${config.nodeEnv}`);
      console.log(`🔗 URL: http://localhost:${PORT}`);
      console.log(`📋 Documentation API: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

// Gestion de l'arrêt gracieux
process.on('SIGINT', () => {
  console.log('\n🛑 Arrêt du serveur...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Arrêt du serveur...');
  process.exit(0);
});

// Démarrer le serveur
startServer(); 