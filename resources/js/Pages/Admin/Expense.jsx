import React, { useState } from 'react';
import { Head, usePage, useForm, router } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';

export default function Pengeluaran() {
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
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h2 className="text-2xl font-bold text-gray-800">Manajemen Pengeluaran</h2>
                    
                    <button 
                        onClick={openAddModal}
                        className="bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold py-2.5 px-5 rounded-lg flex items-center transition-colors shadow-sm"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Pengeluaran Baru
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-[#3b82f6] rounded-xl p-6 text-white shadow-sm flex justify-between items-center cursor-default">
                        <div>
                            <p className="text-sm font-semibold text-sky-100 mb-1">Total Pengeluaran</p>
                            <h3 className="text-3xl font-bold">{formatRp(totalPengeluaran)}</h3>
                        </div>
                        <svg className="w-10 h-10 text-white opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex justify-between items-center cursor-default">
                        <div>
                            <p className="text-sm font-semibold text-gray-500 mb-1">Total Transaksi</p>
                            <h3 className="text-3xl font-bold text-gray-800">{expenses.length}</h3>
                        </div>
                        <svg className="w-10 h-10 text-[#3b82f6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex justify-between items-center cursor-default">
                        <div>
                            <p className="text-sm font-semibold text-gray-500 mb-1">Kategori Terbanyak</p>
                            <h3 className="text-xl font-bold text-gray-800 truncate pr-2 max-w-[200px]">
                                {getKategoriTerbanyak()}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-[#3b82f6]/30 overflow-hidden min-h-[400px]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="text-xs text-gray-700 font-bold bg-[#eff6ff] border-b border-[#3b82f6]/20">
                                <tr>
                                    <th scope="col" className="px-6 py-4">Tanggal</th>
                                    <th scope="col" className="px-6 py-4">Kategori</th>
                                    <th scope="col" className="px-6 py-4">Deskripsi</th>
                                    <th scope="col" className="px-6 py-4">Jumlah</th>
                                    <th scope="col" className="px-6 py-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>

                                {expenses.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-20">
                                            <div className="flex flex-col items-center justify-center text-center">
                                                <div className="text-[#3b82f6] mb-4">
                                                    <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                                                </div>
                                                <p className="text-gray-500 text-base mb-6">Belum ada pengeluaran</p>
                                                <button onClick={openAddModal} className="bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold py-2.5 px-6 rounded-lg flex items-center transition-colors shadow-sm">
                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
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
                                            <tr key={expense.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-gray-800">{formatTanggal(expense.date)}</td>
                                                <td className="px-6 py-4"><span className="bg-sky-100 text-sky-700 px-3 py-1 rounded-full text-xs font-semibold">{kategori}</span></td>
                                                <td className="px-6 py-4">{deskripsi}</td>
                                                <td className="px-6 py-4 font-bold text-rose-500">{formatRp(expense.amount)}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center space-x-3">
                                                        {/* TOMBOL EDIT - WARNA NILA (INDIGO) */}
                                                        <button 
                                                            onClick={() => openEditModal(expense)}
                                                            className="text-indigo-500 hover:text-indigo-700 transition-colors p-1"
                                                            title="Edit Pengeluaran"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                        </button>
                                                        {/* TOMBOL DELETE - WARNA MERAH (RED) */}
                                                        <button 
                                                            onClick={() => handleDelete(expense.id)}
                                                            className="text-red-500 hover:text-red-700 transition-colors p-1"
                                                            title="Hapus Pengeluaran"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm transition-opacity">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        
                        <div className={`px-6 py-5 text-white flex items-center ${editingExpense ? 'bg-gradient-to-r from-indigo-500 to-indigo-700' : 'bg-gradient-to-r from-[#3b82f6] to-[#2563eb]'}`}>
                            {editingExpense ? (
                                <svg className="w-7 h-7 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            ) : (
                                <svg className="w-7 h-7 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                            )}
                            <div>
                                <h2 className="text-xl font-bold">{editingExpense ? 'Edit Pengeluaran' : 'Tambah Pengeluaran Baru'}</h2>
                                <p className="text-xs text-white/80 mt-0.5">{editingExpense ? 'Perbarui data pengeluaran' : 'Catat pengeluaran bisnis Anda'}</p>
                            </div>
                        </div>

                        <div className="p-6">
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div>
                                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-1">
                                        <span className={`mr-1 text-base ${editingExpense ? 'text-indigo-500' : 'text-[#3b82f6]'}`}>$</span> Kategori <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <select 
                                        value={data.kategori}
                                        onChange={e => setData('kategori', e.target.value)}
                                        className={`w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 outline-none transition-all text-gray-600 bg-white ${editingExpense ? 'focus:ring-indigo-500 focus:border-indigo-500' : 'focus:ring-[#3b82f6] focus:border-[#3b82f6]'}`}
                                    >
                                        <option value="Operasional (Listrik, Air)">Operasional (Listrik, Air)</option>
                                        <option value="Bahan Baku (Deterjen, Pewangi)">Bahan Baku (Deterjen, Pewangi)</option>
                                        <option value="Gaji Karyawan">Gaji Karyawan</option>
                                        <option value="Lain-lain">Lain-lain</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Jumlah <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <input 
                                        type="number" 
                                        min="1"
                                        placeholder="50000" 
                                        value={data.amount}
                                        onChange={e => setData('amount', e.target.value)}
                                        className={`w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 outline-none transition-all ${editingExpense ? 'focus:ring-indigo-500 focus:border-indigo-500' : 'focus:ring-[#3b82f6] focus:border-[#3b82f6]'}`} 
                                    />
                                    {errors.amount && <span className="text-xs text-red-500 mt-1">{errors.amount}</span>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Deskripsi <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <textarea 
                                        placeholder="Deskripsi pengeluaran" 
                                        rows="3" 
                                        value={data.deskripsi}
                                        onChange={e => setData('deskripsi', e.target.value)}
                                        className={`w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 outline-none transition-all resize-none ${editingExpense ? 'focus:ring-indigo-500 focus:border-indigo-500' : 'focus:ring-[#3b82f6] focus:border-[#3b82f6]'}`}
                                    ></textarea>
                                    {errors.description && <span className="text-xs text-red-500 mt-1">{errors.description}</span>}
                                </div>

                                <div>
                                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-1">
                                        <svg className={`w-4 h-4 mr-1 ${editingExpense ? 'text-indigo-500' : 'text-[#3b82f6]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        Tanggal <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <input 
                                        type="date" 
                                        value={data.date}
                                        onChange={e => setData('date', e.target.value)}
                                        className={`w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 outline-none transition-all text-gray-600 ${editingExpense ? 'focus:ring-indigo-500 focus:border-indigo-500' : 'focus:ring-[#3b82f6] focus:border-[#3b82f6]'}`} 
                                    />
                                    {errors.date && <span className="text-xs text-red-500 mt-1">{errors.date}</span>}
                                </div>

                                <div className="flex gap-3 pt-4 mt-2">
                                    <button 
                                        type="button" 
                                        onClick={closeModal} 
                                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={processing}
                                        className={`flex-1 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-xl transition-colors shadow-md ${editingExpense ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-[#3b82f6] hover:bg-[#2563eb]'}`}
                                    >
                                        {processing ? 'Menyimpan...' : (editingExpense ? 'Update Data' : 'Simpan Data')}
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