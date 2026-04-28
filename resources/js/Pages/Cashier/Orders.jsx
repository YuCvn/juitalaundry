import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import CashierLayout from '../../Layouts/CashierLayout';

export default function Orders() {
    const [activeFilter, setActiveFilter] = useState('semua');

    return (
        <AdminLayout title="Orders">
            
            {/* Bagian Header Halaman */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Manajemen Orders</h2>
                
                <Link href="/orders/create" className="bg-[#10b981] hover:bg-emerald-600 text-white font-semibold py-2.5 px-5 rounded-lg flex items-center transition-colors shadow-sm w-fit">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Order Baru
                </Link>
            </div>

            {/* Kotak Filter Status (Pills Design) */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex items-center gap-4 overflow-x-auto">
                <span className="text-sm font-medium text-gray-500 whitespace-nowrap pl-2">Filter Status:</span>
                
                <div className="flex gap-3">
                    <button 
                        onClick={() => setActiveFilter('semua')}
                        className={`px-5 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                            activeFilter === 'semua' 
                            ? 'bg-[#3b82f6] text-white shadow-md' 
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        Semua (0)
                    </button>
                    <button 
                        onClick={() => setActiveFilter('menunggu')}
                        className={`px-5 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                            activeFilter === 'menunggu' 
                            ? 'bg-[#3b82f6] text-white shadow-md' 
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        Menunggu (0)
                    </button>
                    <button 
                        onClick={() => setActiveFilter('proses')}
                        className={`px-5 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                            activeFilter === 'proses' 
                            ? 'bg-[#3b82f6] text-white shadow-md' 
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        Proses (0)
                    </button>
                    <button 
                        onClick={() => setActiveFilter('selesai')}
                        className={`px-5 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                            activeFilter === 'selesai' 
                            ? 'bg-[#3b82f6] text-white shadow-md' 
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        Selesai (0)
                    </button>
                </div>
            </div>

            {/* Kotak Konten Utama (Empty State) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 md:p-24 flex flex-col items-center justify-center min-h-[400px]">
                
                {/* Ikon Box Empty */}
                <div className="text-gray-300 mb-5">
                    <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                </div>
                
                <p className="text-gray-500 mb-8 text-lg">Belum ada order</p>
                
                {/* Tombol Tambah Order di Tengah */}
                <Link 
                    href="/orders/create" 
                    className="bg-[#00d2ff] hover:bg-[#00b8e6] text-white font-bold py-3 px-6 rounded-xl flex items-center transition-colors shadow-lg"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Tambah Order Pertama
                </Link>
            </div>

        </AdminLayout>
    );
}