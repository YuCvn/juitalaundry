import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import CashierLayout from '../../Layouts/Cashierlayout';

export default function Dashboard() {
    const { stats, recentOrders } = usePage().props;

    const formatRp = (angka) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka || 0);
    };

    const statusCards = [
        { label: 'Order Berjalan', val: stats?.order_berjalan || 0, icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', borderColor: 'border-blue-100', iconColor: 'text-blue-500' },
        { label: 'Menunggu', val: stats?.menunggu || 0, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', borderColor: 'border-yellow-100', iconColor: 'text-yellow-500' },
        { label: 'Diproses', val: stats?.diproses || 0, icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', borderColor: 'border-blue-100', iconColor: 'text-blue-500' },
        { label: 'Total Member', val: stats?.total_member || 0, icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', borderColor: 'border-violet-100', iconColor: 'text-violet-500' },
    ];

    const membershipCards = [
        { label: 'Total Member', val: stats?.total_member || 0, icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', border: 'border-violet-300', bg: 'bg-violet-100', text: 'text-violet-800', iconColor: 'text-violet-500', href: null },
        { label: 'Tambah Member Baru', val: 'Klik disini', icon: 'M12 4v16m8-8H4', border: 'border-blue-300', bg: 'bg-blue-100', text: 'text-blue-800', iconColor: 'text-blue-500', href: '/cashier/membership' },
        
        // IKON KARTU CREDIT DIPERBARUI DI SINI
        { label: 'Top-up Saldo', val: 'Klik disini', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z', border: 'border-green-300', bg: 'bg-green-100', text: 'text-green-800', iconColor: 'text-green-500', href: '/cashier/membership' },
    ];

    return (
        <CashierLayout title="Dashboard">
            <Head title="Dashboard Kasir" />

            <div className="space-y-6">
                
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-8 rounded-2xl text-white shadow-lg">
                    <h1 className="text-3xl font-bold">Dashboard Kasir</h1>
                    <p className="text-sm opacity-90 mt-1 font-medium">Selamat datang! Kelola order dan member dengan mudah</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Card 1: Tambah Order dengan gradasi Biru -> Cyan */}
                    <Link 
                        href="/cashier/orders/create" 
                        className="bg-gradient-to-r from-blue-500 to-cyan-400 p-6 rounded-2xl text-white flex justify-between items-center shadow-md transform transition-all duration-200 hover:scale-[1.03] hover:shadow-lg"
                    >
                        <div>
                            <p className="text-xs font-semibold opacity-90">Buat Transaksi Baru</p>
                            <h3 className="text-xl font-bold mt-1">Tambah Order</h3>
                            <p className="text-[11px] mt-1 opacity-80 font-medium">Klik untuk membuat order baru</p>
                        </div>
                        <div className="bg-white/20 p-3 rounded-xl">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                    </Link>

                    {/* Card 2: Tambah Member dengan gradasi Ungu -> Pink */}
                    <Link 
                        href="/cashier/membership" 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-2xl text-white flex justify-between items-center shadow-md transform transition-all duration-200 hover:scale-[1.03] hover:shadow-lg"
                    >
                        <div>
                            <p className="text-xs font-semibold opacity-90">Kelola Membership</p>
                            <h3 className="text-xl font-bold mt-1">Tambah Member</h3>
                            <p className="text-[11px] mt-1 opacity-80 font-medium">Klik untuk membuat member baru</p>
                        </div>
                        <div className="bg-white/20 p-3 rounded-xl">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3-3v8a3 3 0 003 3z" />
                            </svg>
                        </div>
                    </Link>
                </div>

                {/* Status Cards */}
                <div className="grid grid-cols-4 gap-4">
                    {statusCards.map((s, i) => (
                        <div key={i} className={`bg-white p-4 rounded-xl border-2 ${s.borderColor} flex items-center justify-between shadow-sm`}>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">{s.label}</p>
                                <h3 className={`text-xl font-black ${s.iconColor}`}>{s.val}</h3>
                            </div>
                            <svg className={`w-8 h-8 ${s.iconColor} opacity-70`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={s.icon} />
                            </svg>
                        </div>
                    ))}
                </div>

                {/* Tabel Order Berjalan */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Header Tabel Gradasi Biru -> Cyan */}
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-400 px-6 py-3 text-white flex justify-between items-center">
                        <h3 className="font-bold text-sm">Order yang Berjalan</h3>
                        <Link href="/cashier/orders" className="text-[10px] bg-white text-blue-500 px-3 py-1 rounded font-bold hover:bg-gray-100">Lihat Semua</Link>
                    </div>
                    
                    <div className="p-6 space-y-3">
                        {recentOrders && recentOrders.length > 0 ? (
                            recentOrders.map((order, index) => (
                                <div 
                                    key={index} 
                                    className="bg-sky-50 border border-blue-300 p-4 rounded-xl flex justify-between items-center shadow-sm"
                                >
                                    <div>
                                        <p className="text-sm text-gray-600 font-normal">
                                            {order.id} 
                                            <span className="ml-2 text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded font-normal">{order.status}</span>
                                        </p>
                                        
                                        <p className="text-lg text-blue-900 mt-0.5 font-normal">{order.customer}</p>
                                        
                                        <p className="text-[10px] text-gray-400 mt-0.5 font-normal">
                                            {order.date || "Tanggal tidak tersedia"}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-base text-blue-600 font-normal">{formatRp(order.total)}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-6">
                                <svg className="w-14 h-14 text-blue-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                                <p className="text-sm text-gray-500 mb-5">Belum ada Order berjalan</p>
                                <Link 
                                    href="/cashier/orders/create" 
                                    className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-semibold py-2 px-5 rounded-lg shadow-sm text-xs flex items-center transition-all"
                                >
                                    + Buat Order Baru
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tabel Membership */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-violet-500 to-pink-500 px-6 py-3 text-white flex justify-between items-center">
                        <h3 className="font-bold text-sm">Membership</h3>
                        <Link href="/cashier/membership" className="text-[10px] bg-white text-pink-600 px-3 py-1 rounded font-bold hover:bg-gray-100">Kelola Member</Link>
                    </div>
                    
                    <div className="p-6 grid grid-cols-3 gap-6">
                        {membershipCards.map((m, i) => {
                            const ComponentTag = m.href ? Link : 'div';
                            return (
                                <ComponentTag 
                                    key={i} 
                                    href={m.href}
                                    className={`${m.bg} ${m.border} border p-6 rounded-xl flex flex-col items-center justify-center text-center transform transition-all duration-200 ${
                                        m.href ? 'hover:scale-[1.03] hover:shadow-md cursor-pointer' : ''
                                    }`}
                                >
                                    <svg className={`w-8 h-8 ${m.iconColor} mb-2`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={m.icon} />
                                    </svg>
                                    <p className="text-[12px] font-normal text-gray-600 mb-1">{m.label}</p>
                                    <h3 className={`text-xl font-bold ${m.text}`}>{m.val}</h3>
                                </ComponentTag>
                            );
                        })}
                    </div>
                </div>

            </div>
        </CashierLayout>
    );
}