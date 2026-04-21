import React, { useState, useEffect } from 'react';
import { Link, Head, usePage } from '@inertiajs/react';

export default function CashierLayout({ children, title }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [showNotification, setShowNotification] = useState(true);
    
    const { url, props } = usePage();
    const { flash } = props;

    const isActive = (path) => {
        return url.startsWith(path);
    };

    const today = new Date().toLocaleDateString('id-ID', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    useEffect(() => {
        if (flash?.success || flash?.error) {
            setShowNotification(true);
            const timer = setTimeout(() => {
                setShowNotification(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    return (
        <div className="flex h-screen bg-gray-100 font-sans relative">
            <Head title={`${title} - Juita Laundry`} />

            {/* NOTIFIKASI TOAST */}
            <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3">
                {flash?.success && showNotification && (
                    <div className="bg-white border-l-4 border-green-500 p-4 rounded-lg shadow-xl flex items-center justify-between w-80 animate-fade-in-down">
                        <div className="flex items-center">
                            <div className="bg-green-100 p-2 rounded-full mr-3">
                                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-800">Berhasil</h4>
                                <p className="text-xs text-gray-500">{flash.success}</p>
                            </div>
                        </div>
                        <button onClick={() => setShowNotification(false)} className="text-gray-400 hover:text-gray-600 focus:outline-none">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                )}
                {flash?.error && showNotification && (
                    <div className="bg-white border-l-4 border-red-500 p-4 rounded-lg shadow-xl flex items-center justify-between w-80 animate-fade-in-down">
                        <div className="flex items-center">
                            <div className="bg-red-100 p-2 rounded-full mr-3">
                                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-800">Gagal</h4>
                                <p className="text-xs text-gray-500">{flash.error}</p>
                            </div>
                        </div>
                        <button onClick={() => setShowNotification(false)} className="text-gray-400 hover:text-gray-600 focus:outline-none">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                )}
            </div>

            {/* SIDEBAR */}
            {/* Warna disesuaikan sedikit agar berbeda feel-nya dari Admin (misal pakai hijau tosca atau tetap biru sesuai seleramu) */}
            <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-[#0ea5e9] text-white transition-all duration-300 flex flex-col shadow-xl z-20`}>
                <div className="p-4 border-b border-sky-500/30 flex items-center justify-between h-20">
                    {isSidebarOpen && (
                        <div>
                            <h1 className="font-bold text-lg">Juita Laundry</h1>
                            <p className="text-xs text-sky-100">Area Kasir</p>
                        </div>
                    )}
                </div>

                <div className="p-3">
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className={`w-full flex items-center p-2 rounded-lg bg-sky-500/50 hover:bg-sky-500 transition-colors ${!isSidebarOpen && 'justify-center'}`}
                    >
                        <svg className={`w-5 h-5 ${isSidebarOpen ? 'rotate-180 mr-2' : ''} transition-transform`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        {isSidebarOpen && <span className="text-sm font-medium">Tutup Menu</span>}
                    </button>
                </div>

                {/* MENU NAVIGASI KASIR */}
                <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
                    
                    {/* Dashboard */}
                    <Link 
                        href="/cashier/dashboard" 
                        className={`flex items-center p-3 rounded-lg transition-all ${!isSidebarOpen && 'justify-center'} ${
                            isActive('/cashier/dashboard') ? 'bg-white text-sky-600 shadow-sm font-semibold' : 'text-sky-50 hover:bg-sky-600 font-medium'
                        }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                        {isSidebarOpen && <span className="ml-3 text-sm">Dashboard</span>}
                    </Link>

                    {/* TRANSAKSI SECTION */}
                    <div className="text-xs font-semibold text-sky-200 mt-6 mb-2 px-3 uppercase tracking-wider">
                        {isSidebarOpen ? 'Transaksi' : '...'}
                    </div>

                    <Link 
                        href="/cashier/orders/create" 
                        className={`flex items-center p-3 rounded-lg transition-all ${!isSidebarOpen && 'justify-center'} ${
                            isActive('/cashier/orders/create') ? 'bg-white text-sky-600 shadow-sm font-semibold' : 'text-sky-50 hover:bg-sky-600 font-medium'
                        }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        {isSidebarOpen && <span className="ml-3 text-sm">Buat Pesanan Baru</span>}
                    </Link>

                    <Link 
                        href="/cashier/orders" 
                        className={`flex items-center p-3 rounded-lg transition-all ${!isSidebarOpen && 'justify-center'} ${
                            url === '/cashier/orders' ? 'bg-white text-sky-600 shadow-sm font-semibold' : 'text-sky-50 hover:bg-sky-600 font-medium'
                        }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                        {isSidebarOpen && <span className="ml-3 text-sm">Daftar Pesanan</span>}
                    </Link>

                    <Link 
                        href="/cashier/history" 
                        className={`flex items-center p-3 rounded-lg transition-all ${!isSidebarOpen && 'justify-center'} ${
                            isActive('/cashier/history') ? 'bg-white text-sky-600 shadow-sm font-semibold' : 'text-sky-50 hover:bg-sky-600 font-medium'
                        }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {isSidebarOpen && <span className="ml-3 text-sm">Riwayat</span>}
                    </Link>

                    {/* PELANGGAN SECTION */}
                    <div className="text-xs font-semibold text-sky-200 mt-6 mb-2 px-3 uppercase tracking-wider">
                        {isSidebarOpen ? 'Pelanggan' : '...'}
                    </div>

                    <Link 
                        href="/cashier/membership" 
                        className={`flex items-center p-3 rounded-lg transition-all ${!isSidebarOpen && 'justify-center'} ${
                            isActive('/cashier/membership') ? 'bg-white text-sky-600 shadow-sm font-semibold' : 'text-sky-50 hover:bg-sky-600 font-medium'
                        }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        {isSidebarOpen && <span className="ml-3 text-sm">Membership</span>}
                    </Link>

                    {/* LAINNYA */}
                    <div className="mt-auto pt-6">
                        <Link 
                            href="/logout" 
                            method="post" 
                            as="button"
                            className={`w-full flex items-center p-3 rounded-lg transition-all ${!isSidebarOpen && 'justify-center'} text-sky-50 hover:bg-sky-600 font-medium`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            {isSidebarOpen && <span className="ml-3 text-sm">Keluar</span>}
                        </Link>
                    </div>
                </nav>
            </aside>

            {/* AREA KANAN */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="bg-white text-gray-800 h-20 px-8 flex items-center justify-between border-b shadow-sm z-10">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <div className="text-sm font-medium text-gray-500">
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