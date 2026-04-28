import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Services({ services }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
    const [editingId, setEditingId] = useState(null);

    const { data, setData, post, put, delete: destroy, reset, processing, errors } = useForm({
        category: 'kiloan',
        name: '',
        type: '',
        price: '',
        unit: '',
        is_active: true,
    });

    const kiloanServices = services.filter((s) => s.category === 'kiloan');
    const lainnyaServices = services.filter((s) => s.category === 'lainnya');

    const openCreateModal = () => {
        setModalMode('create');
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (service) => {
        setModalMode('edit');
        setEditingId(service.id);
        setData({
            category: service.category,
            name: service.name,
            type: service.type || '',
            price: service.price,
            unit: service.unit,
            is_active: service.is_active,
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (modalMode === 'create') {
            post(route('services.store'), { onSuccess: () => closeModal() });
        } else {
            put(route('services.update', editingId), { onSuccess: () => closeModal() });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus layanan ini?')) {
            destroy(route('services.destroy', id));
        }
    };

    // Komponen Card untuk dipake berulang
    const ServiceCard = ({ service }) => (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-gray-800">{service.name}</h4>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${service.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {service.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                </div>
                <p className="text-sm text-gray-500 mb-2">{service.type || '-'}</p>
                <p className="font-semibold text-blue-600">
                    Rp {service.price.toLocaleString('id-ID')} <span className="text-sm font-normal text-gray-500">/ {service.unit}</span>
                </p>
            </div>
            <div className="flex gap-2">
                {/* Tombol Edit (Icon Pensil Biru/Abu) */}
                <button onClick={() => openEditModal(service)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                </button>
                {/* Tombol Hapus (Icon Tong Sampah Merah) */}
                <button onClick={() => handleDelete(service.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                </button>
            </div>
        </div>
    );

    return (
        <AdminLayout>
            <Head title="Kelola Layanan" />
            
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Kelola Layanan</h2>
                    <button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        + Tambah Layanan
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Bagian Laundry Kiloan */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Laundry Kiloan</h3>
                        <div className="flex flex-col gap-3">
                            {kiloanServices.length > 0 ? (
                                kiloanServices.map((service) => <ServiceCard key={service.id} service={service} />)
                            ) : (
                                <p className="text-gray-400 text-sm italic">Belum ada layanan kiloan.</p>
                            )}
                        </div>
                    </div>

                    {/* Bagian Jasa Lainnya */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Jasa Lainnya</h3>
                        <div className="flex flex-col gap-3">
                            {lainnyaServices.length > 0 ? (
                                lainnyaServices.map((service) => <ServiceCard key={service.id} service={service} />)
                            ) : (
                                <p className="text-gray-400 text-sm italic">Belum ada jasa lainnya.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Edit / Tambah */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            {modalMode === 'create' ? 'Tambah Layanan Baru' : 'Edit Layanan'}
                        </h3>
                        
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                                <select 
                                    value={data.category} 
                                    onChange={(e) => setData('category', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="kiloan">Laundry Kiloan</option>
                                    <option value="lainnya">Jasa Lainnya</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Layanan</label>
                                <input 
                                    type="text" 
                                    value={data.name} 
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Contoh: Cuci Komplit"
                                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tipe (Opsional)</label>
                                <input 
                                    type="text" 
                                    value={data.type} 
                                    onChange={(e) => setData('type', e.target.value)}
                                    placeholder="Contoh: Reguler / Kilat"
                                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
                                    <input 
                                        type="number" 
                                        value={data.price} 
                                        onChange={(e) => setData('price', e.target.value)}
                                        placeholder="5000"
                                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                    {/* Tambahkan ini untuk menampilkan pesan error */}
                                    {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Satuan</label>
                                    <input 
                                        type="text" 
                                        value={data.unit} 
                                        onChange={(e) => setData('unit', e.target.value)}
                                        placeholder="Kg / Pcs"
                                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-2">
                                <input 
                                    type="checkbox" 
                                    id="is_active"
                                    checked={data.is_active} 
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="is_active" className="text-sm font-medium text-gray-700 cursor-pointer">
                                    Layanan Aktif
                                </label>
                            </div>

                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                                <button 
                                    type="button" 
                                    onClick={closeModal}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
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