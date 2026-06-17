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
        $history = \App\Models\Order::with(['details.service', 'membership'])
                                    ->where('status', 'picked_up')
                                    ->latest()
                                    ->get();
        
        $activeCount = \App\Models\Order::where('status', '!=', 'picked_up')->count();
        $historyCount = $history->count();

        return Inertia::render('Cashier/HistoryView', [
            'history' => $history,
            'activeCount' => $activeCount,
            'historyCount' => $historyCount
        ]);
    }
}