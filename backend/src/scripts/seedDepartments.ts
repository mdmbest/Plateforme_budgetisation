import prisma from '../utils/database';

async function seedDepartments() {
  // Remplace cette valeur par l'ID d'un utilisateur existant (par exemple le super admin)
  const chefId = await prisma.user.findFirst({ where: { role: 'admin' } }).then(u => u?.id || '');
  if (!chefId) {
    console.error('Aucun utilisateur admin trouvé. Créez d\'abord un super admin.');
    process.exit(1);
  }

  await prisma.department.upsert({
    where: { name: 'Informatique' },
    update: {},
    create: {
      name: 'Informatique',
      code: 'INFO',
      chefId,
      totalBudget: 0,
      usedBudget: 0,
    },
  });
  console.log('Département Informatique ajouté !');
  await prisma.$disconnect();
}

seedDepartments(); 