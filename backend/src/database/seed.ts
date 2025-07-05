import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../utils/auth';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding...');

  // Créer le super administrateur
  const superAdmin = {
    email: 'serigne.mame.sarr@esp.sn',
    firstName: 'Serigne Mame',
    lastName: 'Sarr',
    role: 'admin',
    password: 'superadmin123',
  };

  const hashedPassword = await hashPassword(superAdmin.password);
  
  await prisma.user.upsert({
    where: { email: superAdmin.email },
    update: {},
    create: {
      ...superAdmin,
      password: hashedPassword,
      role: superAdmin.role as any,
    },
  });

  console.log('✅ Super administrateur créé avec succès!');
  console.log('📧 Email: serigne.mame.sarr@esp.sn');
  console.log('🔑 Mot de passe: superadmin123');
  console.log('');
  console.log('⚠️  IMPORTANT: Changez ce mot de passe après la première connexion!');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 