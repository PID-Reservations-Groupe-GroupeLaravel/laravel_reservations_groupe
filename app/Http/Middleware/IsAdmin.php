<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check()) {
            abort(403);
        }

        //  ManyToMany roles : vérifier si l'utilisateur a le rôle "admin"
        $isAdmin = auth()->user()
            ->roles()
            ->where('role', 'admin')
            ->exists();

        if (!$isAdmin) {
            abort(403);
        }

        return $next($request);
    }
}
