<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Session\TokenMismatchException;

class VerifyXCsrfHeader
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
        // Skip middleware for GET requests.
        if ($request->isMethod('GET')) return $next($request);


        $csrfHeader = $request->header('X-XSRF-TOKEN');
        $csrfCookie = $request->cookie('XSRF-TOKEN');

        // Make sure csrf header is present and matches csrf cookie.
        if ($csrfHeader && $csrfHeader === $csrfCookie) {
            return $next($request);
        }

        throw new TokenMismatchException('CSRF token mismatch.');
    }
}
