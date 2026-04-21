<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CashierController extends Controller
{
    public function index()
    {
        $cashiers = User::all();

        return Inertia::render('Admin/Cashier', [
            'cashiers' => $cashiers
        ]);
    }
}