import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import CashierLayout from '../../Layouts/CashierLayout';

export default function Membership({ memberships = [], histories = [] }) {
    // State Modal sekarang memakai 4 mode: 'add', 'edit', 'topup', atau 'history'
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('add'); 
    const [selectedId, setSelectedId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Inertia useForm untuk mengelola input data
    const { data, setData, post, put, delete: destroy, processing, reset, transform } = useForm({
        nama_lengkap: '',
        nomor_telepon: '',
        alamat: '',
        saldo: '',
        nominal_topup: '', 
        current_saldo: 0,  
    });

    const formatRp = (angka) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
    };

    const formatTanggal = (tanggal) => {
        if (!tanggal) return '-';
        return new Date(tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    // Menghitung total saldo aktif dari seluruh member
    const totalSaldoAktif = memberships.reduce((total, member) => total + Number(member.saldo), 0);

    // Filter daftar member berdasarkan pencarian
    const filteredMemberships = memberships.filter((member) => 
        member.nama_lengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.nomor_telepon.includes(searchQuery)
    );

    // Fungsi Buka Modal
    const openAddModal = () => {
        setModalMode('add');
        reset();
        setShowModal(true);
    };

    const openEditModal = (member) => {
        setModalMode('edit');
        setSelectedId(member.id);
        setData({
            nama_lengkap: member.nama_lengkap,
            nomor_telepon: member.nomor_telepon,
            alamat: member.alamat || '',
            saldo: member.saldo,
            nominal_topup: '',
            current_saldo: member.saldo,
        });
        setShowModal(true);
    };

    const openTopupModal = (member) => {
        setModalMode('topup');
        setSelectedId(member.id);
        setData({
            nama_lengkap: member.nama_lengkap,
            nomor_telepon: member.nomor_telepon,
            alamat: member.alamat || '', 
            saldo: member.saldo,
            nominal_topup: '',
            current_saldo: member.saldo,
        });
        setShowModal(true);
    };

    const openHistoryModal = () => {
        setModalMode('history');
        setShowModal(true);
    };

    // Submit Data Form
    const handleSubmit = (e) => {
        e.preventDefault();

        transform((currentData) => {
            if (modalMode === 'topup') {
                return {
                    ...currentData,
                    saldo: Number(currentData.current_saldo) + Number(currentData.nominal_topup)
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

    // Hapus Data
    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus member ini?')) {
            destroy(route('cashier.membership.destroy', id));
        }
    };

    return (
        <CashierLayout title="Membership">
            <Head title="Membership" />
            
            <div className="max-w-7xl mx-auto relative">
                
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Membership</h2>
                </div>

                {/* Top Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-[#3b82f6] hover:-translate-y-1 transition-transform duration-200 rounded-xl p-6 text-white shadow-sm flex justify-between items-center cursor-default">
                        <div>
                            <p className="text-sm font-semibold text-blue-100 mb-1">Total Member</p>
                            <h3 className="text-4xl font-bold">{memberships.length}</h3>
                        </div>
                        <svg className="w-12 h-12 text-blue-200 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    </div>

                    <div className="bg-[#06b6d4] hover:-translate-y-1 transition-transform duration-200 rounded-xl p-6 text-white shadow-sm flex justify-between items-center cursor-default">
                        <div>
                            <p className="text-sm font-semibold text-cyan-100 mb-1">Total Saldo Aktif</p>
                            <h3 className="text-4xl font-bold">{formatRp(totalSaldoAktif)}</h3>
                        </div>
                        <svg className="w-12 h-12 text-cyan-200 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                    </div>

                    <div className="bg-[#0ea5e9] hover:-translate-y-1 transition-transform duration-200 rounded-xl p-6 text-white shadow-sm flex justify-between items-center cursor-default">
                        <div>
                            <p className="text-sm font-semibold text-sky-100 mb-1">Total Top-up</p>
                            <h3 className="text-4xl font-bold">{formatRp(totalSaldoAktif)}</h3>
                        </div>
                        <svg className="w-12 h-12 text-sky-200 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <div className="w-full md:max-w-md relative">
                        <svg className="w-5 h-5 absolute left-4 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari nama atau nomor telepon..." 
                            className="pl-11 w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0ea5e9] focus:border-[#0ea5e9] outline-none transition-all shadow-sm"
                        />
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        <button 
                            onClick={openHistoryModal}
                            className="flex-1 md:flex-none bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 px-5 rounded-xl flex items-center justify-center transition-colors shadow-sm"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Riwayat Transaksi
                        </button>
                        
                        <button 
                            onClick={openAddModal}
                            className="flex-1 md:flex-none bg-[#10b981] hover:bg-emerald-600 text-white font-semibold py-2.5 px-5 rounded-xl flex items-center justify-center transition-colors shadow-sm"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            Tambah Member
                        </button>
                    </div>
                </div>

                {/* Area Daftar Member */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px] flex flex-col">
                    <div className="bg-[#0ea5e9] px-6 py-4 flex items-center text-white">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        <h3 className="font-bold text-lg">Daftar Member</h3>
                    </div>

                    <div className="p-6 bg-gray-50/50">
                        {filteredMemberships.length === 0 ? (
                            <div className="text-center text-gray-500 py-12 flex flex-col items-center">
                                <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                                {searchQuery ? 'Tidak ada member yang cocok dengan pencarian Anda.' : 'Belum ada member yang terdaftar.'}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredMemberships.map((member) => (
                                    <div key={member.id} className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col shadow-sm hover:shadow-md transition-shadow">
                                        
                                        <div className="mb-4">
                                            <h4 className="text-xl font-bold text-gray-800 mb-2">{member.nama_lengkap}</h4>
                                            <div className="flex items-center text-gray-500 text-sm mb-1.5">
                                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                                {member.nomor_telepon}
                                            </div>
                                            <div className="flex items-center text-gray-500 text-sm">
                                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                Bergabung {formatTanggal(member.created_at)}
                                            </div>
                                        </div>

                                        <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3 mb-5">
                                            <p className="text-xs text-blue-600/80 font-semibold mb-0.5">Saldo Aktif</p>
                                            <p className="font-bold text-blue-700 text-xl">{formatRp(member.saldo)}</p>
                                        </div>

                                        <div className="flex gap-2 mt-auto">
                                            <button 
                                                onClick={() => openTopupModal(member)}
                                                className="flex-1 bg-[#10b981] hover:bg-emerald-600 text-white py-2 px-3 rounded-lg text-sm font-bold flex items-center justify-center transition-colors shadow-sm"
                                            >
                                                <span className="mr-1 text-base">$</span> Top-up
                                            </button>
                                            <button 
                                                onClick={() => openEditModal(member)}
                                                className="bg-[#f59e0b] hover:bg-[#d97706] text-white py-2 px-3 rounded-lg text-sm font-semibold flex items-center justify-center transition-colors shadow-sm"
                                                title="Edit"
                                            >
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(member.id)}
                                                className="bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg text-sm font-semibold flex items-center justify-center transition-colors shadow-sm"
                                                title="Hapus"
                                            >
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                Hapus
                                            </button>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* MODAL POP-UP */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-opacity">
                    
                    {/* Mengatur lebar modal agar dinamis (lebih lebar khusus untuk History) */}
                    <div className={`bg-white rounded-2xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 ${modalMode === 'history' ? 'max-w-2xl' : 'max-w-md'}`}>
                        <div className="p-6 md:p-8">
                            
                            {/* KHUSUS TAMPILAN RIWAYAT TRANSAKSI */}
                            {modalMode === 'history' ? (
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
                                        Riwayat Transaksi
                                    </h2>
                                    
                                    <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                                        {histories.length === 0 ? (
                                            <div className="text-center text-gray-500 py-6">Belum ada riwayat transaksi.</div>
                                        ) : (
                                            histories.map(history => {
                                                const isTopup = history.type === 'Top-up Saldo';
                                                const dateObj = new Date(history.created_at);
                                                const tanggal = dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
                                                const jam = dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
                                                const namaMember = history.membership ? history.membership.nama_lengkap : 'Member Terhapus';

                                                return (
                                                    <div key={history.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 border border-gray-100 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow gap-4 sm:gap-0">
                                                        
                                                        {/* Kiri: Icon, Tipe, Tanggal */}
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center ${isTopup ? 'bg-emerald-50 text-[#10b981]' : 'bg-blue-50 text-blue-500'}`}>
                                                                {isTopup ? (
                                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                                ) : (
                                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-gray-800 text-base md:text-lg leading-tight">
                                                                    {history.type} 
                                                                    <span className="text-sm font-normal text-gray-500 ml-2 bg-gray-100 px-2 py-0.5 rounded">({namaMember})</span>
                                                                </h4>
                                                                <p className="text-sm text-gray-500 mt-1 flex items-center">
                                                                    <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                                    {tanggal} <span className="mx-1.5">•</span> 
                                                                    <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                                    {jam}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Kanan: Nominal dan Saldo Akhir */}
                                                        <div className="text-left sm:text-right ml-16 sm:ml-0">
                                                            <p className="font-extrabold text-[#10b981] text-lg">+ {formatRp(history.nominal)}</p>
                                                            <p className="text-xs text-gray-500 font-medium mt-0.5 bg-gray-100 inline-block px-2 py-1 rounded-md sm:bg-transparent sm:px-0 sm:py-0">
                                                                Saldo Akhir: <span className="font-bold">{formatRp(history.saldo_akhir)}</span>
                                                            </p>
                                                        </div>

                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>

                                    {/* Tombol Tutup Riwayat */}
                                    <div className="mt-6 pt-4 border-t flex justify-end">
                                        <button 
                                            onClick={() => setShowModal(false)}
                                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 px-6 rounded-xl transition-colors"
                                        >
                                            Tutup
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                /* KHUSUS FORM TAMBAH / EDIT / TOP-UP */
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-1">
                                        {modalMode === 'edit' && 'Edit Data Member'}
                                        {modalMode === 'add' && 'Tambah Member Baru'}
                                        {modalMode === 'topup' && 'Top-up Saldo'}
                                    </h2>
                                    {modalMode === 'edit' && <p className="text-sm text-gray-500 mb-6">ID Member: {selectedId}</p>}
                                    {modalMode === 'topup' && <p className="text-gray-600 mb-6 font-medium">{data.nama_lengkap}</p>}
                                    {modalMode === 'add' && <div className="mb-6"></div>}

                                    <form className="space-y-4" onSubmit={handleSubmit}>
                                        
                                        {modalMode === 'topup' ? (
                                            <>
                                                {/* Box Saldo Saat Ini (Biru) */}
                                                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4">
                                                    <p className="text-xs text-gray-500 font-semibold mb-1">Saldo Saat Ini</p>
                                                    <p className="text-3xl font-bold text-blue-600">{formatRp(data.current_saldo)}</p>
                                                </div>

                                                {/* Input Nominal Top-up */}
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Jumlah Top-up</label>
                                                    <input 
                                                        type="number" 
                                                        value={data.nominal_topup}
                                                        onChange={(e) => setData('nominal_topup', e.target.value)}
                                                        required
                                                        min="1"
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#10b981] focus:border-[#10b981] outline-none transition-all text-gray-800" 
                                                    />
                                                </div>

                                                {/* Box Saldo Setelah Top-up */}
                                                {Number(data.nominal_topup) > 0 && (
                                                    <div className="bg-[#10b981]/10 border border-[#10b981]/30 rounded-xl p-4 mt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                                        <p className="text-xs text-gray-500 font-semibold mb-1">Saldo Setelah Top-up</p>
                                                        <p className="text-3xl font-bold text-[#10b981]">
                                                            {formatRp(Number(data.current_saldo) + Number(data.nominal_topup))}
                                                        </p>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                {/* Form Input Biasa (Nama, Telp, Alamat) */}
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap</label>
                                                    <div className="relative">
                                                        <svg className={`w-5 h-5 absolute left-3 top-2.5 ${modalMode === 'edit' ? 'text-yellow-500' : 'text-blue-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                                        <input type="text" value={data.nama_lengkap} onChange={(e) => setData('nama_lengkap', e.target.value)} required placeholder="Nama lengkap member" className={`pl-10 w-full px-4 py-2.5 border rounded-lg outline-none transition-all ${modalMode === 'edit' ? 'border-yellow-400 focus:ring-yellow-500 focus:border-yellow-500' : 'border-gray-200 focus:ring-[#00d2ff] focus:border-[#00d2ff]'}`} />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nomor Telepon</label>
                                                    <div className="relative">
                                                        <svg className={`w-5 h-5 absolute left-3 top-2.5 ${modalMode === 'edit' ? 'text-yellow-500' : 'text-blue-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                                        <input type="tel" value={data.nomor_telepon} onChange={(e) => setData('nomor_telepon', e.target.value)} required placeholder="08xxxxxxxxxx" className={`pl-10 w-full px-4 py-2.5 border rounded-lg outline-none transition-all ${modalMode === 'edit' ? 'border-yellow-400 focus:ring-yellow-500 focus:border-yellow-500' : 'border-gray-200 focus:ring-[#00d2ff] focus:border-[#00d2ff]'}`} />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Alamat Lengkap</label>
                                                    <div className="relative">
                                                        <svg className={`w-5 h-5 absolute left-3 top-3 ${modalMode === 'edit' ? 'text-yellow-500' : 'text-blue-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                        <textarea value={data.alamat} onChange={(e) => setData('alamat', e.target.value)} placeholder="Alamat lengkap member" rows="3" className={`pl-10 pt-2.5 w-full px-4 border rounded-lg outline-none transition-all resize-none ${modalMode === 'edit' ? 'border-yellow-400 focus:ring-yellow-500 focus:border-yellow-500' : 'border-gray-200 focus:ring-[#00d2ff] focus:border-[#00d2ff]'}`}></textarea>
                                                    </div>
                                                </div>

                                                {modalMode === 'edit' ? (
                                                    <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 mt-2">
                                                        <p className="text-xs text-gray-500 font-semibold mb-1">Saldo Saat Ini</p>
                                                        <p className="text-2xl font-bold text-blue-600 mb-2">{formatRp(data.saldo)}</p>
                                                        <p className="text-[10px] text-gray-400 leading-tight">*Saldo tidak dapat diubah melalui form edit. Gunakan fitur Top-up untuk menambah saldo.</p>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Saldo Awal</label>
                                                        <div className="relative">
                                                            <span className="absolute left-4 top-2.5 font-bold text-blue-600">Rp</span>
                                                            <input type="number" value={data.saldo} onChange={(e) => setData('saldo', e.target.value)} placeholder="100000" className="pl-12 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00d2ff] focus:border-[#00d2ff] outline-none transition-all" />
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )}

                                        {/* Tombol Aksi Form */}
                                        <div className="flex gap-3 pt-4 mt-2">
                                            <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-colors">Batal</button>
                                            <button type="submit" disabled={processing} className={`flex-1 font-semibold py-3 px-4 rounded-xl transition-colors shadow-md disabled:opacity-50 text-white ${modalMode === 'edit' ? 'bg-[#f59e0b] hover:bg-[#d97706]' : modalMode === 'topup' ? 'bg-[#10b981] hover:bg-emerald-600' : 'bg-[#00d2ff] hover:bg-[#00b8e6]'}`}>
                                                {processing ? 'Menyimpan...' : (modalMode === 'edit' ? 'Simpan Perubahan' : modalMode === 'topup' ? 'Konfirmasi Top-up' : 'Tambah Member')}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            )}
        </CashierLayout>
    );
}