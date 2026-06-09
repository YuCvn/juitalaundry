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
use Illuminate\Support\Facades\Auth; 

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with(['membership', 'details.service', 'user'])
                        ->whereDate('created_at', today())
                        ->orWhereIn('status', ['pending', 'processing'])
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

        // PROTEKSI XSS
        $validated['customer_name'] = strip_tags($validated['customer_name']);
        if (!empty($validated['address'])) {
            $validated['address'] = strip_tags($validated['address']);
        }

        DB::beginTransaction();

        try {
            // PROTEKSI MANIPULASI HARGA
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

            // Kalkulasi Dasar & Ongkir
            $distance = $validated['delivery_distance'] ?? 0;
            $deliveryFee = 0;
            if ($validated['pickup_method'] === 'delivery' && $distance > 3) {
                $deliveryFee = (ceil($distance) - 3) * 2000;
            }

            $discount = 0;
            $totalPrice = $subtotalServices + $deliveryFee;

            // LOGIKA MEMBERSHIP
            if (!empty($validated['membership_id'])) {
                $membership = Membership::findOrFail($validated['membership_id']);
                
                $discount = $subtotalServices * 0.10;
                $totalPrice = $subtotalServices - $discount + $deliveryFee;

                if ($membership->balance < $totalPrice) {
                    return back()->withErrors(['error' => 'Saldo member tidak mencukupi untuk membayar tagihan.']);
                }

                $membership->decrement('balance', $totalPrice);
            }

            // PROTEKSI RACE CONDITION: Generate Order ID yang aman
            $latestOrder = Order::lockForUpdate()->latest('id')->first();
            $nextId = $latestOrder ? $latestOrder->id + 1 : 1;
            $orderId = 'ORD-' . str_pad($nextId, 4, '0', STR_PAD_LEFT);

            // SIMPAN ORDER + PROTEKSI AKUNTABILITAS KASIR
            $order = Order::create([
                'order_id'          => $orderId,
                'user_id'           => Auth::id(), // <--- MEREKAM ID KASIR YANG LOGIN
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
        $order = Order::with(['membership', 'details.service', 'user'])->findOrFail($id);

        return view('print.nota', compact('order'));
    }
}