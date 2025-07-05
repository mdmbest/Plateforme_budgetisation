import prisma from '../utils/database';
import bcrypt from 'bcryptjs';

async function createDemoUsers() {
  try {
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const demoUsers = [
      {
        email: 'admin@esp.sn',
        firstName: 'Serigne Mame',
        lastName: 'Sarr',
        password: hashedPassword,
        role: 'admin',
        department: null,
        isActive: true,
      },
      {
        email: 'agent@esp.sn',
        firstName: 'MAME DIARRA',
        lastName: 'MBACKE',
        password: hashedPassword,
        role: 'agent',
        department: 'Informatique',
        isActive: true,
      },
      {
        email: 'chef@esp.sn',
        firstName: 'Chef',
        lastName: 'Département',
        password: hashedPassword,
        role: 'chef_departement',
        department: 'Informatique',
        isActive: true,
      },
      {
        email: 'direction@esp.sn',
        firstName: 'Direction',
        lastName: 'Générale',
        password: hashedPassword,
        role: 'direction',
        department: null,
        isActive: true,
      },
      {
        email: 'recteur@esp.sn',
        firstName: 'Recteur',
        lastName: 'ESP',
        password: hashedPassword,
        role: 'recteur',
        department: null,
        isActive: true,
      },
      {
        email: 'auditeur@esp.sn',
        firstName: 'Auditeur',
        lastName: 'Interne',
        password: hashedPassword,
        role: 'auditeur',
        department: null,
        isActive: true,
      }
    ];

    for (const userData of demoUsers) {
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (!existingUser) {
        const user = await prisma.user.create({
          data: userData,
        });
        console.log(`Utilisateur créé: ${user.email} (${user.firstName} ${user.lastName})`);
      } else {
        console.log(`Utilisateur existe déjà: ${userData.email}`);
      }
    }

    console.log('Script terminé !');
  } catch (error) {
    console.error('Erreur lors de la création des utilisateurs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createDemoUsers(); 