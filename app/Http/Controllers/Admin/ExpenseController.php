<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Expense;

class ExpenseController extends Controller
{
    public function index()
    {
        // Ambil semua data pengeluaran, urutkan dari tanggal terbaru
        $expenses = Expense::latest('tanggal')->latest('id')->get();
        
        // Hitung total pengeluaran untuk ditampilkan di atas tabel
        $totalPengeluaran = $expenses->sum('nominal');

        return Inertia::render('Admin/Expense', [
            'expenses' => $expenses,
            'totalPengeluaran' => $totalPengeluaran
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'keterangan' => 'required|string|max:255',
            'nominal'    => 'required|numeric|min:1',
            'tanggal'    => 'required|date',
        ]);

        Expense::create([
            'keterangan' => $request->keterangan,
            'nominal'    => $request->nominal,
            'tanggal'    => $request->tanggal,
        ]);

        return back()->with('success', 'Data pengeluaran berhasil dicatat!');
    }

    public function destroy(Expense $expense)
    {
        $expense->delete();
        return back()->with('success', 'Data pengeluaran berhasil dihapus!');
    }
}