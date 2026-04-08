<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        // Non connecté → rediriger vers login
        if (!auth()->check()) {
            return redirect()->route('login');
        }

        //  ManyToMany roles : vérifier si l'utilisateur a le rôle "admin"
        $isAdmin = auth()->user()
            ->roles()
            ->where('role', 'admin')
            ->exists();

        // Connecté mais pas admin → 403
        if (!$isAdmin) {
            abort(403, 'Accès réservé aux administrateurs.');
        }

        return $next($request);
    }
}
