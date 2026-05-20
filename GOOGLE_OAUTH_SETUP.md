# Configuration Google OAuth - Standing Ovation

## 🔐 Configuration Google OAuth

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

### Étape 5: Tester l'intégration

1. Lancez le serveur Laravel: `php artisan serve`
2. Lancez le frontend: `npm run dev`
3. Cliquez sur le bouton "Continuer avec Google" sur les pages Login/Register
4. Vous devez être redirigé vers Google, puis revenir avec un token

## 🚀 Utilisation en production

Pour la production:
1. Mettez à jour `GOOGLE_REDIRECT_URI` avec votre domaine
2. Configurez les URIs autorisés dans Google Cloud Console
3. Utilisez votre vrai `FRONTEND_URL` en production

## 📝 Notes

- Le frontend est sur le port 3001 par défaut
- Le backend est sur le port 8000
- Les credentials utilisateur sont automatiquement créés lors de la première connexion Google
- Les utilisateurs Google n'ont pas besoin de définir un mot de passe

## 🔗 Ressources

- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2/web-server)
- [Laravel Socialite](https://laravel.com/docs/socialite)
