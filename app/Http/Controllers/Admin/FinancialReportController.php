<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\FinancialReport;
use Carbon\Carbon;

class FinancialReportController extends Controller
{
    public function index(Request $request)
    {
        $startDate = $request->input('start_date', Carbon::now()->startOfMonth()->toDateString());
        $endDate = $request->input('end_date', Carbon::now()->endOfMonth()->toDateString());

        $orders = Order::where('status', 'picked_up')
            ->whereBetween('updated_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
            ->get();
            
        $totalPendapatan = $orders->sum('total_price');

        $expenses = FinancialReport::whereBetween('tanggal', [$startDate, $endDate])->get();
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
    
    public function exportCsv(Request $request)
    {
        $startDate = $request->input('start_date', Carbon::now()->startOfMonth()->toDateString());
        $endDate = $request->input('end_date', Carbon::now()->endOfMonth()->toDateString());

        $orders = Order::where('status', 'picked_up')
            ->whereBetween('updated_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
            ->get();

        $expenses = FinancialReport::whereBetween('tanggal', [$startDate, $endDate])->get();

        $csvData = [];
        $csvData[] = ['Tanggal', 'Tipe', 'Keterangan / Pelanggan', 'Pemasukan (Rp)', 'Pengeluaran (Rp)'];

        foreach ($orders as $order) {
            $csvData[] = [
                Carbon::parse($order->updated_at)->format('Y-m-d'),
                'Pendapatan',
                $order->order_id . ' - ' . $order->customer_name,
                $order->total_price,
                0
            ];
        }

        foreach ($expenses as $expense) {
            $csvData[] = [
                Carbon::parse($expense->tanggal)->format('Y-m-d'),
                'Pengeluaran',
                $expense->keterangan,
                0,
                $expense->nominal
            ];
        }

        usort($csvData, function ($a, $b) {
            if ($a[0] === 'Tanggal') return -1; 
            if ($b[0] === 'Tanggal') return 1;
            return strtotime($a[0]) <=> strtotime($b[0]);
        });

        $filename = "laporan_keuangan_{$startDate}_sampai_{$endDate}.csv";

        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $callback = function () use ($csvData) {
            $file = fopen('php://output', 'w');
            foreach ($csvData as $row) {
                fputcsv($file, $row);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}