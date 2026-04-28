import React from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Pengaturan() {
    // Inisialisasi useForm dari Inertia
    const { data, setData, put, processing, errors, reset } = useForm({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        put('/pengaturan/password', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <AdminLayout title="Pengaturan">
            <Head title="Pengaturan - Juita Laundry" />

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-2xl">
                <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-4">Ubah Password</h3>
                
                <form onSubmit={submit} className="space-y-5 max-w-md">
                    {/* Input Password Lama */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Password Lama</label>
                        <input
                            type="password"
                            value={data.current_password}
                            onChange={e => setData('current_password', e.target.value)}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            placeholder="Masukkan password lama"
                        />
                        {/* Menampilkan error validasi dari Laravel */}
                        {errors.current_password && <div className="text-red-500 text-sm mt-1">{errors.current_password}</div>}
                    </div>

                    {/* Input Password Baru */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Password Baru</label>
                        <input
                            type="password"
                            value={data.new_password}
                            onChange={e => setData('new_password', e.target.value)}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            placeholder="Masukkan password baru"
                        />
                        {errors.new_password && <div className="text-red-500 text-sm mt-1">{errors.new_password}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Konfirmasi Password Baru</label>
                        <input
                            type="password"
                            value={data.new_password_confirmation}
                            onChange={e => setData('new_password_confirmation', e.target.value)}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            placeholder="Ulangi password baru"
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition duration-200 disabled:opacity-70"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}