import React, { useState } from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';

export default function Cashier({ cashiers, totalCashiers, activeCashiers, inactiveCashiers }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        username: '',
        password: '',
        name: '',
    });

    const openAddModal = () => {
        setIsEditMode(false);
        setEditingId(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (cashier) => {
        setIsEditMode(true);
        setEditingId(cashier.id);
        setData({
            username: cashier.username,
            password: '',
            name: cashier.name,
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
        clearErrors();
    };

    const submit = (e) => {
        e.preventDefault();
        
        if (isEditMode) {
            put(`/admin/cashiers/${editingId}`, {
                onSuccess: () => closeModal(),
            });
        } else {
            post('/admin/cashiers', {
                onSuccess: () => closeModal(),
            });
        }
    };

    const toggleStatus = (id) => {
        router.patch(`/admin/cashiers/${id}/toggle`, {}, { preserveScroll: true });
    };

    const deleteCashier = (id, name) => {
        if (window.confirm(`Peringatan: Apakah Anda yakin ingin menghapus kasir "${name}" secara permanen? Data yang sudah dihapus tidak bisa dikembalikan.`)) {
            router.delete(`/admin/cashiers/${id}`, { preserveScroll: true });
        }
    };

    return (
        <AdminLayout title="Kelola Pengguna">
            <Head title="Kelola Akun Kasir - Juita Laundry" />
            
            {/* Header Utama */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-800">Kelola Akun Kasir</h3>
                    <p className="text-sm text-gray-500 mt-1">Manajemen akun kasir untuk sistem</p>
                </div>
  
                <button 
                    onClick={openAddModal}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-lg transition duration-200 flex items-center text-sm shadow-sm"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Tambah Kasir
                </button>
            </div>

            {/* Card Informasi*/}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                    <span className="text-[13px] font-semibold text-gray-500 mb-0.5">Total Kasir</span>
                    <span className="text-3xl font-bold text-gray-800">{totalCashiers || 0}</span>
                </div>
                <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                    <span className="text-[13px] font-semibold text-gray-500 mb-0.5">Kasir Aktif</span>
                    <span className="text-3xl font-bold text-emerald-500">{activeCashiers || 0}</span>
                </div>
                <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                    <span className="text-[13px] font-semibold text-gray-500 mb-0.5">Kasir Nonaktif</span>
                    <span className="text-3xl font-bold text-rose-500">{inactiveCashiers || 0}</span>
                </div>
            </div>

            {/* Tabel Data Kasir */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                    <h4 className="font-semibold text-gray-800 font-sans">Daftar Kasir</h4>
                    <p className="text-sm text-gray-500 mt-0.5">Semua akun kasir yang terdaftar</p>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                                <th className="p-4 font-semibold font-sans w-32">Username</th>
                                <th className="p-4 font-semibold font-sans">Nama Lengkap</th>
                                <th className="p-4 font-semibold font-sans">Status</th>
                                <th className="p-4 font-semibold font-sans">Dibuat</th>
                                <th className="p-4 font-semibold font-sans text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {cashiers && cashiers.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4 text-sm text-gray-600 font-medium">{item.username}</td>
                                    <td className="p-4">
                                        <div className="flex items-center">
                                            <div className="font-semibold text-gray-800 text-sm">{item.name}</div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                                            item.is_active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                                        }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${item.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                                            {item.is_active ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                    </td>

                                    <td className="p-4 text-sm text-gray-600">
                                        {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </td>

                                    <td className="p-4 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button onClick={() => openEditModal(item)} className="bg-blue-50 text-blue-600 hover:bg-blue-100 p-2 rounded-lg transition-colors shadow-sm border border-blue-100" title="Edit Data">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                            </button>

                                            <button onClick={() => toggleStatus(item.id)} className={`p-2 rounded-lg transition-colors shadow-sm border ${item.is_active ? 'bg-red-50 text-red-600 hover:bg-red-100 border-red-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-emerald-100'}`} title={item.is_active ? 'Kunci Akun (Nonaktifkan)' : 'Buka Akun (Aktifkan)'}>
                                                {item.is_active ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>}
                                            </button>
                                            
                                            <button onClick={() => deleteCashier(item.id, item.name)} className="bg-red-50 text-red-600 hover:bg-red-100 p-2 rounded-lg transition-colors shadow-sm border border-red-100" title="Hapus Permanen">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {(!cashiers || cashiers.length === 0) && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500">
                                        <p className="text-sm font-medium">Belum ada akun kasir terdaftar.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" onClick={closeModal}></div>
                    
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg z-10 overflow-hidden transform transition-all">
                        
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
                            <div>
                                <h3 className="text-sm font-bold text-gray-800">
                                    {isEditMode ? 'Edit Akun Kasir' : 'Tambahkan Akun Kasir Baru'}
                                </h3>
                                <p className="text-[11px] text-gray-500 mt-0.5">
                                    {isEditMode ? 'Update informasi akun kasir' : 'Buat akun kasir baru untuk mengakses sistem'}
                                </p>
                            </div>
                            <button onClick={closeModal} className="text-gray-400 hover:bg-gray-200 hover:text-gray-600 rounded-full p-1 transition-colors mt-0.5">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <form onSubmit={submit} className="p-6">
                            
                            <div className="space-y-4">
                                
                                <div className="w-full">
                                    <label className="block text-[12px] font-bold text-gray-700 mb-1.5">Username</label>
                                    <input 
                                        type="text" 
                                        className={`w-full border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-colors ${errors.username ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200'}`} 
                                        placeholder="Contoh: budis" 
                                        value={data.username} 
                                        onChange={e => setData('username', e.target.value)} 
                                    />
                                    {errors.username && <div className="text-red-500 text-[10px] mt-1 font-medium">{errors.username}</div>}
                                </div>

                                <div className="w-full">
                                    <label className="block text-[12px] font-bold text-gray-700 mb-1.5">
                                        {isEditMode ? 'Password Baru (Opsional)' : 'Password'}
                                    </label>
                                    <input 
                                        type="password" 
                                        className={`w-full border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-colors ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200'}`} 
                                        placeholder={isEditMode ? "Kosongkan jika tidak diganti" : "Minimal 6 karakter"} 
                                        value={data.password} 
                                        onChange={e => setData('password', e.target.value)} 
                                    />
                                    {errors.password && <div className="text-red-500 text-[10px] mt-1 font-medium">{errors.password}</div>}
                                </div>
                                <div className="w-full">
                                    <label className="block text-[12px] font-bold text-gray-700 mb-1.5">Nama Lengkap</label>
                                    <input 
                                        type="text" 
                                        className={`w-full border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-colors ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200'}`} 
                                        placeholder="Contoh: Budi Santoso" 
                                        value={data.name} 
                                        onChange={e => setData('name', e.target.value)} 
                                    />
                                    {errors.name && <div className="text-red-500 text-[10px] mt-1 font-medium">{errors.name}</div>}
                                </div>

                            </div>
                            <div className="flex justify-end gap-3 mt-8 w-full">
                                <button type="button" onClick={closeModal} className="px-5 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                    Batal
                                </button>
                                <button type="submit" disabled={processing} className={`px-5 py-2 text-xs font-semibold text-white rounded-lg transition-colors shadow-sm flex items-center justify-center ${processing ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
                                    {processing ? 'Loading...' : (isEditMode ? 'Update Kasir' : 'Tambah Kasir')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}