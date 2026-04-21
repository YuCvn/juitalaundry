import React from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

export default function Cashier({ cashiers }) {
    return (
        <AdminLayout title="Kelola Kasir">
            <Head title="Kelola Kasir - Juita Laundry" />

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                {/* Bagian Header Tabel & Tombol Tambah */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-800">Daftar Pengguna / Kasir</h3>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center text-sm">
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
                                <th className="p-3 font-semibold">Nama (Username)</th>
                                <th className="p-3 font-semibold">Role</th>
                                <th className="p-3 font-semibold text-center w-32">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cashiers && cashiers.map((item, index) => (
                                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="p-3 text-sm text-gray-700">{index + 1}</td>
                                    <td className="p-3 text-sm font-medium text-gray-800">{item.username}</td>
                                    <td className="p-3 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                            // Normalisasi pengecekan role karena di DB sekarang 'admin' atau 'cashier'
                                            (item.role === 'admin' || item.role === 'Administrator') 
                                                ? 'bg-purple-100 text-purple-700' 
                                                : 'bg-green-100 text-green-700'
                                        }`}>
                                            {/* Supaya tampilannya rapi, kita ubah huruf depannya jadi kapital */}
                                            {item.role.charAt(0).toUpperCase() + item.role.slice(1)}
                                        </span>
                                    </td>
                                    <td className="p-3 text-sm text-center flex justify-center gap-2">
                                        {/* Tombol Edit */}
                                        <button className="bg-yellow-100 text-yellow-600 hover:bg-yellow-200 p-1.5 rounded transition-colors" title="Edit">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                        </button>
                                        
                                        {/* Tombol Hapus */}
                                        <button className="bg-red-100 text-red-600 hover:bg-red-200 p-1.5 rounded transition-colors" title="Hapus">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {/* 4. Ubah pengecekan data kosong menjadi cashiers.length */}
                            {(!cashiers || cashiers.length === 0) && (
                                <tr>
                                    <td colSpan="4" className="p-6 text-center text-gray-500 text-sm">Belum ada data kasir.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}