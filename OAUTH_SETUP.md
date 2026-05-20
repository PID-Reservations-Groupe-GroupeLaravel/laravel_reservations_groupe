# Configuration OAuth - Standing Ovation

This guide covers setup for both Google and Apple OAuth authentication.

## 🔐 Google OAuth Configuration

### Étape 1: Créer une application Google Cloud

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet
3. Accédez à "APIs & Services" → "Credentials"
4. Créez une nouvelle "OAuth 2.0 Client ID"
5. Type d'application: "Web application"

### Étape 2: Configurer les URIs autorisés

Dans les paramètres de votre OAuth client:

**Authorized JavaScript origins:**
- `http://localhost:8000`
- `http://localhost:3001`
- Votre domaine en production

**Authorized redirect URIs:**
- `http://localhost:8000/api/auth/callback/google`
- Votre URL de callback en production

### Étape 3: Obtenir les credentials

1. Copiez votre **Client ID**
2. Copiez votre **Client Secret**

### Étape 4: Configurer les variables d'environnement

Ajoutez dans votre fichier `.env`:

```env
GOOGLE_CLIENT_ID=votre_client_id_ici
GOOGLE_CLIENT_SECRET=votre_client_secret_ici
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/callback/google
```

## 🍎 Apple OAuth Configuration

### Étape 1: Créer une application Apple

1. Allez sur [Apple Developer](https://developer.apple.com/)
2. Connectez-vous à votre compte Apple Developer
3. Accédez à "Certificates, Identifiers & Profiles"
4. Cliquez sur "Identifiers" et créez un nouvel "App ID"
5. Activez "Sign in with Apple" pour cette App ID

### Étape 2: Créer un Service ID

1. Dans "Identifiers", sélectionnez "Services IDs"
2. Créez un nouveau Service ID
3. Notez le Service ID (c'est votre Client ID pour Apple)

### Étape 3: Configurer les Return URLs

Ajoutez les URLs de callback autorisées:
- `http://localhost:8000/api/auth/callback/apple`
- Votre URL de callback en production

### Étape 4: Créer une clé privée

1. Allez à "Keys" et créez une nouvelle clé avec "Sign in with Apple"
2. Téléchargez la clé privée (fichier .p8)
3. Notez le Key ID et Team ID

### Étape 5: Configurer les variables d'environnement

Ajoutez dans votre fichier `.env`:

```env
APPLE_CLIENT_ID=votre_service_id
APPLE_CLIENT_SECRET=votre_cle_privee_ou_path_au_fichier
APPLE_REDIRECT_URI=http://localhost:8000/api/auth/callback/apple
```

## ✅ Tester l'intégration

### Configuration locale

1. Lancez le serveur Laravel: `php artisan serve`
2. Lancez le frontend: `npm run dev`

### Pages de test

- **Login**: `http://localhost:3001/login`
- **Register**: `http://localhost:3001/register`

### Cliquer sur les boutons

- Bouton "Continuer avec Google" → Redirection vers Google
- Bouton "Apple" → Redirection vers Apple

Après authentification, vous serez redirigé avec un token et les infos utilisateur.

## 🚀 Déploiement en production

### Mise à jour des variables

1. Mettez à jour `GOOGLE_REDIRECT_URI` avec votre domaine de production
2. Mettez à jour `APPLE_REDIRECT_URI` avec votre domaine de production

### Google Cloud Console

1. Configurez les URIs autorisés avec votre domaine de production
2. Vérifiez les origines JavaScript autorisées

### Apple Developer

1. Ajoutez vos URLs de production dans "Return URLs"
2. Vérifiez les paramètres de configuration

## 📝 Notes importantes

- Le frontend est sur le port 3001 par défaut
- Le backend est sur le port 8000
- Les credentials utilisateur sont automatiquement créés lors de la première connexion
- Les utilisateurs OAuth n'ont pas besoin de définir un mot de passe
- Les deux boutons sont affichés côte à côte sur les pages Login/Register

## 🔗 Ressources

- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2/web-server)
- [Apple Sign in with Apple](https://developer.apple.com/sign-in-with-apple/)
- [Laravel Socialite](https://laravel.com/docs/socialite)
