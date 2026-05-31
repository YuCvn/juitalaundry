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
        // Hanya ambil order yang statusnya 'sudah diambil'
        $orders = Order::with(['membership', 'details.service'])
                        ->where('status_order', 'sudah diambil')
                        ->latest('updated_at') // Urutkan berdasarkan waktu terakhir diambil
                        ->get();

        return Inertia::render('Cashier/History', [
            'orders' => $orders
        ]);
    }
}