import React, { useState } from 'react';
import { useForm, Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Services({ auth, services }) {
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
            category: service.category || 'kiloan',
            name: service.name || service.nama_layanan || '',
            type: service.type || '',
            price: service.price || service.harga || '',
            unit: service.unit || service.satuan || 'kg',
            is_active: service.is_active !== undefined ? !!service.is_active : true,
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

    // Filter data berdasarkan pencarian (Aman jika services undfined)
    const safeServices = Array.isArray(services) ? services : [];
    const filteredServices = safeServices.filter(service => {
        const sName = service.name || service.nama_layanan || '';
        const sType = service.type || '';
        return sName.toLowerCase().includes(search.toLowerCase()) ||
               sType.toLowerCase().includes(search.toLowerCase());
    });

    // Kelompokkan data berdasarkan kategori
    const kiloanServices = filteredServices.filter(s => s.category === 'kiloan' || !s.category);
    const lainnyaServices = filteredServices.filter(s => s.category === 'lainnya');

    return (
        <AdminLayout title="Kelola Layanan" auth={auth}>
            <Head title="Kelola Layanan" />
            <div className="space-y-6">
                
                {/* 1. BANNER ATAS (Desain Estetik) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-xl">
                        <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                    </div>
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
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder-gray-400 shadow-sm"
                        />
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                        Tambah Layanan
                    </button>
                </div>

                {/* 3. KATEGORI: LAUNDRY KILOAN */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <h2 className="text-lg font-bold text-gray-800">Laundry Kiloan</h2>
                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">{kiloanServices.length}</span>
                    </div>
                    
                    {kiloanServices.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <p className="text-sm text-gray-500 font-medium">Belum ada data layanan kiloan.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {kiloanServices.map((service) => (
                                <div key={service.id} className="border border-gray-100 rounded-xl p-5 bg-white shadow-sm hover:shadow-lg transition-all relative flex flex-col justify-between group">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-gray-800 text-base">{service.name || service.nama_layanan}</h3>
                                                {service.type && <p className="text-sm text-gray-500 mt-0.5">{service.type}</p>}
                                            </div>
                                            <div className="flex gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => openEditModal(service)} className="text-blue-500 hover:bg-blue-50 p-1.5 rounded-lg transition-colors">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                </button>
                                                <button onClick={() => handleDelete(service.id)} className="text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition-colors">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex items-baseline gap-1">
                                            <span className="text-xl font-extrabold text-blue-600">{formatRupiah(service.price || service.harga)}</span>
                                            <span className="text-sm text-gray-500 font-medium">/{service.unit || service.satuan}</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-gray-50">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${service.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${service.is_active ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
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
                    <div className="flex items-center gap-2 mb-4">
                        <h2 className="text-lg font-bold text-gray-800">Jasa Lainnya</h2>
                        <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-0.5 rounded-full">{lainnyaServices.length}</span>
                    </div>
                    
                    {lainnyaServices.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <p className="text-sm text-gray-500 font-medium">Belum ada data jasa lainnya.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {lainnyaServices.map((service) => (
                                <div key={service.id} className="border border-gray-100 rounded-xl p-5 bg-white shadow-sm hover:shadow-lg transition-all relative flex flex-col justify-between group">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-gray-800 text-base">{service.name || service.nama_layanan}</h3>
                                                {service.type && <p className="text-sm text-gray-500 mt-0.5">{service.type}</p>}
                                            </div>
                                            <div className="flex gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => openEditModal(service)} className="text-purple-500 hover:bg-purple-50 p-1.5 rounded-lg transition-colors">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                </button>
                                                <button onClick={() => handleDelete(service.id)} className="text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition-colors">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex items-baseline gap-1">
                                            <span className="text-xl font-extrabold text-purple-600">{formatRupiah(service.price || service.harga)}</span>
                                            <span className="text-sm text-gray-500 font-medium">/{service.unit || service.satuan}</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-gray-50">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${service.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${service.is_active ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                                            {service.is_active ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL INPUT (TAMBAH / EDIT) - Desain Modern Clean */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="text-lg font-bold text-gray-800">
                                {modalMode === 'create' ? 'Tambah Layanan Baru' : 'Edit Data Layanan'}
                            </h3>
                            <button onClick={() => { setIsModalOpen(false); reset(); }} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Kategori</label>
                                    <select 
                                        value={data.category} 
                                        onChange={(e) => setData('category', e.target.value)} 
                                        className="block w-full border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2.5 px-3 bg-gray-50 outline-none"
                                    >
                                        <option value="kiloan">Laundry Kiloan</option>
                                        <option value="lainnya">Jasa Lainnya</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Layanan</label>
                                    <input 
                                        type="text" 
                                        value={data.name} 
                                        onChange={(e) => setData('name', e.target.value)} 
                                        required
                                        placeholder="Contoh: Cuci Komplit"
                                        className="block w-full border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2.5 px-3 outline-none"
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tipe <span className="text-gray-400 font-normal">(Opsional)</span></label>
                                    <input 
                                        type="text" 
                                        value={data.type} 
                                        placeholder="Contoh: Pakaian, Selimut"
                                        onChange={(e) => setData('type', e.target.value)} 
                                        className="block w-full border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2.5 px-3 outline-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Harga</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500 sm:text-sm font-medium">Rp</span>
                                            </div>
                                            <input 
                                                type="number" 
                                                value={data.price} 
                                                onChange={(e) => setData('price', e.target.value)} 
                                                required
                                                className="block w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm outline-none"
                                            />
                                        </div>
                                        {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Satuan</label>
                                        <select 
                                            value={data.unit} 
                                            onChange={(e) => setData('unit', e.target.value)} 
                                            className="block w-full border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2.5 px-3 bg-gray-50 outline-none"
                                        >
                                            <option value="kg">Kg</option>
                                            <option value="pcs">Pcs</option>
                                            <option value="meter">Meter</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <label className="flex items-center cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                        <div className="relative">
                                            <input 
                                                type="checkbox" 
                                                id="is_active"
                                                checked={data.is_active} 
                                                onChange={(e) => setData('is_active', e.target.checked)} 
                                                className="sr-only"
                                            />
                                            {/* Toggle switch visual */}
                                            <div className={`block w-10 h-6 rounded-full transition-colors ${data.is_active ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                                            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${data.is_active ? 'transform translate-x-4' : ''}`}></div>
                                        </div>
                                        <div className="ml-3 text-sm font-semibold text-gray-700">
                                            Status Layanan Aktif
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-8">
                                <button 
                                    type="button" 
                                    onClick={() => { setIsModalOpen(false); reset(); }} 
                                    className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    Batal
                                </button>

                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center shadow-sm"
                                >
                                    {processing && (
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    )}
                                    {modalMode === 'create' ? 'Simpan Data' : 'Update Data'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}