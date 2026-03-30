import React from 'react';
import { useForm, Head } from '@inertiajs/react';

export default function Login() {
    // Menginisialisasi form state menggunakan Inertia
    const { data, setData, post, processing, errors } = useForm({
        username: '',
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        // Mengirim data form ke route POST '/login'
        post('/login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#00d2ff] to-[#3a7bd5]">
            <Head title="Login - Juita Laundry" />

            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                {/* Bagian Logo dan Judul */}
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-[#00a8ff] p-3 rounded-full mb-4 shadow-sm">
                        {/* Ikon Tetesan Air sederhana */}
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16a4 4 0 100-8 4 4 0 000 8z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-[#00a8ff]">Juita Laundry</h2>
                    <p className="text-sm text-gray-500 mt-1">Masuk ke dashboard admin</p>
                </div>

                {/* Form Login */}
                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
                        <input
                            type="text"
                            value={data.username}
                            onChange={e => setData('username', e.target.value)}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a8ff] transition-all"
                            placeholder="Masukkan username"
                            autoComplete="username"
                        />
                        {errors.username && <div className="text-red-500 text-sm mt-1">{errors.username}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a8ff] transition-all"
                            placeholder="Masukkan password"
                            autoComplete="current-password"
                        />
                        {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-[#00a8ff] hover:bg-[#008fe6] text-white font-semibold py-2.5 px-4 rounded-lg transition duration-200 mt-2"
                    >
                        Masuk
                    </button>
                </form>

                {/* Info Demo */}
                <div className="text-center mt-6 text-xs text-gray-500">
                    <p>Demo: username: admin</p>
                    <p>password: admin</p>
                </div>
            </div>
        </div>
    );
}