import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../utils/auth';

const prisma = new PrismaClient();

async function resetPassword() {
  const email = process.argv[2];
  const newPassword = process.argv[3];

  if (!email || !newPassword) {
    console.log('Usage: npm run reset-password <email> <new-password>');
    console.log('Example: npm run reset-password user@example.com newpassword123');
    process.exit(1);
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log(`❌ Utilisateur avec l'email ${email} non trouvé`);
      process.exit(1);
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    console.log(`✅ Mot de passe réinitialisé pour ${email}`);
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Nouveau mot de passe: ${newPassword}`);
  } catch (error) {
    console.error('❌ Erreur lors de la réinitialisation:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetPassword(); 