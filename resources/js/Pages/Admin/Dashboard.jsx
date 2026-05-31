import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
    const { 
        totalOrders = 0, 
        totalPelanggan = 0, 
        totalPendapatan = 0, 
        pengeluaran = 0, 
        topCustomers = [], 
        chartData 
    } = usePage().props;

    const formatRp = (angka) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka || 0);
    };

    // Format Y-Axis agar tidak terlalu panjang (contoh: 100000 -> 100k)
    const formatYAxis = (value) => {
        if (value >= 1000) return `${value / 1000}k`;
        return value;
    };

    // Mapping data dari backend agar sesuai dengan format Recharts
    const formattedChartData = chartData?.labels.map((label, index) => ({
        name: label,
        Pendapatan: chartData.revenues[index],
        Pengeluaran: chartData.expenses[index],
        Profit: chartData.profits[index],
    })) || [];

    return (
        <AdminLayout title="Dashboard">
            <Head title="Dashboard Admin - Juita Laundry" />

            <div className="mb-6"></div>

            {/* --- TOP CARDS STATISTIK --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-[#3b82f6] rounded-xl p-5 text-white shadow-sm flex justify-between items-center">
                    <div>
                        <p className="text-[11px] font-semibold text-blue-100 mb-1 uppercase tracking-wider">Total Orders</p>
                        <h3 className="text-3xl font-bold">{totalOrders}</h3>
                        <p className="text-[10px] text-blue-200 mt-1">Pesanan Selesai</p>
                    </div>
                    <svg className="w-10 h-10 text-blue-200 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                </div>

                <div className="bg-[#06b6d4] rounded-xl p-5 text-white shadow-sm flex justify-between items-center">
                    <div>
                        <p className="text-[11px] font-semibold text-cyan-100 mb-1 uppercase tracking-wider">Total Pelanggan</p>
                        <h3 className="text-3xl font-bold">{totalPelanggan}</h3>
                    </div>
                    <svg className="w-10 h-10 text-cyan-200 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                </div>

                <div className="bg-[#10b981] rounded-xl p-5 text-white shadow-sm flex justify-between items-center">
                    <div>
                        <p className="text-[11px] font-semibold text-emerald-100 mb-1 uppercase tracking-wider">Pendapatan Keseluruhan</p>
                        <h3 className="text-xl font-bold truncate pr-2">{formatRp(totalPendapatan)}</h3>
                    </div>
                    <svg className="w-10 h-10 text-emerald-200 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                </div>

                <div className="bg-[#2563eb] rounded-xl p-5 text-white shadow-sm flex justify-between items-center">
                    <div>
                        <p className="text-[11px] font-semibold text-blue-100 mb-1 uppercase tracking-wider">Pengeluaran Keseluruhan</p>
                        <h3 className="text-xl font-bold truncate pr-2">{formatRp(pengeluaran)}</h3>
                    </div>
                    <svg className="w-10 h-10 text-blue-200 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
            </div>

            {/* --- GRAFIK AREA --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                
                {/* Grafik Bar: Pendapatan & Pengeluaran */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 min-h-[300px] flex flex-col">
                    <h4 className="text-sm font-bold text-gray-800 mb-4">Pendapatan & Pengeluaran (7 Hari Terakhir)</h4>
                    <div className="flex-1 w-full h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={formattedChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#9ca3af'}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#9ca3af'}} tickFormatter={formatYAxis} />
                                
                                {/* Tooltip Diperbarui */}
                                <Tooltip 
                                    cursor={{fill: '#f9fafb'}} 
                                    formatter={(value) => formatRp(value)} 
                                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', padding: '10px'}} 
                                    itemStyle={{fontSize: '11px', fontWeight: '600', paddingBottom: '4px'}}
                                    labelStyle={{fontSize: '11px', color: '#6b7280', marginBottom: '6px', fontWeight: 'bold'}}
                                />
                                
                                <Legend iconType="circle" wrapperStyle={{fontSize: '11px', paddingTop: '10px'}} />
                                <Bar dataKey="Pendapatan" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                <Bar dataKey="Pengeluaran" fill="#06b6d4" radius={[4, 4, 0, 0]} maxBarSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Grafik Line: Net Profit */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 min-h-[300px] flex flex-col">
                    <h4 className="text-sm font-bold text-gray-800 mb-4">Net Profit (7 Hari Terakhir)</h4>
                    <div className="flex-1 w-full h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={formattedChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#9ca3af'}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#9ca3af'}} tickFormatter={formatYAxis} />
                                
                                {/* Tooltip Diperbarui */}
                                <Tooltip 
                                    formatter={(value) => formatRp(value)} 
                                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', padding: '10px'}} 
                                    itemStyle={{fontSize: '11px', fontWeight: '600'}}
                                    labelStyle={{fontSize: '11px', color: '#6b7280', marginBottom: '6px', fontWeight: 'bold'}}
                                />
                                
                                <Legend iconType="circle" wrapperStyle={{fontSize: '11px', paddingTop: '10px'}} />
                                <Line type="monotone" dataKey="Profit" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

            {/* --- TOP 5 PELANGGAN --- */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <h4 className="text-sm font-bold text-gray-800">Top 5 Pelanggan</h4>
                </div>
                
                <div className="p-4 flex flex-col gap-3">
                    {topCustomers.length === 0 ? (
                        <p className="text-xs text-gray-500 text-center py-6">Belum ada riwayat pelanggan yang selesai.</p>
                    ) : (
                        topCustomers.map((customer, index) => (
                            <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-white hover:bg-blue-50/50 transition-colors shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                                        {index + 1}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-gray-800">{customer.nama}</span>
                                        <span className="text-[10px] text-gray-500 mt-0.5">{customer.total_orders} orders</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-xs font-bold text-blue-600">{formatRp(customer.total_spent)}</span>
                                    <span className="text-[9px] text-gray-400 font-medium mt-0.5">Total belanja</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

        </AdminLayout>
    );
}