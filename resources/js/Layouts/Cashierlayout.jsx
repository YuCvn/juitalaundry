import React, { useState, useEffect } from 'react';
import { Link, Head, usePage } from '@inertiajs/react';

export default function CashierLayout({ children, title }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [showNotification, setShowNotification] = useState(true);
    
    const { url, props } = usePage();
    const { flash, auth } = props; 
    
    const user = auth?.user;
    const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'C';

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

    useEffect(() => {
        setIsMobileOpen(false);
    }, [url]);

    const showText = isSidebarOpen || isMobileOpen;

    return (
        <div className="flex h-screen bg-gray-100 font-sans relative overflow-hidden">
            <Head title={`${title} - Juita Laundry`} />
            
            <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3">
                {flash?.success && showNotification && (
                    <div className="bg-white border-l-4 border-emerald-500 p-4 rounded-xl shadow-xl flex items-center justify-between w-[90vw] md:w-80 animate-fade-in-down">
                        <div className="flex items-center">
                            <div className="bg-emerald-100 p-2 rounded-full mr-3 shrink-0">
                                <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-800">
                                    {flash.success.includes('|') ? flash.success.split('|')[0] : 'Berhasil'}
                                </h4>
                                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed truncate max-w-[200px]">
                                    {flash.success.includes('|') ? flash.success.split('|')[1] : flash.success}
                                </p>
                            </div>
                        </div>
                        <button onClick={() => setShowNotification(false)} className="text-gray-400 hover:text-gray-600 focus:outline-none p-1 shrink-0"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                    </div>
                )}

                {flash?.error && showNotification && (
                    <div className="bg-white border-l-4 border-rose-500 p-4 rounded-xl shadow-xl flex items-center justify-between w-[90vw] md:w-80 animate-fade-in-down">
                        <div className="flex items-center">
                            <div className="bg-rose-100 p-2 rounded-full mr-3 shrink-0">
                                <svg className="w-5 h-5 text-rose-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-800">
                                    {flash.error.includes('|') ? flash.error.split('|')[0] : 'Gagal'}
                                </h4>
                                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed truncate max-w-[200px]">
                                    {flash.error.includes('|') ? flash.error.split('|')[1] : flash.error}
                                </p>
                            </div>
                        </div>
                        <button onClick={() => setShowNotification(false)} className="text-gray-400 hover:text-gray-600 focus:outline-none p-1 shrink-0"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                    </div>
                )}
            </div>

            {isMobileOpen && (
                <div 
                    className="fixed inset-0 bg-gray-900/60 z-20 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            <aside className={`
                fixed md:static inset-y-0 left-0 z-30 
                transform ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
                ${isSidebarOpen ? 'w-64 md:w-56' : 'w-64 md:w-16'}
                bg-[#0f766e] text-white transition-all duration-300 flex flex-col shadow-2xl md:shadow-xl
            `}>
                
                <div className="p-4 border-b border-teal-500/30 flex items-center justify-between h-20 shrink-0">
                    {showText && (
                        <div>
                            <h1 className="font-bold text-base">Juita Laundry</h1>
                            <p className="text-[11px] text-teal-200">Panel Kasir</p>
                        </div>
                    )}
                    <button onClick={() => setIsMobileOpen(false)} className="md:hidden p-2 text-teal-200 hover:text-white rounded-lg hover:bg-teal-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="p-3 hidden md:block shrink-0">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`w-full flex items-center p-2 rounded-lg bg-teal-600/50 hover:bg-teal-600 transition-colors ${!isSidebarOpen && 'justify-center'}`}>
                        <svg className={`w-[18px] h-[18px] ${isSidebarOpen ? 'rotate-180 mr-2.5' : ''} transition-transform`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        {isSidebarOpen && <span className="text-xs font-medium">Tutup Menu</span>}
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5 scrollbar-thin scrollbar-thumb-teal-500 scrollbar-track-transparent">
                    
                    <Link href="/cashier/dashboard" className={`flex items-center p-2.5 rounded-lg transition-all ${!showText && 'justify-center'} ${isActive('/cashier/dashboard') ? 'bg-white text-teal-700 shadow-sm font-semibold' : 'text-teal-100 hover:bg-teal-800 font-medium'}`}>
                        <svg className="w-[18px] h-[18px] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                        {showText && <span className="ml-2.5 text-xs truncate">Dashboard</span>}
                    </Link>

                    <div className="text-[10px] font-semibold text-teal-300 mt-5 mb-1.5 px-2.5 uppercase tracking-wider truncate">{showText ? 'Transaksi Kasir' : '...'}</div>
                    
                    <Link href="/cashier/orders" className={`flex items-center p-2.5 rounded-lg transition-all ${!showText && 'justify-center'} ${isActive('/cashier/orders') ? 'bg-white text-teal-700 shadow-sm font-semibold' : 'text-teal-100 hover:bg-teal-800 font-medium'}`}>
                        <svg className="w-[18px] h-[18px] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                        {showText && <span className="ml-2.5 text-xs truncate">Pesanan Baru</span>}
                    </Link>
                    
                    <Link href="/cashier/history" className={`flex items-center p-2.5 rounded-lg transition-all ${!showText && 'justify-center'} ${isActive('/cashier/history') ? 'bg-white text-teal-700 shadow-sm font-semibold' : 'text-teal-100 hover:bg-teal-800 font-medium'}`}>
                        <svg className="w-[18px] h-[18px] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        {showText && <span className="ml-2.5 text-xs truncate">Riwayat Transaksi</span>}
                    </Link>

                    <div className="text-[10px] font-semibold text-teal-300 mt-5 mb-1.5 px-2.5 uppercase tracking-wider truncate">{showText ? 'Pelanggan' : '...'}</div>
                    
                    <Link href="/cashier/memberships" className={`flex items-center p-2.5 rounded-lg transition-all ${!showText && 'justify-center'} ${isActive('/cashier/memberships') ? 'bg-white text-teal-700 shadow-sm font-semibold' : 'text-teal-100 hover:bg-teal-800 font-medium'}`}>
                        <svg className="w-[18px] h-[18px] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        {showText && <span className="ml-2.5 text-xs truncate">Data Member</span>}
                    </Link>

                    <Link href="/logout" method="post" as="button" className={`w-full flex items-center p-2.5 rounded-lg transition-all ${!showText && 'justify-center'} text-teal-100 hover:bg-teal-800 font-medium mt-4`}>
                        <svg className="w-[18px] h-[18px] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        {showText && <span className="ml-2.5 text-xs truncate">Keluar</span>}
                    </Link>
                </nav>

                <div className="p-3 border-t border-teal-600 bg-teal-800/50 shrink-0">
                    <div className={`flex items-center ${!showText ? 'justify-center' : ''}`}>
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-600 border border-teal-500 flex items-center justify-center shadow-sm">
                            <span className="text-white font-bold text-sm leading-none" style={{ fontFamily: 'sans-serif' }}>
                                {userInitial}
                            </span>
                        </div>
                        
                        {showText && (
                            <div className="ml-2.5 overflow-hidden">
                                <p className="text-xs font-normal text-white truncate leading-tight tracking-tight">
                                    {user?.name || 'Kasir'}
                                </p>
                                <p className="text-[9px] text-teal-200 uppercase font-normal tracking-widest leading-none mt-0.5">
                                    {user?.role || 'Cashier'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            <div className="flex-1 flex flex-col h-screen overflow-hidden w-full relative">
                <header className="bg-[#14b8a6] text-white h-20 px-4 md:px-8 flex items-center justify-between shadow-md z-10 shrink-0">
                    <div className="flex items-center">
                        <button 
                            onClick={() => setIsMobileOpen(true)}
                            className="mr-3 md:hidden p-2 rounded-lg bg-teal-600 hover:bg-teal-700 focus:outline-none transition-colors"
                        >
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <h2 className="text-lg md:text-xl font-bold truncate max-w-[200px] sm:max-w-none">{title}</h2>
                    </div>
                    <div className="text-xs md:text-sm font-medium text-teal-50 hidden sm:block">{today}</div>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 md:p-6 pb-20">{children}</main>
            </div>
        </div>
    );
}