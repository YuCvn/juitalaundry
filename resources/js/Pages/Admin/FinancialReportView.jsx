import React, { useState } from 'react';
import { Head, usePage, useForm, router } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import { 
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

export default function FinancialReportView() {
    const { summary, expenses = [], filters, chartData } = usePage().props;
    const [showModal, setShowModal] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null); 

    const { data, setData, post, put, processing, reset, errors, transform, clearErrors } = useForm({
        kategori: 'Operasional (Listrik, Air)',
        deskripsi: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
    });

    transform((data) => ({
        description: `${data.kategori}: ${data.deskripsi}`,
        amount: data.amount,
        date: data.date,
    }));

    const openAddModal = () => {
        reset();
        clearErrors();
        setEditingExpense(null);
        setShowModal(true);
    };

    const openEditModal = (expense) => {
        const [kategori, ...descArr] = expense.description.split(': ');
        const deskripsi = descArr.join(': ') || '';

        clearErrors();
        setData({
            kategori: kategori || 'Lain-lain',
            deskripsi: deskripsi,
            amount: expense.amount,
            date: expense.date,
        });
        setEditingExpense(expense);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingExpense(null);
        reset();
        clearErrors();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (editingExpense) {
            put(`/admin/expenses/${editingExpense.id}`, {
                onSuccess: () => closeModal()
            });
        } else {
            post('/admin/expenses', {
                onSuccess: () => closeModal()
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus data pengeluaran ini?')) {
            router.delete(`/admin/expenses/${id}`, { preserveScroll: true });
        }
    };


    const handleFilterChange = (field, value) => {
        router.get('/admin/financial-reports', {
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

    const CATEGORY_COLORS = {
        'Operasional (Listrik, Air)': '#06b6d4',
        'Bahan Baku (Deterjen, Pewangi)': '#ec4899',
        'Gaji Karyawan': '#a855f7',
        'Lain-lain': '#f97316'
    };

    const isProfitNegative = summary.profit < 0;
    const profitColorClass = isProfitNegative ? 'text-red-500' : 'text-cyan-500';
    const profitBorderClass = isProfitNegative ? 'border-red-500' : 'border-cyan-500';

    return (
        <AdminLayout title="Laporan Keuangan">
            <Head title="Laporan Keuangan - Juita Laundry" />
            
            <div className="max-w-7xl mx-auto space-y-6 relative">
                
                {/* FILTER AREA */}
                <div className="bg-white rounded-xl shadow-sm border border-cyan-400 p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Filter Periode</h3>
                    <div className="flex flex-col md:flex-row items-end gap-4">
                        <div className="flex-1 w-full">
                            <label className="block text-sm font-semibold text-gray-600 mb-1">Dari</label>
                            <input 
                                type="date" 
                                value={filters.start_date || ''} 
                                onChange={(e) => handleFilterChange('start_date', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none text-gray-600" 
                            />
                        </div>
                        <div className="flex-1 w-full">
                            <label className="block text-sm font-semibold text-gray-600 mb-1">Sampai</label>
                            <input 
                                type="date" 
                                value={filters.end_date || ''} 
                                onChange={(e) => handleFilterChange('end_date', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none text-gray-600" 
                            />
                        </div>
                        <div className="flex-1 w-full md:w-auto mt-4 md:mt-0">
                            <button 
                                onClick={openAddModal}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center transition-colors shadow-sm"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                Tambah Pengeluaran
                            </button>
                        </div>
                    </div>
                </div>

                {/* KARTU RINGKASAN */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-cyan-500 flex flex-col justify-between">
                        <div className="flex items-center text-cyan-500 mb-2">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                            <span className="text-sm font-semibold text-gray-600">Total Pendapatan</span>
                        </div>
                        <h3 className="text-2xl font-bold text-cyan-500 truncate">{formatRp(summary.pendapatan)}</h3>
                    </div>

                    <div className="bg-white rounded-xl p-5 shadow-sm border border-orange-500 flex flex-col justify-between">
                        <div className="flex items-center text-orange-500 mb-2">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                            <span className="text-sm font-semibold text-gray-600">Total Pengeluaran</span>
                        </div>
                        <h3 className="text-2xl font-bold text-orange-500 truncate">{formatRp(summary.pengeluaran)}</h3>
                    </div>

                    <div className={`bg-white rounded-xl p-5 shadow-sm border ${profitBorderClass} flex flex-col justify-between`}>
                        <div className={`flex items-center ${profitColorClass} mb-2`}>
                            <span className="text-lg font-bold mr-2">$</span>
                            <span className="text-sm font-semibold text-gray-600">Net Profit</span>
                        </div>
                        <h3 className={`text-2xl font-bold ${profitColorClass} truncate`}>{formatRp(summary.profit)}</h3>
                    </div>

                    <div className="bg-white rounded-xl p-5 shadow-sm border border-cyan-500 flex flex-col justify-between">
                        <div className="flex items-center text-cyan-500 mb-2">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11h10M7 15h10M3 20a1 1 0 001 1h16a1 1 0 001-1V4a1 1 0 00-1-1H4a1 1 0 00-1 1v16z" /></svg>
                            <span className="text-sm font-semibold text-gray-600">Profit Margin</span>
                        </div>
                        <h3 className="text-3xl font-bold text-cyan-500">{profitMargin}%</h3>
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
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
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
                                    <Bar dataKey="Pendapatan" fill="#06b6d4" radius={[4, 4, 0, 0]} maxBarSize={20} />
                                    <Bar dataKey="Pengeluaran" fill="#f97316" radius={[4, 4, 0, 0]} maxBarSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
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
                    
                    {/* PIE CHART KATEGORI */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
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
                                            outerRadius={100} 
                                            dataKey="value"
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            labelLine={false}
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || '#f97316'} />
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
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
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
                                                <button 
                                                    onClick={() => openEditModal(expense)}
                                                    className="text-cyan-500 hover:text-cyan-700 hover:bg-cyan-50 transition-colors p-1.5 rounded-lg" 
                                                    title="Edit"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(expense.id)}
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors p-1.5 rounded-lg" 
                                                    title="Hapus"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* MODAL POP-UP TAMBAH / EDIT PENGELUARAN */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-opacity">
                    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        
                        <div className="px-5 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h2 className="text-sm font-semibold text-gray-800">
                                {editingExpense ? 'Edit Pengeluaran' : 'Pengeluaran Baru'}
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:bg-gray-200 hover:text-gray-600 rounded-full p-1 transition-colors">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="p-5">
                            <form className="space-y-3" onSubmit={handleSubmit}>
                                
                                <div>
                                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                                        Tanggal <span className="text-red-500 ml-0.5">*</span>
                                    </label>
                                    <input 
                                        type="date" 
                                        value={data.date}
                                        onChange={e => setData('date', e.target.value)}
                                        className="w-full px-3 py-2 text-xs border border-cyan-400 rounded-lg focus:ring-2 focus:ring-cyan-200 focus:border-cyan-500 outline-none transition-all text-gray-700" 
                                    />
                                    {errors.date && <span className="text-[10px] text-red-500 mt-1">{errors.date}</span>}
                                </div>

                                <div>
                                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                                        Kategori <span className="text-red-500 ml-0.5">*</span>
                                    </label>
                                    <select 
                                        value={data.kategori}
                                        onChange={e => setData('kategori', e.target.value)}
                                        className="w-full px-3 py-2 text-xs border border-cyan-400 rounded-lg focus:ring-2 focus:ring-cyan-200 focus:border-cyan-500 outline-none transition-all text-gray-700 bg-white"
                                    >
                                        <option value="Operasional (Listrik, Air)">Operasional (Listrik, Air)</option>
                                        <option value="Bahan Baku (Deterjen, Pewangi)">Bahan Baku (Deterjen, Pewangi)</option>
                                        <option value="Gaji Karyawan">Gaji Karyawan</option>
                                        <option value="Lain-lain">Lain-lain</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                                        Jumlah <span className="text-red-500 ml-0.5">*</span>
                                    </label>
                                    <input 
                                        type="number" 
                                        min="1"
                                        placeholder="Contoh: 50000" 
                                        value={data.amount}
                                        onChange={e => setData('amount', e.target.value)}
                                        className="w-full px-3 py-2 text-xs border border-cyan-400 rounded-lg focus:ring-2 focus:ring-cyan-200 focus:border-cyan-500 outline-none transition-all text-gray-700" 
                                    />
                                    {errors.amount && <span className="text-[10px] text-red-500 mt-1">{errors.amount}</span>}
                                </div>

                                <div>
                                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                                        Deskripsi <span className="text-red-500 ml-0.5">*</span>
                                    </label>
                                    <textarea 
                                        placeholder="Contoh: Beli token listrik" 
                                        rows="2" 
                                        value={data.deskripsi}
                                        onChange={e => setData('deskripsi', e.target.value)}
                                        className="w-full px-3 py-2 text-xs border border-cyan-400 rounded-lg focus:ring-2 focus:ring-cyan-200 focus:border-cyan-500 outline-none transition-all resize-none text-gray-700"
                                    ></textarea>
                                    {errors.description && <span className="text-[10px] text-red-500 mt-1">{errors.description}</span>}
                                </div>

                                <div className="flex gap-2 pt-3 mt-2">
                                    <button 
                                        type="button" 
                                        onClick={closeModal} 
                                        className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-600 font-semibold py-2 px-3 text-xs rounded-lg transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={processing}
                                        className="flex-1 disabled:opacity-50 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-semibold py-2 px-3 text-xs rounded-lg transition-all shadow-sm flex items-center justify-center"
                                    >
                                        {processing ? 'Loading...' : (editingExpense ? 'Update Data' : 'Simpan Data')}
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