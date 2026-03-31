import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '../Layouts/AdminLayout';

export default function History() {
    return (
        <AdminLayout title="History">
            
            <div className="max-w-7xl mx-auto">
                {/* Header Halaman */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">History Orderan</h2>
                    <p className="text-sm text-gray-500 mt-1">Daftar orderan yang sudah selesai dan diambil</p>
                </div>

                {/* Top Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-[#10b981] hover:bg-[#059669] transition-colors rounded-xl p-6 text-white shadow-sm flex justify-between items-center cursor-default">
                        <div>
                            <p className="text-sm font-semibold text-emerald-100 mb-1">Total Orderan Selesai</p>
                            <h3 className="text-4xl font-bold">0</h3>
                        </div>
                        {/* Ikon Box */}
                        <svg className="w-14 h-14 text-emerald-200 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                    </div>

                    {/* Total Pendapatan */}
                    <div className="bg-[#0ea5e9] hover:bg-[#0284c7] transition-colors rounded-xl p-6 text-white shadow-sm flex justify-between items-center cursor-default">
                        <div>
                            <p className="text-sm font-semibold text-sky-100 mb-1">Total Pendapatan</p>
                            <h3 className="text-4xl font-bold">Rp 0</h3>
                        </div>
                        {/* Ikon Box */}
                        <svg className="w-14 h-14 text-sky-200 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                    </div>
                </div>

                {/* Kolom Pencarian Besar */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                    <div className="relative">
                        <svg className="w-5 h-5 absolute left-4 top-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        <input 
                            type="text" 
                            placeholder="Cari berdasarkan nama, nomor telepon, atau nomor order..." 
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50/50"
                        />
                    </div>
                </div>

                {/* Area Konten Kosong (Empty State) */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 md:p-24 flex flex-col items-center justify-center min-h-[350px]">
                    {/* Ikon box kosong */}
                    <div className="text-gray-300 mb-6">
                        <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Belum ada history orderan</h3>
                    <p className="text-gray-500 text-base text-center max-w-sm">Orderan yang sudah diambil akan muncul di sini</p>
                </div>
            </div>

        </AdminLayout>
    );
}