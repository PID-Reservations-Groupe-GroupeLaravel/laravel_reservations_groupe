# 🚀 Quick Start - Laravel Réservations Groupe

## ⚡ Installation Rapide

### 1. Prérequis
- **PHP** 8.2+
- **Composer** (https://getcomposer.org/)
- **Node.js** 18+ (https://nodejs.org/)
- **MySQL/PostgreSQL** ou SQLite

### 2. Installation

```bash
# Cloner le projet
git clone https://github.com/PID-Reservations-Groupe-GroupeLaravel/laravel_reservations_groupe.git
cd laravel_reservations_groupe

# Installer les dépendances
composer install
npm install

# Configurer l'environnement
cp .env.example .env
php artisan key:generate

# Préparer la base de données
php artisan migrate
php artisan db:seed  # Optionnel
```

---

## 🎯 Démarrer le Serveur

**Terminal 1** - Backend:
```bash
php artisan serve
# L'app est accessible sur http://localhost:8000
```

**Terminal 2** - Frontend:
```bash
npm run dev
# Les assets sont compilés en temps réel
```

---

## 📂 Structure Rapide

```
laravel_reservations_groupe/
├── app/                    # Code application
│   ├── Http/Controllers/  # Contrôleurs
│   └── Models/            # Modèles (Eloquent)
├── routes/                 # Définition des routes
├── resources/views/        # Templates HTML
├── database/migrations/    # Migrations DB
├── tests/                  # Tests
├── public/                 # CSS, JS, images compilées
├── storage/               # Fichiers uploadés, logs
├── docs/                  # Documentation du projet
└── config/                # Configurations
```

---

## 🔧 Configuration

### `.env` - Fichier d'Environnement

```env
APP_NAME="Réservations Groupe"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=reservations_db
DB_USERNAME=root
DB_PASSWORD=password

MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=587
```

---

## 🧪 Tests

```bash
# Exécuter tous les tests
php artisan test

# Tests avec couverture
php artisan test --coverage

# Test spécifique
php artisan test tests/Feature/ReservationTest.php
```

---

## 🔨 Commandes Pratiques

```bash
# Génération de Code
php artisan make:model User -m          # Model + Migration
php artisan make:controller UserController -r  # Ressource complète
php artisan make:migration create_users_table
php artisan make:request StoreUserRequest
php artisan make:seeder UserSeeder

# Database
php artisan migrate                     # Exécuter migrations
php artisan migrate:rollback           # Annuler dernière migration
php artisan migrate:refresh --seed     # Reset complet
php artisan db:seed                    # Exécuter seeders

# Cache
php artisan cache:clear
php artisan route:cache
php artisan config:cache

# Assets
npm run dev                             # Dev mode
npm run build                           # Production build

# Tinker
php artisan tinker                      # Shell interactif PHP
```

---

## 📚 Documentation Complète

- **[STRUCTURE.md](STRUCTURE.md)** - Structure du projet
- **[DEVELOPMENT.md](DEVELOPMENT.md)** - Guide de développement complet
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Comment contribuer

---

## 🐛 Troubleshooting

### Problem: `composer` command not found
**Solution:** Installer Composer de https://getcomposer.org/

### Problem: SQLite database error
**Solution:** S'assurer que SQLite est compilé avec PHP.
```bash
php -m | grep sqlite
```

### Problem: Port 8000 déjà utilisé
**Solution:** Utiliser un autre port:
```bash
php artisan serve --port=8001
```

### Problem: npm ERR! Cannot find module
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📞 Support

- 📖 Docs Laravel: https://laravel.com/docs
- 🐙 Voir les Issues: [GitHub Issues](https://github.com/PID-Reservations-Groupe-GroupeLaravel/laravel_reservations_groupe/issues)

---

## ✅ Vous êtes Prêt!

Votre projet Laravel est maintenant:
- ✅ Complètement organisé
- ✅ Prêt pour le développement
- ✅ Bien documenté
- ✅ Suivant les meilleures pratiques

Happy Coding! 🎉
