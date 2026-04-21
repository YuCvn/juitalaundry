import React, { useState } from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Cashier({ cashiers }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        username: '',
        password: '',
        password_confirmation: '',
    });

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
        clearErrors();
    };

    const submit = (e) => {
        e.preventDefault();
        
        post('/admin/cashiers', {
            onSuccess: () => closeModal(),
        });
    };

    return (
        <AdminLayout title="Kelola Kasir">
            <Head title="Kelola Kasir - Juita Laundry" />

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                {/* Header Tabel */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-800">Daftar Pengguna / Kasir</h3>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center text-sm shadow-sm"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Tambah Kasir
                    </button>
                </div>

                {/* Tabel Data Kasir */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
                                <th className="p-3 font-semibold">ID</th>
                                <th className="p-3 font-semibold">Nama Lengkap</th>
                                <th className="p-3 font-semibold">Username</th>
                                <th className="p-3 font-semibold">Role</th>
                                <th className="p-3 font-semibold text-center w-32">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cashiers && cashiers.map((item, index) => (
                                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="p-3 text-sm text-gray-700">{index + 1}</td>
                                    <td className="p-3 text-sm font-medium text-gray-800">{item.name}</td>
                                    <td className="p-3 text-sm text-gray-600">@{item.username}</td>
                                    <td className="p-3 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                            (item.role === 'admin' || item.role === 'Administrator') 
                                                ? 'bg-purple-100 text-purple-700' 
                                                : 'bg-green-100 text-green-700'
                                        }`}>
                                            {item.role.charAt(0).toUpperCase() + item.role.slice(1)}
                                        </span>
                                    </td>
                                    <td className="p-3 text-sm text-center flex justify-center gap-2">
                                        <button className="bg-yellow-100 text-yellow-600 hover:bg-yellow-200 p-1.5 rounded transition-colors" title="Edit">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                        </button>
                                        <button className="bg-red-100 text-red-600 hover:bg-red-200 p-1.5 rounded transition-colors" title="Hapus">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {(!cashiers || cashiers.length === 0) && (
                                <tr>
                                    <td colSpan="5" className="p-6 text-center text-gray-500 text-sm">Belum ada data kasir.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={closeModal}></div>

                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md z-10 overflow-hidden transform transition-all">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-800">Tambah Kasir Baru</h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <form onSubmit={submit}>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap</label>
                                    <input 
                                        type="text" 
                                        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Masukkan nama lengkap" 
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                    />
                                    {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
                                    <input 
                                        type="text" 
                                        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Masukkan username untuk login" 
                                        value={data.username}
                                        onChange={e => setData('username', e.target.value)}
                                    />
                                    {errors.username && <div className="text-red-500 text-xs mt-1">{errors.username}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                                    <input 
                                        type="password" 
                                        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Minimal 6 karakter" 
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                    />
                                    {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Konfirmasi Password</label>
                                    <input 
                                        type="password" 
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                        placeholder="Ulangi password" 
                                        value={data.password_confirmation}
                                        onChange={e => setData('password_confirmation', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                                <button 
                                    type="button"
                                    onClick={closeModal} 
                                    className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
                                >
                                    Batal
                                </button>
                                
                                <button 
                                    type="submit"
                                    disabled={processing}
                                    className={`px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors shadow-sm ${processing ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Data'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}