import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import CashierLayout from '../../Layouts/CashierLayout';

export default function EditOrderView() {
    const { order, services = [], memberships = [], errors } = usePage().props; 


    const initialServices = order.details ? order.details.map(d => ({
        id: d.id || Date.now() + Math.random(), 
        service_id: d.service_id,
        name: d.service?.name || 'Layanan Terhapus',
        price: parseFloat(d.price),
        qty: parseFloat(d.qty),
        unit: d.service?.category?.toLowerCase() === 'kiloan' ? 'Kg' : 'Pcs',
        subtotal: parseFloat(d.subtotal),
        type: d.service?.category?.toLowerCase() === 'kiloan' ? 'kiloan' : 'jasa'
    })) : [];

    const { data, setData, put, processing } = useForm({
        is_membership: !!order.membership_id,
        membership_id: order.membership_id || '',
        customer_name: order.customer_name || '',
        phone_number: order.phone_number || '',
        address: order.address || '',
        services: initialServices,
        pickup_method: order.pickup_method || 'pickup',
        delivery_distance: order.delivery_distance > 0 ? order.delivery_distance : '', 
        payment_method: order.payment_method || 'upfront',
    });

    const [isModalKiloan, setIsModalKiloan] = useState(false);
    const [kiloanInput, setKiloanInput] = useState({ service_id: '', qty: '' });

    const [isModalJasa, setIsModalJasa] = useState(false);
    const [jasaInput, setJasaInput] = useState({ service_id: '', qty: '' });

    const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    const listKiloan = services.filter(s => s.category?.toLowerCase() === 'kiloan');
    const listJasa = services.filter(s => s.category?.toLowerCase() !== 'kiloan');

    const formatRp = (angka) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka || 0);
    };

    const handleMembershipChange = (e) => {
        const selectedId = e.target.value;
        const member = memberships.find(m => m.id.toString() === selectedId);

        if (member) {
            setData(prev => ({
                ...prev,
                membership_id: selectedId,
                customer_name: member.full_name || '',
                phone_number: member.phone_number || '',
                address: member.address || ''
            }));
        } else {
            setData(prev => ({
                ...prev,
                membership_id: '',
                customer_name: '',
                phone_number: '',
                address: ''
            }));
        }
    };

    const activeKiloan = listKiloan.find(s => s.id.toString() === kiloanInput.service_id.toString());
    const totalKiloanModal = activeKiloan ? (activeKiloan.price * (parseFloat(kiloanInput.qty) || 0)) : 0;

    const activeJasa = listJasa.find(s => s.id.toString() === jasaInput.service_id.toString());
    const totalJasaModal = activeJasa ? (activeJasa.price * (parseFloat(jasaInput.qty) || 0)) : 0;

    const handleSimpanKiloan = () => {
        if (!activeKiloan || !kiloanInput.qty) return;
        const newItem = {
            id: Date.now(),
            service_id: activeKiloan.id,
            name: activeKiloan.name, 
            price: activeKiloan.price,
            qty: parseFloat(kiloanInput.qty),
            unit: 'Kg',
            subtotal: totalKiloanModal,
            type: 'kiloan'
        };
        setData('services', [...data.services, newItem]);
        setIsModalKiloan(false);
        setKiloanInput({ service_id: '', qty: '' });
    };

    const handleSimpanJasa = () => {
        if (!activeJasa || !jasaInput.qty) return;
        const newItem = {
            id: Date.now(),
            service_id: activeJasa.id,
            name: activeJasa.name,
            price: activeJasa.price,
            qty: parseFloat(jasaInput.qty),
            unit: 'Pcs',
            subtotal: totalJasaModal,
            type: 'jasa'
        };
        setData('services', [...data.services, newItem]);
        setIsModalJasa(false);
        setJasaInput({ service_id: '', qty: '' });
    };

    const hapusLayanan = (id) => {
        setData('services', data.services.filter(item => item.id !== id));
    };

    const subtotalServices = data.services.reduce((sum, item) => sum + item.subtotal, 0);
    const distance = parseFloat(data.delivery_distance) || 0;
    const deliveryFee = (data.pickup_method === 'delivery' && distance > 3) 
        ? (Math.ceil(distance) - 3) * 2000 
        : 0;

    const discount = (data.is_membership && data.membership_id) ? (subtotalServices * 0.10) : 0; 
    const totalSemua = subtotalServices - discount + deliveryFee;

    const selectedMember = memberships.find(m => m.id.toString() === data.membership_id.toString());
    

    const baseBalance = selectedMember ? parseFloat(selectedMember.balance) : 0;
    const balanceWithRefund = (order.membership_id === data.membership_id) ? (baseBalance + parseFloat(order.total_price)) : baseBalance;
    const currentBalance = selectedMember ? balanceWithRefund : 0;
    
    const isSaldoKurang = (data.is_membership && data.membership_id) ? (currentBalance < totalSemua) : false;
    const poinDidapat = Math.floor(totalSemua / 10000);

    const submit = (e) => {
        e.preventDefault();
        
        setIsLoadingModalOpen(true);
        
        setTimeout(() => {
            setIsLoadingModalOpen(false);
            setIsSuccessModalOpen(true);
            
            setTimeout(() => {
                put(`/cashier/orders/${order.id}`, {
                    preserveScroll: true,
                    onFinish: () => {
                        setIsSuccessModalOpen(false);
                    }
                });
            }, 800);
            
        }, 1200);
    };

    return (
        <CashierLayout title={`Edit Order ${order.order_id}`}>
            <Head title={`Edit Order ${order.order_id} - Juita Laundry`} />
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pb-12 px-4 md:px-0">
                <div className="md:col-start-4 md:col-span-6 relative">
                    
                    <Link href="/cashier/orders" className="inline-flex items-center text-sky-500 hover:text-sky-700 font-semibold mb-6 transition-colors text-sm">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Kembali ke Orders
                    </Link>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                        <h2 className="text-xl font-bold text-sky-600 mb-8">Edit Order <span className="text-gray-800">#{order.order_id}</span></h2>

                        {errors?.error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100 flex items-start gap-3">
                                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <p className="text-xs font-semibold">{errors.error}</p>
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            
                            <div className="bg-sky-50 border border-sky-100 p-4 rounded-xl">
                                <div className="flex items-start gap-3">
                                    <input 
                                        type="checkbox" 
                                        id="membership"
                                        checked={data.is_membership}
                                        onChange={e => {
                                            const isChecked = e.target.checked;
                                            setData(prev => ({
                                                ...prev, 
                                                is_membership: isChecked,
                                                membership_id: isChecked ? prev.membership_id : '',
                                                customer_name: isChecked ? prev.customer_name : '',
                                                phone_number: isChecked ? prev.phone_number : '',
                                                address: isChecked ? prev.address : ''
                                            }));
                                        }}
                                        className="mt-0.5 w-4 h-4 text-sky-600 rounded border-gray-300 focus:ring-sky-500 cursor-pointer"
                                    />
                                    <div>
                                        <label htmlFor="membership" className="font-semibold text-gray-800 cursor-pointer flex items-center gap-2 text-sm">
                                            <svg className="w-4 h-4 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" /></svg>
                                            Gunakan Membership
                                        </label>
                                        <p className="text-xs text-sky-700 mt-1">Centang jika pelanggan ini menggunakan membership (akan mendapat poin dan bisa bayar pakai saldo).</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {data.is_membership && (
                                    <div className="animate-fade-in">
                                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Pilih Member (Mendapatkan Diskon 10%)</label>
                                        <div className="relative">
                                            <svg className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                            <select 
                                                value={data.membership_id}
                                                onChange={handleMembershipChange}
                                                className="w-full pl-9 pr-4 py-2 border border-sky-500 bg-white rounded-lg focus:ring-2 focus:ring-sky-500 outline-none text-gray-700 font-medium text-xs"
                                            >
                                                <option value="">-- Ketik manual atau pilih dari daftar member --</option>
                                                {memberships.length > 0 ? (
                                                    memberships.map(m => (
                                                        <option key={m.id} value={m.id}>
                                                            {m.full_name} - Saldo: {formatRp(m.balance || 0)}
                                                        </option>
                                                    ))
                                                ) : (
                                                    <option value="" disabled>Data member kosong</option>
                                                )}
                                            </select>
                                        </div>
                                        
                                        {selectedMember && (
                                            <div className="mt-3 bg-[#dcf8c6] border border-[#128C7E] rounded-lg p-3 flex flex-col gap-1 shadow-sm">
                                                <p className="text-[#075E54] font-bold text-sm">{selectedMember.full_name}</p>
                                                <p className="text-[#075E54] text-xs">
                                                    Estimasi Saldo: <span className="font-bold">{formatRp(currentBalance)}</span>
                                                </p>
                                                <p className="text-[10px] text-[#128C7E] italic">*Estimasi saldo sudah termasuk proses restorasi (pengembalian) tagihan pesanan sebelumnya.</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Nama Pelanggan</label>
                                    <input 
                                        type="text" 
                                        value={data.customer_name} 
                                        onChange={e => setData('customer_name', e.target.value)} 
                                        disabled={!!data.membership_id}
                                        placeholder="Nama pelanggan" 
                                        className={`w-full px-4 py-2 border border-sky-500 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition-colors text-xs ${data.membership_id ? 'bg-gray-100 text-gray-500 cursor-not-allowed font-semibold' : 'bg-white'}`} 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Telepon</label>
                                    <input 
                                        type="tel" 
                                        value={data.phone_number} 
                                        onChange={e => setData('phone_number', e.target.value)} 
                                        disabled={!!data.membership_id}
                                        placeholder="08xxxxxxxx" 
                                        className={`w-full px-4 py-2 border border-sky-500 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition-colors text-xs ${data.membership_id ? 'bg-gray-100 text-gray-500 cursor-not-allowed font-semibold' : 'bg-white'}`} 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Alamat</label>
                                    <input 
                                        type="text" 
                                        value={data.address} 
                                        onChange={e => setData('address', e.target.value)} 
                                        disabled={!!data.membership_id}
                                        placeholder="Alamat lengkap" 
                                        className={`w-full px-4 py-2 border border-sky-500 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition-colors text-xs ${data.membership_id ? 'bg-gray-100 text-gray-500 cursor-not-allowed font-semibold' : 'bg-white'}`} 
                                    />
                                </div>
                            </div>

                            <div className="bg-[#f3e8ff] border border-[#d8b4fe] rounded-xl p-4 md:p-5 shadow-sm">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                                    <h3 className="text-base font-bold text-[#6b21a8]">Jenis Layanan</h3>
                                    
                                    <div className="flex gap-2">
                                        <button onClick={() => setIsModalKiloan(true)} type="button" className="bg-[#9333ea] hover:bg-[#7e22ce] text-white text-xs font-bold py-1.5 px-3 md:px-4 rounded-lg shadow transition-colors flex items-center">
                                            <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                                            Kiloan
                                        </button>
                                        <button onClick={() => setIsModalJasa(true)} type="button" className="bg-[#25D366] hover:bg-[#128C7E] text-white text-xs font-bold py-1.5 px-3 md:px-4 rounded-lg shadow transition-colors flex items-center">
                                            <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                                            Jasa Lainnya
                                        </button>
                                    </div>
                                </div>

                                <div className={`bg-white/90 rounded-lg p-4 min-h-[100px] flex flex-col justify-center transition-all ${data.services.length === 0 ? 'border-2 border-dashed border-[#d8b4fe]' : 'border border-[#e9d5ff]'}`}>
                                    {data.services.length === 0 ? (
                                        <div className="text-center">
                                            <p className="text-xs font-medium text-[#7e22ce] italic">Belum ada layanan yang ditambahkan</p>
                                            <p className="text-[10px] text-gray-500 mt-1">Klik tombol "Kiloan" atau "Jasa Lainnya" untuk menambah</p>
                                        </div>
                                    ) : (
                                        <ul className="space-y-2.5">
                                            {data.services.map((item) => (
                                                <li key={item.id} className="flex justify-between items-center p-2.5 bg-white border border-[#e9d5ff] rounded-lg shadow-sm">
                                                    <div>
                                                        <p className="font-bold text-gray-800 text-xs md:text-sm">{item.name}</p>
                                                        <p className="text-[11px] font-medium text-gray-500 mt-0.5">
                                                            {item.qty} {item.unit} x {formatRp(item.price)}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-bold text-[#6b21a8] text-xs md:text-sm">{formatRp(item.subtotal)}</span>
                                                        <button type="button" onClick={() => hapusLayanan(item.id)} className="text-rose-500 hover:text-rose-700 bg-rose-50 p-1 rounded-md transition-colors">
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                        </button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>

                            <div className="pt-2">
                                <label className="block text-xs font-bold text-gray-700 mb-2">Metode Pengambilan</label>
                                
                                <div className="grid grid-cols-2 gap-3 mb-2">
                                    <label className={`cursor-pointer border-2 rounded-xl p-3 flex flex-col items-center justify-center transition-all ${data.pickup_method === 'pickup' ? 'border-[#25D366] bg-[#25D366]/10 shadow-sm' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
                                        <input type="radio" value="pickup" checked={data.pickup_method === 'pickup'} onChange={() => setData(prev => ({ ...prev, pickup_method: 'pickup', delivery_distance: '' }))} className="hidden" />
                                        <div className={`w-4 h-4 mb-2 rounded-full border-2 flex items-center justify-center ${data.pickup_method === 'pickup' ? 'border-[#25D366]' : 'border-gray-300'}`}>
                                            {data.pickup_method === 'pickup' && <div className="w-2 h-2 rounded-full bg-[#25D366]"></div>}
                                        </div>
                                        <svg className={`w-5 h-5 mb-1 ${data.pickup_method === 'pickup' ? 'text-[#25D366]' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                        <span className={`text-xs font-semibold ${data.pickup_method === 'pickup' ? 'text-gray-800' : 'text-gray-500'}`}>Ambil di Tempat</span>
                                    </label>

                                    <label className={`cursor-pointer border-2 rounded-xl p-3 flex flex-col items-center justify-center transition-all ${data.pickup_method === 'delivery' ? 'border-orange-500 bg-orange-100/50 shadow-sm' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
                                        <input type="radio" value="delivery" checked={data.pickup_method === 'delivery'} onChange={() => setData('pickup_method', 'delivery')} className="hidden" />
                                        <div className={`w-4 h-4 mb-2 rounded-full border-2 flex items-center justify-center ${data.pickup_method === 'delivery' ? 'border-orange-500' : 'border-gray-300'}`}>
                                            {data.pickup_method === 'delivery' && <div className="w-2 h-2 rounded-full bg-orange-500"></div>}
                                        </div>
                                        <svg className={`w-5 h-5 mb-1 ${data.pickup_method === 'delivery' ? 'text-orange-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1" />
                                        </svg>
                                        <span className={`text-xs font-semibold ${data.pickup_method === 'delivery' ? 'text-gray-800' : 'text-gray-500'}`}>Antar ke Alamat</span>
                                    </label>
                                </div>
                                
                                <p className="text-[11px] text-gray-500 font-medium mb-3">
                                    🚚 Gratis ongkir hingga 3 km. Lebih dari itu dikenakan biaya Rp 2.000/km
                                </p>
                                
                                {data.pickup_method === 'delivery' && (
                                    <div className="mb-3 animate-fade-in">
                                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Jarak Pengiriman (km)</label>
                                        <div className="relative">
                                            <svg className="w-4 h-4 absolute left-3 top-2.5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                            <input type="number" min="0" step="0.1" value={data.delivery_distance} onChange={e => setData('delivery_distance', e.target.value)} placeholder="0.0" className="w-full pl-9 pr-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none transition-all text-xs" />
                                        </div>

                                        {data.delivery_distance !== '' && data.delivery_distance !== null && (
                                            distance <= 3 ? (
                                                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-start gap-2 shadow-sm mt-3 animate-fade-in">
                                                    <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                    <p className="text-xs text-emerald-700 mt-0.5"><span className="font-bold">Gratis Ongkir!</span> Jarak masih dalam radius gratis</p>
                                                </div>
                                            ) : (
                                                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-start gap-2 shadow-sm mt-3 animate-fade-in">
                                                    <svg className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                                    <div>
                                                        <p className="text-xs font-semibold text-orange-800">Biaya pengiriman: {formatRp(deliveryFee)}</p>
                                                        <p className="text-[10px] text-orange-600 mt-0.5">{Math.ceil(distance) - 3} km x Rp 2.000/km</p>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>

                            {!data.is_membership && (
                                <div className="pt-2 animate-fade-in">
                                    <label className="block text-xs font-bold text-gray-700 mb-2">Metode Pembayaran</label>
                                    
                                    <div className="grid grid-cols-2 gap-3">
                                        <label className={`cursor-pointer border-2 rounded-xl p-3 flex flex-col items-center justify-center transition-all ${data.payment_method === 'pay_later' ? 'border-[#0ea5e9] bg-white shadow-sm' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
                                            <input type="radio" value="pay_later" checked={data.payment_method === 'pay_later'} onChange={e => setData('payment_method', e.target.value)} className="hidden" />
                                            <div className={`w-4 h-4 mb-2 rounded-full border-2 flex items-center justify-center ${data.payment_method === 'pay_later' ? 'border-[#0ea5e9]' : 'border-gray-300'}`}>
                                                {data.payment_method === 'pay_later' && <div className="w-2 h-2 rounded-full bg-[#4b5563]"></div>}
                                            </div>
                                            <svg className={`w-5 h-5 mb-1 ${data.payment_method === 'pay_later' ? 'text-[#0ea5e9]' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1" />
                                            </svg>
                                            <span className={`text-xs font-semibold ${data.payment_method === 'pay_later' ? 'text-gray-800' : 'text-gray-500'}`}>Bayar Nanti</span>
                                        </label>

                                        <label className={`cursor-pointer border-2 rounded-xl p-3 flex flex-col items-center justify-center transition-all ${data.payment_method === 'upfront' ? 'border-[#0ea5e9] bg-sky-50/30 shadow-sm' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
                                            <input type="radio" value="upfront" checked={data.payment_method === 'upfront'} onChange={e => setData('payment_method', e.target.value)} className="hidden" />
                                            <div className={`w-4 h-4 mb-2 rounded-full border-2 flex items-center justify-center ${data.payment_method === 'upfront' ? 'border-[#0ea5e9]' : 'border-gray-300'}`}>
                                                {data.payment_method === 'upfront' && <div className="w-2 h-2 rounded-full bg-[#4b5563]"></div>}
                                            </div>
                                            <svg className={`w-5 h-5 mb-1 ${data.payment_method === 'upfront' ? 'text-[#0ea5e9]' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                            </svg>
                                            <span className={`text-xs font-semibold ${data.payment_method === 'upfront' ? 'text-gray-800' : 'text-gray-500'}`}>Bayar Langsung</span>
                                        </label>
                                    </div>
                                </div>
                            )}

                            <div className="bg-[#0ea5e9] rounded-xl p-4 text-white mt-5 shadow-md text-xs relative overflow-hidden">
                                <p className="font-medium text-sky-100 mb-2.5">Ringkasan Pembayaran</p>

                                <div className="flex justify-between py-1.5 border-b border-sky-400/50">
                                    <span>Total Layanan ({data.services.length} item)</span>
                                    <span className="font-semibold">{formatRp(subtotalServices)}</span>
                                </div>
                                
                                {data.is_membership && data.membership_id && (
                                    <div className="flex justify-between py-1.5 border-b border-sky-400/50 text-emerald-200">
                                        <span>Diskon Member (10%)</span>
                                        <span className="font-semibold">- {formatRp(discount)}</span>
                                    </div>
                                )}

                                {data.pickup_method === 'delivery' && data.delivery_distance !== '' && (
                                    <div className="flex justify-between py-1.5 border-b border-sky-400/50">
                                        <span>Biaya Ongkir {distance > 3 ? `(${(Math.ceil(distance) - 3)} KM)` : '(Gratis)'}</span>
                                        <span className="font-semibold">{formatRp(deliveryFee)}</span>
                                    </div>
                                )}
                                
                                <div className="pt-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm font-semibold">Total Pembayaran</span>
                                        <span className="text-xl font-bold">{formatRp(totalSemua)}</span>
                                    </div>
                                    
                                    {data.is_membership && data.membership_id && (
                                        <div className="flex justify-start items-center gap-1.5 mt-1.5 animate-fade-in">
                                            <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M19.95 9.05L12 21.36 4.05 9.05 7.55 3h8.9l3.5 6.05zM12 18.5l6.05-9.35H5.95L12 18.5zm-.4-10.45L8.75 4.5h6.5l-2.85 3.55H11.6z"/>
                                            </svg>
                                            <span className="text-xs font-semibold italic text-white">Poin yang didapat adalah {poinDidapat} poin</span>
                                        </div>
                                    )}
                                </div>

                                {isSaldoKurang && (
                                    <div className="mt-3 bg-rose-500/20 border border-rose-400/50 p-2.5 rounded-lg flex items-start gap-2">
                                        <svg className="w-4 h-4 text-rose-200 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                        <p className="text-[11px] text-rose-100 font-medium leading-snug">
                                            Saldo member (sisa {formatRp(currentBalance)}) tidak mencukupi untuk tagihan ini. Kasir mungkin harus membatalkan pemakaian member atau mengisi saldo member terlebih dahulu.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <button type="submit" disabled={processing || isLoadingModalOpen || isSuccessModalOpen || isSaldoKurang || data.services.length === 0} className="w-full bg-[#0284c7] hover:bg-[#0369a1] transition-colors text-white font-bold py-3 px-4 rounded-xl shadow-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                                Simpan Perubahan
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Modal Kiloan */}
            {isModalKiloan && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
                            <h3 className="text-base font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">Tambah Laundry Kiloan</h3>
                            <button onClick={() => setIsModalKiloan(false)} className="text-gray-400 hover:text-gray-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                        </div>
                        <div className="p-4 space-y-4 bg-gray-50/50">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Jenis Layanan</label>
                                <select value={kiloanInput.service_id} onChange={e => setKiloanInput({...kiloanInput, service_id: e.target.value})} className="w-full px-3 py-2 bg-white border border-purple-500 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none font-medium text-gray-700 text-xs">
                                    <option value="" disabled>-- Pilih Layanan Kiloan --</option>
                                    {listKiloan.length > 0 ? listKiloan.map(s => <option key={s.id} value={s.id}>{s.name}</option>) : <option value="" disabled>Data layanan kiloan kosong</option>}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Berat</label>
                                <div className="relative flex items-center">
                                    <input type="number" min="0" step="0.1" value={kiloanInput.qty} onChange={e => setKiloanInput({...kiloanInput, qty: e.target.value})} className="w-full pl-3 pr-10 py-2 bg-white border border-purple-500 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none font-medium text-gray-800 text-xs" placeholder="0.0" />
                                    <span className="absolute right-3 font-medium text-gray-400 text-xs">Kg</span>
                                </div>
                            </div>
                            
                            {kiloanInput.qty !== '' && parseFloat(kiloanInput.qty) > 0 && (
                                <div className="bg-purple-100 border border-purple-500 rounded-lg py-4 px-4 mt-4 flex flex-col items-start animate-fade-in">
                                    <span className="text-xs text-black">Harga Per kg:</span>
                                    <span className="text-xl font-bold text-purple-500 mt-0.5">{activeKiloan ? formatRp(activeKiloan.price) : 'Rp 0'}</span>
                                    
                                    <div className="w-full border-t border-purple-500 my-3"></div>
                                    
                                    <span className="text-xs text-black">Total Harga:</span>
                                    <span className="text-2xl font-bold text-purple-500 mt-0.5">{formatRp(totalKiloanModal)}</span>
                                </div>
                            )}
                        </div>
                        <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-white">
                            <button type="button" onClick={() => setIsModalKiloan(false)} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 text-xs">Batal</button>
                            <button type="button" onClick={handleSimpanKiloan} disabled={!activeKiloan || !kiloanInput.qty} className="px-4 py-2 rounded-lg bg-[#9333ea] hover:bg-[#7e22ce] text-white font-bold shadow-md disabled:opacity-50 transition-colors text-xs">Simpan</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Jasa Lainnya */}
            {isModalJasa && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
                            <h3 className="text-base font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400">Tambah Jasa Lainnya</h3>
                            <button onClick={() => setIsModalJasa(false)} className="text-gray-400 hover:text-gray-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                        </div>
                        <div className="p-4 space-y-4 bg-gray-50/50">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Jenis Layanan</label>
                                <select value={jasaInput.service_id} onChange={e => setJasaInput({...jasaInput, service_id: e.target.value})} className="w-full px-3 py-2 bg-white border border-emerald-400 rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none font-medium text-gray-700 text-xs">
                                    <option value="" disabled>-- Pilih Jasa --</option>
                                    {listJasa.length > 0 ? listJasa.map(s => <option key={s.id} value={s.id}>{s.name}</option>) : <option value="" disabled>Data jasa kosong</option>}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Jumlah</label>
                                <div className="relative flex items-center">
                                    <input type="number" min="1" value={jasaInput.qty} onChange={e => setJasaInput({...jasaInput, qty: e.target.value})} className="w-full pl-3 pr-10 py-2 bg-white border border-emerald-400 rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none font-medium text-gray-800 text-xs" placeholder="0" />
                                    <span className="absolute right-3 font-medium text-gray-400 text-xs">Pcs</span>
                                </div>
                            </div>
                            
                            {jasaInput.qty !== '' && parseInt(jasaInput.qty) > 0 && (
                                <div className="bg-emerald-100 border border-emerald-600 rounded-lg py-4 px-4 mt-4 flex flex-col items-start animate-fade-in">
                                    <span className="text-xs text-black">Harga per pcs:</span>
                                    <span className="text-xl font-bold text-emerald-600 mt-0.5">{activeJasa ? formatRp(activeJasa.price) : 'Rp 0'}</span>
                                    
                                    <div className="w-full border-t border-emerald-600 my-3"></div>
                                    
                                    <span className="text-xs text-black">Total Harga:</span>
                                    <span className="text-2xl font-bold text-emerald-600 mt-0.5">{formatRp(totalJasaModal)}</span>
                                </div>
                            )}
                        </div>
                        <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-white">
                            <button type="button" onClick={() => setIsModalJasa(false)} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 text-xs">Batal</button>
                            <button type="button" onClick={handleSimpanJasa} disabled={!activeJasa || !jasaInput.qty} className="px-4 py-2 rounded-lg bg-[#10b981] hover:bg-[#059669] text-white font-bold shadow-md disabled:opacity-50 transition-colors text-xs">Simpan</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL LOADING */}
            {isLoadingModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4 animate-fade-in">
                    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center text-center">
                        <div className="relative mb-5 flex items-center justify-center w-16 h-16">
                            <svg className="animate-spin absolute inset-0 w-full h-full text-blue-600" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <svg className="w-6 h-6 text-blue-600 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                        </div>
                        
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                            Menyimpan Perubahan
                        </h3>
                        <p className="text-[11px] text-gray-500 mb-6">
                            Sedang memperbarui data pesanan...
                        </p>
                    </div>
                </div>
            )}

            {/* MODAL SUCCESS */}
            {isSuccessModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4 animate-fade-in">
                    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-[#16a34a] rounded-full flex items-center justify-center mb-5 shadow-sm">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        
                        <h3 className="text-lg font-bold text-[#16a34a] mb-1">
                            Perubahan Berhasil!
                        </h3>
                        <p className="text-[11px] text-gray-500 mb-6">
                            Data order berhasil disimpan ke sistem.
                        </p>

                        <div className="flex items-center gap-1.5 text-gray-400">
                            <svg className="w-3.5 h-3.5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24"><path d="M19.95 9.05L12 21.36 4.05 9.05 7.55 3h8.9l3.5 6.05zM12 18.5l6.05-9.35H5.95L12 18.5zm-.4-10.45L8.75 4.5h6.5l-2.85 3.55H11.6z"/></svg>
                            <span className="text-[10px] italic">Mengalihkan halaman...</span>
                        </div>
                    </div>
                </div>
            )}
        </CashierLayout>
    );
}