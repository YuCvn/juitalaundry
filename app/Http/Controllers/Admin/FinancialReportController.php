<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\Expense;
use Carbon\Carbon;

class FinancialReportController extends Controller
{
    public function index(Request $request)
    {
        $startDate = $request->input('start_date', Carbon::now()->startOfMonth()->toDateString());
        $endDate = $request->input('end_date', Carbon::now()->endOfMonth()->toDateString());

        $orders = Order::where('status_order', 'sudah diambil')
            ->whereBetween('updated_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
            ->get();
            
        $totalPendapatan = $orders->sum('total_harga');

        $expenses = Expense::whereBetween('tanggal', [$startDate, $endDate])->get();
        $totalPengeluaran = $expenses->sum('nominal');

        $netProfit = $totalPendapatan - $totalPengeluaran;

        return Inertia::render('Admin/FinancialReport', [
            'summary' => [
                'pendapatan'  => $totalPendapatan,
                'pengeluaran' => $totalPengeluaran,
                'profit'      => $netProfit,
            ],
            'orders'   => $orders,
            'expenses' => $expenses,
            'filters'  => [
                'start_date' => $startDate,
                'end_date'   => $endDate,
            ]
        ]);
    }
}