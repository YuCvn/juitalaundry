import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '../Layouts/AdminLayout';

export default function Pengeluaran() {
    // State untuk mengontrol pop-up (modal) Tambah Pengeluaran
    const [showModal, setShowModal] = useState(false);

    return (
        <AdminLayout title="Pengeluaran">
            
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
                            <p className="text-sm font-semibold text-sky-100 mb-1">Total Bulan Ini</p>
                            <h3 className="text-3xl font-bold">Rp 0</h3>
                        </div>
                        {/* Ikon Trending Down */}
                        <svg className="w-10 h-10 text-white opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                    </div>

                    {/*  Total Transaksi */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex justify-between items-center cursor-default">
                        <div>
                            <p className="text-sm font-semibold text-gray-500 mb-1">Total Transaksi</p>
                            <h3 className="text-3xl font-bold text-gray-800">0</h3>
                        </div>
                        {/* Ikon Kalender */}
                        <svg className="w-10 h-10 text-[#00a3ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>

                    {/* Kategori Terbanyak */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex justify-between items-center cursor-default">
                        <div>
                            <p className="text-sm font-semibold text-gray-500 mb-1">Kategori Terbanyak</p>
                            <h3 className="text-3xl font-bold text-gray-800">-</h3>
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
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* MODAL POP-UP TAMBAH PENGELUARAN*/}
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
                            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowModal(false); }}>
                                <div>
                                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-1">
                                        <span className="text-[#00d2ff] mr-1 text-base">$</span> Kategori <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00d2ff] focus:border-[#00d2ff] outline-none transition-all text-gray-600 bg-white">
                                        <option>Pilih kategori</option>
                                        <option>Operasional (Listrik, Air)</option>
                                        <option>Bahan Baku (Deterjen, Pewangi)</option>
                                        <option>Gaji Karyawan</option>
                                        <option>Lain-lain</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Jumlah <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <input type="number" placeholder="50000" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00d2ff] outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Deskripsi <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <textarea placeholder="Deskripsi pengeluaran" rows="3" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00d2ff] outline-none transition-all resize-none"></textarea>
                                </div>
                                <div>
                                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-1">
                                        <svg className="w-4 h-4 text-[#00d2ff] mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        Tanggal <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <input type="date" defaultValue="2026-03-14" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00d2ff] outline-none transition-all text-gray-600" />
                                </div>
                                <div className="flex gap-3 pt-4 mt-2">
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-colors">Batal</button>
                                    <button type="submit" className="flex-1 bg-[#00d2ff] hover:bg-[#00b8e6] text-white font-semibold py-3 px-4 rounded-xl transition-colors shadow-md">Simpan Data</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

        </AdminLayout>
    );
}