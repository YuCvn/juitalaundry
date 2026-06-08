<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL; // <-- 1. PASTIKAN LINE INI ADA

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // 2. TAMBAHKAN KODE INI
        // Memaksa Laravel menggunakan HTTPS jika diakses lewat Expose atau environment bukan lokal biasa
        if (str_contains(request()->url(), 'sharedwithexpose.com') || config('app.env') !== 'local') {
            URL::forceScheme('https');
        }
    }
}