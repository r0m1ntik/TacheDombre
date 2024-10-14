# Gestionnaire de Tâches - Installation et Configuration

## Description du Projet

Ce projet est un gestionnaire de tâches avec authentification d'utilisateurs, utilisant Supabase comme backend pour la base de données et l'authentification. Les tâches peuvent être créées, modifiées, supprimées et classées dans des catégories. Le projet est déployé via Vercel, avec un système de versioning géré par des variables d'environnement.

## Fonctionnalités

- Création, modification et suppression de tâches
- Gestion des catégories de tâches
- Authentification des utilisateurs avec Supabase
- Déploiement automatisé avec Vercel

## Prérequis

Avant de commencer, assurez-vous d'avoir les éléments suivants installés sur votre machine :

- [Node.js](https://nodejs.org/) (version v20.18.0 ou supérieure)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- Un compte [Supabase](https://supabase.com/)
- Un compte [Vercel](https://vercel.com/)

## Configuration de la Base de Données

### 1. **Créer un projet Supabase :**

Rendez-vous sur [Supabase](https://supabase.com/) et créez un nouveau projet. Supabase générera une URL et une clé API (anon key), que vous utiliserez dans votre projet.

### 2. **Modèles de la Base de Données :**

Créez deux tables dans votre base de données Supabase :

- **Table `tasks` :**
  - `id` : integer, clé primaire
  - `title` : varchar (titre de la tâche)
  - `description` : text (description de la tâche)
  - `category_id` : integer (référence à une catégorie)
  - `priority` : varchar (priorité de la tâche)
  - `status` : varchar (statut de la tâche : "À faire", "En cours", "Terminé")
  - `due_date` : date (date limite)
  - `user_id` : uuid (référence à l'utilisateur)
  - `created_at` : timestamp (date de création)

- **Table `categories` :**
  - `id` : integer, clé primaire
  - `name` : varchar (nom de la catégorie)

### 3. **Activer l'authentification :**

Utilisez le système d'authentification intégré de Supabase pour gérer les utilisateurs et la création de comptes.

## Installation Locale

### 1. **Cloner le projet :**

```bash
git clone [https://github.com/r0m1ntik/TacheDombre.git](https://github.com/r0m1ntik/TacheDombre.git)
cd TacheDombre
```

## 2. Installer les dépendances :

Utilisez npm ou yarn pour installer les dépendances :

```bash
npm install
# ou
yarn install
```
## 3. Configuration des Variables d'Environnement :

Créez un fichier ```.env.local``` à la racine du projet et ajoutez les informations suivantes :

```bash
VITE_SUPABASE_URL= <votre-url-supabase>
VITE_SUPABASE_ANON_KEY= <votre-anon-key>
VITE_PACKAGE_VERSION= <votre-version>
```
- ```VITE_SUPABASE_URL``` : L'URL de votre instance Supabase
- ```VITE_SUPABASE_ANON_KEY``` : La clé API publique fournie par Supabase
- ```VITE_PACKAGE_VERSION``` : Version actuelle de votre application (facultatif pour le versioning)

## 4. Lancer l'application en local :

```bash
npm run dev
# ou
yarn dev
```
Accédez à l'application via l'URL locale fournie (généralement ```http://localhost:5173/```)

# Déploiement avec Vercel

## 1. Créer un compte Vercel :
Si vous ne l'avez pas déjà fait, créez un compte sur [Vercel](https://vercel.com).

## 2. Lier le projet GitHub à Vercel :
Liez votre repository GitHub à Vercel pour automatiser le déploiement. Suivez les instructions sur Vercel pour lier votre projet.

## 3. Configurer les variables d'environnement sur Vercel :
Ajoutez les variables d'environnement suivantes dans les paramètres de votre projet sur Vercel :

- **VITE_SUPABASE_URL**
- **VITE_SUPABASE_ANON_KEY**
- **VITE_PACKAGE_VERSION**

## 4. Déployer :
Une fois le projet configuré sur Vercel, chaque push vers la branche principale déclenchera automatiquement un déploiement. Vous pouvez suivre l'état du déploiement directement sur votre tableau de bord Vercel.

# Utilisation

- **Créer un compte** : Accédez à l'application et créez un compte via le formulaire d'inscription. L'authentification est gérée par Supabase.
- **Créer des tâches** : Une fois connecté, vous pouvez créer des tâches, les classer par priorité, les assigner à des catégories et définir des dates d'échéance.
- **Gérer les catégories** : Vous pouvez ajouter de nouvelles catégories directement lors de la création d'une tâche.

# API

Les routes API sont situées dans `src/routes/api` :

- **POST /api/tasks** : Créer une nouvelle tâche
- **PUT /api/tasks** : Modifier une tâche existante
- **DELETE /api/tasks** : Supprimer une tâche
- **POST /api/categories** : Créer une nouvelle catégorie
- **PUT /api/categories** : Modifier une catégorie
- **DELETE /api/categories** : Supprimer une catégorie

# Technologies Utilisées

- **Supabase** : Backend et authentification
- **SvelteKit** : Framework frontend
- **Vercel** : Plateforme de déploiement
