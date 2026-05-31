import React, { useState } from 'react';
import { Head, usePage, useForm, router } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';

export default function Pengeluaran() {
    const { expenses = [], totalPengeluaran = 0 } = usePage().props;
    const [showModal, setShowModal] = useState(false);

    // --- FORM SETUP ---
    const { data, setData, post, processing, reset, errors, transform } = useForm({
        kategori: 'Operasional (Listrik, Air)',
        deskripsi: '',
        nominal: '',
        tanggal: new Date().toISOString().split('T')[0],
    });

    // Menggabungkan kategori & deskripsi menjadi satu string "keterangan" sebelum dikirim ke DB
    transform((data) => ({
        keterangan: `${data.kategori}: ${data.deskripsi}`,
        nominal: data.nominal,
        tanggal: data.tanggal,
    }));

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/pengeluaran', {
            onSuccess: () => {
                setShowModal(false);
                reset('deskripsi', 'nominal');
            }
        });
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus data pengeluaran ini?')) {
            router.delete(`/admin/pengeluaran/${id}`);
        }
    };

    // --- HELPER FORMATTING ---
    const formatRp = (angka) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka || 0);
    };

    const formatTanggal = (tanggalString) => {
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return new Date(tanggalString).toLocaleDateString('id-ID', options);
    };

    // --- KALKULASI KATEGORI TERBANYAK ---
    const getKategoriTerbanyak = () => {
        if (expenses.length === 0) return '-';
        const categories = expenses.map(e => e.keterangan.split(': ')[0]);
        const mode = categories.sort((a,b) =>
            categories.filter(v => v===a).length - categories.filter(v => v===b).length
        ).pop();
        return mode;
    };

    return (
        <AdminLayout title="Pengeluaran">
            <Head title="Pengeluaran - Juita Laundry" />
            
            <div className="max-w-7xl mx-auto relative">
                
                {/* Header Halaman & Tombol Tambah  */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h2 className="text-2xl font-bold text-gray-800">Manajemen Pengeluaran</h2>
                    
                    <button 
                        onClick={() => setShowModal(true)}
                        className="bg-[#00d2ff] hover:bg-[#00b8e6] text-white font-semibold py-2.5 px-5 rounded-lg flex items-center transition-colors shadow-sm"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Pengeluaran Baru
                    </button>
                </div>

                {/* (Top Cards) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {/* Total Bulan Ini (Biru Solid) */}
                    <div className="bg-[#00d2ff] rounded-xl p-6 text-white shadow-sm flex justify-between items-center cursor-default">
                        <div>
                            <p className="text-sm font-semibold text-sky-100 mb-1">Total Pengeluaran</p>
                            <h3 className="text-3xl font-bold">{formatRp(totalPengeluaran)}</h3>
                        </div>
                        {/* Ikon Trending Down */}
                        <svg className="w-10 h-10 text-white opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                    </div>

                    {/*  Total Transaksi */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex justify-between items-center cursor-default">
                        <div>
                            <p className="text-sm font-semibold text-gray-500 mb-1">Total Transaksi</p>
                            <h3 className="text-3xl font-bold text-gray-800">{expenses.length}</h3>
                        </div>
                        {/* Ikon Kalender */}
                        <svg className="w-10 h-10 text-[#00a3ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>

                    {/* Kategori Terbanyak */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex justify-between items-center cursor-default">
                        <div>
                            <p className="text-sm font-semibold text-gray-500 mb-1">Kategori Terbanyak</p>
                            <h3 className="text-xl font-bold text-gray-800 truncate pr-2 max-w-[200px]">
                                {getKategoriTerbanyak()}
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Area Tabel */}
                <div className="bg-white rounded-xl shadow-sm border border-[#00d2ff]/30 overflow-hidden min-h-[400px]">
                    
                    {/* Table View */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="text-xs text-gray-700 font-bold bg-[#cffafe] border-b border-[#00d2ff]/20">
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
                                                <div className="text-[#00d2ff] mb-4">
                                                    <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                                                    </svg>
                                                </div>
                                                <p className="text-gray-500 text-base mb-6">Belum ada pengeluaran</p>
                                                
                                                <button 
                                                    onClick={() => setShowModal(true)}
                                                    className="bg-[#00d2ff] hover:bg-[#00b8e6] text-white font-semibold py-2.5 px-6 rounded-lg flex items-center transition-colors shadow-sm"
                                                >
                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                                    Tambah Pengeluaran
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    expenses.map((expense) => {
                                        // Memisahkan kategori dan deskripsi yang sebelumnya digabung dengan ": "
                                        const [kategori, ...descArr] = expense.keterangan.split(': ');
                                        const deskripsi = descArr.join(': ') || '-';

                                        return (
                                            <tr key={expense.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-gray-800">{formatTanggal(expense.tanggal)}</td>
                                                <td className="px-6 py-4"><span className="bg-sky-100 text-sky-700 px-3 py-1 rounded-full text-xs font-semibold">{kategori}</span></td>
                                                <td className="px-6 py-4">{deskripsi}</td>
                                                <td className="px-6 py-4 font-bold text-rose-500">{formatRp(expense.nominal)}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <button 
                                                        onClick={() => handleDelete(expense.id)}
                                                        className="text-gray-400 hover:text-rose-500 transition-colors p-1"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    </button>
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

            {/* MODAL POP-UP TAMBAH PENGELUARAN */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm transition-opacity">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="bg-gradient-to-r from-[#00d2ff] to-[#00b8e6] px-6 py-5 text-white flex items-center">
                            <svg className="w-7 h-7 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                            <div>
                                <h2 className="text-xl font-bold">Tambah Pengeluaran Baru</h2>
                                <p className="text-xs text-sky-100 mt-0.5">Catat pengeluaran bisnis Anda</p>
                            </div>
                        </div>

                        <div className="p-6">
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div>
                                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-1">
                                        <span className="text-[#00d2ff] mr-1 text-base">$</span> Kategori <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <select 
                                        value={data.kategori}
                                        onChange={e => setData('kategori', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00d2ff] focus:border-[#00d2ff] outline-none transition-all text-gray-600 bg-white"
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
                                        value={data.nominal}
                                        onChange={e => setData('nominal', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00d2ff] outline-none transition-all" 
                                    />
                                    {errors.nominal && <span className="text-xs text-red-500 mt-1">{errors.nominal}</span>}
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
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00d2ff] outline-none transition-all resize-none"
                                    ></textarea>
                                    {errors.keterangan && <span className="text-xs text-red-500 mt-1">{errors.keterangan}</span>}
                                </div>

                                <div>
                                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-1">
                                        <svg className="w-4 h-4 text-[#00d2ff] mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        Tanggal <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <input 
                                        type="date" 
                                        value={data.tanggal}
                                        onChange={e => setData('tanggal', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00d2ff] outline-none transition-all text-gray-600" 
                                    />
                                    {errors.tanggal && <span className="text-xs text-red-500 mt-1">{errors.tanggal}</span>}
                                </div>

                                <div className="flex gap-3 pt-4 mt-2">
                                    <button 
                                        type="button" 
                                        onClick={() => setShowModal(false)} 
                                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={processing}
                                        className="flex-1 bg-[#00d2ff] hover:bg-[#00b8e6] disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-xl transition-colors shadow-md"
                                    >
                                        {processing ? 'Menyimpan...' : 'Simpan Data'}
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