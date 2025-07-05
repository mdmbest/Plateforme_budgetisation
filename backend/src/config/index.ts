import dotenv from 'dotenv';
import path from 'path';

// Charger les variables d'environnement
dotenv.config({ path: path.join(__dirname, '../../.env') });

export const config = {
  // Configuration du serveur
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Configuration de la base de données
  database: {
    url: process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/esp_budget_db',
  },
  
  // Configuration JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-here',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  
  // Configuration Email
  email: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    secure: false,
  },
  
  // Configuration SMS (Twilio)
  sms: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || '',
    authToken: process.env.TWILIO_AUTH_TOKEN || '',
    phoneNumber: process.env.TWILIO_PHONE_NUMBER || '',
  },
  
  // Configuration Upload
  upload: {
    path: process.env.UPLOAD_PATH || './uploads',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
  },
  
  // Configuration Logs
  logs: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || './logs/app.log',
  },
  
  // Configuration Sécurité
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12'),
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  },
  
  // Configuration CORS
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  },
  
  // Configuration des rôles et permissions
  roles: {
    admin: ['*'],
    recteur: ['budget_requests.*', 'users.read', 'departments.read', 'reports.*'],
    direction: ['budget_requests.*', 'users.read', 'departments.read'],
    chef_departement: ['budget_requests.*', 'users.read'],
    agent: ['budget_requests.create', 'budget_requests.read_own', 'budget_requests.update_own'],
    auditeur: ['budget_requests.read', 'reports.*', 'audit_logs.*'],
  },
  
  // Configuration des statuts de workflow
  workflow: {
    statusFlow: {
      draft: ['submitted'],
      submitted: ['chef_review', 'chef_rejected'],
      chef_review: ['chef_approved', 'chef_rejected'],
      chef_approved: ['direction_review', 'direction_rejected'],
      chef_rejected: ['draft'],
      direction_review: ['direction_approved', 'direction_rejected'],
      direction_approved: ['recteur_review', 'recteur_rejected'],
      direction_rejected: ['draft'],
      recteur_review: ['recteur_approved', 'recteur_rejected'],
      recteur_approved: ['executed'],
      recteur_rejected: ['draft'],
      executed: [],
    },
  },
};

export default config; 