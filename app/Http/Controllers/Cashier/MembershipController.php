<?php

namespace App\Http\Controllers\Cashier;

use App\Http\Controllers\Controller;
use App\Models\Membership;
use App\Models\MembershipHistory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MembershipController extends Controller
{
    public function index()
    {
        $memberships = Membership::latest()->get();
        // Mengambil semua riwayat beserta data member-nya
        $histories = MembershipHistory::with('membership')->latest()->get();

        return Inertia::render('Cashier/Membership', [
            'memberships' => $memberships,
            'histories' => $histories // Kirim ke React
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_lengkap' => 'required|string|max:255',
            'nomor_telepon' => 'required|string|max:20|unique:memberships,nomor_telepon',
            'alamat' => 'nullable|string',
            'saldo' => 'nullable|numeric|min:0',
        ]);

        $membership = Membership::create([
            'nama_lengkap' => $request->nama_lengkap,
            'nomor_telepon' => $request->nomor_telepon,
            'alamat' => $request->alamat,
            'saldo' => $request->saldo ?? 0,
        ]);

        // LOG OTOMATIS: Pendaftaran
        MembershipHistory::create([
            'membership_id' => $membership->id,
            'type' => 'Pendaftaran Membership',
            'nominal' => $request->saldo ?? 0,
            'saldo_akhir' => $request->saldo ?? 0,
        ]);

        return redirect()->back()->with('success', 'Member berhasil ditambahkan.');
    }

    public function update(Request $request, Membership $membership)
    {
        $request->validate([
            'nama_lengkap' => 'required|string|max:255',
            'nomor_telepon' => 'required|string|max:20|unique:memberships,nomor_telepon,' . $membership->id,
            'alamat' => 'nullable|string',
            'saldo' => 'required|numeric|min:0',
        ]);

        $oldSaldo = $membership->saldo;
        $newSaldo = $request->saldo;

        $membership->update($request->all());

        // LOG OTOMATIS: Jika saldo baru lebih besar dari saldo lama, berarti ada Top-Up!
        if ($newSaldo > $oldSaldo) {
            MembershipHistory::create([
                'membership_id' => $membership->id,
                'type' => 'Top-up Saldo',
                'nominal' => $newSaldo - $oldSaldo, // Selisihnya adalah nominal top up
                'saldo_akhir' => $newSaldo,
            ]);
        }

        return redirect()->back()->with('success', 'Data member berhasil diperbarui.');
    }

    public function destroy(Membership $membership)
    {
        $membership->delete(); // Riwayatnya akan otomatis terhapus karena on-delete cascade di migration
        return redirect()->back()->with('success', 'Member berhasil dihapus.');
    }
}