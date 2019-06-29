<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Session\TokenMismatchException;

class VerifyXCsrfHeader
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array
     */
    protected $except = [
        'api/checkout/fulfill'
    ];

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

        // Allow request if url is in except array.
        if ($this->inExceptArray($request)) {
            return $next($request);
        }

        // Make sure csrf header is present and matches csrf cookie.
        if ($csrfHeader && $csrfHeader === $csrfCookie) {
            return $next($request);
        }

        throw new TokenMismatchException('CSRF token mismatch.');
    }

    public function inExceptArray($request)
    {
        foreach ($this->except as $except) {
            if ($except !== '/') {
                $except = trim($except, '/');
            }

            if ($request->fullUrlIs($except) || $request->is($except)) {
                return true;
            }
        }

        return false;
    }
}
