import React, { useState } from 'react';
import { Link, Head, usePage } from '@inertiajs/react';

export default function AdminLayout({ children, title }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    
    //Ambil URL yang sedang aktif saat ini
    const { url } = usePage();

    //Fungsi untuk mengecek apakah menu ini sedang aktif
    const isActive = (path) => {
        // Jika URL saat ini sama dengan path menu, atau diawali dengan path tersebut 
        // (contoh: /orders/create akan membuat menu /orders tetap menyala)
        return url.startsWith(path);
    };

    const today = new Date().toLocaleDateString('id-ID', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <Head title={`${title} - Juita Laundry`} />

            {/* SIDEBAR */}
            <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-[#2563eb] text-white transition-all duration-300 flex flex-col shadow-xl z-20`}>
                <div className="p-4 border-b border-blue-500/30 flex items-center justify-between h-20">
                    {isSidebarOpen && (
                        <div>
                            <h1 className="font-bold text-lg">Juita Laundry</h1>
                            <p className="text-xs text-blue-200">Admin Panel</p>
                        </div>
                    )}
                </div>

                <div className="p-3">
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className={`w-full flex items-center p-2 rounded-lg bg-blue-500/50 hover:bg-blue-500 transition-colors ${!isSidebarOpen && 'justify-center'}`}
                    >
                        <svg className={`w-5 h-5 ${isSidebarOpen ? 'rotate-180 mr-2' : ''} transition-transform`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        {isSidebarOpen && <span className="text-sm font-medium">Tutup Menu</span>}
                    </button>
                </div>

                {/* --- MENU NAVIGASI --- */}
                <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
                    
                    {/* Menu: Dashboard */}
                    <Link 
                        href="/dashboard" 
                        // Kelas CSS berubah tergantung aktif atau tidak
                        className={`flex items-center p-3 rounded-lg transition-all ${!isSidebarOpen && 'justify-center'} ${
                            isActive('/dashboard') 
                            ? 'bg-white text-blue-600 shadow-sm font-semibold' 
                            : 'text-blue-100 hover:bg-blue-700 font-medium'
                        }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                        {isSidebarOpen && <span className="ml-3 text-sm">Dashboard</span>}
                    </Link>

                    <div className="text-xs font-semibold text-blue-300 mt-6 mb-2 px-3 uppercase tracking-wider">
                        {isSidebarOpen ? 'Order Management' : '...'}
                    </div>
                    
                    {/* Menu: Orders */}
                    <Link 
                        href="/orders" 
                        className={`flex items-center p-3 rounded-lg transition-all ${!isSidebarOpen && 'justify-center'} ${
                            isActive('/orders') 
                            ? 'bg-white text-blue-600 shadow-sm font-semibold' 
                            : 'text-blue-100 hover:bg-blue-700 font-medium'
                        }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                        {isSidebarOpen && <span className="ml-3 text-sm">Orders</span>}
                    </Link>

                    {/* Menu: History */}
                    <Link 
                        href="/history" 
                        className={`flex items-center p-3 rounded-lg transition-all ${!isSidebarOpen && 'justify-center'} ${
                            isActive('/history') 
                            ? 'bg-white text-blue-600 shadow-sm font-semibold' 
                            : 'text-blue-100 hover:bg-blue-700 font-medium'
                        }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                        {isSidebarOpen && <span className="ml-3 text-sm">History</span>}
                    </Link>

                    {/* --- Pemisah DATA MASTER --- */}
                    <div className="text-xs font-semibold text-blue-300 mt-6 mb-2 px-3 uppercase tracking-wider">
                        {isSidebarOpen ? 'Data Master' : '...'}
                    </div>

                    {/* Menu: Membership */}
                    <Link 
                        href="/membership" 
                        className={`flex items-center p-3 rounded-lg transition-all ${!isSidebarOpen && 'justify-center'} ${
                            isActive('/membership') 
                            ? 'bg-white text-blue-600 shadow-sm font-semibold' 
                            : 'text-blue-100 hover:bg-blue-700 font-medium'
                        }`}
                    >
                        {/* Ikon Kartu Membership */}
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                        {isSidebarOpen && <span className="ml-3 text-sm">Membership</span>}
                    </Link>
                    {/* --- Pemisah FINANCIAL --- */}
                    <div className="text-xs font-semibold text-blue-300 mt-6 mb-2 px-3 uppercase tracking-wider">
                        {isSidebarOpen ? 'Financial' : '...'}
                    </div>

                    {/* Menu: Laporan Keuangan */}
                    <Link 
                        href="/laporan-keuangan" 
                        className={`flex items-center p-3 rounded-lg transition-all ${!isSidebarOpen && 'justify-center'} ${
                            isActive('/laporan-keuangan') 
                            ? 'bg-white text-blue-600 shadow-sm font-semibold' 
                            : 'text-blue-100 hover:bg-blue-700 font-medium'
                        }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                        {isSidebarOpen && <span className="ml-3 text-sm">Laporan Keuangan</span>}
                    </Link>

                    {/* Menu: Pengeluaran */}
                    <Link 
                        href="/pengeluaran" 
                        className={`flex items-center p-3 rounded-lg transition-all ${!isSidebarOpen && 'justify-center'} ${
                            isActive('/pengeluaran') 
                            ? 'bg-white text-blue-600 shadow-sm font-semibold' 
                            : 'text-blue-100 hover:bg-blue-700 font-medium'
                        }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                        {isSidebarOpen && <span className="ml-3 text-sm">Pengeluaran</span>}
                    </Link>

                    {/* --- Pemisah LAINNYA --- */}
                    <div className="text-xs font-semibold text-blue-300 mt-6 mb-2 px-3 uppercase tracking-wider">
                        {isSidebarOpen ? 'Lainnya' : '...'}
                    </div>

                    {/* Menu: Pengaturan */}
                    <Link 
                        href="/pengaturan" 
                        className={`flex items-center p-3 rounded-lg transition-all ${!isSidebarOpen && 'justify-center'} ${
                            isActive('/pengaturan') 
                            ? 'bg-white text-blue-600 shadow-sm font-semibold' 
                            : 'text-blue-100 hover:bg-blue-700 font-medium'
                        }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {isSidebarOpen && <span className="ml-3 text-sm">Pengaturan</span>}
                    </Link>
                </nav>
            </aside>

            {/* AREA KANAN */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="bg-[#3b82f6] text-white h-20 px-8 flex items-center justify-between shadow-md z-10">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <div className="text-sm font-medium text-blue-100">
                        {today}
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}