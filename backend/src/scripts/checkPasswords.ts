import { PrismaClient } from '@prisma/client';
import { comparePassword } from '../utils/auth';

const prisma = new PrismaClient();

async function checkPasswords() {
  console.log('🔍 Vérification des mots de passe...');

  const testPasswords = [
    { email: 'admin@esp.sn', password: 'admin123' },
    { email: 'agent@esp.sn', password: 'agent123' },
    { email: 'chef@esp.sn', password: 'chef123' },
    { email: 'direction@esp.sn', password: 'direction123' },
    { email: 'recteur@esp.sn', password: 'recteur123' },
    { email: 'auditeur@esp.sn', password: 'audit123' },
  ];

  for (const test of testPasswords) {
    const user = await prisma.user.findUnique({
      where: { email: test.email },
    });

    if (user) {
      const isValid = await comparePassword(test.password, user.password);
      console.log(`${test.email}: ${isValid ? '✅' : '❌'} (${isValid ? 'Valide' : 'Invalide'})`);
    } else {
      console.log(`${test.email}: ❌ (Utilisateur non trouvé)`);
    }
  }

  await prisma.$disconnect();
}

checkPasswords().catch(console.error); 