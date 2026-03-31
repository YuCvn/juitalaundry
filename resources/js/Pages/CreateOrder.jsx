import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '../Layouts/AdminLayout';

export default function CreateOrder() {
    // State form menggunakan Inertia
    const { data, setData, post, processing } = useForm({
        is_membership: false,
        nama: '',
        telepon: '',
        alamat: '',
        berat: '',
        metode_pengambilan: 'ambil', 
        metode_pembayaran: 'langsung',
    });

    const hargaPerKg = 2500;
    
    // Menghitubg otomatis
    const beratAngka = parseFloat(data.berat) || 0;
    const totalPembayaran = beratAngka * hargaPerKg;

    // Format rupiah
    const formatRp = (angka) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
    };

    const submit = (e) => {
        e.preventDefault();
        // Kode untuk beckemd nanti
        console.log("Data siap dikirim:", data);
        // post('/orders');
    };

    return (
        <AdminLayout title="Dashboard"> {/* Sidebar */}
            
            <div className="max-w-3xl mx-auto pb-12">
                {/* Tombol Kembali */}
                <Link href="/orders" className="inline-flex items-center text-blue-500 hover:text-blue-700 font-semibold mb-6 transition-colors">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Kembali ke Orders
                </Link>

                {/* Card Form Utama */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                    <h2 className="text-2xl font-bold text-blue-600 mb-8">Order Baru</h2>

                    <form onSubmit={submit} className="space-y-6">
                        
                        {/* Checkbox Membership */}
                        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
                            <input 
                                type="checkbox" 
                                id="membership"
                                checked={data.is_membership}
                                onChange={e => setData('is_membership', e.target.checked)}
                                className="mt-1 w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                            />
                            <div>
                                <label htmlFor="membership" className="font-semibold text-gray-800 cursor-pointer flex items-center gap-2">
                                    {/* TODO: Ganti ikon kartu di bawah ini jika perlu */}
                                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                    Gunakan Membership
                                </label>
                                <p className="text-xs text-gray-500 mt-1">Centang jika pelanggan ini menggunakan membership (akan mendapat poin dan bisa bayar pakai saldo)</p>
                            </div>
                        </div>

                        {/* Input Nama */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Pelanggan</label>
                            <div className="relative">
                                {/* Icon ganti jangan lupa wkwk*/}
                                <svg className="w-5 h-5 absolute left-3 top-2.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                <input 
                                    type="text" 
                                    value={data.nama}
                                    onChange={e => setData('nama', e.target.value)}
                                    placeholder="Nama lengkap pelanggan" 
                                    className="pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Input Telepon */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Nomor Telepon</label>
                            <div className="relative">
                                {/* Icon tolong GANTI!!!!!!!!!!!! */}
                                <svg className="w-5 h-5 absolute left-3 top-2.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                <input 
                                    type="tel" 
                                    value={data.telepon}
                                    onChange={e => setData('telepon', e.target.value)}
                                    placeholder="08xxxxxxxxxx" 
                                    className="pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Input Alamat */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Alamat Pelanggan</label>
                            <div className="relative">
                                {/* Icon ganti */}
                                <svg className="w-5 h-5 absolute left-3 top-2.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                <input 
                                    type="text" 
                                    value={data.alamat}
                                    onChange={e => setData('alamat', e.target.value)}
                                    placeholder="Alamat lengkap pelanggan" 
                                    className="pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Input Harga */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Harga per kg (Rp)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-2.5 font-bold text-blue-600">Rp</span>
                                <input 
                                    type="text" 
                                    disabled 
                                    value={hargaPerKg}
                                    className="pl-12 w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-600 outline-none cursor-not-allowed"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">🔥 Harga tetap: Rp 2.500/kg</p>
                        </div>

                        {/* Input Berat */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Berat Laundry (kg)</label>
                            <div className="relative">
                                {/*  Icon ganti */}
                                <svg className="w-5 h-5 absolute left-3 top-2.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                <input 
                                    type="number" 
                                    step="0.1"
                                    min="0"
                                    value={data.berat}
                                    onChange={e => setData('berat', e.target.value)}
                                    placeholder="0.0" 
                                    className="pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Metode Pengambilan */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Metode Pengambilan</label>
                            <div className="grid grid-cols-2 gap-4">
                                <label className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${data.metode_pengambilan === 'ambil' ? 'border-green-500 bg-green-50 shadow-sm' : 'border-gray-200 hover:bg-gray-50'}`}>
                                    <input type="radio" name="pengambilan" value="ambil" checked={data.metode_pengambilan === 'ambil'} onChange={e => setData('metode_pengambilan', e.target.value)} className="hidden" />
                                    {/* Icon ganti */}
                                    <svg className={`w-6 h-6 ${data.metode_pengambilan === 'ambil' ? 'text-green-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                    <span className={`text-sm font-semibold ${data.metode_pengambilan === 'ambil' ? 'text-green-700' : 'text-gray-600'}`}>Ambil di Tempat</span>
                                </label>

                                <label className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${data.metode_pengambilan === 'antar' ? 'border-orange-500 bg-orange-50 shadow-sm' : 'border-gray-200 hover:bg-gray-50'}`}>
                                    <input type="radio" name="pengambilan" value="antar" checked={data.metode_pengambilan === 'antar'} onChange={e => setData('metode_pengambilan', e.target.value)} className="hidden" />
                                    {/* Icon ganti */}
                                    <svg className={`w-6 h-6 ${data.metode_pengambilan === 'antar' ? 'text-orange-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                                    <span className={`text-sm font-semibold ${data.metode_pengambilan === 'antar' ? 'text-orange-600' : 'text-gray-600'}`}>Antar ke Alamat</span>
                                </label>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">🚚 Gratis ongkir hingga 3 km. Lebih dari itu dikenakan biaya Rp 2.000/km</p>
                        </div>

                        {/* Metode Pembayaran */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Metode Pembayaran</label>
                            <div className="grid grid-cols-2 gap-4">
                                <label className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${data.metode_pembayaran === 'nanti' ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-200 hover:bg-gray-50'}`}>
                                    <input type="radio" name="pembayaran" value="nanti" checked={data.metode_pembayaran === 'nanti'} onChange={e => setData('metode_pembayaran', e.target.value)} className="hidden" />
                                    {/* Icon ganti */}
                                    <svg className={`w-6 h-6 ${data.metode_pembayaran === 'nanti' ? 'text-blue-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <span className={`text-sm font-semibold ${data.metode_pembayaran === 'nanti' ? 'text-blue-700' : 'text-gray-600'}`}>Bayar Nanti</span>
                                </label>

                                <label className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${data.metode_pembayaran === 'langsung' ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-200 hover:bg-gray-50'}`}>
                                    <input type="radio" name="pembayaran" value="langsung" checked={data.metode_pembayaran === 'langsung'} onChange={e => setData('metode_pembayaran', e.target.value)} className="hidden" />
                                    {/* Icon ganti */}
                                    <svg className={`w-6 h-6 ${data.metode_pembayaran === 'langsung' ? 'text-blue-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                    <span className={`text-sm font-semibold ${data.metode_pembayaran === 'langsung' ? 'text-blue-700' : 'text-gray-600'}`}>Bayar Langsung</span>
                                </label>
                            </div>
                        </div>

                        {/* Ringkasan Pembayaran */}
                        <div className="bg-[#0ea5e9] rounded-xl p-5 text-white mt-6 shadow-md">
                            <p className="text-sm font-medium text-sky-100 mb-3">Ringkasan Pembayaran</p>
                            
                            <div className="flex justify-between items-center py-2 border-b border-sky-400/50">
                                <span className="text-sm">Biaya Laundry ({beratAngka} kg × {formatRp(hargaPerKg)})</span>
                                <span className="font-semibold">{formatRp(totalPembayaran)}</span>
                            </div>
                            
                            <div className="flex justify-between items-center pt-4">
                                <span className="text-base font-semibold">Total Pembayaran</span>
                                <span className="text-2xl font-bold">{formatRp(totalPembayaran)}</span>
                            </div>
                        </div>

                        {/* Tombol Submit */}
                        <button 
                            type="submit"
                            className="w-full bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold py-3.5 px-4 rounded-xl transition-colors shadow-lg mt-4"
                        >
                            Buat Order
                        </button>

                    </form>
                </div>
            </div>

        </AdminLayout>
    );
}