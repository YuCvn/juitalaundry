import React, { useState } from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

export default function Service() {
    // State untuk Filter
    const [activeFilter, setActiveFilter] = useState('semua');

    // State untuk Modal & Form
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        name: '',
        category: 'Kiloan',
        price: '',
        unit: 'Kg',
    });

    // Data Bodong (Mock Data)
    const [services, setServices] = useState([
        { id: 1, name: 'Setrika Kiloan', category: 'Kiloan', price: 4000, unit: 'Kg', is_active: true },
        { id: 2, name: 'Cuci Kiloan', category: 'Kiloan', price: 5000, unit: 'Kg', is_active: true },
        { id: 3, name: 'Cuci Kering', category: 'Kiloan', price: 7000, unit: 'Kg', is_active: true },
        { id: 4, name: 'Cuci Komplit', category: 'Kiloan', price: 10000, unit: 'Kg', is_active: true },
        { id: 5, name: 'Baju / Kaos', category: 'Satuan', price: 2000, unit: 'Pcs', is_active: true },
        { id: 6, name: 'Kemeja', category: 'Satuan', price: 3000, unit: 'Pcs', is_active: true },
    ]);

    // Format Rupiah
    const formatRp = (angka) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
    };

    // Filter Layanan
    const filteredServices = services.filter(s => {
        if (activeFilter === 'semua') return true;
        return s.category.toLowerCase() === activeFilter.toLowerCase();
    });

    // Fungsi Buka Modal Tambah
    const openAddModal = () => {
        setIsEditMode(false);
        setFormData({ id: null, name: '', category: 'Kiloan', price: '', unit: 'Kg' });
        setIsModalOpen(true);
    };

    // Fungsi Buka Modal Edit
    const openEditModal = (service) => {
        setIsEditMode(true);
        setFormData({ ...service });
        setIsModalOpen(true);
    };

    // Fungsi Toggle Status & Delete
    const toggleStatus = (id) => {
        setServices(services.map(s => s.id === id ? { ...s, is_active: !s.is_active } : s));
    };
    const deleteService = (id) => {
        if (window.confirm('Yakin ingin menghapus layanan ini?')) {
            setServices(services.filter(s => s.id !== id));
        }
    };

    // Submit Form
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditMode) {
            setServices(services.map(s => s.id === formData.id ? { ...formData, is_active: s.is_active } : s));
        } else {
            const newId = Math.max(...services.map(s => s.id), 0) + 1;
            setServices([...services, { ...formData, id: newId, is_active: true }]);
        }
        setIsModalOpen(false);
    };

    return (
        <AdminLayout title="Kelola Layanan">
            <Head title="Kelola Layanan - Juita Laundry" />

            <div className="max-w-7xl mx-auto">
                {/* Header Halaman */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Kelola Layanan</h2>
                    <p className="text-sm text-gray-500 mt-1">Manajemen jenis layanan dan harga laundry.</p>
                </div>

                {/* Kotak Filter Kategori */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex items-center gap-4 overflow-x-auto">
                    <span className="text-sm font-medium text-gray-500 whitespace-nowrap pl-2">Filter Kategori:</span>
                    
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setActiveFilter('semua')}
                            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                                activeFilter === 'semua' 
                                ? 'bg-[#3b82f6] text-white shadow-md' 
                                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            Semua ({services.length})
                        </button>
                        <button 
                            onClick={() => setActiveFilter('kiloan')}
                            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                                activeFilter === 'kiloan' 
                                ? 'bg-[#3b82f6] text-white shadow-md' 
                                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            Kiloan ({services.filter(s => s.category === 'Kiloan').length})
                        </button>
                        <button 
                            onClick={() => setActiveFilter('satuan')}
                            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                                activeFilter === 'satuan' 
                                ? 'bg-[#3b82f6] text-white shadow-md' 
                                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            Satuan ({services.filter(s => s.category === 'Satuan').length})
                        </button>
                    </div>
                </div>

                {/* Kotak Tabel Daftar Layanan */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Header Tabel */}
                    <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Daftar Layanan</h3>
                            <p className="text-sm text-gray-500 mt-1">Kelola layanan beserta harganya.</p>
                        </div>
                        
                        <button 
                            onClick={openAddModal}
                            className="bg-[#10b981] hover:bg-emerald-600 text-white font-semibold py-2.5 px-5 rounded-lg flex items-center transition-colors shadow-sm"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            Tambah Layanan
                        </button>
                    </div>

                    {/* Tabel */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                                    <th className="p-4 font-semibold font-sans w-16 text-center">#</th>
                                    <th className="p-4 font-semibold font-sans">Layanan</th>
                                    <th className="p-4 font-semibold font-sans">Kategori</th>
                                    <th className="p-4 font-semibold font-sans">Harga</th>
                                    <th className="p-4 font-semibold font-sans">Unit</th>
                                    {/* Kolom Status & Aksi disejajarkan dengan desain */}
                                    <th className="p-4 font-semibold font-sans">Status</th>
                                    <th className="p-4 font-semibold font-sans text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredServices.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4 text-center text-sm font-medium text-gray-500">{index + 1}</td>
                                        <td className="p-4 font-bold text-gray-800 text-sm">{item.name}</td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                                                item.category === 'Kiloan' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                                            }`}>
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm font-bold text-gray-800">{formatRp(item.price)}</td>
                                        <td className="p-4 text-sm text-gray-600 font-medium">{item.unit}</td>
                                        
                                        {/* KOLOM STATUS: HANYA SWITCH TOGGLE */}
                                        <td className="p-4">
                                            <button 
                                                onClick={() => toggleStatus(item.id)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                                                    item.is_active ? 'bg-emerald-500' : 'bg-gray-200'
                                                }`}
                                            >
                                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                                                    item.is_active ? 'translate-x-6' : 'translate-x-1'
                                                }`} />
                                            </button>
                                        </td>

                                        {/* KOLOM AKSI: HANYA TOMBOL EDIT & HAPUS */}
                                        <td className="p-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => openEditModal(item)} className="bg-blue-50 text-blue-600 hover:bg-blue-100 p-2 rounded-lg transition-colors shadow-sm" title="Edit Layanan">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                </button>
                                                <button onClick={() => deleteService(item.id)} className="bg-red-50 text-red-600 hover:bg-red-100 p-2 rounded-lg transition-colors shadow-sm" title="Hapus Layanan">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredServices.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="p-8 text-center text-gray-500 font-medium">Belum ada layanan di kategori ini.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* MODAL TAMBAH/EDIT LAYANAN */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-opacity">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="text-lg font-bold text-gray-800">
                                {isEditMode ? 'Edit Layanan' : 'Tambah Layanan Baru'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:bg-gray-200 hover:text-gray-600 rounded-full p-1 transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="p-6 space-y-5">
                                {/* Input Nama Layanan */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Layanan</label>
                                    <div className="relative">
                                        <svg className="w-5 h-5 absolute left-3 top-2.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                                        <input 
                                            type="text" 
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            placeholder="Misal: Cuci Komplit" 
                                            className="pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                                        />
                                    </div>
                                </div>

                                {/* Radio Kategori Layanan */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Kategori Layanan</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <label className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${formData.category === 'Kiloan' ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-200 hover:bg-gray-50'}`}>
                                            <input type="radio" name="category" value="Kiloan" checked={formData.category === 'Kiloan'} onChange={(e) => setFormData({...formData, category: e.target.value, unit: 'Kg'})} className="hidden" />
                                            <svg className={`w-6 h-6 ${formData.category === 'Kiloan' ? 'text-blue-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
                                            <span className={`text-sm font-semibold ${formData.category === 'Kiloan' ? 'text-blue-700' : 'text-gray-600'}`}>Kiloan</span>
                                        </label>

                                        <label className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${formData.category === 'Satuan' ? 'border-orange-500 bg-orange-50 shadow-sm' : 'border-gray-200 hover:bg-gray-50'}`}>
                                            <input type="radio" name="category" value="Satuan" checked={formData.category === 'Satuan'} onChange={(e) => setFormData({...formData, category: e.target.value, unit: 'Pcs'})} className="hidden" />
                                            <svg className={`w-6 h-6 ${formData.category === 'Satuan' ? 'text-orange-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.004 5H9.996C8.88 5 8.012 5.869 8.001 6.985A2.001 2.001 0 009.996 9h4.008a2.001 2.001 0 001.995-2.015C15.988 5.869 15.12 5 14.004 5zM3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                            <span className={`text-sm font-semibold ${formData.category === 'Satuan' ? 'text-orange-600' : 'text-gray-600'}`}>Satuan</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Input Harga */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Harga</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-2.5 font-bold text-gray-500">Rp</span>
                                            <input 
                                                type="number" 
                                                required
                                                min="0"
                                                value={formData.price}
                                                onChange={(e) => setFormData({...formData, price: e.target.value})}
                                                placeholder="0" 
                                                className="pl-11 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                                            />
                                        </div>
                                    </div>

                                    {/* Input Unit Satuan */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Unit Satuan</label>
                                        <input 
                                            type="text" 
                                            required
                                            value={formData.unit}
                                            onChange={(e) => setFormData({...formData, unit: e.target.value})}
                                            placeholder="Kg / Pcs / Meter" 
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50" 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">Batal</button>
                                <button type="submit" className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm">
                                    Simpan Data
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </AdminLayout>
    );
}