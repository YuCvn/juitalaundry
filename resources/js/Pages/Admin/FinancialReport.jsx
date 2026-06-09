import React, { useState } from 'react';
import { Head, usePage, useForm, router } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import { 
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

export default function LaporanKeuangan() {
    const { summary, expenses = [], filters, chartData } = usePage().props;
    const [showModal, setShowModal] = useState(false);

    const { data: formData, setData: setFormData, post, processing, reset } = useForm({
        kategori: 'Operasional (Listrik, Air)',
        deskripsi: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
    });

    const handleSimpanPengeluaran = (e) => {
        e.preventDefault();

        const payload = {
            description: `${formData.kategori}: ${formData.deskripsi}`,
            amount: formData.amount,
            date: formData.date,
        };

        router.post('/admin/expenses', payload, {
            onSuccess: () => {
                setShowModal(false);
                reset('deskripsi', 'amount');
            }
        });
    };

    const handleFilterChange = (field, value) => {
        router.get('/admin/laporan-keuangan', {
            ...filters,
            [field]: value
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const formatRp = (angka) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka || 0);
    };

    const formatYAxis = (value) => {
        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
        if (value >= 1000) return `${value / 1000}k`;
        return value;
    };

    const profitMargin = summary.pendapatan > 0 
        ? Math.round((summary.profit / summary.pendapatan) * 100) 
        : 0;

    const formattedChartData = chartData?.labels.map((label, index) => ({
        name: label,
        Pendapatan: chartData.revenues[index],
        Pengeluaran: chartData.expenses[index],
        Profit: chartData.profits[index],
    })) || [];

    const startObj = new Date(filters.start_date);
    const endObj = new Date(filters.end_date);
    const diffDays = Math.round(Math.abs((endObj - startObj) / (1000 * 60 * 60 * 24))) + 1;
    const titleSuffix = `(${diffDays} Hari)`;

    const categoryData = {};
    expenses.forEach(exp => {
        const cat = exp.description.split(': ')[0] || 'Lain-lain';
        categoryData[cat] = (categoryData[cat] || 0) + Number(exp.amount);
    });

    const pieData = Object.keys(categoryData).map(key => ({
        name: key,
        value: categoryData[key]
    }));

    const PIE_COLORS = ['#00d2ff', '#f97316', '#14b8a6', '#8b5cf6', '#eab308'];

    return (
        <AdminLayout title="Laporan Keuangan">
            <Head title="Laporan Keuangan - Juita Laundry" />
            
            <div className="max-w-7xl mx-auto space-y-6 relative">
                
                {/* FILTER AREA */}
                <div className="bg-white rounded-xl shadow-sm border border-[#06b6d4]/30 p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Filter Periode</h3>
                    <div className="flex flex-col md:flex-row items-end gap-4">
                        <div className="flex-1 w-full">
                            <label className="block text-sm font-semibold text-gray-600 mb-1">Dari</label>
                            <input 
                                type="date" 
                                value={filters.start_date || ''} 
                                onChange={(e) => handleFilterChange('start_date', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00d2ff] outline-none text-gray-600" 
                            />
                        </div>
                        <div className="flex-1 w-full">
                            <label className="block text-sm font-semibold text-gray-600 mb-1">Sampai</label>
                            <input 
                                type="date" 
                                value={filters.end_date || ''} 
                                onChange={(e) => handleFilterChange('end_date', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00d2ff] outline-none text-gray-600" 
                            />
                        </div>
                        <div className="flex-1 w-full md:w-auto mt-4 md:mt-0">
                            <button 
                                onClick={() => setShowModal(true)}
                                className="w-full bg-[#00d2ff] hover:bg-[#00b8e6] text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center transition-colors shadow-sm"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                Tambah Pengeluaran
                            </button>
                        </div>
                    </div>
                </div>

                {/* KARTU RINGKASAN */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-[#06b6d4] flex flex-col justify-between">
                        <div className="flex items-center text-[#06b6d4] mb-2">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                            <span className="text-sm font-semibold text-gray-600">Total Pendapatan</span>
                        </div>
                        <h3 className="text-2xl font-bold text-[#06b6d4] truncate">{formatRp(summary.pendapatan)}</h3>
                    </div>

                    <div className="bg-white rounded-xl p-5 shadow-sm border border-[#f97316] flex flex-col justify-between">
                        <div className="flex items-center text-[#f97316] mb-2">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                            <span className="text-sm font-semibold text-gray-600">Total Pengeluaran</span>
                        </div>
                        <h3 className="text-2xl font-bold text-[#f97316] truncate">{formatRp(summary.pengeluaran)}</h3>
                    </div>

                    <div className="bg-white rounded-xl p-5 shadow-sm border border-[#14b8a6] flex flex-col justify-between">
                        <div className="flex items-center text-[#14b8a6] mb-2">
                            <span className="text-lg font-bold mr-2">$</span>
                            <span className="text-sm font-semibold text-gray-600">Net Profit</span>
                        </div>
                        <h3 className="text-2xl font-bold text-[#14b8a6] truncate">{formatRp(summary.profit)}</h3>
                    </div>

                    <div className="bg-white rounded-xl p-5 shadow-sm border border-[#06b6d4] flex flex-col justify-between">
                        <div className="flex items-center text-[#06b6d4] mb-2">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11h10M7 15h10M3 20a1 1 0 001 1h16a1 1 0 001-1V4a1 1 0 00-1-1H4a1 1 0 00-1 1v16z" /></svg>
                            <span className="text-sm font-semibold text-gray-600">Profit Margin</span>
                        </div>
                        <h3 className="text-3xl font-bold text-[#06b6d4]">{profitMargin}%</h3>
                    </div>
                </div>

                <div className="bg-[#00d26a] rounded-xl p-5 md:p-6 flex flex-col md:flex-row justify-between items-center shadow-sm mb-6 border border-[#00c060]">
                    <div className="text-white mb-4 md:mb-0 w-full text-center md:text-left">
                        <h3 className="font-bold text-lg flex items-center justify-center md:justify-start">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            Export Laporan Keuangan
                        </h3>
                        <p className="text-white/90 text-sm mt-1">Download laporan lengkap dalam format CSV</p>
                    </div>
                    <a
                        href={`/admin/financial-reports/export?start_date=${filters?.start_date || ''}&end_date=${filters?.end_date || ''}`}
                        className="bg-white text-[#00d26a] hover:bg-green-50 font-bold py-2.5 px-6 rounded-lg shadow transition-colors flex items-center text-sm w-full md:w-auto justify-center whitespace-nowrap"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        Export ke Sheets
                    </a>
                </div>

                {/* BAR CHART & LINE CHART */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-[#06b6d4]/30">
                        <h3 className="text-md font-bold text-gray-800 mb-4">Pendapatan vs Pengeluaran {titleSuffix}</h3>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={formattedChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} tickFormatter={formatYAxis} />
                                    <Tooltip 
                                        cursor={{ fill: '#f3f4f6' }} 
                                        formatter={(value) => formatRp(value)}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} 
                                        itemStyle={{fontSize: '12px', fontWeight: '600', paddingBottom: '4px'}}
                                    />
                                    <Legend iconType="square" wrapperStyle={{ fontSize: '11px', paddingTop: '15px' }} />
                                    {/* Bar dibikin tipis sesuai permintaan */}
                                    <Bar dataKey="Pendapatan" fill="#00d2ff" radius={[4, 4, 0, 0]} maxBarSize={20} />
                                    <Bar dataKey="Pengeluaran" fill="#f97316" radius={[4, 4, 0, 0]} maxBarSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-[#06b6d4]/30">
                        <h3 className="text-md font-bold text-gray-800 mb-4">Profit Harian {titleSuffix}</h3>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={formattedChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} tickFormatter={formatYAxis} />
                                    <Tooltip 
                                        formatter={(value) => formatRp(value)}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} 
                                        itemStyle={{fontSize: '12px', fontWeight: '600'}}
                                    />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '15px' }} />
                                    <Line type="monotone" dataKey="Profit" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 6 }} dot={{ strokeWidth: 2, r: 4, fill: '#3b82f6' }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-[#06b6d4]/30">
                        <h3 className="text-md font-bold text-gray-800 mb-4">Pengeluaran per Kategori</h3>
                        <div className="h-64 flex justify-center items-center">
                            {pieData.length === 0 ? (
                                <p className="text-gray-400 text-sm">Belum ada pengeluaran</p>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={2}
                                            dataKey="value"
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            labelLine={false}
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            formatter={(value) => formatRp(value)}
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} 
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>

                    {/* Pengeluaran Terbaru */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-[#06b6d4]/30 flex flex-col">
                        <h3 className="text-md font-bold text-gray-800 mb-4">Pengeluaran Terbaru</h3>
                        {expenses.length === 0 ? (
                            <div className="flex-1 flex justify-center items-center text-gray-400 text-sm py-10">
                                Belum ada pengeluaran pada rentang waktu ini
                            </div>
                        ) : (
                            <div className="space-y-3 overflow-y-auto max-h-64 pr-2">
                                {expenses.slice(0, 5).map(expense => {
                                    const [kategori, ...descArr] = expense.description.split(': ');
                                    const deskripsi = descArr.join(': ') || '-';
                                    return (
                                        <div key={expense.id} className="flex justify-between items-center p-3 border border-gray-100 bg-orange-50/50 rounded-lg hover:bg-orange-50 transition-colors">
                                            <div>
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-semibold">{kategori}</span>
                                                    <span className="text-[10px] text-gray-400">{new Date(expense.date).toLocaleDateString('id-ID')}</span>
                                                </div>
                                                <p className="text-xs text-gray-700 font-medium">{deskripsi}</p>
                                                <p className="text-sm font-bold text-orange-500 mt-1">{formatRp(expense.amount)}</p>
                                            </div>
                                            <div className="flex space-x-2">
                                                <a href="/admin/expenses" className="text-indigo-500 hover:text-indigo-700 transition-colors p-1" title="Edit">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                </a>
                                                <a href="/admin/expenses" className="text-red-500 hover:text-red-700 transition-colors p-1" title="Hapus">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </a>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* MODAL POP-UP TAMBAH PENGELUARAN */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm transition-opacity">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="bg-gradient-to-r from-[#00d2ff] to-[#00b8e6] px-6 py-5 text-white flex items-center">
                            <svg className="w-7 h-7 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                            <div>
                                <h2 className="text-xl font-bold">Tambah Pengeluaran Baru</h2>
                                <p className="text-xs text-sky-100 mt-0.5">Catat pengeluaran bisnis Anda</p>
                            </div>
                        </div>

                        <div className="p-6">
                            <form className="space-y-4" onSubmit={handleSimpanPengeluaran}>
                                <div>
                                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-1">
                                        <span className="text-[#00d2ff] mr-1 text-base">$</span> Kategori <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <select 
                                        value={formData.kategori}
                                        onChange={e => setFormData('kategori', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00d2ff] focus:border-[#00d2ff] outline-none transition-all text-gray-600 bg-white"
                                    >
                                        <option value="Operasional (Listrik, Air)">Operasional (Listrik, Air)</option>
                                        <option value="Bahan Baku (Deterjen, Pewangi)">Bahan Baku (Deterjen, Pewangi)</option>
                                        <option value="Gaji Karyawan">Gaji Karyawan</option>
                                        <option value="Lain-lain">Lain-lain</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Jumlah <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <input 
                                        type="number" 
                                        min="1"
                                        placeholder="50000" 
                                        value={formData.amount}
                                        onChange={e => setFormData('amount', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00d2ff] focus:border-[#00d2ff] outline-none transition-all" 
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Deskripsi <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <textarea 
                                        placeholder="Deskripsi pengeluaran" 
                                        rows="3" 
                                        value={formData.deskripsi}
                                        onChange={e => setFormData('deskripsi', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00d2ff] focus:border-[#00d2ff] outline-none transition-all resize-none" 
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-1">
                                        <svg className="w-4 h-4 text-[#00d2ff] mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        Tanggal <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <input 
                                        type="date" 
                                        value={formData.date}
                                        onChange={e => setFormData('date', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00d2ff] focus:border-[#00d2ff] outline-none transition-all text-gray-600" 
                                    />
                                </div>

                                <div className="flex gap-3 pt-4 mt-2">
                                    <button 
                                        type="button" 
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={processing || !formData.amount || !formData.deskripsi}
                                        className="flex-1 bg-[#00d2ff] hover:bg-[#00b8e6] text-white font-semibold py-3 px-4 rounded-xl transition-colors shadow-md disabled:opacity-50"
                                    >
                                        {processing ? 'Menyimpan...' : 'Simpan Data'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

        </AdminLayout>
    );
}