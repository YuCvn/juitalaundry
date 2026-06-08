<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FinancialReport; // Tetap gunakan model ini
use Inertia\Inertia;

class ExpenseController extends Controller
{
    public function index()
    {
        // Mengambil semua data pengeluaran, diurutkan dari yang terbaru
        $expenses = FinancialReport::latest('tanggal')->get();

        return Inertia::render('Admin/Expense', [
            'expenses' => $expenses
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'keterangan' => 'required|string|max:255',
            'nominal'    => 'required|numeric|min:0',
            'tanggal'    => 'required|date',
        ]);

        FinancialReport::create($request->all());

        return redirect()->back()->with('success', 'Pengeluaran Berhasil Ditambahkan');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'keterangan' => 'required|string|max:255',
            'nominal'    => 'required|numeric|min:0',
            'tanggal'    => 'required|date',
        ]);

        $expense = FinancialReport::findOrFail($id);
        $expense->update($request->all());

        return redirect()->back()->with('success', 'Data Pengeluaran Diperbarui');
    }

    public function destroy($id)
    {
        $expense = FinancialReport::findOrFail($id);
        $expense->delete();

        return redirect()->back()->with('success', 'Data Pengeluaran Dihapus');
    }
}