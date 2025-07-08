# Plateforme de Budgétisation

Plateforme web permettant la gestion, la soumission, la validation et le suivi des demandes budgétaires au sein d'une institution.  
Ce projet propose un workflow complet de validation multi-niveaux, une gestion des utilisateurs par rôles, et une interface moderne.

## 🚀 Fonctionnalités principales

- Authentification sécurisée (JWT)
- Gestion des utilisateurs et des rôles (agent, chef de département, recteur, etc.)
- Soumission et suivi des demandes budgétaires
- Workflow de validation multi-niveaux
- Notifications automatiques
- Tableau de bord interactif
- Historique des actions

## 🛠️ Technologies utilisées

### Frontend
- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)

### Backend
- [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
- [Prisma ORM](https://www.prisma.io/) (avec [PostgreSQL](https://www.postgresql.org/))
- [JWT](https://jwt.io/) pour l'authentification

## 📁 Structure du projet

```
Plateforme_budgetisation/
  backend/         # API, logique métier, base de données
  project/         # Frontend React (interface utilisateur)
```

## ⚡ Installation

### Prérequis
- Node.js (>= 16)
- npm ou yarn
- PostgreSQL

### 1. Cloner le dépôt
```bash
git clone https://github.com/votre-utilisateur/Plateforme_budgetisation.git
cd Plateforme_budgetisation
```

### 2. Installer les dépendances

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd ../project
npm install
```

### 3. Configurer la base de données
- Créez une base PostgreSQL
- Configurez les variables d'environnement dans `backend/.env` :
```
DATABASE_URL="postgresql://user:password@localhost:5432/nom_de_la_base"
JWT_SECRET="votre_secret"
```

### 4. Lancer les migrations et le seed
```bash
cd backend
npx prisma migrate deploy
npm run seed
```

### 5. Démarrer le backend
```bash
npm run dev
```

### 6. Démarrer le frontend
```bash
cd ../project
npm run dev
```

L'application sera accessible sur [http://localhost:5173](http://localhost:5173) (par défaut).

## 📚 Documentation
- **API** : Voir le dossier `backend/src/routes/`
- **Modèles de données** : Voir `backend/prisma/schema.prisma`
- **Scripts de seed** : Voir `backend/src/scripts/`

## 🤝 Contribuer
1. Forkez le projet
2. Créez votre branche (`git checkout -b feature/ma-nouvelle-fonctionnalite`)
3. Commitez vos changements (`git commit -am 'Ajout d'une fonctionnalité'`)
4. Poussez la branche (`git push origin feature/ma-nouvelle-fonctionnalite`)
5. Ouvrez une Pull Request

## 📄 Licence
Ce projet est sous licence MIT.

## 👨‍💻 Auteurs
- [Votre Nom](https://github.com/votre-utilisateur)
- Toute contribution est la bienvenue !
