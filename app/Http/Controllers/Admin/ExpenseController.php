<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FinancialReport; 
use Inertia\Inertia;

class ExpenseController extends Controller
{
    public function index()
    {
        // Mengambil semua data pengeluaran
        $expenses = FinancialReport::latest('date')->get();
        
        // MENGHITUNG TOTAL PENGELUARAN (Berdasarkan kolom 'amount')
        $totalPengeluaran = FinancialReport::sum('amount');

        return Inertia::render('Admin/Expense', [
            'expenses' => $expenses,
            'totalPengeluaran' => $totalPengeluaran // Mengirimkan total ke frontend
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'description' => 'required|string|max:255',
            'amount'      => 'required|numeric|min:0',
            'date'        => 'required|date',
        ]);

        $validated['description'] = strip_tags($validated['description']);

        FinancialReport::create($validated);

        return redirect()->back()->with('success', 'Pengeluaran Berhasil Ditambahkan');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'description' => 'required|string|max:255',
            'amount'      => 'required|numeric|min:0',
            'date'        => 'required|date',
        ]);

        $validated['description'] = strip_tags($validated['description']);

        $expense = FinancialReport::findOrFail($id);
        $expense->update($validated);

        return redirect()->back()->with('success', 'Data Pengeluaran Diperbarui');
    }

    public function destroy($id)
    {
        $expense = FinancialReport::findOrFail($id);
        $expense->delete();

        return redirect()->back()->with('success', 'Data Pengeluaran Dihapus');
    }
}