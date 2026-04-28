import React, { useState, useEffect } from 'react';
import { Link, Head, usePage } from '@inertiajs/react';

export default function AdminLayout({ children, title }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [showNotification, setShowNotification] = useState(true);
    
    const { url, props } = usePage();
    const { flash, auth } = props; 
    
    const user = auth?.user;
    const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'A';

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

            {/* SIDEBAR ADMIN */}
            <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-[#2563eb] text-white transition-all duration-300 flex flex-col shadow-xl z-20`}>
                <div className="p-4 border-b border-blue-500/30 flex items-center justify-between h-20">
                    {isSidebarOpen && (
                        <div>
                            <h1 className="font-bold text-lg">Juita Laundry</h1>
                            <p className="text-xs text-blue-200">Panel Admin</p>
                        </div>
                    )}
                </div>

                <div className="p-3">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`w-full flex items-center p-2 rounded-lg bg-blue-500/50 hover:bg-blue-500 transition-colors ${!isSidebarOpen && 'justify-center'}`}>
                        <svg className={`w-5 h-5 ${isSidebarOpen ? 'rotate-180 mr-2' : ''} transition-transform`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        {isSidebarOpen && <span className="text-sm font-medium">Tutup Menu</span>}
                    </button>
                </div>

                {/* MENU NAVIGASI */}
                <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
                    <Link href="/admin/dashboard" className={`flex items-center p-3 rounded-lg transition-all ${!isSidebarOpen && 'justify-center'} ${isActive('/admin/dashboard') ? 'bg-white text-blue-600 shadow-sm font-semibold' : 'text-blue-100 hover:bg-blue-700 font-medium'}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                        {isSidebarOpen && <span className="ml-3 text-sm">Dashboard</span>}
                    </Link>

                    <div className="text-xs font-semibold text-blue-300 mt-6 mb-2 px-3 uppercase tracking-wider">{isSidebarOpen ? 'Keuangan' : '...'}</div>
                    <Link href="/admin/financial-reports" className={`flex items-center p-3 rounded-lg transition-all ${!isSidebarOpen && 'justify-center'} ${isActive('/admin/financial-reports') ? 'bg-white text-blue-600 shadow-sm font-semibold' : 'text-blue-100 hover:bg-blue-700 font-medium'}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                        {isSidebarOpen && <span className="ml-3 text-sm">Laporan Keuangan</span>}
                    </Link>
                    <Link href="/admin/expenses" className={`flex items-center p-3 rounded-lg transition-all ${!isSidebarOpen && 'justify-center'} ${isActive('/admin/expenses') ? 'bg-white text-blue-600 shadow-sm font-semibold' : 'text-blue-100 hover:bg-blue-700 font-medium'}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                        {isSidebarOpen && <span className="ml-3 text-sm">Pengeluaran</span>}
                    </Link>

                    <div className="text-xs font-semibold text-blue-300 mt-6 mb-2 px-3 uppercase tracking-wider">{isSidebarOpen ? 'Lainnya' : '...'}</div>
                    <Link href="/admin/services" className={`flex items-center p-3 rounded-lg transition-all ${!isSidebarOpen && 'justify-center'} ${isActive('/admin/services') ? 'bg-white text-blue-600 shadow-sm font-semibold' : 'text-blue-100 hover:bg-blue-700 font-medium'}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                        {isSidebarOpen && <span className="ml-3 text-sm">Kelola Layanan</span>}
                    </Link>
                    <Link href="/admin/cashiers" className={`flex items-center p-3 rounded-lg transition-all ${!isSidebarOpen && 'justify-center'} ${isActive('/admin/cashiers') ? 'bg-white text-blue-600 shadow-sm font-semibold' : 'text-blue-100 hover:bg-blue-700 font-medium'}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        {isSidebarOpen && <span className="ml-3 text-sm">Kelola Kasir</span>}
                    </Link>
                    <Link href="/admin/settings" className={`flex items-center p-3 rounded-lg transition-all ${!isSidebarOpen && 'justify-center'} ${isActive('/admin/settings') ? 'bg-white text-blue-600 shadow-sm font-semibold' : 'text-blue-100 hover:bg-blue-700 font-medium'}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {isSidebarOpen && <span className="ml-3 text-sm">Pengaturan</span>}
                    </Link>
                    <Link href="/logout" method="post" as="button" className={`w-full flex items-center p-3 rounded-lg transition-all ${!isSidebarOpen && 'justify-center'} text-blue-100 hover:bg-blue-700 font-medium`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        {isSidebarOpen && <span className="ml-3 text-sm">Keluar</span>}
                    </Link>
                </nav>

                <div className="p-4 border-t border-blue-400/20 bg-blue-800/30">
                    <div className={`flex items-center ${!isSidebarOpen ? 'justify-center' : ''}`}>
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                            <span className="text-blue-700 font-black text-lg leading-none" style={{ fontFamily: 'sans-serif' }}>
                                {userInitial}
                            </span>
                        </div>
                        
                        {/* Nama & Role */}
                        {isSidebarOpen && (
                            <div className="ml-3 overflow-hidden">
                                <p className="text-sm font-bold text-white truncate leading-tight tracking-tight">
                                    {user?.name || 'Administrator'}
                                </p>
                                <p className="text-[10px] text-blue-200 uppercase font-bold tracking-widest leading-none mt-0.5">
                                    {user?.role || 'Admin'}
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