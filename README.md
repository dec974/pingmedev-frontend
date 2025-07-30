# Ping Me Dev - Frontend

## 📝 Description

Interface utilisateur principale de l'application **Ping Me Dev**, un projet de fin de formation pour un titre RNCP. Cette application React/Next.js constitue l'interface frontend qui consomme l'API REST du backend.

## 🏗️ Architecture du projet

Le projet **Ping Me Dev** est composé de 3 applications distinctes :
- **Backend** (Express.js) - API REST pour la logique métier
- **Frontend** (React/Next.js) - Interface utilisateur principale ✨
- **Admin** (React/Next.js) - Interface d'administration

L'application propose une plateforme collaborative offrant :
- 💬 **Interface de chat temps réel** - Discussion fluide entre utilisateurs
- 📧 **Messagerie asynchrone** - Interface de communication différée
- ❓ **Interface Q&A** - Publication et consultation de questions/réponses par langage
- 👤 **Gestion de profil** - Inscription, connexion et gestion du compte utilisateur

## 🚀 Fonctionnalités principales

- **Authentification utilisateur** : Inscription/connexion classique et OAuth (Google, GitHub)
- **Chat interactif** : Interface temps réel avec WebSocket
- **Messagerie** : Envoi et réception de messages asynchrones
- **Forum Q&A** : Publication, consultation et recherche de questions par langage
- **Profil utilisateur** : Gestion du compte et informations personnelles
- **Interface responsive** : Design adaptatif pour tous les appareils

## 🛠️ Technologies utilisées

- **Framework** : Next.js 12.1.6
- **Bibliothèque UI** : React 18.1.0
- **Styling** : CSS Modules
- **Communication API** : Fetch/Axios (à définir)
- **Temps réel** : WebSocket client
- **Tests** : Jest & React Testing Library
- **Gestionnaire de paquets** : Yarn

## 📋 Prérequis

- Node.js (version 14 ou supérieure)
- Yarn (gestionnaire de paquets)
- Backend Ping Me Dev en cours d'exécution

## ⚙️ Installation

1. **Cloner le repository**
   ```bash
   git clone [URL_DU_REPO]
   cd pingmedev/frontend
   ```

2. **Installer les dépendances**
   ```bash
   yarn install
   ```

3. **Démarrer l'application**
   ```bash
   yarn dev
   ```
   
   L'application sera accessible sur `http://localhost:3001`

## 🚧 État du projet

**Phase actuelle** : Conception et architecture
- ✅ Structure Next.js initialisée
- ✅ Configuration de base
- ⏳ Design des interfaces (en cours)
- ⏳ Intégration API backend (à venir)
- ⏳ Début du développement prévu : Lundi 04/08/2025

**Roadmap** :
1. Design et maquettage des interfaces utilisateur
2. Intégration avec l'API backend (authentification)
3. Développement des composants chat temps réel
4. Interface Q&A avec filtres par langage
5. Tests et optimisations

## 📁 Structure du projet

```
frontend/
├── package.json        # Dépendances et scripts
├── yarn.lock          # Lock file Yarn
├── next.config.js     # Configuration Next.js
├── jest.config.js     # Configuration des tests
├── pages/             # Pages Next.js (routing automatique)
│   ├── _app.js       # Configuration globale de l'app
│   └── index.js      # Page d'accueil
├── components/        # Composants React réutilisables
│   └── Home.js       # Composant page d'accueil
├── styles/           # Feuilles de style
│   ├── globals.css   # Styles globaux
│   └── Home.module.css # Styles modulaires
├── public/           # Fichiers statiques
│   └── favicon.ico
├── hooks/            # Hooks personnalisés (à créer)
├── utils/            # Utilitaires et helpers (à créer)
├── context/          # Context React (état global) (à créer)
└── __tests__/        # Tests unitaires (à créer)
```

## 📱 Pages et composants (prévisionnel)

> **Note** : Cette structure est prévisionnelle et pourra évoluer lors du développement.

### Pages principales
- `/` - Page d'accueil et présentation
- `/auth/login` - Connexion utilisateur
- `/auth/register` - Inscription utilisateur
- `/chat` - Interface de chat temps réel
- `/messages` - Messagerie asynchrone
- `/questions` - Liste des questions Q&A
- `/questions/[id]` - Détail d'une question
- `/questions/new` - Créer une nouvelle question
- `/profile` - Profil utilisateur
- `/profile/edit` - Édition du profil

### Composants clés
- `AuthForm` - Formulaires d'authentification
- `ChatWindow` - Interface de chat temps réel
- `MessageList` - Liste des messages
- `QuestionCard` - Carte de question dans la liste
- `QuestionDetail` - Affichage détaillé d'une question
- `AnswerForm` - Formulaire de réponse
- `UserProfile` - Composant profil utilisateur
- `Navigation` - Menu de navigation
- `Layout` - Layout général de l'application

## 🧪 Tests

```bash
yarn test
```

## 🚀 Déploiement

```bash
# Build de production
yarn build

# Démarrage en mode production
yarn start
```

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs)

## 👥 Équipe de développement

Ce projet est développé en équipe de 4 personnes dans le cadre d'une formation RNCP :
- **Sébastien** - Développeur / Product Owner
- **Karine** - Développeuse
- **Adrien** - Développeur
- **Cédric** - Développeur

## 📄 Licence

Ce projet est réalisé dans le cadre d'une formation RNCP.

---

*Développé par l'équipe Ping Me Dev - Projet de fin de formation RNCP*  
*Cédric, Sébastien, Karine & Adrien*
