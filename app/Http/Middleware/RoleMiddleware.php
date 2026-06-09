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
        if (!Auth::check()) {
            return redirect('/login');
        }

        $userRole = strtolower(Auth::user()->role);
        $expectedRole = strtolower($role);

        if ($userRole === 'administrator') {
            $userRole = 'admin';
        } elseif ($userRole === 'kasir') {
            $userRole = 'cashier';
        }

        if ($userRole !== $expectedRole) {
            $redirectRoute = $userRole === 'admin' ? 'admin.dashboard' : 'cashier.dashboard';
            
            return redirect()->route($redirectRoute)
                ->with('error', 'Akses ditolak! Anda tidak memiliki izin ke halaman tersebut.');
        }

        return $next($request);
    }
}