# 📁 Structure du Projet Laravel - Réservations Groupe

## Vue d'ensemble
Ce projet Laravel suit les bonnes pratiques professionnelles pour l'organisation du code et des ressources.

---

## 📂 Organisation des Dossiers

### **app/**
Structure de l'application Laravel
- **Http/** - Contrôleurs, Middlewares, Requêtes
  - `Controllers/` - Logique métier des endpoints
  - `Requests/` - Validations des requêtes
  - `Middleware/` - Middlewares d'authentification et autorisations
- **Models/** - Modèles Eloquent (base de données)
- **Livewire/** - Composants Livewire (si utilisé)
- **Providers/** - Service Providers
- **View/** - Logique métier commune

### **bootstrap/**
Fichiers d'initialisation de l'application
- Chargement de l'autoloader
- Cache bootstrapping

### **config/**
Fichiers de configuration
- `app.php` - Configuration application
- `database.php` - Configuration base de données
- `services.php` - Services externes
- Autres configurations (mail, cache, etc...)

### **database/**
Gestion de base de données
- **migrations/** - Fichiers de migration DB
- **seeders/** - Peuplement de données
- **factories/** - Factories pour tests

### **public/**
Dossier racine web (accessible publiquement)
- **images/** - Images du site
- **css/** - Feuilles de styles compilées
- **js/** - Scripts JavaScript compilés
- `index.php` - Point d'entrée de l'application
- `robots.txt` - Directives robots
- `.htaccess` - Configuration Apache

### **resources/**
Ressources brutes (non compilées)
- **views/** - Templates Blade
- **css/** - Sources CSS (Tailwind, etc.)
- **js/** - Sources JavaScript
- **lang/** - Fichiers de traduction (si multilingue)

### **routes/**
Définition des routes de l'application
- `web.php` - Routes web
- `api.php` - Routes API (si applicable)
- `channels.php` - Broadcasting (si applicable)

### **storage/**
Fichiers générés par l'application
- **app/** - Fichiers utilisateur générés
  - **uploads/** - Fichiers uploadés par les utilisateurs
- **logs/** - Fichiers journaux
- **framework/** - Cache et autres fichiers framework

### **tests/**
Fichiers de test
- **Unit/** - Tests unitaires
- **Feature/** - Tests fonctionnels

### **docs/**
Documentation du projet
- README des fonctionnalités
- Guides de développement
- Architecture documentation

### **logs/**
Fichiers journaux applicatifs
- erreurs
- accès
- audit

---

## 📄 Fichiers à la Racine

| Fichier | Utilité |
|---------|---------|
| `.env.example` | Template de configuration (copier en `.env`) |
| `.gitignore` | Fichiers à ignorer dans Git |
| `.gitattributes` | Attributs Git |
| `.editorconfig` | Config éditeur (indentation, etc.) |
| `composer.json` | Dépendances PHP |
| `composer.lock` | Lock file dépendances PHP |
| `package.json` | Dépendances Node.js |
| `package-lock.json` | Lock file dépendances Node.js |
| `artisan` | CLI Laravel |
| `phpunit.xml` | Configuration des tests |
| `vite.config.js` | Configuration Vite (bundler) |
| `tailwind.config.js` | Configuration Tailwind CSS |
| `postcss.config.js` | Configuration PostCSS |
| `README.md` | Documentation générale du projet |

---

## 🚀 Commandes Utiles

```bash
# Installation des dépendances
composer install
npm install

# Exécuter migrations
php artisan migrate

# Démarrer le serveur local
php artisan serve

# Compiler les assets
npm run dev
npm run build

# Exécuter les tests
php artisan test
```

---

## 📋 Bonnes Pratiques à Respecter

✅ **À FAIRE:**
- Une classe par fichier
- Namespaces correctement organisés
- Noms en anglais pour le code
- Validations au niveau des Requests
- Tests unitaires et fonctionnels
- Comments pour la logique complexe

❌ **À ÉVITER:**
- Code dans les routes directement
- Logique métier dans les Contrôleurs
- Fichiers au hasard à la racine
- Pas de tests
- Structure désorganisée

---

## 📝 Version
Dernière mise à jour: 2026-04-04
