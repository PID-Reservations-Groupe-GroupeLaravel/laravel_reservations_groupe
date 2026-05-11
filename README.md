# OVATIO — Plateforme de réservation de spectacles

Stack : **Laravel 12** (API REST, port 8000) + **React 18 + Vite** (frontend, port 3001) + **MySQL**

---

## Prérequis

| Outil | Version minimale |
|-------|-----------------|
| PHP | 8.2 |
| Composer | 2.x |
| Node.js | 18+ |
| MySQL | 8.0 |

---

## Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/PID-Reservations-Groupe-GroupeLaravel/laravel_reservations_groupe.git
cd laravel_reservations_groupe
```

### 2. Backend Laravel

```bash
# Installer les dépendances PHP
composer install

# Copier et configurer l'environnement
cp .env.example .env
```

Ouvrir `.env` et remplir :
```
DB_DATABASE=reservations
DB_USERNAME=root
DB_PASSWORD=          # ton mot de passe MySQL
STRIPE_SECRET=sk_test_...   # ta clé Stripe test
```

```bash
# Générer la clé d'application
php artisan key:generate

# Créer la base de données MySQL (si elle n'existe pas encore)
# Dans MySQL : CREATE DATABASE reservations;

# Migrer et seeder
php artisan migrate:fresh --seed

# Démarrer le serveur Laravel
php artisan serve --port=8000
```

### 3. Frontend React

```bash
cd ovatio-frontend
npm install
npm run dev
```

Le frontend tourne sur **http://localhost:3001**

---

## Comptes de test (après le seed)

| Rôle | Login | Email | Mot de passe |
|------|-------|-------|--------------|
| **Admin** | `bob` | bob@standing-ovation.be | `12345678` |
| **Admin** | `fred` | fred@standing-ovation.be | `12345678` |
| **Producteur** | `anna` | anna.lyse@standing-ovation.be | `12345678` |
| **Producteur** | `thomas` | thomas.martin@standing-ovation.be | `12345678` |
| **Producteur** | `marie` | marie.dupont@standing-ovation.be | `12345678` |
| **Producteur** | `lucas` | lucas.bernard@standing-ovation.be | `12345678` |
| **Membre** | *(users aléatoires générés par factory)* | — | `12345678` |

> La connexion accepte le **login** OU l'**email** comme identifiant.

---

## Structure du projet

```
laravel_reservations_groupe/
├── app/                  # Modèles, contrôleurs Laravel
├── database/
│   ├── migrations/       # Structure de la base
│   └── seeders/          # Données de test
├── routes/
│   └── api.php           # Toutes les routes API
├── ovatio-frontend/      # Application React (Vite)
│   ├── src/
│   │   ├── pages/        # Pages (Login, Shows, Reservations, Admin…)
│   │   ├── contexts/     # AuthContext, LanguageContext
│   │   └── i18n/         # Traductions FR / EN / NL
│   └── package.json
├── .env.example          # Template de configuration
└── README.md
```

---

## Branches Git

| Préfixe | Auteur |
|---------|--------|
| `A*` | Soufiane |
| `B*` | Salim |
| `C*` | Mehdi |
| `D*` | Mohamed |

La branche **`main`** contient toujours l'état stable le plus récent.

---

## Fonctionnalités principales

- Inscription / connexion (email ou login, remember me)
- Navigation des spectacles avec détails et avis
- Réservation avec génération de **ticket QR code** (téléchargeable en PNG)
- Back-office **Admin** : gestion utilisateurs, spectacles, avis, stats
- Back-office **Producteur** : créer/modifier ses spectacles (lieu, tarifs, artistes)
- Internationalisation **FR / EN / NL**
- Paiement **Stripe** (clé test)
