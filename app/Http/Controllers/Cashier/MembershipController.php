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
        $histories = MembershipHistory::with('membership')->latest()->get();

        return Inertia::render('Cashier/MembershipView', [
            'memberships' => $memberships,
            'histories' => $histories
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'full_name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20|unique:memberships,phone_number',
            'address' => 'nullable|string',
            'balance' => 'nullable|numeric|min:0',
            'loyalty_point' => 'nullable|integer|min:0',
        ]);

        $membership = Membership::create([
            'full_name' => strip_tags($request->full_name),
            'phone_number' => $request->phone_number,
            'address' => $request->address ? strip_tags($request->address) : null,
            'balance' => $request->balance ?? 0,
            'loyalty_point' => $request->loyalty_point ?? 0,
        ]);

        MembershipHistory::create([
            'membership_id' => $membership->id,
            'type' => 'Pendaftaran Membership',
            'amount' => $request->balance ?? 0,
            'final_balance' => $request->balance ?? 0,
        ]);

        return redirect()->back()->with('success', 'Member berhasil ditambahkan.');
    }

    public function update(Request $request, Membership $membership)
    {
        $request->validate([
            'full_name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20|unique:memberships,phone_number,' . $membership->id,
            'address' => 'nullable|string',
            'balance' => 'required|numeric|min:0',
            'loyalty_point' => 'nullable|integer|min:0',
        ]);

        $oldBalance = $membership->balance;
        $newBalance = $request->balance;

        $membership->update([
            'full_name' => strip_tags($request->full_name),
            'phone_number' => $request->phone_number,
            'address' => $request->address ? strip_tags($request->address) : null,
            'balance' => $newBalance,
            'loyalty_point' => $request->loyalty_point ?? $membership->loyalty_point,
        ]);

        if ($newBalance > $oldBalance) {
            MembershipHistory::create([
                'membership_id' => $membership->id,
                'type' => 'Top-up Saldo',
                'amount' => $newBalance - $oldBalance, 
                'final_balance' => $newBalance,
            ]);
        } elseif ($newBalance < $oldBalance) {
            MembershipHistory::create([
                'membership_id' => $membership->id,
                'type' => 'Pengurangan Saldo (Manual)',
                'amount' => $oldBalance - $newBalance, 
                'final_balance' => $newBalance,
            ]);
        }

        return redirect()->back()->with('success', 'Data member berhasil diperbarui.');
    }

    public function destroy(Membership $membership)
    {
        $membership->delete();
        return redirect()->back()->with('success', 'Member berhasil dihapus.');
    }
}