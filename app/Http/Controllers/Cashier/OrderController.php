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
            'services.*.price'  => 'required|numeric',
            'services.*.subtotal'=> 'required|numeric',
        ]);

        DB::beginTransaction();

        try {
            // Kalkulasi Dasar
            $subtotalServices = collect($validated['services'])->sum('subtotal');
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
                
                // Diskon 10%
                $discount = $subtotalServices * 0.10;
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
                'status'            => 'pending', // Status dalam bahasa inggris
            ]);

            // Simpan Detail Order
            foreach ($validated['services'] as $item) {
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
}