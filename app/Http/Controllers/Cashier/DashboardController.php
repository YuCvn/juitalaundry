<?php

namespace App\Http\Controllers\Cashier;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Membership;
use Inertia\Inertia;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    public function index()
    {

        config(['app.locale' => 'id']);
        Carbon::setLocale('id');

        $stats = [
            'order_berjalan' => Order::whereIn('status', ['pending', 'processing'])->count(),
            'menunggu'       => Order::where('status', 'pending')->count(),
            'diproses'       => Order::where('status', 'processing')->count(),
            'total_member'   => Membership::count(),
        ];

        $ordersDb = Order::whereIn('status', ['pending', 'processing'])
            ->orderBy('created_at', 'desc')
            ->take(5) 
            ->get();

        $recentOrders = $ordersDb->map(function ($order) {
            $statusMapping = [
                'pending'    => 'Menunggu',
                'processing' => 'Diproses',
                'completed'  => 'Selesai',
                'picked_up'  => 'Diambil',
            ];

            $tanggalRaw = $order->created_at ?? $order->order_date ?? null;
            $formatTanggal = $tanggalRaw ? Carbon::parse($tanggalRaw)->translatedFormat('d F Y, H:i') : null;

            return [
                'id'       => $order->order_id,
                'customer' => $order->customer_name,
                'status'   => $statusMapping[$order->status] ?? $order->status,
                'total'    => $order->total_price,
                'date'     => $formatTanggal, 
            ];
        });

        return Inertia::render('Cashier/DashboardCashierView', [
            'stats'        => $stats,
            'recentOrders' => $recentOrders
        ]);
    }
}