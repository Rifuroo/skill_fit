import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Download, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

const Reports = () => {
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/reports/monthly?month=${month}&year=${year}`);
                setData(res.data);
            } catch (error) {
                console.error("Failed to load report", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [month, year]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Laporan Bulanan</h1>
                <div className="flex space-x-2 print:hidden">
                    <select
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        className="border rounded-md px-3 py-2"
                    >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                            <option key={m} value={m}>{new Date(0, m - 1).toLocaleString('id-ID', { month: 'long' })}</option>
                        ))}
                    </select>
                    <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="border rounded-md px-3 py-2"
                    >
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                        <option value="2027">2027</option>
                    </select>
                    <button className="btn btn-secondary flex items-center" onClick={() => window.print()}>
                        <Download className="w-4 h-4 mr-2" /> Print
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="p-12 text-center text-gray-500">Loading report...</div>
            ) : data ? (
                <>
                    {/* Screen View */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:hidden">
                        <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 flex items-center">
                            <div className="bg-emerald-100 p-3 rounded-full mr-4 text-emerald-600">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-emerald-800">Total Pemasukan</h3>
                                <p className="text-2xl font-bold text-emerald-600 mt-1">
                                    Rp {parseInt(data.total_income).toLocaleString('id-ID')}
                                </p>
                            </div>
                        </div>
                        <div className="bg-red-50 p-6 rounded-xl border border-red-100 flex items-center">
                            <div className="bg-red-100 p-3 rounded-full mr-4 text-red-600">
                                <TrendingDown className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-red-800">Total Pengeluaran</h3>
                                <p className="text-2xl font-bold text-red-600 mt-1">
                                    Rp {parseInt(data.total_expense).toLocaleString('id-ID')}
                                </p>
                            </div>
                        </div>
                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex items-center">
                            <div className="bg-blue-100 p-3 rounded-full mr-4 text-blue-600">
                                <Wallet className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-blue-800">Sisa Saldo</h3>
                                <p className="text-2xl font-bold text-blue-600 mt-1">
                                    Rp {parseInt(data.balance).toLocaleString('id-ID')}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 print:hidden">
                        {/* Existing Screen Tables (Grid) */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                                <h3 className="font-semibold text-gray-800">Rincian Pemasukan</h3>
                                <span className="text-xs font-medium bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                                    {data.incomes.length} Transaksi
                                </span>
                            </div>
                            <div className="max-h-96 overflow-y-auto w-full">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-500 sticky top-0">
                                        <tr>
                                            <th className="px-6 py-2">Rumah</th>
                                            <th className="px-6 py-2">Jenis</th>
                                            <th className="px-6 py-2 text-right">Jumlah</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {data.incomes.map(inc => (
                                            <tr key={inc.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-3 font-medium">{inc.house.nomor_rumah}</td>
                                                <td className="px-6 py-3 capitalize text-gray-600">{inc.jenis_iuran}</td>
                                                <td className="px-6 py-3 text-right font-medium text-emerald-600">
                                                    Rp {parseInt(inc.jumlah).toLocaleString('id-ID')}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                                <h3 className="font-semibold text-gray-800">Rincian Pengeluaran</h3>
                                <span className="text-xs font-medium bg-red-100 text-red-700 px-2 py-1 rounded-full">
                                    {data.expenses.length} Transaksi
                                </span>
                            </div>
                            <div className="max-h-96 overflow-y-auto w-full">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-500 sticky top-0">
                                        <tr>
                                            <th className="px-6 py-2">Kategori</th>
                                            <th className="px-6 py-2">Tanggal</th>
                                            <th className="px-6 py-2 text-right">Jumlah</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {data.expenses.map(exp => (
                                            <tr key={exp.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-3 font-medium">{exp.kategori}</td>
                                                <td className="px-6 py-3 text-gray-500">{new Date(exp.tanggal).toLocaleDateString('id-ID')}</td>
                                                <td className="px-6 py-3 text-right font-medium text-red-600">
                                                    Rp {parseInt(exp.jumlah).toLocaleString('id-ID')}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* PRINT ONLY VIEW (Full Width Stacked) */}
                    <div className="hidden print:block space-y-8">
                        <div className="mb-6 border-b pb-4">
                            <h2 className="text-xl font-bold">Ringkasan Keuangan</h2>
                            <p className="text-sm text-gray-500">Bulan: {new Date(0, month - 1).toLocaleString('id-ID', { month: 'long' })} {year}</p>
                            <div className="flex space-x-8 mt-2">
                                <div>
                                    <span className="text-gray-500 text-sm">Total Masuk:</span>
                                    <p className="font-bold text-emerald-600">Rp {parseInt(data.total_income).toLocaleString('id-ID')}</p>
                                </div>
                                <div>
                                    <span className="text-gray-500 text-sm">Total Keluar:</span>
                                    <p className="font-bold text-red-600">Rp {parseInt(data.total_expense).toLocaleString('id-ID')}</p>
                                </div>
                                <div>
                                    <span className="text-gray-500 text-sm">Sisa Saldo:</span>
                                    <p className="font-bold text-blue-600">Rp {parseInt(data.balance).toLocaleString('id-ID')}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-2 text-emerald-800 border-b border-emerald-200 pb-1">Rincian Pemasukan</h3>
                            <table className="w-full text-sm text-left border-collapse">
                                <thead className="bg-gray-100 border-b">
                                    <tr>
                                        <th className="px-4 py-2 border">No. Rumah</th>
                                        <th className="px-4 py-2 border">Penghuni</th>
                                        <th className="px-4 py-2 border">Jenis Iuran</th>
                                        <th className="px-4 py-2 border text-right">Jumlah</th>
                                        <th className="px-4 py-2 border">Tanggal Bayar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.incomes.map(inc => (
                                        <tr key={inc.id} className="border-b">
                                            <td className="px-4 py-2 border">{inc.house.nomor_rumah}</td>
                                            <td className="px-4 py-2 border">{inc.resident?.nama_lengkap || '-'}</td>
                                            <td className="px-4 py-2 border capitalize">{inc.jenis_iuran}</td>
                                            <td className="px-4 py-2 border text-right">Rp {parseInt(inc.jumlah).toLocaleString('id-ID')}</td>
                                            <td className="px-4 py-2 border">{new Date(inc.tanggal_bayar).toLocaleDateString('id-ID')}</td>
                                        </tr>
                                    ))}
                                    <tr className="bg-emerald-50 font-bold">
                                        <td colSpan="3" className="px-4 py-2 border text-right">Total Pemasukan</td>
                                        <td className="px-4 py-2 border text-right">Rp {parseInt(data.total_income).toLocaleString('id-ID')}</td>
                                        <td className="border"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div>
                            <h3 className="font-bold text-lg mb-2 text-red-800 border-b border-red-200 pb-1">Rincian Pengeluaran</h3>
                            <table className="w-full text-sm text-left border-collapse">
                                <thead className="bg-gray-100 border-b">
                                    <tr>
                                        <th className="px-4 py-2 border">Tanggal</th>
                                        <th className="px-4 py-2 border">Kategori</th>
                                        <th className="px-4 py-2 border">Deskripsi</th>
                                        <th className="px-4 py-2 border text-right">Jumlah</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.expenses.map(exp => (
                                        <tr key={exp.id} className="border-b">
                                            <td className="px-4 py-2 border">{new Date(exp.tanggal).toLocaleDateString('id-ID')}</td>
                                            <td className="px-4 py-2 border">{exp.kategori}</td>
                                            <td className="px-4 py-2 border">{exp.deskripsi || '-'}</td>
                                            <td className="px-4 py-2 border text-right">Rp {parseInt(exp.jumlah).toLocaleString('id-ID')}</td>
                                        </tr>
                                    ))}
                                    <tr className="bg-red-50 font-bold">
                                        <td colSpan="3" className="px-4 py-2 border text-right">Total Pengeluaran</td>
                                        <td className="px-4 py-2 border text-right">Rp {parseInt(data.total_expense).toLocaleString('id-ID')}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    );
};

export default Reports;
