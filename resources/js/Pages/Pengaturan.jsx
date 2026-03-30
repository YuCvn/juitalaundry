import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '../Layouts/AdminLayout';

export default function Pengaturan() {
    const [activeTab, setActiveTab] = useState('profil');

    return (
        <AdminLayout title="Pengaturan">
            
            <div className="max-w-6xl mx-auto">
                
                {/* --- Header Halaman & Tombol Logout --- */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <h2 className="text-2xl font-bold text-gray-800">Pengaturan</h2>
                    
                    <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-5 rounded-lg flex items-center transition-colors shadow-sm">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Logout
                    </button>
                </div>

                {/* --- Layout Utama: Kiri (Menu) & Kanan (Konten) --- */}
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    
                    {/* --- KIRI: Navigasi Tab (Lebar Dikunci) --- */}
                    <div className="w-full md:w-72 flex-none">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                            <button 
                                onClick={() => setActiveTab('profil')}
                                className={`flex items-center p-4 transition-colors text-sm font-medium border-b border-gray-50 ${activeTab === 'profil' ? 'bg-[#00d2ff] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                Profil
                            </button>
                            <button 
                                onClick={() => setActiveTab('keamanan')}
                                className={`flex items-center p-4 transition-colors text-sm font-medium border-b border-gray-50 ${activeTab === 'keamanan' ? 'bg-[#00d2ff] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                Keamanan
                            </button>
                            <button 
                                onClick={() => setActiveTab('notifikasi')}
                                className={`flex items-center p-4 transition-colors text-sm font-medium border-b border-gray-50 ${activeTab === 'notifikasi' ? 'bg-[#00d2ff] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                                Notifikasi
                            </button>
                            <button 
                                onClick={() => setActiveTab('data')}
                                className={`flex items-center p-4 transition-colors text-sm font-medium ${activeTab === 'data' ? 'bg-[#00d2ff] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                Data
                            </button>
                        </div>
                    </div>

                    {/* --- KANAN: Konten Tab Aktif --- */}
                    <div className="flex-1 w-full min-w-0">
                        
                        {/* Konten: PROFIL */}
                        {activeTab === 'profil' && (
                            <div className="bg-white rounded-xl shadow-sm border border-[#00d2ff]/30 p-6 md:p-8 animate-in fade-in duration-300">
                                <h3 className="text-xl font-bold text-gray-800 mb-6">Informasi Profil</h3>
                                <form className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Username</label>
                                        <input type="text" defaultValue="admin" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00d2ff] outline-none text-gray-600 transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Role</label>
                                        <input type="text" defaultValue="Administrator" disabled className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Bisnis</label>
                                        <input type="text" defaultValue="Laundry Sistem" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00d2ff] outline-none text-gray-600 transition-all" />
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Konten: KEAMANAN */}
                        {activeTab === 'keamanan' && (
                            <div className="bg-white rounded-xl shadow-sm border border-[#00d2ff]/30 p-6 md:p-8 animate-in fade-in duration-300">
                                <h3 className="text-xl font-bold text-gray-800 mb-6">Keamanan Akun</h3>
                                <form className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password Lama</label>
                                        <input type="password" placeholder="Masukkan password lama" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00d2ff] outline-none text-gray-600 transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password Baru</label>
                                        <input type="password" placeholder="Masukkan password baru" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00d2ff] outline-none text-gray-600 transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Konfirmasi Password Baru</label>
                                        <input type="password" placeholder="Konfirmasi password baru" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00d2ff] outline-none text-gray-600 transition-all" />
                                    </div>
                                    <div className="pt-2">
                                        <button type="button" className="bg-[#00d2ff] hover:bg-[#00b8e6] text-white font-semibold py-2.5 px-6 rounded-lg transition-colors shadow-sm">
                                            Ubah Password
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Konten: NOTIFIKASI */}
                        {activeTab === 'notifikasi' && (
                            <div className="bg-white rounded-xl shadow-sm border border-[#00d2ff]/30 p-6 md:p-8 animate-in fade-in duration-300">
                                <h3 className="text-xl font-bold text-gray-800 mb-6">Preferensi Notifikasi</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <div>
                                            <p className="font-semibold text-gray-800">Order Baru</p>
                                            <p className="text-sm text-gray-500">Notifikasi saat ada order baru</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00d2ff]"></div>
                                        </label>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <div>
                                            <p className="font-semibold text-gray-800">Order Selesai</p>
                                            <p className="text-sm text-gray-500">Notifikasi saat order selesai dikerjakan</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00d2ff]"></div>
                                        </label>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <div>
                                            <p className="font-semibold text-gray-800">Pembayaran Diterima</p>
                                            <p className="text-sm text-gray-500">Notifikasi saat pembayaran berhasil</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00d2ff]"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Konten: DATA */}
                        {activeTab === 'data' && (
                            <div className="bg-white rounded-xl shadow-sm border border-[#00d2ff]/30 p-6 md:p-8 animate-in fade-in duration-300">
                                <h3 className="text-xl font-bold text-gray-800 mb-6">Manajemen Data</h3>
                                <div className="space-y-6">
                                    <div className="p-5 bg-red-50 border border-red-200 rounded-xl">
                                        <div className="flex items-start gap-3">
                                            <svg className="w-6 h-6 text-red-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            <div>
                                                <h4 className="text-base font-bold text-red-700">Zona Bahaya</h4>
                                                <p className="text-sm text-red-600/80 mt-1 mb-4">Menghapus semua data akan menghilangkan seluruh informasi order, pelanggan, layanan, membership, dan pengeluaran dari sistem. Tindakan ini tidak dapat dibatalkan.</p>
                                                <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-sm text-sm">
                                                    Hapus Semua Data
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-5 bg-blue-50/50 border border-blue-100 rounded-xl">
                                        <h4 className="text-base font-bold text-blue-800">Backup Data</h4>
                                        <p className="text-sm text-blue-600/80 mt-1 mb-4">Export semua data sistem untuk backup atau migrasi.</p>
                                        <button className="bg-[#00d2ff] hover:bg-[#00b8e6] text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-sm text-sm">
                                            Export Data
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}