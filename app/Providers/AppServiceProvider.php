<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\Stripe;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton('guzzle', function () {
            return new \GuzzleHttp\Client();
        });

        $this->app->singleton('stripe', function () {
            return new Stripe();
        });
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
