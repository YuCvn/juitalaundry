<?php

namespace App\Http\Controllers\Cashier;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        return Inertia::render('Cashier/Orders');
    }

    public function create()
    {
        return Inertia::render('Cashier/CreateOrder');
    }

    public function store(Request $request)
    {
        
        return redirect()->route('cashier.orders.index')->with('success', 'Pesanan berhasil dibuat!');
    }
}