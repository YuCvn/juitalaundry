import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '../Layouts/AdminLayout';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function LaporanKeuangan() {
    // State untuk mengontrol pop-up (modal) Tambah Pengeluaran
    const [showModal, setShowModal] = useState(false);

    // Data dummy untuk grafik
    const chartData = [
        { name: '8 Mar', Pendapatan: 0, Pengeluaran: 0, Profit: 0 },
        { name: '9 Mar', Pendapatan: 0, Pengeluaran: 0, Profit: 0 },
        { name: '10 Mar', Pendapatan: 0, Pengeluaran: 0, Profit: 0 },
        { name: '11 Mar', Pendapatan: 0, Pengeluaran: 0, Profit: 0 },
        { name: '12 Mar', Pendapatan: 0, Pengeluaran: 0, Profit: 0 },
        { name: '13 Mar', Pendapatan: 0, Pengeluaran: 0, Profit: 0 },
        { name: '14 Mar', Pendapatan: 0, Pengeluaran: 0, Profit: 0 },
    ];

    return (
        <AdminLayout title="Laporan Keuangan">
            
            <div className="max-w-7xl mx-auto space-y-6 relative">
                
                {/* --- Filter Periode & Tombol Tambah --- */}
                <div className="bg-white rounded-xl shadow-sm border border-[#06b6d4]/30 p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Filter Periode</h3>
                    <div className="flex flex-col md:flex-row items-end gap-4">
                        <div className="flex-1 w-full">
                            <label className="block text-sm font-semibold text-gray-600 mb-1">Dari</label>
                            <div className="relative">
                                <input type="date" defaultValue="2026-02-11" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00d2ff] focus:border-[#00d2ff] outline-none text-gray-600" />
                            </div>
                        </div>
                        <div className="flex-1 w-full">
                            <label className="block text-sm font-semibold text-gray-600 mb-1">Sampai</label>
                            <div className="relative">
                                <input type="date" defaultValue="2026-03-13" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00d2ff] focus:border-[#00d2ff] outline-none text-gray-600" />
                            </div>
                        </div>
                        <div className="flex-1 w-full md:w-auto mt-4 md:mt-0">
                            {/* Tombol pemicu Modal */}
                            <button 
                                onClick={() => setShowModal(true)}
                                className="w-full bg-[#00d2ff] hover:bg-[#00b8e6] text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center transition-colors shadow-sm"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                Tambah Pengeluaran
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- Empat Kartu Ringkasan --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Card 1: Total Pendapatan */}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-[#06b6d4] flex flex-col justify-between">
                        <div className="flex items-center text-[#06b6d4] mb-2">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                            <span className="text-sm font-semibold text-gray-600">Total Pendapatan</span>
                        </div>
                        <h3 className="text-3xl font-bold text-[#06b6d4]">Rp 0</h3>
                    </div>

                    {/* Card 2: Total Pengeluaran */}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-[#f97316] flex flex-col justify-between">
                        <div className="flex items-center text-[#f97316] mb-2">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                            <span className="text-sm font-semibold text-gray-600">Total Pengeluaran</span>
                        </div>
                        <h3 className="text-3xl font-bold text-[#f97316]">Rp 0</h3>
                    </div>

                    {/* Card 3: Net Profit */}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-[#14b8a6] flex flex-col justify-between">
                        <div className="flex items-center text-[#14b8a6] mb-2">
                            <span className="text-lg font-bold mr-2">$</span>
                            <span className="text-sm font-semibold text-gray-600">Net Profit</span>
                        </div>
                        <h3 className="text-3xl font-bold text-[#14b8a6]">Rp 0</h3>
                    </div>

                    {/* Card 4: Profit Margin */}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-[#06b6d4] flex flex-col justify-between">
                        <div className="flex items-center text-[#06b6d4] mb-2">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11h10M7 15h10M3 20a1 1 0 001 1h16a1 1 0 001-1V4a1 1 0 00-1-1H4a1 1 0 00-1 1v16z" /></svg>
                            <span className="text-sm font-semibold text-gray-600">Profit Margin</span>
                        </div>
                        <h3 className="text-3xl font-bold text-[#06b6d4]">0%</h3>
                    </div>
                </div>

                {/* --- Area Grafik --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-[#06b6d4]/30">
                        <h3 className="text-md font-bold text-gray-800 mb-4">Pendapatan vs Pengeluaran (7 Hari)</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                                    <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                    <Legend iconType="square" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                                    <Bar dataKey="Pendapatan" fill="#00d2ff" radius={[2, 2, 0, 0]} barSize={20} />
                                    <Bar dataKey="Pengeluaran" fill="#f97316" radius={[2, 2, 0, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-[#06b6d4]/30">
                        <h3 className="text-md font-bold text-gray-800 mb-4">Profit Harian (7 Hari)</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                                    <Line type="monotone" dataKey="Profit" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 6 }} dot={{ strokeWidth: 2, r: 4, fill: '#3b82f6' }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* --- Pengeluaran Terbaru --- */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-[#06b6d4]/30 flex flex-col min-h-[150px]">
                    <h3 className="text-md font-bold text-gray-800 mb-4">Pengeluaran Terbaru</h3>
                    <div className="flex-1 flex justify-center items-center text-gray-400 text-sm">
                        Belum ada pengeluaran
                    </div>
                </div>

            </div>

            {/* --- MODAL POP-UP TAMBAH PENGELUARAN --- */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm transition-opacity">
                    
                    {/* Kotak Modal */}
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        
                        {/* Header Modal Gradien */}
                        <div className="bg-gradient-to-r from-[#00d2ff] to-[#00b8e6] px-6 py-5 text-white flex items-center">
                            <svg className="w-7 h-7 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                            <div>
                                <h2 className="text-xl font-bold">Tambah Pengeluaran Baru</h2>
                                <p className="text-xs text-sky-100 mt-0.5">Catat pengeluaran bisnis Anda</p>
                            </div>
                        </div>

                        {/* Body Modal (Form) */}
                        <div className="p-6">
                            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowModal(false); }}>
                                
                                {/* Input Kategori */}
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

                                {/* Input Jumlah */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Jumlah <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <input 
                                        type="number" 
                                        placeholder="50000" 
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00d2ff] focus:border-[#00d2ff] outline-none transition-all" 
                                    />
                                </div>

                                {/* Input Deskripsi */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Deskripsi <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <textarea 
                                        placeholder="Deskripsi pengeluaran" 
                                        rows="3"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00d2ff] focus:border-[#00d2ff] outline-none transition-all resize-none" 
                                    ></textarea>
                                </div>

                                {/* Input Tanggal */}
                                <div>
                                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-1">
                                        <svg className="w-4 h-4 text-[#00d2ff] mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        Tanggal <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <input 
                                        type="date" 
                                        defaultValue="2026-03-13" 
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00d2ff] focus:border-[#00d2ff] outline-none transition-all text-gray-600" 
                                    />
                                </div>

                                {/* Tombol Aksi Pop-up */}
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
                                        className="flex-1 bg-[#00d2ff] hover:bg-[#00b8e6] text-white font-semibold py-3 px-4 rounded-xl transition-colors shadow-md"
                                    >
                                        Simpan Data
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