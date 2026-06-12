import React, { useState, useEffect } from 'react';
import { Link, Head, usePage } from '@inertiajs/react';

export default function CashierLayout({ children, title }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [showNotification, setShowNotification] = useState(true);
    
    const { url, props } = usePage();
    const { flash, auth } = props; 
    
    const user = auth?.user;
    // Ambil inisial nama, default 'K' untuk Kasir
    const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'K';

    const isActive = (path) => url.startsWith(path);

    const today = new Date().toLocaleDateString('id-ID', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    useEffect(() => {
        if (flash?.success || flash?.error) {
            setShowNotification(true);
            const timer = setTimeout(() => setShowNotification(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    return (
        <div className="flex h-screen bg-gray-100 font-sans relative">
            <Head title={`${title} - Juita Laundry`} />

            {/* NOTIFIKASI TOAST */}
            <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3">
                {flash?.success && showNotification && (
                    <div className="bg-white border-l-4 border-emerald-500 p-4 rounded-xl shadow-xl flex items-center justify-between w-80 animate-fade-in-down">
                        <div className="flex items-center">
                            <div className="bg-emerald-100 p-2 rounded-full mr-3 shrink-0">
                                <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-800">
                                    {flash.success.includes('|') ? flash.success.split('|')[0] : 'Berhasil'}
                                </h4>
                                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                                    {flash.success.includes('|') ? flash.success.split('|')[1] : flash.success}
                                </p>
                            </div>
                        </div>
                        <button onClick={() => setShowNotification(false)} className="text-gray-400 hover:text-gray-600 focus:outline-none p-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                    </div>
                )}

                {flash?.error && showNotification && (
                    <div className="bg-white border-l-4 border-rose-500 p-4 rounded-xl shadow-xl flex items-center justify-between w-80 animate-fade-in-down">
                        <div className="flex items-center">
                            <div className="bg-rose-100 p-2 rounded-full mr-3 shrink-0">
                                <svg className="w-5 h-5 text-rose-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-800">
                                    {flash.error.includes('|') ? flash.error.split('|')[0] : 'Gagal'}
                                </h4>
                                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                                    {flash.error.includes('|') ? flash.error.split('|')[1] : flash.error}
                                </p>
                            </div>
                        </div>
                        <button onClick={() => setShowNotification(false)} className="text-gray-400 hover:text-gray-600 focus:outline-none p-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                    </div>
                )}
            </div>

            {/* SIDEBAR KASIR */}
            <aside className={`${isSidebarOpen ? 'w-56' : 'w-16'} bg-[#2563eb] text-white transition-all duration-300 flex flex-col shadow-xl z-20`}>
                
                {/* Header Logo */}
                <div className="p-4 border-b border-blue-500/30 flex items-center justify-between h-20">
                    {isSidebarOpen && (
                        <div>
                            <h1 className="font-bold text-base">Juita Laundry</h1>
                            <p className="text-[11px] text-blue-200">Panel Kasir</p>
                        </div>
                    )}
                </div>

                {/* Tombol Tutup/Buka Menu */}
                <div className="p-3">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`w-full flex items-center p-2 rounded-lg bg-blue-500/50 hover:bg-blue-500 transition-colors ${!isSidebarOpen && 'justify-center'}`}>
                        <svg className={`w-[18px] h-[18px] ${isSidebarOpen ? 'rotate-180 mr-2.5' : ''} transition-transform`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        {isSidebarOpen && <span className="text-xs font-medium">Tutup Menu</span>}
                    </button>
                </div>

                {/* MENU NAVIGASI (Sesuai Struktur Asli) */}
                <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5">
                    
                    {/* 1. DASHBOARD */}
                    <Link href="/cashier/dashboard" className={`flex items-center p-2.5 rounded-lg transition-all ${!isSidebarOpen && 'justify-center'} ${isActive('/cashier/dashboard') ? 'bg-white text-blue-600 shadow-sm font-semibold' : 'text-blue-100 hover:bg-blue-700 font-medium'}`}>
                        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        {isSidebarOpen && <span className="ml-2.5 text-xs">Dashboard</span>}
                    </Link>

                    {/* PEMISAH: ORDER MANAGEMENT */}
                    <div className="text-[10px] font-semibold text-blue-300 mt-5 mb-1.5 px-2.5 uppercase tracking-wider">
                        {isSidebarOpen ? 'Order Management' : '...'}
                    </div>
                    
                    {/* 2. ORDER & HISTORY (Dikembalikan ke Ikon Box/Kotak) */}
                    <Link href="/cashier/orders" className={`flex items-center p-2.5 rounded-lg transition-all ${!isSidebarOpen && 'justify-center'} ${isActive('/cashier/orders') ? 'bg-white text-blue-600 shadow-sm font-semibold' : 'text-blue-100 hover:bg-blue-700 font-medium'}`}>
                        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        {isSidebarOpen && <span className="ml-2.5 text-xs">Order & History</span>}
                    </Link>

                    {/* PEMISAH: DATA MASTER */}
                    <div className="text-[10px] font-semibold text-blue-300 mt-5 mb-1.5 px-2.5 uppercase tracking-wider">
                        {isSidebarOpen ? 'Data Master' : '...'}
                    </div>
                    
                    {/* 3. MEMBERSHIP (URL diperbaiki menjadi /cashier/membership, Ikon Kartu) */}
                    <Link href="/cashier/membership" className={`flex items-center p-2.5 rounded-lg transition-all ${!isSidebarOpen && 'justify-center'} ${isActive('/cashier/membership') ? 'bg-white text-blue-600 shadow-sm font-semibold' : 'text-blue-100 hover:bg-blue-700 font-medium'}`}>
                        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        {isSidebarOpen && <span className="ml-2.5 text-xs">Membership</span>}
                    </Link>
                    
                    {/* 4. LOGOUT */}
                    <Link href="/logout" method="post" as="button" className={`w-full flex items-center p-2.5 rounded-lg transition-all ${!isSidebarOpen && 'justify-center'} text-blue-100 hover:bg-blue-700 font-medium mt-5`}>
                        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        {isSidebarOpen && <span className="ml-2.5 text-xs">Logout</span>}
                    </Link>
                </nav>

                {/* Profil User Bagian Bawah */}
                <div className="p-3 border-t border-blue-400/20 bg-blue">
                    <div className={`flex items-center ${!isSidebarOpen ? 'justify-center' : ''}`}>
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center shadow-sm">
                            <span className="text-white-700 font-black text-sm leading-none" style={{ fontFamily: 'sans-serif' }}>
                                {userInitial}
                            </span>
                        </div>
                        
                        {/* Nama & Role */}
                        {isSidebarOpen && (
                            <div className="ml-2.5 overflow-hidden">
                                <p className="text-xs font-normal text-white truncate leading-tight tracking-tight">
                                    {user?.name || 'Kasir'}
                                </p>
                                <p className="text-[9px] text-blue-200 uppercase font-normal tracking-widest leading-none mt-0.5">
                                    {user?.role || 'Cashier'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* AREA KANAN */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="bg-[#3b82f6] text-white h-20 px-8 flex items-center justify-between shadow-md z-10">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <div className="text-sm font-medium text-blue-100">{today}</div>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">{children}</main>
            </div>
        </div>
    );
}