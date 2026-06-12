import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import CashierLayout from '../../Layouts/Cashierlayout';

export default function Membership({ memberships = [], histories = [] }) {
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('add'); 
    const [selectedId, setSelectedId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const { data, setData, post, put, delete: destroy, processing, reset, transform } = useForm({
        full_name: '',
        phone_number: '',
        address: '',
        balance: '',
        loyalty_point: '',
        topup_amount: '', 
        current_balance: 0,  
    });

    const formatRp = (angka) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
    };

    const formatTanggal = (tanggal) => {
        if (!tanggal) return '-';
        return new Date(tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const totalActiveBalance = memberships.reduce((total, member) => total + Number(member.balance), 0);

    const filteredMemberships = memberships.filter((member) => 
        member.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.phone_number.includes(searchQuery)
    );

    const openAddModal = () => {
        setModalMode('add');
        reset();
        setShowModal(true);
    };

    const openEditModal = (member) => {
        setModalMode('edit');
        setSelectedId(member.id);
        setData({
            full_name: member.full_name,
            phone_number: member.phone_number,
            address: member.address || '',
            balance: member.balance,
            loyalty_point: member.loyalty_point || 0,
            topup_amount: '',
            current_balance: member.balance,
        });
        setShowModal(true);
    };

    const openTopupModal = (member) => {
        setModalMode('topup');
        setSelectedId(member.id);
        setData({
            full_name: member.full_name,
            phone_number: member.phone_number,
            address: member.address || '', 
            balance: member.balance,
            loyalty_point: member.loyalty_point || 0,
            topup_amount: '',
            current_balance: member.balance,
        });
        setShowModal(true);
    };

    const openHistoryModal = () => {
        setModalMode('history');
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        transform((currentData) => {
            if (modalMode === 'topup') {
                return {
                    ...currentData,
                    balance: Number(currentData.current_balance) + Number(currentData.topup_amount)
                };
            }
            return currentData;
        });

        if (modalMode === 'edit' || modalMode === 'topup') {
            put(route('cashier.membership.update', selectedId), {
                onSuccess: () => setShowModal(false),
            });
        } else {
            post(route('cashier.membership.store'), {
                onSuccess: () => setShowModal(false),
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus member ini?')) {
            destroy(route('cashier.membership.destroy', id));
        }
    };

    return (
        <CashierLayout title="Membership">
            <Head title="Membership - Juita Laundry" />
            
            <div className="max-w-7xl mx-auto relative">
                

                <div className="bg-blue-600 rounded-xl p-6 mb-6 shadow-sm w-full">
                    <h2 className="text-xl font-bold text-white">Membership</h2>
                    <p className="text-xs text-blue-100 mt-1">Manajemen data membership laundry</p>
                </div>

                {/* 3 Card Ringkasan */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-[#3b82f6] rounded-xl px-5 py-4 text-white shadow-sm flex justify-between items-center cursor-default">
                        <div>
                            <p className="text-[11px] font-semibold text-blue-100 mb-0.5">Total Member</p>
                            <h3 className="text-2xl font-bold">{memberships.length}</h3>
                        </div>
                        <svg className="w-8 h-8 text-blue-200 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    </div>

                    <div className="bg-[#06b6d4] rounded-xl px-5 py-4 text-white shadow-sm flex justify-between items-center cursor-default">
                        <div>
                            <p className="text-[11px] font-semibold text-cyan-100 mb-0.5">Total Saldo Aktif</p>
                            <h3 className="text-2xl font-bold">{formatRp(totalActiveBalance)}</h3>
                        </div>
                        <svg className="w-8 h-8 text-cyan-200 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                    </div>

                    <div className="bg-[#0ea5e9] rounded-xl px-5 py-4 text-white shadow-sm flex justify-between items-center cursor-default">
                        <div>
                            <p className="text-[11px] font-semibold text-sky-100 mb-0.5">Total Top-up</p>
                            <h3 className="text-2xl font-bold">{formatRp(totalActiveBalance)}</h3>
                        </div>
                        <svg className="w-8 h-8 text-sky-200 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                    </div>
                </div>

                {/* Filter dan Tombol */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
                    <div className="w-full md:max-w-xs relative">
                        <svg className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari nama / nomor..." 
                            className="pl-9 w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0ea5e9] focus:border-[#0ea5e9] outline-none shadow-sm"
                        />
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                        <button 
                            onClick={openHistoryModal}
                            className="flex-1 md:flex-none bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-5 text-xs rounded-lg flex items-center justify-center transition-colors shadow-sm"
                        >
                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Riwayat Transaksi
                        </button>
                        
                        <button 
                            onClick={openAddModal}
                            className="flex-1 md:flex-none bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold py-2 px-4 text-xs rounded-lg flex items-center justify-center transition-colors shadow-sm"
                        >
                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            Tambah Member
                        </button>
                    </div>
                </div>

                {/* Daftar Member */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px] flex flex-col">
                    <div className="bg-[#0ea5e9] px-5 py-3 flex items-center text-white">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        <h3 className="font-bold text-sm">Daftar Member</h3>
                    </div>

                    <div className="p-5 bg-gray-50/50">
                        {filteredMemberships.length === 0 ? (
                            <div className="text-center text-gray-500 py-12 flex flex-col items-center">
                                <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                                <p className="text-xs">{searchQuery ? 'Tidak ada member yang cocok dengan pencarian Anda.' : 'Belum ada member yang terdaftar.'}</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                {filteredMemberships.map((member) => (
                                    <div key={member.id} className="bg-sky-100 border border-sky-400 rounded-xl p-5 flex flex-col shadow-sm hover:shadow-md transition-shadow">
                                        
                                        <div className="mb-3">
                                            <h4 className="text-lg font-bold text-gray-800 mb-1.5">{member.full_name}</h4>
                                            <div className="flex items-center text-gray-500 text-xs mb-1">
                                                <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                                {member.phone_number}
                                            </div>
                                            <div className="flex items-center text-gray-500 text-xs">
                                                <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                Bergabung {formatTanggal(member.created_at)}
                                            </div>
                                        </div>


                                        <div className="bg-white border border-sky-200 rounded-lg p-2 mb-2">
                                            <p className="text-[10px] text-gray-500 font-normal mb-0.5">Saldo Aktif</p>
                                            <p className="font-bold text-sky-700 text-[15px]">{formatRp(member.balance)}</p>
                                        </div>


                                        <div className="bg-amber-50 border border-amber-400 rounded-lg p-2 mb-3 flex justify-between items-center">
                                            <div>
                                                <p className="text-[10px] text-amber-700 font-medium mb-0.5">Point Loyalty</p>
                                                <p className="font-bold text-amber-700 text-[15px]">{member.loyalty_point || 0}</p>
                                            </div>
                                            <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                            </svg>
                                        </div>


                                        <div className="grid grid-cols-5 gap-1.5 mt-auto">
                                            <button 
                                                onClick={() => openTopupModal(member)}
                                                className="col-span-3 bg-[#25D366] hover:bg-[#20bd5a] text-white py-1.5 rounded-md text-[11px] font-bold flex items-center justify-center transition-colors shadow-sm gap-1"
                                            >
                                                <span className="text-sm font-bold">$</span>
                                                <span>Top-up</span>
                                            </button>
                                            <button 
                                                onClick={() => openEditModal(member)}
                                                className="col-span-1 bg-[#f59e0b] hover:bg-[#d97706] text-white py-1.5 rounded-md text-[11px] font-semibold flex items-center justify-center transition-colors shadow-sm gap-1 px-1 overflow-hidden"
                                                title="Edit Data"
                                            >
                                                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                <span className="truncate">Edit</span>
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(member.id)}
                                                className="col-span-1 bg-red-500 hover:bg-red-600 text-white py-1.5 rounded-md text-[11px] font-semibold flex items-center justify-center transition-colors shadow-sm gap-1 px-1 overflow-hidden"
                                                title="Hapus Member"
                                            >
                                                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                <span className="truncate">Hapus</span>
                                            </button>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* Modal Area */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-opacity">
                    <div className={`bg-white rounded-2xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 ${modalMode === 'history' ? 'max-w-md' : 'max-w-sm'}`}>
                        
                        {/* MODAL RIWAYAT TRANSAKSI */}
                        {modalMode === 'history' ? (
                            <div>

                                <div className="bg-blue-600 px-5 py-4 w-full flex justify-between items-center">
                                    <h2 className="text-base font-bold text-white tracking-wide">
                                        Riwayat Transaksi Membership
                                    </h2>
                                    <button onClick={() => setShowModal(false)} className="text-white/80 hover:text-white rounded-full p-1 transition-colors">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                                
                                <div className="p-5">
                                    <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                                        {histories.length === 0 ? (
                                            <div className="text-center text-xs text-gray-500 py-6">Belum ada riwayat transaksi.</div>
                                        ) : (
                                            histories.map(history => {
                                                const dateObj = new Date(history.created_at);
                                                const tanggal = dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
                                                const jam = dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
                                                const namaMember = history.membership ? history.membership.full_name : 'Member Terhapus';

                                                return (
                                                    <div key={history.id} className="bg-green-100 border border-green-500 rounded-xl p-3 flex flex-col shadow-sm">
                                                        

                                                        <div className="flex justify-between items-start">
                                                            <div className="flex flex-col">
                                                                <p className="text-sm font-bold text-gray-800 leading-tight">{namaMember}</p>
                                                                <p className="text-xs text-gray-600 font-normal mt-0.5">{history.type}</p>
                                                            </div>
                                                            <p className="text-lg font-semibold text-green-600 leading-none mt-1">+ {formatRp(history.amount)}</p>
                                                        </div>
                                                        

                                                        <div className="flex justify-between items-center mt-2 text-[10px] text-gray-500 font-normal">
                                                            <p>{tanggal} • {jam}</p>
                                                            <p>Saldo: <span>{formatRp(history.final_balance)}</span></p>
                                                        </div>

                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>

                                    <div className="mt-5 pt-3 border-t flex justify-end">
                                        <button 
                                            onClick={() => setShowModal(false)}
                                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-5 text-xs rounded-lg transition-colors"
                                        >
                                            Tutup
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* MODAL ADD / EDIT / TOPUP */
                            <div className="p-5 md:p-6">
                                <h2 className="text-lg font-bold text-gray-800 mb-1">
                                    {modalMode === 'edit' && 'Edit Data Member'}
                                    {modalMode === 'add' && 'Tambah Member Baru'}
                                    {modalMode === 'topup' && 'Top-up Saldo'}
                                </h2>
                                {modalMode === 'edit' && <p className="text-xs text-gray-500 mb-4">ID Member: {selectedId}</p>}
                                {modalMode === 'topup' && <p className="text-xs text-gray-600 mb-4 font-medium">{data.full_name}</p>}
                                {modalMode === 'add' && <div className="mb-4"></div>}

                                <form className="space-y-3" onSubmit={handleSubmit}>
                                    
                                    {modalMode === 'topup' ? (
                                        <>
                                            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3">
                                                <p className="text-[11px] text-gray-500 font-semibold mb-1">Saldo Saat Ini</p>
                                                <p className="text-xl font-bold text-blue-600">{formatRp(data.current_balance)}</p>
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Jumlah Top-up</label>
                                                <input 
                                                    type="number" 
                                                    value={data.topup_amount}
                                                    onChange={(e) => setData('topup_amount', e.target.value)}
                                                    required
                                                    min="1"
                                                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-[#10b981] outline-none transition-all text-gray-800" 
                                                />
                                            </div>

                                            {Number(data.topup_amount) > 0 && (
                                                <div className="bg-[#10b981]/10 border border-[#10b981]/30 rounded-xl p-3 mt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                                    <p className="text-[11px] text-gray-500 font-semibold mb-1">Saldo Setelah Top-up</p>
                                                    <p className="text-xl font-bold text-[#10b981]">
                                                        {formatRp(Number(data.current_balance) + Number(data.topup_amount))}
                                                    </p>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <div>
                                                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Nama Lengkap</label>
                                                <div className="relative">
                                                    <svg className={`w-4 h-4 absolute left-3 top-2.5 ${modalMode === 'edit' ? 'text-yellow-500' : 'text-blue-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                                    <input type="text" value={data.full_name} onChange={(e) => setData('full_name', e.target.value)} required placeholder="Nama lengkap member" className={`pl-9 w-full px-3 py-2 text-xs border rounded-lg outline-none transition-all ${modalMode === 'edit' ? 'border-yellow-400 focus:ring-yellow-500 focus:border-yellow-500' : 'border-gray-200 focus:ring-[#00d2ff] focus:border-[#00d2ff]'}`} />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Nomor Telepon</label>
                                                <div className="relative">
                                                    <svg className={`w-4 h-4 absolute left-3 top-2.5 ${modalMode === 'edit' ? 'text-yellow-500' : 'text-blue-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                                    <input type="tel" value={data.phone_number} onChange={(e) => setData('phone_number', e.target.value)} required placeholder="08xxxxxxxxxx" className={`pl-9 w-full px-3 py-2 text-xs border rounded-lg outline-none transition-all ${modalMode === 'edit' ? 'border-yellow-400 focus:ring-yellow-500 focus:border-yellow-500' : 'border-gray-200 focus:ring-[#00d2ff] focus:border-[#00d2ff]'}`} />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Alamat Lengkap</label>
                                                <div className="relative">
                                                    <svg className={`w-4 h-4 absolute left-3 top-2.5 ${modalMode === 'edit' ? 'text-yellow-500' : 'text-blue-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                    <textarea value={data.address} onChange={(e) => setData('address', e.target.value)} placeholder="Alamat lengkap member" rows="2" className={`pl-9 pt-2 w-full px-3 text-xs border rounded-lg outline-none transition-all resize-none ${modalMode === 'edit' ? 'border-yellow-400 focus:ring-yellow-500 focus:border-yellow-500' : 'border-gray-200 focus:ring-[#00d2ff] focus:border-[#00d2ff]'}`}></textarea>
                                                </div>
                                            </div>

                                            {modalMode === 'edit' && (
                                                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3 mt-2">
                                                    <p className="text-[10px] text-gray-500 font-semibold mb-1">Saldo Saat Ini</p>
                                                    <p className="text-lg font-bold text-blue-600 mb-1">{formatRp(data.balance)}</p>
                                                    <p className="text-[9px] text-gray-400 leading-tight">*Saldo tidak dapat diubah melalui form edit. Gunakan fitur Top-up untuk menambah saldo.</p>
                                                </div>
                                            )}

                                            {modalMode === 'add' && (
                                                <div>
                                                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">Saldo Awal</label>
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-2.5 text-xs font-bold text-blue-600">Rp</span>
                                                        <input type="number" value={data.balance} onChange={(e) => setData('balance', e.target.value)} placeholder="100000" className="pl-9 w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00d2ff] focus:border-[#00d2ff] outline-none transition-all" />
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}

                                    <div className="flex gap-2 pt-3 mt-2 border-t border-gray-100">
                                        <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold py-2 px-3 rounded-lg transition-colors">Batal</button>
                                        <button type="submit" disabled={processing} className={`flex-1 text-xs font-semibold py-2 px-3 rounded-lg transition-colors shadow-sm disabled:opacity-50 text-white ${modalMode === 'edit' ? 'bg-[#f59e0b] hover:bg-[#d97706]' : modalMode === 'topup' ? 'bg-[#10b981] hover:bg-emerald-600' : 'bg-[#00d2ff] hover:bg-[#00b8e6]'}`}>
                                            {processing ? 'Menyimpan...' : (modalMode === 'edit' ? 'Simpan' : modalMode === 'topup' ? 'Konfirmasi' : 'Tambah')}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                    </div>
                </div>
            )}
        </CashierLayout>
    );
}