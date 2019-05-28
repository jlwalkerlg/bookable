<?php

namespace App\Http\Middleware;

use Closure;

class ConvertCookieToBearer
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if ($token = $request->cookie('laravel_token')) {
            $request->headers->set('Authorization', "Bearer $token");
        }
        return $next($request);
    }
}
