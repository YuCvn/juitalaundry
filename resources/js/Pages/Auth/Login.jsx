import React, { useState, useEffect } from 'react';
import { useForm, Head, usePage } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        username: '',
        password: '',
    });

    const { flash } = usePage().props;
    const [showNotification, setShowNotification] = useState(true);

    useEffect(() => {
        if (flash?.error || flash?.success) {
            setShowNotification(true);
            const timer = setTimeout(() => {
                setShowNotification(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const submit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#00d2ff] to-[#3a7bd5] relative">
            <Head title="Login - Juita Laundry" />

            <div className="fixed top-5 right-5 z-50 flex flex-col gap-3">
                {flash?.success && showNotification && (
                    <div className="bg-white border-l-4 border-green-500 p-4 rounded-lg shadow-lg flex items-center justify-between w-80 animate-fade-in-down">
                        <div className="flex items-center">
                            <div className="bg-green-100 p-2 rounded-full mr-3">
                                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-800">Berhasil</h4>
                                <p className="text-xs text-gray-500">{flash.success}</p>
                            </div>
                        </div>
                        <button onClick={() => setShowNotification(false)} className="text-gray-400 hover:text-gray-600 focus:outline-none">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                )}

                {flash?.error && showNotification && (
                    <div className="bg-white border-l-4 border-red-500 p-4 rounded-lg shadow-lg flex items-center justify-between w-80 animate-fade-in-down">
                        <div className="flex items-center">
                            <div className="bg-red-100 p-2 rounded-full mr-3">
                                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-800">Gagal</h4>
                                <p className="text-xs text-gray-500">{flash.error}</p>
                            </div>
                        </div>
                        <button onClick={() => setShowNotification(false)} className="text-gray-400 hover:text-gray-600 focus:outline-none">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                )}
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <div className="flex flex-col items-center mb-8">
                    <img src="/images/logo.png" alt="Logo Juita Laundry" className="w-20 h-20 mb-4 object-contain" />
                    <h2 className="text-2xl font-bold text-[#00a8ff]">Juita Laundry</h2>
                    <p className="text-sm text-gray-500 mt-1">Masuk ke dashboard sistem</p>
                </div>

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
                        {errors.username && !flash.error && <div className="text-red-500 text-sm mt-1">{errors.username}</div>}
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
                        {errors.password && !flash.error && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-[#00a8ff] hover:bg-[#008fe6] text-white font-semibold py-2.5 px-4 rounded-lg transition duration-200 mt-2 disabled:opacity-70"
                    >
                        {processing ? 'Memproses...' : 'Masuk'}
                    </button>
                </form>
            </div>
        </div>
    );
}