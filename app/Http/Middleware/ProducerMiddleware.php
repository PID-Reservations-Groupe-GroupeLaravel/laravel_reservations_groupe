<?php
namespace App\Http\Middleware;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
class ProducerMiddleware
{
public function handle(Request $request, Closure $next): Response
{
if (!$request->user() || !$request->user()->isProducteur()) {
abort(403, 'Accès réservé aux producteurs.');
}
return $next($request);
}
}