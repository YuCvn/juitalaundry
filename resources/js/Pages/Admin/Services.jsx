import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Services({ services }) {
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' atau 'edit'
    const [currentId, setCurrentId] = useState(null);

    // Menggunakan Inertia Form Helper
    const { data, setData, post, put, delete: destroy, errors, reset, processing } = useForm({
        category: 'kiloan',
        name: '',
        type: '',
        price: '',
        unit: 'kg',
        is_active: true,
    });

    // Handle buka modal untuk tambah data
    const openCreateModal = () => {
        reset();
        setModalMode('create');
        setIsModalOpen(true);
    };

    // Handle buka modal untuk edit data
    const openEditModal = (service) => {
        setData({
            category: service.category,
            name: service.name,
            type: service.type || '',
            price: service.price,
            unit: service.unit,
            is_active: !!service.is_active,
        });
        setCurrentId(service.id);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    // Submit Form (Tambah / Edit)
    const handleSubmit = (e) => {
        e.preventDefault();
        if (modalMode === 'create') {
            post(route('admin.services.store'), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                }
            });
        } else {
            put(route('admin.services.update', currentId), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                }
            });
        }
    };

    // Handle Hapus Data
    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus layanan ini?')) {
            destroy(route('admin.services.destroy', id));
        }
    };

    // Format Rupiah
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    };

    // Filter data berdasarkan pencarian
    const filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(search.toLowerCase()) ||
        (service.type && service.type.toLowerCase().includes(search.toLowerCase()))
    );

    // Kelompokkan data berdasarkan kategori
    const kiloanServices = filteredServices.filter(s => s.category === 'kiloan');
    const lainnyaServices = filteredServices.filter(s => s.category === 'lainnya');

    return (
        <AdminLayout title="Kelola Layanan">
            <div className="space-y-6">
                
                {/* 1. BANNER ATAS DENGAN LOGO (Sesuai referensi gambar) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    {/* Sesuaikan src dengan lokasi logo Anda di folder public */}
                    <img 
                        src="/images/logo.png" 
                        alt="Logo Juita Laundry" 
                        className="w-16 h-16 object-contain"
                    />
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-800 tracking-wide font-sans">Kelola Layanan</h1>
                        <p className="text-sm text-gray-500 font-medium mt-1">Atur harga, satuan, dan jenis layanan laundry</p>
                    </div>
                </div>

                {/* 2. SEARCH BAR & BUTTON TAMBAH */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full sm:w-80">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            placeholder="Cari layanan..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder-gray-400 shadow-sm"
                        />
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="w-full sm:w-auto bg-[#2563eb] hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                        Tambah Layanan
                    </button>
                </div>

                {/* 3. KATEGORI: LAUNDRY KILOAN */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h2 className="text-base font-bold text-gray-800 mb-4">Laundry Kiloan</h2>
                    {kiloanServices.length === 0 ? (
                        <p className="text-sm text-gray-400 italic">Tidak ada layanan kiloan.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {kiloanServices.map((service) => (
                                <div key={service.id} className="border border-purple-100 rounded-xl p-5 bg-white relative flex flex-col justify-between hover:shadow-md transition-shadow">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-gray-800 text-base">
                                                {service.name} {service.type && <span className="text-gray-400 font-normal text-sm">- {service.type}</span>}
                                            </h3>
                                            <div className="flex gap-2">
                                                <button onClick={() => openEditModal(service)} className="text-blue-500 hover:text-blue-700 p-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                </button>
                                                <button onClick={() => handleDelete(service.id)} className="text-rose-500 hover:text-rose-700 p-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex items-baseline gap-1">
                                            <span className="text-xl font-extrabold text-[#2563eb]">{formatRupiah(service.price)}</span>
                                            <span className="text-xs text-gray-400 font-medium">/{service.unit}</span>
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold ${service.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                                            {service.is_active ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 4. KATEGORI: JASA LAINNYA */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h2 className="text-base font-bold text-gray-800 mb-4">Jasa Lainnya</h2>
                    {lainnyaServices.length === 0 ? (
                        <p className="text-sm text-gray-400 italic">Tidak ada layanan lainnya.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {lainnyaServices.map((service) => (
                                <div key={service.id} className="border border-purple-100 rounded-xl p-5 bg-white relative flex flex-col justify-between hover:shadow-md transition-shadow">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-gray-800 text-base">{service.name}</h3>
                                                {service.type && <p className="text-xs text-gray-400 mt-0.5">- {service.type}</p>}
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => openEditModal(service)} className="text-purple-500 hover:text-purple-700 p-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                </button>
                                                <button onClick={() => handleDelete(service.id)} className="text-rose-500 hover:text-rose-700 p-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex items-baseline gap-1">
                                            <span className="text-xl font-extrabold text-fuchsia-600">{formatRupiah(service.price)}</span>
                                            <span className="text-xs text-gray-400 font-medium">/{service.unit}</span>
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold ${service.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                                            {service.is_active ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL INPUT (TAMBAH / EDIT) */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-fade-in">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">
                            {modalMode === 'create' ? 'Tambah Layanan Baru' : 'Edit Data Layanan'}
                        </h3>
                        
                        {/* Perbaikan: Menggunakan handleSubmit yang valid */}
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-5">
                                
                                {/* Input Kategori */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Kategori</label>
                                    <select 
                                        value={data.category} 
                                        onChange={(e) => setData('category', e.target.value)} 
                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="kiloan">Laundry Kiloan</option>
                                        <option value="lainnya">Jasa Lainnya</option>
                                    </select>
                                </div>

                                {/* Input Nama Layanan */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Layanan</label>
                                    <input 
                                        type="text" 
                                        value={data.name} 
                                        onChange={(e) => setData('name', e.target.value)} 
                                        required
                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* Input Tipe (Opsional) */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Tipe (Opsional)</label>
                                    <input 
                                        type="text" 
                                        value={data.type} 
                                        placeholder="Contoh: Pakaian, Selimut"
                                        onChange={(e) => setData('type', e.target.value)} 
                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* Input Harga */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Harga</label>
                                    <input 
                                        type="number" 
                                        value={data.price} 
                                        onChange={(e) => setData('price', e.target.value)} 
                                        required
                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* Input Satuan (Sudah dipindah ke bawah Harga) */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Satuan</label>
                                    <select 
                                        value={data.unit} 
                                        onChange={(e) => setData('unit', e.target.value)} 
                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="kg">Kg</option>
                                        <option value="pcs">Pcs</option>
                                        <option value="meter">Meter</option>
                                    </select>
                                </div>

                                {/* Input Status Aktif */}
                                <div className="flex items-center gap-2 mt-2">
                                    <input 
                                        type="checkbox" 
                                        id="is_active"
                                        checked={data.is_active} 
                                        onChange={(e) => setData('is_active', e.target.checked)} 
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor="is_active" className="text-sm font-semibold text-gray-700">Aktifkan Layanan</label>
                                </div>
                            </div>

                            {/* Posisi Tombol: Batal di Kiri, Simpan/Update di Kanan */}
                            <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-200">
                                {/* Perbaikan: setIsModalOpen & reset() langsung pada onClick */}
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        reset();
                                    }} 
                                    className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 transition-colors"
                                >
                                    Batal
                                </button>

                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                                >
                                    {modalMode === 'create' ? 'Simpan' : 'Update'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}