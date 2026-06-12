<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\FinancialReport;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon; 

class DashboardController extends Controller
{
    public function index()
    {
        $completedOrders = Order::where('status', 'picked_up');

        $totalOrders = $completedOrders->count();
        $totalPendapatan = $completedOrders->sum('total_price');
        $totalPelanggan = Order::where('status', 'picked_up')
            ->distinct('customer_name')
            ->count('customer_name');

        $topCustomers = Order::where('status', 'picked_up')
            ->select('customer_name', DB::raw('count(id) as total_orders'), DB::raw('sum(total_price) as total_spent'))
            ->groupBy('customer_name')
            ->orderByDesc('total_spent')
            ->take(5)
            ->get();

        $pengeluaran = FinancialReport::sum('amount');

        $labels = [];
        $revenues = [];
        $expenses = [];
        $profits = [];


        $startDate = Carbon::today()->subDays(6);
        $endDate = Carbon::today()->endOfDay();


        $revenuesData = Order::selectRaw('DATE(updated_at) as date, SUM(total_price) as total')
            ->where('status', 'picked_up')
            ->whereBetween('updated_at', [$startDate, $endDate])
            ->groupBy('date')
            ->pluck('total', 'date');


        $expensesData = FinancialReport::selectRaw('DATE(date) as date, SUM(amount) as total')
            ->whereBetween('date', [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')])
            ->groupBy('date')
            ->pluck('total', 'date');


        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $dateString = $date->format('Y-m-d');

            $labels[] = $date->isoFormat('D MMM'); 
            

            $dailyRev = (float) ($revenuesData[$dateString] ?? 0);
            $dailyExp = (float) ($expensesData[$dateString] ?? 0);

            $revenues[] = $dailyRev;
            $expenses[] = $dailyExp;
            $profits[]  = $dailyRev - $dailyExp;
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