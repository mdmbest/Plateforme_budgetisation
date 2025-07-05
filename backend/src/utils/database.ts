import { PrismaClient } from '@prisma/client';
import config from '../config';

// Instance Prisma avec logging en développement
const prisma = new PrismaClient({
  log: config.nodeEnv === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Fonction pour tester la connexion
export const testDatabaseConnection = async (): Promise<boolean> => {
  try {
    await prisma.$connect();
    console.log('✅ Connexion à la base de données réussie');
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données:', error);
    return false;
  }
};

// Fonction pour fermer la connexion
export const closeDatabaseConnection = async (): Promise<void> => {
  await prisma.$disconnect();
};

// Gestionnaire d'erreurs pour Prisma
prisma.$use(async (params, next) => {
  const before = Date.now();
  const result = await next(params);
  const after = Date.now();
  
  if (config.nodeEnv === 'development') {
    console.log(`Query ${params.model}.${params.action} took ${after - before}ms`);
  }
  
  return result;
});

export default prisma; 