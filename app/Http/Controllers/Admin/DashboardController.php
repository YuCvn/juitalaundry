<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\Expense; // Import model Expense
use Illuminate\Support\Facades\DB;
use Carbon\Carbon; // Import Carbon untuk manipulasi tanggal

class DashboardController extends Controller
{
    public function index()
    {
        $completedOrders = Order::where('status_order', 'sudah diambil');

        $totalOrders = $completedOrders->count();
        $totalPendapatan = $completedOrders->sum('total_harga');

        $totalPelanggan = Order::where('status_order', 'sudah diambil')
            ->distinct('nama')
            ->count('nama');

        $topCustomers = Order::where('status_order', 'sudah diambil')
            ->select('nama', DB::raw('count(id) as total_orders'), DB::raw('sum(total_harga) as total_spent'))
            ->groupBy('nama')
            ->orderByDesc('total_spent')
            ->take(5)
            ->get();

        // 4. Ambil Total Pengeluaran Sesungguhnya
        $pengeluaran = Expense::sum('nominal');

        // 5. Kalkulasi Data Grafik (7 Hari Terakhir)
        $labels = [];
        $revenues = [];
        $expenses = [];
        $profits = [];

        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $labels[] = $date->isoFormat('D MMM'); // Hasil: "26 Mei"
            
            // Pendapatan hari itu (berdasarkan waktu diambil / update terakhir)
            $dailyRevenue = Order::where('status_order', 'sudah diambil')
                ->whereDate('updated_at', $date)
                ->sum('total_harga');
                
            // Pengeluaran hari itu
            $dailyExpense = Expense::whereDate('tanggal', $date)
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
            'chartData'       => $chartData, // Kirim data grafik ke React
        ]);
    }
}