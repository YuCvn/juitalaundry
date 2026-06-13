import React, { useState } from 'react';
import { Head, usePage, useForm, router } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';

export default function ExpenseView({ expenses, totalExpenses, thisMonthExpenses, todayExpenses }) {
    const { expenses = [], totalPengeluaran = 0 } = usePage().props;
    const [showModal, setShowModal] = useState(false);
    
    const [editingExpense, setEditingExpense] = useState(null); 

    const { data, setData, post, put, processing, reset, errors, transform, clearErrors } = useForm({
        kategori: 'Operasional (Listrik, Air)',
        deskripsi: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
    });

    transform((data) => ({
        description: `${data.kategori}: ${data.deskripsi}`,
        amount: data.amount,
        date: data.date,
    }));

    const openAddModal = () => {
        reset();
        clearErrors();
        setEditingExpense(null);
        setShowModal(true);
    };

    const openEditModal = (expense) => {
        const [kategori, ...descArr] = expense.description.split(': ');
        const deskripsi = descArr.join(': ') || '';

        clearErrors();
        setData({
            kategori: kategori || 'Lain-lain',
            deskripsi: deskripsi,
            amount: expense.amount,
            date: expense.date,
        });
        setEditingExpense(expense);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingExpense(null);
        reset();
        clearErrors();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (editingExpense) {
            put(`/admin/expenses/${editingExpense.id}`, {
                onSuccess: () => closeModal()
            });
        } else {
            post('/admin/expenses', {
                onSuccess: () => closeModal()
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus data pengeluaran ini?')) {
            router.delete(`/admin/expenses/${id}`);
        }
    };

    const formatRp = (angka) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka || 0);
    };

    const formatTanggal = (tanggalString) => {
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return new Date(tanggalString).toLocaleDateString('id-ID', options);
    };

    const getKategoriTerbanyak = () => {
        if (expenses.length === 0) return '-';
        const categories = expenses.map(e => e.description.split(': ')[0]);
        const mode = categories.sort((a,b) =>
            categories.filter(v => v===a).length - categories.filter(v => v===b).length
        ).pop();
        return mode;
    };

    return (
        <AdminLayout title="Pengeluaran">
            <Head title="Pengeluaran - Juita Laundry" />
            
            <div className="max-w-7xl mx-auto relative">
                
                {/* Header Utama */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-4">
                    <h2 className="text-xl font-semibold text-gray-800">Manajemen Pengeluaran</h2>
                    
                    <button 
                        onClick={openAddModal}
                        className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-semibold py-2 px-5 rounded-lg flex items-center transition-all shadow-sm text-xs"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Pengeluaran Baru
                    </button>
                </div>

                {/* 3 Card Informasi */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
    
                    <div className="rounded-xl py-3 px-5 shadow-sm bg-sky-500 flex justify-between items-center cursor-default">
                        <div>
                            <p className="text-[11px] font-semibold text-white/90 mb-0.5">Total Bulan Ini</p>
                            <h3 className="text-2xl font-bold text-white">{formatRp(totalPengeluaran)}</h3>
                        </div>
                        <svg className="w-8 h-8 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                    </div>

                    <div className="bg-white rounded-xl py-3 px-5 shadow-sm border border-cyan-400 flex justify-between items-center cursor-default">
                        <div>
                            <p className="text-[11px] font-semibold text-gray-500 mb-0.5">Total Transaksi</p>
                            <h3 className="text-2xl font-semibold text-gray-800">{expenses.length}</h3>
                        </div>
                        <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>

                    <div className="bg-white rounded-xl py-3 px-5 shadow-sm border border-cyan-400 flex justify-between items-center cursor-default">
                        <div>
                            <p className="text-[11px] font-semibold text-gray-500 mb-0.5">Kategori Terbanyak</p>
                            <h3 className="text-lg font-semibold text-gray-800 truncate pr-2 max-w-[200px]">
                                {getKategoriTerbanyak()}
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Card Tabel */}
                <div className="bg-white rounded-xl shadow-sm border border-cyan-400 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="text-[12px] text-cyan-800 font-normal bg-cyan-100 border-b border-cyan-400 tracking-wide">
                                <tr>
                                    <th scope="col" className="px-5 py-3">Tanggal</th>
                                    <th scope="col" className="px-5 py-3">Kategori</th>
                                    <th scope="col" className="px-5 py-3">Deskripsi</th>
                                    <th scope="col" className="px-5 py-3">Jumlah</th>
                                    <th scope="col" className="px-5 py-3 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">

                                {expenses.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-16">
                                            <div className="flex flex-col items-center justify-center text-center">
                                                <div className="text-cyan-400 mb-3">
                                                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                                                </div>
                                                <p className="text-gray-500 text-sm mb-5 font-medium">Belum ada pengeluaran</p>
                                                <button onClick={openAddModal} className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-semibold py-2 px-5 rounded-lg flex items-center transition-all shadow-sm text-xs">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                                    Tambah Pengeluaran
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    expenses.map((expense) => {
                                        const [kategori, ...descArr] = expense.description.split(': ');
                                        const deskripsi = descArr.join(': ') || '-';

                                        return (
                                            <tr key={expense.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-5 py-3.5 text-xs text-gray-700 font-medium">{formatTanggal(expense.date)}</td>
                                                <td className="px-5 py-3.5">
                                                    <span className="bg-cyan-50 text-cyan-700 border border-cyan-100 px-2.5 py-1 rounded-full text-[10px] font-semibold">
                                                        {kategori}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3.5 text-xs text-gray-600">{deskripsi}</td>
                                                <td className="px-5 py-3.5 text-xs font-semibold text-rose-500">{formatRp(expense.amount)}</td>
                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center justify-center space-x-2">
                                                        <button 
                                                            onClick={() => openEditModal(expense)}
                                                            className="text-cyan-500 hover:bg-cyan-50 p-1.5 rounded-lg transition-colors border border-transparent hover:border-cyan-100"
                                                            title="Edit Pengeluaran"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(expense.id)}
                                                            className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                                            title="Hapus Pengeluaran"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}

                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* MODAL POP-UP */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-opacity">
                    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        
                        <div className="px-5 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h2 className="text-sm font-semibold text-gray-800">
                                {editingExpense ? 'Edit Pengeluaran' : 'Pengeluaran Baru'}
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:bg-gray-200 hover:text-gray-600 rounded-full p-1 transition-colors">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="p-5">
                            <form className="space-y-3" onSubmit={handleSubmit}>
                                
                                <div>
                                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                                        Tanggal <span className="text-red-500 ml-0.5">*</span>
                                    </label>
                                    <input 
                                        type="date" 
                                        value={data.date}
                                        onChange={e => setData('date', e.target.value)}
                                        className="w-full px-3 py-2 text-xs border border-cyan-400 rounded-lg focus:ring-2 focus:ring-cyan-200 focus:border-cyan-500 outline-none transition-all text-gray-700" 
                                    />
                                    {errors.date && <span className="text-[10px] text-red-500 mt-1">{errors.date}</span>}
                                </div>

                                <div>
                                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                                        Kategori <span className="text-red-500 ml-0.5">*</span>
                                    </label>
                                    <select 
                                        value={data.kategori}
                                        onChange={e => setData('kategori', e.target.value)}
                                        className="w-full px-3 py-2 text-xs border border-cyan-400 rounded-lg focus:ring-2 focus:ring-cyan-200 focus:border-cyan-500 outline-none transition-all text-gray-700 bg-white"
                                    >
                                        <option value="Operasional (Listrik, Air)">Operasional (Listrik, Air)</option>
                                        <option value="Bahan Baku (Deterjen, Pewangi)">Bahan Baku (Deterjen, Pewangi)</option>
                                        <option value="Gaji Karyawan">Gaji Karyawan</option>
                                        <option value="Lain-lain">Lain-lain</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                                        Jumlah <span className="text-red-500 ml-0.5">*</span>
                                    </label>
                                    <input 
                                        type="number" 
                                        min="1"
                                        placeholder="Contoh: 50000" 
                                        value={data.amount}
                                        onChange={e => setData('amount', e.target.value)}
                                        className="w-full px-3 py-2 text-xs border border-cyan-400 rounded-lg focus:ring-2 focus:ring-cyan-200 focus:border-cyan-500 outline-none transition-all text-gray-700" 
                                    />
                                    {errors.amount && <span className="text-[10px] text-red-500 mt-1">{errors.amount}</span>}
                                </div>

                                <div>
                                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                                        Deskripsi <span className="text-red-500 ml-0.5">*</span>
                                    </label>
                                    <textarea 
                                        placeholder="Contoh: Beli token listrik" 
                                        rows="2" 
                                        value={data.deskripsi}
                                        onChange={e => setData('deskripsi', e.target.value)}
                                        className="w-full px-3 py-2 text-xs border border-cyan-400 rounded-lg focus:ring-2 focus:ring-cyan-200 focus:border-cyan-500 outline-none transition-all resize-none text-gray-700"
                                    ></textarea>
                                    {errors.description && <span className="text-[10px] text-red-500 mt-1">{errors.description}</span>}
                                </div>

                                <div className="flex gap-2 pt-3 mt-2">
                                    <button 
                                        type="button" 
                                        onClick={closeModal} 
                                        className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-600 font-semibold py-2 px-3 text-xs rounded-lg transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={processing}
                                        className="flex-1 disabled:opacity-50 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-semibold py-2 px-3 text-xs rounded-lg transition-all shadow-sm flex items-center justify-center"
                                    >
                                        {processing ? 'Loading...' : (editingExpense ? 'Update Data' : 'Simpan Data')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

        </AdminLayout>
    );
}