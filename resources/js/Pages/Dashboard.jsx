import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '../Layouts/AdminLayout';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
    // Data jelek doang
    const chartData = [
        { name: '8 Mar', Pendapatan: 0, Pengeluaran: 0, Profit: 0 },
        { name: '9 Mar', Pendapatan: 0, Pengeluaran: 0, Profit: 0 },
        { name: '10 Mar', Pendapatan: 0, Pengeluaran: 0, Profit: 0 },
        { name: '11 Mar', Pendapatan: 0, Pengeluaran: 0, Profit: 0 },
        { name: '12 Mar', Pendapatan: 0, Pengeluaran: 0, Profit: 0 },
        { name: '13 Mar', Pendapatan: 0, Pengeluaran: 0, Profit: 0 },
        { name: '14 Mar', Pendapatan: 0, Pengeluaran: 0, Profit: 0 },
    ];

    return (
        <AdminLayout title="Dashboard">
            
            {/* --- Top Cards --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-[#3b82f6] rounded-xl p-5 text-white shadow-sm flex flex-col justify-between hover:-translate-y-1 transition-transform">
                    <div>
                        <p className="text-sm text-blue-100">Total Orders</p>
                        <h3 className="text-3xl font-bold mt-1">0</h3>
                    </div>
                    <div className="flex justify-between items-end mt-4">
                        <span className="text-xs text-blue-200">0 aktif</span>
                        <svg className="w-8 h-8 text-blue-300 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                    </div>
                </div>

                <div className="bg-[#06b6d4] rounded-xl p-5 text-white shadow-sm flex flex-col justify-between hover:-translate-y-1 transition-transform">
                    <div>
                        <p className="text-sm text-cyan-100">Total Pelanggan</p>
                        <h3 className="text-3xl font-bold mt-1">0</h3>
                    </div>
                    <div className="flex justify-end mt-4">
                         <svg className="w-8 h-8 text-cyan-300 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    </div>
                </div>

                <div className="bg-[#10b981] rounded-xl p-5 text-white shadow-sm flex flex-col justify-between hover:-translate-y-1 transition-transform">
                    <div>
                        <p className="text-sm text-emerald-100">Pendapatan Bulan Ini</p>
                        <h3 className="text-3xl font-bold mt-1">Rp 0</h3>
                    </div>
                    <div className="flex justify-end mt-4">
                        <svg className="w-8 h-8 text-emerald-300 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                    </div>
                </div>

                <div className="bg-[#2563eb] rounded-xl p-5 text-white shadow-sm flex flex-col justify-between hover:-translate-y-1 transition-transform">
                    <div>
                        <p className="text-sm text-blue-200">Pengeluaran Bulan Ini</p>
                        <h3 className="text-3xl font-bold mt-1">Rp 0</h3>
                    </div>
                    <div className="flex justify-end mt-4">
                        <svg className="w-8 h-8 text-blue-300 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                </div>
            </div>

            {/* --- Quick Actions--- */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
                <h3 className="text-md font-bold text-gray-800 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Link ke Order Baru */}
                    <Link href="/orders/create" className="bg-[#10b981] hover:bg-emerald-600 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center md:justify-start transition-colors shadow-sm">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Order Baru
                    </Link>
                    
                    {/* Link ke Membership */}
                    <Link href="/membership" className="bg-[#06b6d4] hover:bg-cyan-600 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center md:justify-start transition-colors shadow-sm">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                        Membership
                    </Link>

                    {/* Link ke Laporan Keuangan */}
                    <Link href="/laporan-keuangan" className="bg-[#3b82f6] hover:bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center md:justify-start transition-colors shadow-sm">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                        Lihat Laporan
                    </Link>
                </div>
            </div>

            {/* --- Area Grafik --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-md font-bold text-gray-800 mb-4">Pendapatan & Pengeluaran (7 Hari Terakhir)</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                                <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                <Legend iconType="square" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                                <Bar dataKey="Pendapatan" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                                <Bar dataKey="Pengeluaran" fill="#06b6d4" radius={[4, 4, 0, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-md font-bold text-gray-800 mb-4">Net Profit (7 Hari Terakhir)</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                                <Line type="monotone" dataKey="Profit" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 6 }} dot={{ strokeWidth: 2, r: 4, fill: '#3b82f6' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* --- Top 5 Pelanggan, belum beckend --- */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
                <h3 className="text-md font-bold text-gray-800 mb-4">Top 5 Pelanggan</h3>
                <div className="flex justify-center items-center h-24 text-gray-400 text-sm">
                    Belum ada data pelanggan
                </div>
            </div>

        </AdminLayout>
    );
}