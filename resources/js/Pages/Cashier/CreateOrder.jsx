import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import CashierLayout from '../../Layouts/CashierLayout';

export default function CreateOrder() {
    const { services = [], memberships = [], errors } = usePage().props; 

    // --- MAIN FORM STATE ---
    const { data, setData, post, processing } = useForm({
        is_membership: false,
        membership_id: '',
        nama: '',
        telepon: '',
        alamat: '',
        layanan: [],
        metode_pengambilan: 'ambil',
        jarak_pengiriman: 0, 
        metode_pembayaran: 'langsung',
    });

    // --- MODAL STATE ---
    const [isModalKiloan, setIsModalKiloan] = useState(false);
    const [kiloanInput, setKiloanInput] = useState({ service_id: '', qty: '' });

    const [isModalJasa, setIsModalJasa] = useState(false);
    const [jasaInput, setJasaInput] = useState({ service_id: '', qty: '' });

    // --- FILTER SERVICES ---
    const listKiloan = services.filter(s => s.category?.toLowerCase() === 'kiloan');
    const listJasa = services.filter(s => s.category?.toLowerCase() !== 'kiloan');

    const formatRp = (angka) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka || 0);
    };

    // --- HANDLER MEMBERSHIP ---
    const handleMembershipChange = (e) => {
        const selectedId = e.target.value;
        const member = memberships.find(m => m.id.toString() === selectedId);

        if (member) {
            setData(prev => ({
                ...prev,
                membership_id: selectedId,
                nama: member.nama_lengkap || '',
                telepon: member.nomor_telepon || '',
                alamat: member.alamat || ''
            }));
        } else {
            setData(prev => ({
                ...prev,
                membership_id: '',
                nama: '',
                telepon: '',
                alamat: ''
            }));
        }
    };

    // --- KALKULASI MODAL ---
    const activeKiloan = listKiloan.find(s => s.id.toString() === kiloanInput.service_id.toString());
    const totalKiloanModal = activeKiloan ? (activeKiloan.price * (parseFloat(kiloanInput.qty) || 0)) : 0;

    const activeJasa = listJasa.find(s => s.id.toString() === jasaInput.service_id.toString());
    const totalJasaModal = activeJasa ? (activeJasa.price * (parseFloat(jasaInput.qty) || 0)) : 0;

    // --- HANDLER SIMPAN LAYANAN ---
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
        setData('layanan', [...data.layanan, newItem]);
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
        setData('layanan', [...data.layanan, newItem]);
        setIsModalJasa(false);
        setJasaInput({ service_id: '', qty: '' });
    };

    const hapusLayanan = (id) => {
        setData('layanan', data.layanan.filter(item => item.id !== id));
    };

    // --- TOTAL KESELURUHAN & DISKON ---
    const subtotalLayanan = data.layanan.reduce((sum, item) => sum + item.subtotal, 0);
    const jarak = parseFloat(data.jarak_pengiriman) || 0;
    const biayaOngkir = (data.metode_pengambilan === 'antar' && jarak > 3) 
        ? (Math.ceil(jarak) - 3) * 2000 
        : 0;

    // Logika Diskon 
    const diskon = (data.is_membership && data.membership_id) ? (subtotalLayanan * 0.5) : 0;
    const totalSemua = subtotalLayanan - diskon + biayaOngkir;

    // Cek Saldo Member
    const selectedMember = memberships.find(m => m.id.toString() === data.membership_id.toString());
    const currentSaldo = selectedMember ? parseFloat(selectedMember.saldo) : 0;
    const isSaldoKurang = (data.is_membership && data.membership_id) ? (currentSaldo < totalSemua) : false;

    const submit = (e) => {
        e.preventDefault();
        post('/cashier/orders');
    };

    return (
        <CashierLayout title="Buat Pesanan Baru">
            <Head title="Order Baru - Juita Laundry" />
            
            <div className="max-w-3xl mx-auto pb-12 relative">
                
                <Link href="/cashier/orders" className="inline-flex items-center text-sky-500 hover:text-sky-700 font-semibold mb-6 transition-colors">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Kembali ke Daftar Pesanan
                </Link>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                    <h2 className="text-2xl font-bold text-sky-600 mb-8">Order Baru</h2>

                    {/* Menampilkan Error dari Backend jika ada */}
                    {errors?.error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100 flex items-start gap-3">
                            <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <p className="text-sm font-semibold">{errors.error}</p>
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        
                        {/* ---------------------------------
                            MEMBERSHIP SECTION 
                        --------------------------------- */}
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
                                            nama: isChecked ? prev.nama : '',
                                            telepon: isChecked ? prev.telepon : '',
                                            alamat: isChecked ? prev.alamat : ''
                                        }));
                                    }}
                                    className="mt-1 w-5 h-5 text-sky-600 rounded border-gray-300 focus:ring-sky-500 cursor-pointer"
                                />
                                <div>
                                    <label htmlFor="membership" className="font-semibold text-gray-800 cursor-pointer flex items-center gap-2">
                                        <svg className="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" /></svg>
                                        Gunakan Membership
                                    </label>
                                </div>
                            </div>

                            {data.is_membership && (
                                <div className="mt-4 pt-4 border-t border-sky-100/60 animate-fade-in">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Pilih Member (Mendapatkan Diskon 10%)</label>
                                    <div className="relative">
                                        <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                        <select 
                                            value={data.membership_id}
                                            onChange={handleMembershipChange}
                                            className="w-full pl-10 pr-4 py-2 border border-sky-200 bg-white rounded-lg focus:ring-2 focus:ring-sky-500 outline-none text-gray-700 font-medium"
                                        >
                                            <option value="">-- Ketik manual atau pilih dari daftar member --</option>
                                            {memberships.length > 0 ? (
                                                memberships.map(m => (
                                                    <option key={m.id} value={m.id}>
                                                        {m.nama_lengkap} - Saldo: {formatRp(m.saldo || 0)}
                                                    </option>
                                                ))
                                            ) : (
                                                <option value="" disabled>Data member kosong</option>
                                            )}
                                        </select>
                                    </div>
                                    <p className="text-xs text-sky-600 mt-2 font-medium">✨ Data pelanggan akan otomatis terisi dan total tagihan akan memotong saldo member.</p>
                                </div>
                            )}
                        </div>

                        {/* ---------------------------------
                            DATA PELANGGAN 
                        --------------------------------- */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Pelanggan</label>
                                <input 
                                    type="text" 
                                    value={data.nama} 
                                    onChange={e => setData('nama', e.target.value)} 
                                    disabled={!!data.membership_id}
                                    placeholder="Nama pelanggan" 
                                    className={`w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition-colors ${data.membership_id ? 'bg-gray-100 text-gray-500 cursor-not-allowed font-semibold' : 'bg-white'}`} 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Telepon</label>
                                <input 
                                    type="tel" 
                                    value={data.telepon} 
                                    onChange={e => setData('telepon', e.target.value)} 
                                    disabled={!!data.membership_id}
                                    placeholder="08xxxxxxxx" 
                                    className={`w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition-colors ${data.membership_id ? 'bg-gray-100 text-gray-500 cursor-not-allowed font-semibold' : 'bg-white'}`} 
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Alamat</label>
                                <input 
                                    type="text" 
                                    value={data.alamat} 
                                    onChange={e => setData('alamat', e.target.value)} 
                                    disabled={!!data.membership_id}
                                    placeholder="Alamat lengkap" 
                                    className={`w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition-colors ${data.membership_id ? 'bg-gray-100 text-gray-500 cursor-not-allowed font-semibold' : 'bg-white'}`} 
                                />
                            </div>
                        </div>

                        {/* Jenis Layanan */}
                        <div className="bg-[#f3e8ff] border border-[#d8b4fe] rounded-xl p-5 shadow-sm">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                                <h3 className="text-lg font-bold text-[#6b21a8]">Jenis Layanan</h3>
                                
                                <div className="flex gap-2">
                                    <button onClick={() => setIsModalKiloan(true)} type="button" className="bg-[#9333ea] hover:bg-[#7e22ce] text-white text-sm font-bold py-2 px-4 rounded-lg shadow transition-colors flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                                        Kiloan
                                    </button>
                                    <button onClick={() => setIsModalJasa(true)} type="button" className="bg-[#9333ea] hover:bg-[#7e22ce] text-white text-sm font-bold py-2 px-4 rounded-lg shadow transition-colors flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                                        Jasa Lainnya
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white/90 rounded-lg p-4 border border-[#e9d5ff] min-h-[120px] flex flex-col justify-center">
                                {data.layanan.length === 0 ? (
                                    <div className="text-center">
                                        <p className="text-sm font-medium text-[#7e22ce]">Belum ada layanan yang ditambahkan</p>
                                    </div>
                                ) : (
                                    <ul className="space-y-3">
                                        {data.layanan.map((item) => (
                                            <li key={item.id} className="flex justify-between items-center p-3 bg-white border border-[#e9d5ff] rounded-lg shadow-sm">
                                                <div>
                                                    <p className="font-bold text-gray-800">{item.name}</p>
                                                    <p className="text-xs font-medium text-gray-500 mt-0.5">
                                                        {item.qty} {item.unit} x {formatRp(item.price)}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="font-bold text-[#6b21a8]">{formatRp(item.subtotal)}</span>
                                                    <button type="button" onClick={() => hapusLayanan(item.id)} className="text-rose-500 hover:text-rose-700 bg-rose-50 p-1.5 rounded-md transition-colors">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        {/* Pengambilan */}
                        <div className="pt-2">
                            <label className="block text-sm font-bold text-gray-700 mb-3">Metode Pengambilan</label>
                            
                            <div className="grid grid-cols-2 gap-4 mb-3">
                                <label className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center transition-all ${data.metode_pengambilan === 'ambil' ? 'border-[#10b981] bg-white shadow-sm' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
                                    <input type="radio" value="ambil" checked={data.metode_pengambilan === 'ambil'} onChange={() => setData(prev => ({ ...prev, metode_pengambilan: 'ambil', jarak_pengiriman: 0 }))} className="hidden" />
                                    <div className={`w-5 h-5 mb-2.5 rounded-full border-2 flex items-center justify-center ${data.metode_pengambilan === 'ambil' ? 'border-[#10b981]' : 'border-gray-300'}`}>
                                        {data.metode_pengambilan === 'ambil' && <div className="w-2.5 h-2.5 rounded-full bg-[#4b5563]"></div>}
                                    </div>
                                    <svg className={`w-7 h-7 mb-1.5 ${data.metode_pengambilan === 'ambil' ? 'text-[#10b981]' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    <span className={`text-sm font-semibold ${data.metode_pengambilan === 'ambil' ? 'text-gray-800' : 'text-gray-500'}`}>Ambil di Tempat</span>
                                </label>

                                <label className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center transition-all ${data.metode_pengambilan === 'antar' ? 'border-[#f97316] bg-orange-50/20 shadow-sm' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
                                    <input type="radio" value="antar" checked={data.metode_pengambilan === 'antar'} onChange={() => setData('metode_pengambilan', 'antar')} className="hidden" />
                                    <div className={`w-5 h-5 mb-2.5 rounded-full border-2 flex items-center justify-center ${data.metode_pengambilan === 'antar' ? 'border-[#f97316]' : 'border-gray-300'}`}>
                                        {data.metode_pengambilan === 'antar' && <div className="w-2.5 h-2.5 rounded-full bg-[#4b5563]"></div>}
                                    </div>
                                    <svg className={`w-7 h-7 mb-1.5 ${data.metode_pengambilan === 'antar' ? 'text-[#f97316]' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1" />
                                    </svg>
                                    <span className={`text-sm font-semibold ${data.metode_pengambilan === 'antar' ? 'text-gray-800' : 'text-gray-500'}`}>Antar ke Alamat</span>
                                </label>
                            </div>
                            
                            <p className="text-xs text-gray-500 font-medium mb-3">
                                🚚 Gratis ongkir hingga 3 km. Lebih dari itu dikenakan biaya Rp 2.000/km
                            </p>
                            
                            {data.metode_pengambilan === 'antar' && (
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Jarak Pengiriman (km)</label>
                                    <div className="relative">
                                        <svg className="w-5 h-5 absolute left-3 top-2.5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                        <input type="number" min="0" step="0.1" value={data.jarak_pengiriman} onChange={e => setData('jarak_pengiriman', e.target.value)} placeholder="0.0" className="w-full pl-10 pr-4 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none transition-all" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Pembayaran */}
                        <div className="pt-2">
                            <label className="block text-sm font-bold text-gray-700 mb-3">Metode Pembayaran</label>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <label className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center transition-all ${data.metode_pembayaran === 'nanti' ? 'border-[#0ea5e9] bg-white shadow-sm' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
                                    <input type="radio" value="nanti" checked={data.metode_pembayaran === 'nanti'} onChange={e => setData('metode_pembayaran', e.target.value)} className="hidden" />
                                    <div className={`w-5 h-5 mb-2.5 rounded-full border-2 flex items-center justify-center ${data.metode_pembayaran === 'nanti' ? 'border-[#0ea5e9]' : 'border-gray-300'}`}>
                                        {data.metode_pembayaran === 'nanti' && <div className="w-2.5 h-2.5 rounded-full bg-[#4b5563]"></div>}
                                    </div>
                                    <svg className={`w-7 h-7 mb-1.5 ${data.metode_pembayaran === 'nanti' ? 'text-[#0ea5e9]' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1" />
                                    </svg>
                                    <span className={`text-sm font-semibold ${data.metode_pembayaran === 'nanti' ? 'text-gray-800' : 'text-gray-500'}`}>Bayar Nanti</span>
                                </label>

                                <label className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center transition-all ${data.metode_pembayaran === 'langsung' ? 'border-[#0ea5e9] bg-sky-50/30 shadow-sm' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
                                    <input type="radio" value="langsung" checked={data.metode_pembayaran === 'langsung'} onChange={e => setData('metode_pembayaran', e.target.value)} className="hidden" />
                                    <div className={`w-5 h-5 mb-2.5 rounded-full border-2 flex items-center justify-center ${data.metode_pembayaran === 'langsung' ? 'border-[#0ea5e9]' : 'border-gray-300'}`}>
                                        {data.metode_pembayaran === 'langsung' && <div className="w-2.5 h-2.5 rounded-full bg-[#4b5563]"></div>}
                                    </div>
                                    <svg className={`w-7 h-7 mb-1.5 ${data.metode_pembayaran === 'langsung' ? 'text-[#0ea5e9]' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                    <span className={`text-sm font-semibold ${data.metode_pembayaran === 'langsung' ? 'text-gray-800' : 'text-gray-500'}`}>Bayar Langsung</span>
                                </label>
                            </div>
                        </div>

                        {/* Ringkasan */}
                        <div className="bg-[#0ea5e9] rounded-xl p-5 text-white mt-6 shadow-md">
                            <p className="text-sm font-medium text-sky-100 mb-3">Ringkasan Pembayaran</p>

                            <div className="flex justify-between py-2 border-b border-sky-400/50">
                                <span>Total Layanan ({data.layanan.length} item)</span>
                                <span className="font-semibold">{formatRp(subtotalLayanan)}</span>
                            </div>
                            
                            {/* Munculkan Diskon 10% Jika Member */}
                            {data.is_membership && data.membership_id && (
                                <div className="flex justify-between py-2 border-b border-sky-400/50 text-emerald-200">
                                    <span>Diskon Member (10%)</span>
                                    <span className="font-semibold">- {formatRp(diskon)}</span>
                                </div>
                            )}

                            {data.metode_pengambilan === 'antar' && (
                                <div className="flex justify-between py-2 border-b border-sky-400/50">
                                    <span>Biaya Ongkir {jarak > 3 ? `(${(Math.ceil(jarak) - 3)} KM)` : '(Gratis)'}</span>
                                    <span className="font-semibold">{formatRp(biayaOngkir)}</span>
                                </div>
                            )}
                            
                            <div className="flex justify-between pt-4">
                                <span className="text-base font-semibold">Total Pembayaran</span>
                                <span className="text-2xl font-bold">{formatRp(totalSemua)}</span>
                            </div>

                            {/* Peringatan Saldo Jika Kurang */}
                            {isSaldoKurang && (
                                <div className="mt-4 bg-rose-500/20 border border-rose-400/50 p-3 rounded-lg flex items-start gap-2">
                                    <svg className="w-5 h-5 text-rose-200 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                    <p className="text-xs text-rose-100 font-medium leading-snug">
                                        Saldo member (sisa {formatRp(currentSaldo)}) tidak mencukupi untuk tagihan ini. Kasir mungkin harus membatalkan pemakaian member atau mengisi saldo member terlebih dahulu.
                                    </p>
                                </div>
                            )}
                        </div>

                        <button type="submit" disabled={processing || isSaldoKurang || data.layanan.length === 0} className="w-full bg-[#0284c7] hover:bg-[#0369a1] transition-colors text-white font-bold py-3.5 px-4 rounded-xl shadow-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed">
                            {processing ? 'Memproses...' : 'Buat Order'}
                        </button>
                    </form>
                </div>
            </div>

            {/* MODAL KILOAN & JASA (KODE TETAP SAMA SEPERTI SEBELUMNYA) */}
            {isModalKiloan && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white">
                            <h3 className="text-lg font-extrabold text-gray-800">Tambah Layanan Kiloan</h3>
                            <button onClick={() => setIsModalKiloan(false)} className="text-gray-400 hover:text-gray-600"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                        </div>
                        <div className="p-5 space-y-4 bg-gray-50/50">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Jenis Layanan</label>
                                <select value={kiloanInput.service_id} onChange={e => setKiloanInput({...kiloanInput, service_id: e.target.value})} className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9333ea] focus:border-[#9333ea] outline-none font-medium text-gray-700">
                                    <option value="" disabled>-- Pilih Layanan Kiloan --</option>
                                    {listKiloan.length > 0 ? listKiloan.map(s => <option key={s.id} value={s.id}>{s.name}</option>) : <option value="" disabled>Data layanan kiloan kosong</option>}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Berat</label>
                                <div className="relative flex items-center">
                                    <input type="number" min="0" step="0.1" value={kiloanInput.qty} onChange={e => setKiloanInput({...kiloanInput, qty: e.target.value})} className="w-full pl-4 pr-12 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9333ea] outline-none font-bold text-gray-800" placeholder="0.0" />
                                    <span className="absolute right-4 font-bold text-gray-400">Kg</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Harga per kg</label>
                                <div className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-600 font-bold">{activeKiloan ? formatRp(activeKiloan.price) : 'Rp 0'}</div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[#7e22ce] mb-1.5">Total Harga</label>
                                <div className="w-full px-4 py-2.5 bg-[#f3e8ff] border border-[#d8b4fe] rounded-lg text-[#6b21a8] font-black text-lg">{formatRp(totalKiloanModal)}</div>
                            </div>
                        </div>
                        <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-white">
                            <button type="button" onClick={() => setIsModalKiloan(false)} className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-bold hover:bg-gray-50">Batal</button>
                            <button type="button" onClick={handleSimpanKiloan} disabled={!activeKiloan || !kiloanInput.qty} className="px-6 py-2.5 rounded-lg bg-[#9333ea] hover:bg-[#7e22ce] text-white font-bold shadow-md disabled:opacity-50 transition-colors">Simpan</button>
                        </div>
                    </div>
                </div>
            )}

            {isModalJasa && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white">
                            <h3 className="text-lg font-extrabold text-gray-800">Tambah Jasa Lainnya</h3>
                            <button onClick={() => setIsModalJasa(false)} className="text-gray-400 hover:text-gray-600"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                        </div>
                        <div className="p-5 space-y-4 bg-gray-50/50">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Jenis Layanan</label>
                                <select value={jasaInput.service_id} onChange={e => setJasaInput({...jasaInput, service_id: e.target.value})} className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-[#10b981] outline-none font-medium text-gray-700">
                                    <option value="" disabled>-- Pilih Jasa --</option>
                                    {listJasa.length > 0 ? listJasa.map(s => <option key={s.id} value={s.id}>{s.name}</option>) : <option value="" disabled>Data jasa kosong</option>}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Jumlah</label>
                                <div className="relative flex items-center">
                                    <input type="number" min="1" value={jasaInput.qty} onChange={e => setJasaInput({...jasaInput, qty: e.target.value})} className="w-full pl-4 pr-12 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] outline-none font-bold text-gray-800" placeholder="0" />
                                    <span className="absolute right-4 font-bold text-gray-400">Pcs</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Harga per pcs</label>
                                <div className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-600 font-bold">{activeJasa ? formatRp(activeJasa.price) : 'Rp 0'}</div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[#047857] mb-1.5">Total Harga</label>
                                <div className="w-full px-4 py-2.5 bg-[#ecfdf5] border border-[#a7f3d0] rounded-lg text-[#065f46] font-black text-lg">{formatRp(totalJasaModal)}</div>
                            </div>
                        </div>
                        <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-white">
                            <button type="button" onClick={() => setIsModalJasa(false)} className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-bold hover:bg-gray-50">Batal</button>
                            <button type="button" onClick={handleSimpanJasa} disabled={!activeJasa || !jasaInput.qty} className="px-6 py-2.5 rounded-lg bg-[#10b981] hover:bg-[#059669] text-white font-bold shadow-md disabled:opacity-50 transition-colors">Simpan</button>
                        </div>
                    </div>
                </div>
            )}
        </CashierLayout>
    );
}