import React, { useState } from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';

export default function Cashier({ cashiers }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        username: '',
        password: '',
        password_confirmation: '',
    });

    const openAddModal = () => {
        setIsEditMode(false);
        setEditingId(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (kasir) => {
        setIsEditMode(true);
        setEditingId(kasir.id);
        setData({
            name: kasir.name,
            username: kasir.username,
            password: '',
            password_confirmation: '',
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

    const deleteKasir = (id, nama) => {
        if (window.confirm(`Peringatan: Apakah Anda yakin ingin menghapus kasir "${nama}" secara permanen? Data yang sudah dihapus tidak bisa dikembalikan.`)) {
            router.delete(`/admin/cashiers/${id}`, { preserveScroll: true });
        }
    };

    return (
        <AdminLayout title="Kelola Akun Kasir">
            <Head title="Kelola Akun Kasir - Juita Laundry" />

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Daftar Akun Kasir</h3>
                        <p className="text-sm text-gray-500 mt-1">Kelola akses dan informasi kasir yang bertugas.</p>
                    </div>
                    
                    <button 
                        onClick={openAddModal}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-lg transition duration-200 flex items-center text-sm shadow-sm"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Tambah Kasir
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                                <th className="p-4 font-semibold font-sans w-32">Username</th>
                                <th className="p-4 font-semibold font-sans">Nama Lengkap</th>
                                <th className="p-4 font-semibold font-sans">Dibuat</th>
                                <th className="p-4 font-semibold font-sans">Status</th>
                                <th className="p-4 font-semibold font-sans text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {cashiers && cashiers.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4 text-sm text-gray-600 font-medium">{item.username}</td>
                                    <td className="p-4">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg mr-3 shrink-0">
                                                {item.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="font-semibold text-gray-800 text-sm">{item.name}</div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">
                                        {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                                            item.is_active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                                        }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${item.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                                            {item.is_active ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex justify-center gap-2">
                                            {/* TOMBOL EDIT */}
                                            <button onClick={() => openEditModal(item)} className="bg-blue-50 text-blue-600 hover:bg-blue-100 p-2 rounded-lg transition-colors shadow-sm border border-blue-100" title="Edit Data">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                            </button>

                                            <button onClick={() => toggleStatus(item.id)} className={`p-2 rounded-lg transition-colors shadow-sm border ${item.is_active ? 'bg-red-50 text-red-600 hover:bg-red-100 border-red-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-emerald-100'}`} title={item.is_active ? 'Kunci Akun (Nonaktifkan)' : 'Buka Akun (Aktifkan)'}>
                                                {item.is_active ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>}
                                            </button>
                                            
                                            {/* TOMBOL HAPUS */}
                                            <button onClick={() => deleteKasir(item.id, item.name)} className="bg-red-50 text-red-600 hover:bg-red-100 p-2 rounded-lg transition-colors shadow-sm border border-red-100" title="Hapus Permanen">
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
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={closeModal}></div>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md z-10 overflow-hidden transform transition-all">
                        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="text-lg font-bold text-gray-800">
                                {isEditMode ? 'Edit Kasir' : 'Tambah Kasir Baru'}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:bg-gray-200 hover:text-gray-600 rounded-full p-1 transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <form onSubmit={submit}>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Nama Lengkap</label>
                                    <input type="text" className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'}`} placeholder="Budi Santoso" value={data.name} onChange={e => setData('name', e.target.value)} />
                                    {errors.name && <div className="text-red-500 text-xs mt-1.5 font-medium">{errors.name}</div>}
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Username</label>
                                    <input type="text" className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${errors.username ? 'border-red-500' : 'border-gray-200'}`} placeholder="budis" value={data.username} onChange={e => setData('username', e.target.value)} />
                                    {errors.username && <div className="text-red-500 text-xs mt-1.5 font-medium">{errors.username}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">
                                        {isEditMode ? 'Password Baru (Opsional)' : 'Password'}
                                    </label>
                                    <input 
                                        type="password" 
                                        className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${errors.password ? 'border-red-500' : 'border-gray-200'}`} 
                                        placeholder={isEditMode ? "Kosongkan jika tidak ingin ganti password" : "Minimal 6 karakter"} 
                                        value={data.password} 
                                        onChange={e => setData('password', e.target.value)} 
                                    />
                                    {errors.password && <div className="text-red-500 text-xs mt-1.5 font-medium">{errors.password}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">
                                        {isEditMode ? 'Konfirmasi Password Baru' : 'Konfirmasi Password'}
                                    </label>
                                    <input 
                                        type="password" 
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500" 
                                        placeholder="Ulangi password" 
                                        value={data.password_confirmation} 
                                        onChange={e => setData('password_confirmation', e.target.value)} 
                                    />
                                </div>
                            </div>

                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                                <button type="button" onClick={closeModal} className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">Batal</button>
                                <button type="submit" disabled={processing} className={`px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-colors shadow-sm ${processing ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
                                    {processing ? 'Menyimpan...' : (isEditMode ? 'Simpan Perubahan' : 'Simpan Data')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}