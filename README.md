Plateforme de Budgétisation
Plateforme web permettant la gestion, la soumission, la validation et le suivi des demandes budgétaires au sein d’une institution.
Ce projet propose un workflow complet de validation multi-niveaux, une gestion des utilisateurs par rôles, et une interface moderne.
🚀 Fonctionnalités principales
Authentification sécurisée (JWT)
Gestion des utilisateurs et des rôles (agent, chef de département, recteur, etc.)
Soumission et suivi des demandes budgétaires
Workflow de validation multi-niveaux
Notifications automatiques
Tableau de bord interactif
Historique des actions
🛠️ Technologies utilisées
Frontend
React + TypeScript
Tailwind CSS
Vite
Backend
Node.js + Express
Prisma ORM (avec PostgreSQL)
JWT pour l’authentification

Plateforme_budgetisation/
  backend/         # API, logique métier, base de données
  project/         # Frontend React (interface utilisateur)

  ⚡ Installation
Prérequis
Node.js (>= 16)
npm ou yarn
PostgreSQL
1. Cloner le dépôt
git clone https://github.com/votre-utilisateur/Plateforme_budgetisation.git
cd Plateforme_budgetisation

2. Installer les dépendances
Backend
cd backend
npm install

Frontend
cd ../project
npm install
3. Configurer la base de données
Créez une base PostgreSQL.
Configurez les variables d’environnement dans backend/.env :
DATABASE_URL="postgresql://user:password@localhost:5432/nom_de_la_base"
JWT_SECRET="votre_secret"
4. Lancer les migrations et le seed
cd backend
npx prisma migrate deploy
npm run seed
Documentation
API : Voir le dossier backend/src/routes/
Modèles de données : Voir backend/prisma/schema.prisma
Scripts de seed : Voir backend/src/scripts/
