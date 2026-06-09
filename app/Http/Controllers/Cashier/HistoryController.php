<?php

namespace App\Http\Controllers\Cashier;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Order;

class HistoryController extends Controller
{
    public function index()
    {
        $orders = Order::with(['membership', 'details.service', 'user'])
                        ->where('status', 'picked_up') 
                        ->latest('updated_at')
                        ->paginate(50); 

        return Inertia::render('Cashier/History', [
            'orders' => $orders
        ]);
    }
}