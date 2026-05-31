<?php

namespace App\Http\Controllers\Cashier;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Service;
use App\Models\Membership;
use App\Models\Order;
use App\Models\OrderDetail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with(['membership', 'details.service'])
                        ->latest()
                        ->get();

        return Inertia::render('Cashier/Orders', [
            'orders' => $orders
        ]);
    }

    public function create()
    {
        $services = Service::all();
        $memberships = Membership::all();

        return Inertia::render('Cashier/CreateOrder', [
            'services' => $services,
            'memberships' => $memberships
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'membership_id'      => 'nullable|exists:memberships,id',
            'nama'               => 'required|string|max:255',
            'telepon'            => 'required|string|max:20',
            'alamat'             => 'nullable|string',
            'metode_pengambilan' => 'required|in:ambil,antar',
            'jarak_pengiriman'   => 'nullable|numeric|min:0',
            'metode_pembayaran'  => 'required|in:langsung,nanti',
            'layanan'            => 'required|array|min:1',
            'layanan.*.service_id'=> 'required|exists:services,id',
            'layanan.*.qty'      => 'required|numeric|min:0.1',
            'layanan.*.price'    => 'required|numeric',
            'layanan.*.subtotal' => 'required|numeric',
        ]);

        DB::beginTransaction();

        try {
            // Kalkulasi Dasar
            $subtotalLayanan = collect($validated['layanan'])->sum('subtotal');
            $jarak = $validated['jarak_pengiriman'] ?? 0;
            
            $biayaOngkir = 0;
            if ($validated['metode_pengambilan'] === 'antar' && $jarak > 3) {
                $biayaOngkir = (ceil($jarak) - 3) * 2000;
            }

            $diskon = 0;
            $totalHarga = $subtotalLayanan + $biayaOngkir;

            // --- LOGIKA MEMBERSHIP: Diskon 10% & Potong Saldo ---
            if (!empty($validated['membership_id'])) {
                $membership = Membership::findOrFail($validated['membership_id']);
                
                // Beri Diskon 10% dari Subtotal Layanan
                $diskon = $subtotalLayanan * 0.10;
                $totalHarga = $subtotalLayanan - $diskon + $biayaOngkir;

                // Cek Saldo Apakah Cukup
                if ($membership->saldo < $totalHarga) {
                    return back()->withErrors(['error' => 'Saldo member tidak mencukupi untuk membayar tagihan.']);
                }

                // Potong Saldo Member
                $membership->decrement('saldo', $totalHarga);
            }

            // Generate Order ID Berurutan (ORD-01, ORD-02, dst)
            $latestOrder = Order::latest('id')->first();
            $nextId = $latestOrder ? $latestOrder->id + 1 : 1;
            $orderId = 'ORD-' . str_pad($nextId, 2, '0', STR_PAD_LEFT);

            // Simpan ke Tabel Orders
            $order = Order::create([
                'order_id'           => $orderId,
                'membership_id'      => $validated['membership_id'] ?: null,
                'nama'               => $validated['nama'],
                'nomor_telepon'      => $validated['telepon'],
                'alamat'             => $validated['alamat'],
                'tanggal_order'      => now(),
                'metode_pengambilan' => $validated['metode_pengambilan'],
                'jarak_pengiriman'   => $jarak,
                'biaya_ongkir'       => $biayaOngkir,
                'subtotal'           => $subtotalLayanan,
                'diskon'             => $diskon,
                'total_harga'        => $totalHarga,
                'metode_pembayaran'  => $validated['metode_pembayaran'],
                'status_order'       => 'menunggu',
            ]);

            // Simpan Item ke Tabel Order Details
            foreach ($validated['layanan'] as $item) {
                OrderDetail::create([
                    'order_id'   => $order->id,
                    'service_id' => $item['service_id'],
                    'harga'      => $item['price'],
                    'qty'        => $item['qty'],
                    'subtotal'   => $item['subtotal'],
                ]);
            }

            DB::commit();

            return redirect()->route('cashier.orders.index')->with('success', 'Pesanan berhasil dibuat!');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal membuat pesanan: ' . $e->getMessage()]);
        }
    }

    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status_order' => 'required|in:menunggu,dalam proses,selesai,sudah diambil'
        ]);

        $order->update([
            'status_order' => $request->status_order
        ]);

        return back(); 
    }
}