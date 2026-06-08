<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\FinancialReport; // 1. Ubah Expense menjadi FinancialReport
use Illuminate\Support\Facades\DB;
use Carbon\Carbon; 

class DashboardController extends Controller
{
    public function index()
    {
        // 2. Ubah status_order -> status & sudah diambil -> picked_up
        $completedOrders = Order::where('status', 'picked_up');

        $totalOrders = $completedOrders->count();
        
        // 3. Ubah total_harga -> total_price
        $totalPendapatan = $completedOrders->sum('total_price');

        // 4. Ubah nama -> customer_name
        $totalPelanggan = Order::where('status', 'picked_up')
            ->distinct('customer_name')
            ->count('customer_name');

        $topCustomers = Order::where('status', 'picked_up')
            ->select('customer_name', DB::raw('count(id) as total_orders'), DB::raw('sum(total_price) as total_spent'))
            ->groupBy('customer_name')
            ->orderByDesc('total_spent')
            ->take(5)
            ->get();

        // 5. Ubah Expense -> FinancialReport
        $pengeluaran = FinancialReport::sum('nominal');

        $labels = [];
        $revenues = [];
        $expenses = [];
        $profits = [];

        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $labels[] = $date->isoFormat('D MMM'); 
            
            // Pendapatan hari itu
            $dailyRevenue = Order::where('status', 'picked_up')
                ->whereDate('updated_at', $date)
                ->sum('total_price');
                
            // Pengeluaran hari itu
            $dailyExpense = FinancialReport::whereDate('tanggal', $date)
                ->sum('nominal');

            $revenues[] = (float) $dailyRevenue;
            $expenses[] = (float) $dailyExpense;
            $profits[] = (float) ($dailyRevenue - $dailyExpense);
        }

        $chartData = [
            'labels'   => $labels,
            'revenues' => $revenues,
            'expenses' => $expenses,
            'profits'  => $profits,
        ];

        return Inertia::render('Admin/Dashboard', [
            'totalOrders'     => $totalOrders,
            'totalPelanggan'  => $totalPelanggan,
            'totalPendapatan' => $totalPendapatan,
            'pengeluaran'     => $pengeluaran,
            'topCustomers'    => $topCustomers,
            'chartData'       => $chartData, 
        ]);
    }
}