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
    $history = \App\Models\Order::where('status', 'picked_up')->get();
    
    $activeCount = \App\Models\Order::where('status', '!=', 'picked_up')->count();
    $historyCount = $history->count();

    return Inertia::render('Cashier/History', [
        'history' => $history,
        'activeCount' => $activeCount,
        'historyCount' => $historyCount
    ]);
}
}