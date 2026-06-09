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
            'membership_id'     => 'nullable|exists:memberships,id',
            'customer_name'     => 'required|string|max:255',
            'phone_number'      => 'required|string|max:20',
            'address'           => 'nullable|string',
            'pickup_method'     => 'required|in:pickup,delivery',
            'delivery_distance' => 'nullable|numeric|min:0',
            'payment_method'    => 'required|in:upfront,pay_later',
            'services'          => 'required|array|min:1',
            'services.*.service_id'=> 'required|exists:services,id',
            'services.*.qty'    => 'required|numeric|min:0.1',
            // Kita tetap biarkan validasi price & subtotal agar frontend tidak error, 
            // tapi nilainya akan kita abaikan di backend demi keamanan.
            'services.*.price'  => 'required|numeric',
            'services.*.subtotal'=> 'required|numeric',
        ]);

        // PROTEKSI XSS: Bersihkan input teks dari tag HTML/Script berbahaya
        $validated['customer_name'] = strip_tags($validated['customer_name']);
        if (!empty($validated['address'])) {
            $validated['address'] = strip_tags($validated['address']);
        }

        DB::beginTransaction();

        try {
            $serviceIds = collect($validated['services'])->pluck('service_id');

            $dbServices = Service::whereIn('id', $serviceIds)->get()->keyBy('id');

            $subtotalServices = 0;
            $orderItems = [];

            foreach ($validated['services'] as $item) {

                $service = $dbServices[$item['service_id']]; 
                
                $actualPrice = $service->price; 
                $actualSubtotal = $actualPrice * $item['qty'];
                
                $subtotalServices += $actualSubtotal;

                $orderItems[] = [
                    'service_id' => $item['service_id'],
                    'price'      => $actualPrice,
                    'qty'        => $item['qty'],
                    'subtotal'   => $actualSubtotal,
                ];
            }
            // -------------------------------------------------

            // Kalkulasi Jarak & Ongkir
            $distance = $validated['delivery_distance'] ?? 0;
            $deliveryFee = 0;
            if ($validated['pickup_method'] === 'delivery' && $distance > 3) {
                $deliveryFee = (ceil($distance) - 3) * 2000;
            }

            $discount = 0;
            $totalPrice = $subtotalServices + $deliveryFee;

            // --- LOGIKA MEMBERSHIP ---
            if (!empty($validated['membership_id'])) {
                $membership = Membership::findOrFail($validated['membership_id']);
                
                $discount = $subtotalServices * 0.04;
                $totalPrice = $subtotalServices - $discount + $deliveryFee;

                if ($membership->balance < $totalPrice) {
                    return back()->withErrors(['error' => 'Saldo member tidak mencukupi untuk membayar tagihan.']);
                }

                $membership->decrement('balance', $totalPrice);
            }

            // Generate Order ID
            $latestOrder = Order::latest('id')->first();
            $nextId = $latestOrder ? $latestOrder->id + 1 : 1;
            $orderId = 'ORD-' . str_pad($nextId, 2, '0', STR_PAD_LEFT);

            // Simpan Order
            $order = Order::create([
                'order_id'          => $orderId,
                'membership_id'     => $validated['membership_id'] ?: null,
                'customer_name'     => $validated['customer_name'],
                'phone_number'      => $validated['phone_number'],
                'address'           => $validated['address'],
                'order_date'        => now(),
                'pickup_method'     => $validated['pickup_method'],
                'delivery_distance' => $distance,
                'delivery_fee'      => $deliveryFee,
                'subtotal'          => $subtotalServices,
                'discount'          => $discount,
                'total_price'       => $totalPrice,
                'payment_method'    => $validated['payment_method'],
                'status'            => 'pending', 
            ]);

            // Simpan Detail Order menggunakan data dari $orderItems yang sudah divalidasi keamanannya
            foreach ($orderItems as $item) {
                OrderDetail::create([
                    'order_id'   => $order->id,
                    'service_id' => $item['service_id'],
                    'price'      => $item['price'],
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
            'status' => 'required|in:pending,processing,completed,picked_up'
        ]);

        $order->update([
            'status' => $request->status
        ]);

        return back(); 
    }

    public function print($id)
    {
        $order = Order::with(['membership', 'details.service'])->findOrFail($id);

        return view('print.nota', compact('order'));
    }
}