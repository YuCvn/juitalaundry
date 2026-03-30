import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '../Layouts/AdminLayout';

export default function Membership() {
    // State untuk mengontrol pop-up (modal) Tambah Member
    const [showModal, setShowModal] = useState(false);

    // Data dummy sementara untuk menampilkan list member sesuai desainmu
    const mockMembers = [
        {
            id: 1,
            nama: 'aa',
            tanggalGabung: '14/3/2026',
            saldoAktif: 100000,
            totalTopUp: 100000,
            poin: 0
        }
    ];

    // Fungsi format rupiah
    const formatRp = (angka) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
    };

    return (
        <AdminLayout title="Membership">
            
            <div className="max-w-7xl mx-auto relative">
                {/* --- Header Halaman & Tombol Tambah --- */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h2 className="text-2xl font-bold text-gray-800">Membership</h2>
                    
                    {/* Tombol yang akan mengubah state showModal menjadi true */}
                    <button 
                        onClick={() => setShowModal(true)}
                        className="bg-[#10b981] hover:bg-emerald-600 text-white font-semibold py-2.5 px-5 rounded-lg flex items-center transition-colors shadow-sm"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Tambah Member
                    </button>
                </div>

                {/* --- 3 Kartu Ringkasan (Top Cards) --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-[#3b82f6] hover:-translate-y-1 transition-transform duration-200 rounded-xl p-6 text-white shadow-sm flex justify-between items-center cursor-default">
                        <div>
                            <p className="text-sm font-semibold text-blue-100 mb-1">Total Member</p>
                            <h3 className="text-4xl font-bold">{mockMembers.length}</h3>
                        </div>
                        <svg className="w-12 h-12 text-blue-200 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    </div>

                    <div className="bg-[#06b6d4] hover:-translate-y-1 transition-transform duration-200 rounded-xl p-6 text-white shadow-sm flex justify-between items-center cursor-default">
                        <div>
                            <p className="text-sm font-semibold text-cyan-100 mb-1">Total Saldo Aktif</p>
                            <h3 className="text-4xl font-bold">Rp 100.000</h3>
                        </div>
                        <svg className="w-12 h-12 text-cyan-200 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                    </div>

                    <div className="bg-[#0ea5e9] hover:-translate-y-1 transition-transform duration-200 rounded-xl p-6 text-white shadow-sm flex justify-between items-center cursor-default">
                        <div>
                            <p className="text-sm font-semibold text-sky-100 mb-1">Total Top-up</p>
                            <h3 className="text-4xl font-bold">Rp 100.000</h3>
                        </div>
                        <svg className="w-12 h-12 text-sky-200 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                    </div>
                </div>

                {/* --- Area Daftar Member --- */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px] flex flex-col">
                    <div className="bg-[#0ea5e9] px-6 py-4 flex items-center text-white">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                        <h3 className="font-bold text-lg">Daftar Member</h3>
                    </div>

                    <div className="p-6">
                        {mockMembers.map((member) => (
                            <div key={member.id} className="bg-gray-50 border border-gray-100 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-shadow">
                                {/* Info Member Kiri */}
                                <div>
                                    <h4 className="text-lg font-bold text-gray-800">{member.nama}</h4>
                                    <p className="text-sm text-gray-500 mb-3">Bergabung {member.tanggalGabung}</p>
                                    
                                    <div className="flex flex-wrap gap-3">
                                        <div className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 shadow-sm">
                                            <p className="text-xs text-gray-500">Saldo Aktif</p>
                                            <p className="font-bold text-blue-600">{formatRp(member.saldoAktif)}</p>
                                        </div>
                                        <div className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 shadow-sm">
                                            <p className="text-xs text-gray-500">Total Top-up</p>
                                            <p className="font-bold text-gray-700">{formatRp(member.totalTopUp)}</p>
                                        </div>
                                        <div className="bg-white border border-orange-200 rounded-lg px-3 py-1.5 shadow-sm bg-orange-50/50">
                                            <p className="text-xs text-orange-600/80">Poin Loyalty</p>
                                            <p className="font-bold text-orange-600">{member.poin} poin</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Tombol Aksi Kanan */}
                                <div className="flex gap-2 w-full md:w-auto">
                                    <button className="flex-1 md:flex-none bg-[#10b981] hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center transition-colors shadow-sm">
                                        <span className="mr-1">$</span> Top-up
                                    </button>
                                    <button className="flex-1 md:flex-none bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center transition-colors shadow-sm">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        Riwayat
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* --- MODAL POP-UP TAMBAH MEMBER --- */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-opacity">
                    
                    {/* Kotak Modal */}
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 md:p-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Tambah Member Baru</h2>

                            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowModal(false); }}>
                                
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap</label>
                                    <div className="relative">
                                        <svg className="w-5 h-5 absolute left-3 top-2.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                        <input type="text" placeholder="Nama lengkap member" className="pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00d2ff] focus:border-[#00d2ff] outline-none transition-all" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nomor Telepon</label>
                                    <div className="relative">
                                        <svg className="w-5 h-5 absolute left-3 top-2.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                        <input type="tel" placeholder="08xxxxxxxxxx" className="pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00d2ff] focus:border-[#00d2ff] outline-none transition-all" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Alamat Lengkap</label>
                                    <div className="relative">
                                        <svg className="w-5 h-5 absolute left-3 top-2.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        <input type="text" placeholder="Alamat lengkap member" className="pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00d2ff] focus:border-[#00d2ff] outline-none transition-all" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Saldo Awal</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-2.5 font-bold text-blue-600">Rp</span>
                                        {/* Ubah defaultValue menjadi placeholder di sini 👇 */}
                                        <input 
                                            type="number" 
                                            placeholder="100000" 
                                            className="pl-12 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00d2ff] focus:border-[#00d2ff] outline-none transition-all" 
                                        />
                                    </div>
                                </div>

                                {/* Tombol Aksi Pop-up */}
                                <div className="flex gap-3 pt-4 mt-2">
                                    <button 
                                        type="button" 
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="flex-1 bg-[#00d2ff] hover:bg-[#00b8e6] text-white font-semibold py-3 px-4 rounded-xl transition-colors shadow-md"
                                    >
                                        Tambah Member
                                    </button>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            )}

        </AdminLayout>
    );
}