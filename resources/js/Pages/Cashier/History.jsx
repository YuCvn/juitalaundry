import React, { useState } from 'react';
import { Link, Head, usePage } from '@inertiajs/react';
import CashierLayout from '../../Layouts/CashierLayout';

export default function History() {
    const { orders = [] } = usePage().props;
    const [searchQuery, setSearchQuery] = useState('');

    const formatRp = (angka) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka || 0);
    };

    const formatTanggal = (tanggalString) => {
        const date = new Date(tanggalString);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const datePart = date.toLocaleDateString('id-ID', options);
        
        const timeOptions = { hour: '2-digit', minute: '2-digit' };
        const timePart = date.toLocaleTimeString('id-ID', timeOptions).replace('.', ':');
        
        return `${datePart} pukul ${timePart}`;
    };

    // Logika Pencarian - Diperbarui ke field Inggris
    const filteredOrders = orders.filter(order => {
        const search = searchQuery.toLowerCase();
        return (
            order.customer_name?.toLowerCase().includes(search) ||
            order.phone_number?.includes(search) ||
            order.order_id?.toLowerCase().includes(search)
        );
    });

    // Kalkulasi Top Cards - Diperbarui ke field Inggris
    const totalOrderanSelesai = orders.length;
    const totalPendapatan = orders.reduce((sum, order) => sum + parseFloat(order.total_price), 0);

    return (
        <CashierLayout title="Order & History">
            <Head title="History Order - Juita Laundry" />
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                <h2 className="text-xl font-medium text-gray-800">Manajemen Orders</h2>
                
                <Link href="/cashier/orders/create" className="bg-[#10b981] hover:bg-emerald-600 text-white py-2 px-4 rounded-lg flex items-center transition-colors shadow-sm w-fit text-sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Order Baru
                </Link>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-white p-1.5 rounded-xl w-full mb-6 border border-gray-200 shadow-sm">
                <Link href="/cashier/orders" className="flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-50 border border-transparent px-6 py-2.5 rounded-lg text-sm font-semibold transition-all">
                    Order Aktif
                </Link>
                <Link href="/cashier/history" className="flex items-center justify-center bg-[#10b981] text-white shadow-md px-6 py-2.5 rounded-lg text-sm font-bold transition-all">
                    History Selesai
                </Link>
            </div>

            {/* Top Cards History */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-[#10b981] rounded-xl p-5 text-white shadow-sm flex justify-between items-center">
                    <div>
                        <p className="text-xs font-normal text-emerald-100 uppercase tracking-wider mb-1">Total Orderan Selesai</p>
                        <h3 className="text-3xl font-black">{totalOrderanSelesai}</h3>
                    </div>
                    <svg className="w-12 h-12 text-emerald-200/80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                </div>

                <div className="bg-[#0ea5e9] rounded-xl p-5 text-white shadow-sm flex justify-between items-center">
                    <div>
                        <p className="text-xs font-normal text-sky-100 uppercase tracking-wider mb-1">Total Pendapatan</p>
                        <h3 className="text-3xl font-black">{formatRp(totalPendapatan)}</h3>
                    </div>
                    <svg className="w-12 h-12 text-sky-200/80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
            </div>

            <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="relative">
                    <svg className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari berdasarkan nama, nomor telepon, atau ID order..." 
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-[#10b981] transition-all bg-gray-50/50"
                    />
                </div>
            </div>

            {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 md:p-24 flex flex-col items-center justify-center min-h-[300px]">
                    <div className="text-gray-300 mb-5">
                        <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                    </div>
                    <p className="text-gray-500 text-sm">Tidak ada riwayat orderan ditemukan</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {filteredOrders.map((order) => (
                        <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                            
                            <div className="border-b border-gray-100 p-3 bg-gray-50/50">
                                <p className="text-[11px] font-medium text-gray-400">{order.order_id}</p>
                            </div>

                            <div className="p-3 flex flex-col flex-1">
                                <div className="mb-4">
                                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Pelanggan</p>
                                    <p className="text-sm text-gray-800">{order.customer_name}</p>
                                    <p className="text-[11px] text-gray-600 mt-1 flex items-center gap-1">
                                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                        {order.phone_number}
                                    </p>
                                </div>

                                <div className="bg-[#f3e8ff] border border-[#d8b4fe] rounded-lg p-3 mb-4">
                                    <div className="flex items-center gap-1.5 mb-2">
                                        <svg className="w-4 h-4 text-[#9333ea]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                        </svg>
                                        <h4 className="text-[#6b21a8] text-xs font-medium">Detail Layanan</h4>
                                    </div>

                                    <div className="space-y-2">
                                        {order.details && order.details.map((detail) => (
                                            <div key={detail.id} className="bg-white rounded p-2 border border-[#e9d5ff]">
                                                <p className="text-gray-800 text-xs">{detail.service?.name || 'Layanan Dihapus'}</p>
                                                <div className="flex justify-between items-end mt-1">
                                                    <p className="text-[10px] text-gray-500">
                                                        {parseFloat(detail.qty)} {detail.service?.category?.toLowerCase() === 'kiloan' ? 'kg' : 'pcs'} <span className="mx-0.5 text-gray-400">x</span> {formatRp(detail.price)}
                                                    </p>
                                                    <p className="text-[#7e22ce] text-xs font-medium">{formatRp(detail.subtotal)}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {order.delivery_fee > 0 && (
                                            <div className="bg-white/60 rounded p-2 border border-[#e9d5ff] flex justify-between items-center mt-1">
                                                <p className="text-[10px] text-gray-700">Biaya Ongkir</p>
                                                <p className="text-[#7e22ce] text-xs font-medium">{formatRp(order.delivery_fee)}</p>
                                            </div>
                                        )}
                                        {order.discount > 0 && (
                                            <div className="bg-emerald-50/60 rounded p-2 border border-emerald-200 flex justify-between items-center mt-1">
                                                <p className="text-[10px] text-emerald-700">Diskon Member</p>
                                                <p className="text-emerald-700 text-xs font-medium">- {formatRp(order.discount)}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 mb-4">
                                    <div className="flex items-center gap-2 bg-sky-50 border border-sky-200 p-2.5 rounded-lg text-xs text-sky-600">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                        <span className="capitalize">
                                            {order.payment_method === 'upfront' ? 'Bayar Langsung' : 'Bayar Nanti'}
                                        </span> 
                                    </div>
                                    <div className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs ${order.pickup_method === 'delivery' ? 'bg-orange-50 border-orange-200 text-orange-600' : 'bg-green-50 border-green-200 text-green-600'}`}>
                                        {order.pickup_method === 'delivery' ? (
                                            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1" /></svg>
                                        ) : (
                                            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                                        )}
                                        {order.pickup_method === 'delivery' ? 'Diantar ke Alamat' : 'Ambil di Tempat'}
                                    </div>
                                    <div className="flex items-start gap-2 bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-[11px] text-gray-500">
                                        <svg className="w-3.5 h-3.5 mt-0.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        <span className="leading-snug break-words w-full">{order.address || 'Alamat tidak diisi'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-[10px] text-gray-500">
                                        <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        {formatTanggal(order.order_date)}
                                    </div>
                                </div>

                                <div className="mt-auto ">
                                    <div className="flex justify-between items-center bg-green-100 px-3 py-2.5 rounded-lg border border-green-300 p-6 mb-6 shadow-sm">
                                        <p className="text-[10px] text-green-600 uppercase font-normal tracking-wider ">Total Harga</p>
                                        <p className="text-sm font-black text-green-500">{formatRp(order.total_price)}</p>
                                    </div>
                                    <button 
                                        onClick={() => window.open(`/cashier/orders/${order.id}/print`, '_blank')}
                                        className="flex items-center justify-center bg-[#3b82f6] hover:bg-[#2563eb] text-white py-2 px-3 rounded-lg transition-colors text-xs w-full shadow-sm"
                                    >
                                        Cetak Nota
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </CashierLayout>
    );
}