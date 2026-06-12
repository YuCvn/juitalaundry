import React from 'react';
import { Link, Head, usePage } from '@inertiajs/react';
import CashierLayout from '../../Layouts/Cashierlayout';

export default function History() {
    const { history = [], orders = [], activeCount = 0, historyCount = 0 } = usePage().props;
    
    const dataList = history.length > 0 ? history : orders;

    const countHistory = historyCount || dataList.length;
    const countAktif = activeCount || 0; 

    const totalOrder = dataList.length;
    const totalPendapatan = dataList.reduce((sum, item) => sum + (Number(item.total_price) || 0), 0);

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

    return (
        <CashierLayout title="Order & History">
            <Head title="History Selesai - Juita Laundry" />
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                <h2 className="text-xl font-medium text-gray-800">Manajemen Orders</h2>
                
                <Link href="/cashier/orders/create" className="bg-[#25D366] hover:bg-[#20bd5a] text-white py-2 px-4 rounded-lg flex items-center transition-colors shadow-sm w-fit text-sm font-semibold">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Order Baru
                </Link>
            </div>


            <div className="grid grid-cols-2 gap-2 bg-white p-1.5 rounded-xl w-full mb-6 border border-gray-200 shadow-sm">
                <Link href="/cashier/orders" className="flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 border border-transparent px-6 py-2.5 rounded-lg text-sm font-semibold transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    Order Aktif ({countAktif})
                </Link>
                <Link href="/cashier/history" className="flex items-center justify-center gap-2 bg-[#25D366] text-white shadow-md px-6 py-2.5 rounded-lg text-sm font-bold transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    History Selesai ({countHistory})
                </Link>
            </div>

            {/* KARTU SUMMARY */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>

                        <p className="text-sm font-semibold text-gray-500 mb-1">Total orderan selesai</p>
                        <h3 className="text-2xl font-bold text-gray-800">{totalOrder}</h3>
                    </div>
                    <div className="bg-[#25D366]/10 p-3 rounded-lg">

                        <svg className="w-7 h-7 text-[#25D366]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>

                        <p className="text-sm font-semibold text-gray-500 mb-1">Total pendapatan</p>
                        <h3 className="text-2xl font-bold text-gray-800">{formatRp(totalPendapatan)}</h3>
                    </div>
                    <div className="bg-[#25D366]/10 p-3 rounded-lg">

                        <svg className="w-7 h-7 text-[#25D366]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* DAFTAR CARD HISTORY */}
            {dataList.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 md:p-24 flex flex-col items-center justify-center min-h-[400px]">
                    <div className="text-gray-300 mb-5">
                        <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                    </div>
                    <p className="text-gray-500 mb-8 text-sm">Belum ada riwayat orderan selesai</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {dataList.map((order) => (
                        <div 
                            key={order.id} 
                            className="bg-white rounded-xl shadow-sm border-y border-r border-gray-200 border-l-[6px] border-l-[#25D366] overflow-hidden flex flex-col"
                        >
                            

                            <div className="border-b border-gray-100 p-3 bg-gray-50/50 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <p className="text-[11px] font-medium text-gray-400">{order.order_id}</p>
                                    

                                    <div className="bg-[#25D366]/15 text-[#25D366] px-2 py-0.5 rounded flex items-center gap-1 text-[10px] font-bold">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Selesai
                                    </div>
                                </div>
                                
                                <div className="flex gap-2">
                                    <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors" title="Edit Order">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                    </a>
                                    <a href="#" className="text-gray-400 hover:text-red-500 transition-colors" title="Hapus Order">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </a>
                                </div>
                            </div>

                            <div className="p-3 flex flex-col flex-1">
                                

                                <div className="mb-4">
                                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Pelanggan</p>
                                    <p className="text-sm text-gray-800 font-semibold">{order.customer_name}</p>
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

                                        {parseFloat(order.delivery_fee) > 0 && (
                                            <div className="bg-white/60 rounded p-2 border border-[#e9d5ff] flex justify-between items-center mt-1">
                                                <p className="text-[10px] text-gray-700">Biaya Ongkir</p>
                                                <p className="text-[#7e22ce] text-xs font-medium">{formatRp(order.delivery_fee)}</p>
                                            </div>
                                        )}

                                        {parseFloat(order.discount) > 0 && (
                                            <div className="bg-emerald-50/60 rounded p-2 border border-emerald-100 flex justify-between items-center mt-1">
                                                <p className="text-[10px] text-emerald-700">Diskon Member</p>
                                                <p className="text-emerald-700 text-xs font-medium">- {formatRp(order.discount)}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>


                                <div className="flex flex-col gap-2 mb-4">
                                    <div className="flex items-center gap-2 bg-sky-50 border border-sky-100 p-2.5 rounded-lg text-xs text-sky-600">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                        <span className="capitalize">{order.payment_method === 'upfront' ? 'Bayar Langsung' : 'Bayar Nanti'}</span>
                                    </div>

                                    <div className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs ${order.pickup_method === 'delivery' ? 'bg-orange-50 border-orange-100 text-orange-600' : 'bg-green-50 border-green-100 text-green-600'}`}>
                                        {order.pickup_method === 'delivery' ? (
                                            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1" /></svg>
                                        ) : (
                                            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                                        )}
                                        {order.pickup_method === 'delivery' ? 'Diantar ke Alamat' : 'Ambil di Tempat'}
                                    </div>

                                    <div className="flex items-start gap-2 bg-gray-50 border border-gray-100 p-2.5 rounded-lg text-[11px] text-gray-500">
                                        <svg className="w-3.5 h-3.5 mt-0.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        <span className="leading-snug break-words w-full">{order.address || 'Alamat tidak diisi'}</span>
                                    </div>

                                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 p-2.5 rounded-lg text-[10px] text-gray-500">
                                        <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        {formatTanggal(order.order_date)}
                                    </div>
                                </div>


                                <div className="mt-auto">


                                    <div className="flex flex-col justify-center items-center bg-[#25D366]/5 px-3 py-3 rounded-lg border border-[#25D366]/20 mb-4 shadow-sm text-center">
                                        <p className="text-[11px] text-[#25D366] uppercase font-bold tracking-wider mb-0.5">Total Harga</p>
                                        <p className="text-xl font-bold text-gray-800">{formatRp(order.total_price)}</p>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        
                                        <button 
                                            onClick={() => window.open(`/cashier/orders/${order.id}/print`, '_blank')}
                                            className="flex items-center justify-center bg-[#25D366] hover:bg-[#20bd5a] text-white py-2 px-3 rounded-lg transition-colors text-xs w-full shadow-sm"
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