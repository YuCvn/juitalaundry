<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, $role): Response
    {
        // Pastikan user sudah login
        if (!Auth::check()) {
            return redirect('/login');
        }

        // Ambil role user
        $userRole = strtolower(Auth::user()->role);
        $expectedRole = strtolower($role);

        // Samakan nama role dari database ke format route
        if ($userRole === 'administrator') {
            $userRole = 'admin';
        } elseif ($userRole === 'kasir') {
            $userRole = 'cashier';
        }

        // Jika role tidak sesuai, tolak akses
        if ($userRole !== $expectedRole) {
            $redirectRoute = $userRole === 'admin' ? 'admin.dashboard' : 'cashier.dashboard';
            
            return redirect()->route($redirectRoute)
                ->with('error', 'Akses ditolak! Anda tidak memiliki izin ke halaman tersebut.');
        }

        return $next($request);
    }
}