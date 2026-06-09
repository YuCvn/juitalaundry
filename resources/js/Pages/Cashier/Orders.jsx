import React, { useState } from 'react';
import { Link, Head, usePage, router } from '@inertiajs/react';
import CashierLayout from '../../Layouts/CashierLayout';

export default function Orders() {
    const { orders = [] } = usePage().props;
    const [activeFilter, setActiveFilter] = useState('semua');

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

    const activeOrders = orders.filter(o => o.status !== 'picked_up');

    const countSemua = activeOrders.length;
    const countMenunggu = activeOrders.filter(o => o.status === 'pending').length;
    const countProses = activeOrders.filter(o => o.status === 'processing').length;
    const countSelesai = activeOrders.filter(o => o.status === 'completed').length;

    const filteredOrders = activeOrders.filter(order => {
        if (activeFilter === 'semua') return true;
        if (activeFilter === 'menunggu') return order.status === 'pending';
        if (activeFilter === 'proses') return order.status === 'processing';
        if (activeFilter === 'selesai') return order.status === 'completed';
        return true;
    });

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'bg-amber-50 text-amber-600 border-amber-200 focus:ring-amber-500';
            case 'processing': return 'bg-blue-50 text-blue-600 border-blue-200 focus:ring-blue-500';
            case 'completed': return 'bg-emerald-50 text-emerald-600 border-emerald-200 focus:ring-emerald-500';
            case 'picked_up': return 'bg-gray-50 text-gray-600 border-gray-200 focus:ring-gray-500';
            default: return 'bg-gray-50 text-gray-600 border-gray-200';
        }
    };

    const handleStatusChange = (orderId, newStatus) => {
        router.put(`/cashier/orders/${orderId}/status`, {
            status: newStatus
        }, {
            preserveScroll: true,
        });
    };

    const handleWhatsApp = (order) => {
        if (order.status_order === 'menunggu') return; 

        const phone = order.whatsapp_number; 
        
        if (!phone) {
            alert('Nomor telepon pelanggan tidak tersedia.');
            return;
        }

        let text = '';

        if (order.status_order === 'dalam proses') {
            text = `Halo Kak *${order.nama}*, salam hangat dari Juita Laundry! 😊\n\nIngin mengabarkan bahwa pesanan laundry Kakak dengan nomor resi *${order.order_id}* saat ini *sedang dalam proses* pengerjaan oleh tim kami.\n\nKami pastikan cucian Kakak ditangani dengan baik agar bersih dan wangi maksimal. Kami akan segera menghubungi Kakak kembali setelah semuanya selesai ya. Mohon ditunggu, Kak! 🙏✨`;
        
        } else if (order.status_order === 'selesai') {
            text = `Halo Kak *${order.nama}*, kabar gembira dari Juita Laundry! 🎉\n\nPesanan laundry Kakak dengan nomor resi *${order.order_id}* *sudah selesai* dikerjakan, sudah wangi, dan rapi lho!\n\nTotal tagihannya adalah *${formatRp(order.total_harga)}*.\n\nApakah pesanan ini mau Kakak ambil sendiri ke outlet kami, atau ingin kami bantu antarkan ke alamat Kakak? Jangan ragu untuk beri tahu kami ya Kak. Terima kasih banyak! 🥰👗`;
        
        } else if (order.status_order === 'sudah diambil') {
            text = `Halo Kak *${order.nama}*, terima kasih banyak telah mempercayakan cuciannya di Juita Laundry! 😊\n\nPesanan dengan nomor resi *${order.order_id}* sudah tercatat selesai dan diambil. Semoga Kakak puas dengan hasilnya ya. Ditunggu kedatangannya kembali! 🙏✨`;
        }

        const encodedText = encodeURIComponent(text);
        
        window.open(`https://wa.me/${phone}?text=${encodedText}`, '_blank');
    };
    return (
        <CashierLayout title="Order & History">
            <Head title="Manajemen Orders - Juita Laundry" />
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                <h2 className="text-xl font-medium text-gray-800">Manajemen Orders</h2>
                
                <Link href="/cashier/orders/create" className="bg-[#10b981] hover:bg-emerald-600 text-white py-2 px-4 rounded-lg flex items-center transition-colors shadow-sm w-fit text-sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Order Baru
                </Link>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-white p-1.5 rounded-xl w-full mb-6 border border-gray-200 shadow-sm">
                <Link href="/cashier/orders" className="flex items-center justify-center bg-[#3b82f6] text-white shadow-md px-6 py-2.5 rounded-lg text-sm font-bold transition-all">
                    Order Aktif
                </Link>
                <Link href="/cashier/history" className="flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-50 border border-transparent px-6 py-2.5 rounded-lg text-sm font-semibold transition-all">
                    History Selesai
                </Link>
            </div>

            <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 mb-6 flex items-center gap-3 overflow-x-auto">
                <span className="text-xs text-gray-500 whitespace-nowrap pl-2">Filter Status:</span>
                
                <div className="flex gap-2">
                    <button onClick={() => setActiveFilter('semua')} className={`px-4 py-1.5 rounded-full text-xs transition-all whitespace-nowrap ${activeFilter === 'semua' ? 'bg-[#3b82f6] text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                        Semua ({countSemua})
                    </button>
                    <button onClick={() => setActiveFilter('menunggu')} className={`px-4 py-1.5 rounded-full text-xs transition-all whitespace-nowrap ${activeFilter === 'menunggu' ? 'bg-amber-500 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                        Menunggu ({countMenunggu})
                    </button>
                    <button onClick={() => setActiveFilter('proses')} className={`px-4 py-1.5 rounded-full text-xs transition-all whitespace-nowrap ${activeFilter === 'proses' ? 'bg-blue-500 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                        Dalam Proses ({countProses})
                    </button>
                    <button onClick={() => setActiveFilter('selesai')} className={`px-4 py-1.5 rounded-full text-xs transition-all whitespace-nowrap ${activeFilter === 'selesai' ? 'bg-emerald-500 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                        Selesai ({countSelesai})
                    </button>
                </div>
            </div>

            {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 md:p-24 flex flex-col items-center justify-center min-h-[400px]">
                    <div className="text-gray-300 mb-5">
                        <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                    </div>
                    <p className="text-gray-500 mb-8 text-sm">Belum ada order di kategori ini</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {filteredOrders.map((order) => (
                        <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                            
                            <div className="border-b border-gray-100 p-3 bg-gray-50/50">
                                <p className="text-[11px] font-medium text-gray-400">{order.order_id}</p>
                            </div>

                            <div className="p-3 flex flex-col flex-1">
                                {/* --- 1. PELANGGAN --- */}
                                <div className="mb-4">
                                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Pelanggan</p>
                                    <p className="text-sm text-gray-800">{order.customer_name}</p>
                                    <p className="text-[11px] text-gray-600 mt-1 flex items-center gap-1">
                                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                        {order.phone_number}
                                    </p>
                                </div>

                                {/* --- 2. DETAIL LAYANAN --- */}
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

                                        {/* Ongkir */}
                                        {parseFloat(order.delivery_fee) > 0 && (
                                            <div className="bg-white/60 rounded p-2 border border-[#e9d5ff] flex justify-between items-center mt-1">
                                                <p className="text-[10px] text-gray-700">Biaya Ongkir</p>
                                                <p className="text-[#7e22ce] text-xs font-medium">{formatRp(order.delivery_fee)}</p>
                                            </div>
                                        )}

                                        {/* Diskon Member */}
                                        {parseFloat(order.discount) > 0 && (
                                            <div className="bg-emerald-50/60 rounded p-2 border border-emerald-100 flex justify-between items-center mt-1">
                                                <p className="text-[10px] text-emerald-700">Diskon Member</p>
                                                <p className="text-emerald-700 text-xs font-medium">- {formatRp(order.discount)}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* --- 3. KUMPULAN CARD INFO --- */}
                                <div className="flex flex-col gap-2 mb-4">
                                    {/* 3.1 Pembayaran */}
                                    <div className="flex items-center gap-2 bg-sky-50 border border-sky-100 p-2.5 rounded-lg text-xs text-sky-600">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                        <span className="capitalize">{order.payment_method === 'upfront' ? 'Bayar Langsung' : 'Bayar Nanti'}</span>
                                    </div>

                                    {/* 3.2 Ambil / Antar */}
                                    <div className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs ${order.pickup_method === 'delivery' ? 'bg-orange-50 border-orange-100 text-orange-600' : 'bg-green-50 border-green-100 text-green-600'}`}>
                                        {order.pickup_method === 'delivery' ? (
                                            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1" /></svg>
                                        ) : (
                                            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                                        )}
                                        {order.pickup_method === 'delivery' ? 'Diantar ke Alamat' : 'Ambil di Tempat'}
                                    </div>

                                    {/* 3.3 Alamat */}
                                    <div className="flex items-start gap-2 bg-gray-50 border border-gray-100 p-2.5 rounded-lg text-[11px] text-gray-500">
                                        <svg className="w-3.5 h-3.5 mt-0.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        <span className="leading-snug break-words w-full">{order.address || 'Alamat tidak diisi'}</span>
                                    </div>

                                    {/* 3.4 Waktu */}
                                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 p-2.5 rounded-lg text-[10px] text-gray-500">
                                        <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        {formatTanggal(order.order_date)}
                                    </div>
                                </div>

                                <div className="mt-auto">
                                    {/* --- 4. TOTAL HARGA --- */}
                                    <div className="flex justify-between items-center bg-sky-100 px-3 py-2.5 rounded-lg border border-sky-200 mb-4 shadow-sm">
                                        <p className="text-[10px] text-sky-700 uppercase font-bold tracking-wider">Total Harga</p>
                                        <p className="text-sm font-medium text-sky-900">{formatRp(order.total_price)}</p>
                                    </div>

                                    {/* --- 5. STATUS DROPDOWN --- */}
                                    <div className="flex flex-col mb-4">
                                        <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Status Pengerjaan</p>
                                        <select 
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            className={`w-full px-3 py-2 rounded-lg text-xs capitalize border outline-none cursor-pointer focus:ring-2 transition-all shadow-sm ${getStatusStyle(order.status)}`}
                                        >
                                            <option value="pending" className="bg-white text-gray-700">Menunggu</option>
                                            <option value="processing" className="bg-white text-gray-700">Dalam Proses</option>
                                            <option value="completed" className="bg-white text-gray-700">Selesai</option>
                                            <option value="picked_up" className="bg-white text-gray-700">Sudah Diambil</option>
                                        </select>
                                    </div>
                                    {/* --- 6. TOMBOL AKSI --- */}
                                    <div className="flex flex-col gap-2">
                                        <button 
                                            onClick={() => handleWhatsApp(order)}
                                            disabled={order.status_order === 'menunggu'}
                                            className={`flex items-center justify-center py-2 px-3 rounded-lg transition-all text-xs w-full shadow-sm ${
                                                order.status_order === 'menunggu' 
                                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-200' 
                                                : 'bg-[#10b981] hover:bg-[#059669] text-white border border-transparent'
                                            }`}
                                        >
                                            <svg className="w-3.5 h-3.5 mr-1.5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12.031 2C6.51 2 2.031 6.48 2.031 12c0 1.765.46 3.42 1.259 4.885L2.031 22l5.328-1.259A9.972 9.972 0 0012.031 22c5.52 0 10-4.48 10-10 0-5.52-4.48-10-10-10zm0 18.375a8.375 8.375 0 01-4.275-1.168l-.307-.183-3.176.75.76-3.093-.2-.317a8.372 8.372 0 01-1.177-4.364c0-4.636 3.766-8.402 8.402-8.402 4.636 0 8.4 3.766 8.4 8.402 0 4.636-3.764 8.4-8.4 8.4zm4.61-6.305c-.252-.126-1.498-.74-1.73-.824-.23-.085-.4-.127-.568.125-.168.252-.653.824-.8 1-.147.175-.295.197-.547.07-.253-.125-1.07-.395-2.042-1.263-.756-.675-1.265-1.508-1.413-1.76-.148-.253-.016-.39.11-.515.114-.113.253-.295.378-.443.125-.148.167-.252.25-.42.084-.168.043-.315-.02-.442-.063-.126-.568-1.37-.777-1.874-.204-.492-.41-.426-.568-.433-.148-.008-.318-.01-.486-.01-.168 0-.442.063-.674.316-.232.253-.884.864-.884 2.106 0 1.243.905 2.443 1.03 2.61.126.168 1.782 2.718 4.316 3.81.603.26 1.074.415 1.442.53.605.193 1.156.165 1.593.1.488-.073 1.498-.612 1.708-1.204.21-.59.21-1.094.148-1.204-.063-.11-.232-.175-.484-.3z"/>
                                            </svg>
                                            Kirim ke WhatsApp
                                        </button>
                                        <button 
                                            onClick={() => window.open(`/cashier/orders/${order.id}/print`, '_blank')}
                                            className="flex items-center justify-center bg-[#3b82f6] hover:bg-[#2563eb] text-white py-2 px-3 rounded-lg transition-colors text-xs w-full shadow-sm"
                                        >
                                            <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                                            Cetak Nota
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </CashierLayout>
    );
}