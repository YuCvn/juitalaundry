<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServiceController extends Controller
{
    public function index()
{
    
    $services = Service::all(); 
    
    return Inertia::render('Admin/Services', [
        'services' => $services
    ]);
}

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category' => 'required|in:kiloan,lainnya',
            'name' => 'required|string|max:255',
            'type' => 'nullable|string|max:255',
            'price' => 'required|numeric|min:0',
            'unit' => 'required|string|max:50',
            'is_active' => 'boolean',
        ]);

        Service::create($validated);

        return redirect()->back();
    }

    public function update(Request $request, Service $service)
    {
        $validated = $request->validate([
            'category' => 'required|in:kiloan,lainnya',
            'name' => 'required|string|max:255',
            'type' => 'nullable|string|max:255',
            'price' => 'required|numeric|min:0',
            'unit' => 'required|string|max:50',
            'is_active' => 'boolean',
        ]);

        $service->update($validated);

        return redirect()->back();
    }

    public function destroy(Service $service)
    {
        $isUsed = \App\Models\OrderDetail::where('service_id', $service->id)->exists();

        if ($isUsed) {
            return redirect()->back()->with('error', 'Layanan tidak bisa dihapus karena sudah tercatat dalam riwayat pesanan pelanggan. Silakan nonaktifkan (uncheck is_active) saja.');
        }

        $service->delete();
        return redirect()->back()->with('success', 'Layanan berhasil dihapus secara permanen.');
    }
}