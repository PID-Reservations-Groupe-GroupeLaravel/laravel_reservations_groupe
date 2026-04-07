# 🤝 Guide de Contribution - Laravel Réservations Groupe

## Avant de Commencer

### Configuration Locale

1. **Cloner le projet:**
```bash
git clone https://github.com/PID-Reservations-Groupe-GroupeLaravel/laravel_reservations_groupe.git
cd laravel_reservations_groupe
```

2. **Installer les dépendances:**
```bash
composer install
npm install
```

3. **Configurer l'environnement:**
```bash
cp .env.example .env
php artisan key:generate
```

4. **Migrer la base de données:**
```bash
php artisan migrate
php artisan db:seed
```

5. **Démarrer le serveur:**
```bash
php artisan serve
npm run dev
```

---

## 📋 Standard de Code

### Nommage des Fichiers et Classes

**Controllers:**
```php
// Fichier: app/Http/Controllers/ReservationController.php
namespace App\Http\Controllers;

class ReservationController extends Controller
{
    // ...
}
```

**Models:**
```php
// Fichier: app/Models/Reservation.php
namespace App\Models;

class Reservation extends Model
{
    // ...
}
```

**Requests:**
```php
// Fichier: app/Http/Requests/StoreReservationRequest.php
namespace App\Http\Requests;

class StoreReservationRequest extends FormRequest
{
    // ...
}
```

### Style de Code PHP

```php
// ✅ BON
public function createReservation(StoreReservationRequest $request)
{
    $reservation = Reservation::create($request->validated());
    return redirect()->route('reservations.show', $reservation);
}

// ❌ MAUVAIS
function create_reservation($data) {
    $r = new Reservation();
    $r->name = $data['name'];
    $r->save();
    return $r;
}
```

---

## 🔄 Git Workflow

### Branches

```
main              - Production
├── develop       - Développement
│   ├── feature/* - Nouvelles fonctionnalités
│   ├── fix/*     - Corrections de bugs
│   └── chore/*   - Tâches de maintenance
```

### Créer une Branch Feature

```bash
git checkout develop
git pull origin develop
git checkout -b feature/nom-de-la-fonctionnalite
```

### Commit Messages

```
# Format
type(scope): description

# Types: feat, fix, docs, style, refactor, test, chore
# Exemples:
feat(reservations): add booking confirmation email
fix(auth): resolve login issue for admin users
docs(setup): update installation instructions
```

### Pull Request

1. Push votre branch
2. Créer une PR vers `develop`
3. Décrire les changements
4. Ajouter les tests
5. Obtenir l'approbation d'au moins une personne
6. Merger et supprimer la branch

---

## ✅ Checklist Avant Pull Request

- [ ] Code testé localement
- [ ] Tests unitaires/fonctionnels ajoutés
- [ ] Pas de warning/erreur PHP
- [ ] Respect du style de code
- [ ] Documentation mise à jour
- [ ] Migration DB créée si besoin
- [ ] Messages de commit clairs
- [ ] Pas de fichiers sensibles (.env, vendor, node_modules)

---

## 🧪 Tests

### Exécuter les Tests

```bash
# Tous les tests
php artisan test

# Tests spécifiques
php artisan test tests/Feature/ReservationTest.php

# Avec couverture
php artisan test --coverage
```

### Écrire des Tests

```php
// tests/Feature/ReservationTest.php
namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Reservation;

class ReservationTest extends TestCase
{
    public function test_can_create_reservation()
    {
        $response = $this->post('/reservations', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('reservations', [
            'name' => 'John Doe',
        ]);
    }
}
```

---

## 📚 Documentation

### Documenter Votre Code

```php
/**
 * Créer une nouvelle réservation
 *
 * @param  StoreReservationRequest $request Données de la réservation
 * @return Reservation Réservation créée
 * @throws ValidationException Si les données sont invalides
 */
public function store(StoreReservationRequest $request): Reservation
{
    return Reservation::create($request->validated());
}
```

### Mise à Jour de STRUCTURE.md

Si vous ajoutez de nouvelles fonctionnalités ou dossiers, mettez à jour le fichier `STRUCTURE.md`.

---

## 🐛 Signaler un Bug

Créer une issue avec:
- Description du bug
- Étapes pour reproduire
- Comportement attendu vs actuel
- Environnement (OS, PHP version, etc.)

---

## 💡 Proposer une Fonctionnalité

Créer une discussion ou issue avec:
- Description de la fonctionnalité
- Cas d'usage
- Implémentation suggérée (si possible)

---

## 📞 Support

- 📧 Email: [contact email]
- 🐙 GitHub Issues: https://github.com/PID-Reservations-Groupe-GroupeLaravel/laravel_reservations_groupe/issues
- 💬 Discord/Slack: [lien si applicable]

---

## 📜 Licence

Ce projet est sous licence [À spécifier].

Merci de contribuer ! 🙌
