import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../services/api';
import { Wallet, TrendingDown, CreditCard } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
        <div className={`p-3 rounded-full ${color} text-white mr-4`}>
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        </div>
    </div>
);

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/reports/dashboard');
                setData(response.data);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;
    if (!data) return <div className="p-8 text-center text-red-500">Failed to load data</div>;

    const formatCurrency = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(val);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Pemasukan (Tahun Ini)"
                    value={formatCurrency(data.summary.total_pemasukan)}
                    icon={Wallet}
                    color="bg-emerald-500"
                />
                <StatCard
                    title="Total Pengeluaran (Tahun Ini)"
                    value={formatCurrency(data.summary.total_pengeluaran)}
                    icon={TrendingDown}
                    color="bg-red-500"
                />
                <StatCard
                    title="Sisa Saldo"
                    value={formatCurrency(data.summary.sisa_saldo)}
                    icon={CreditCard}
                    color="bg-blue-500"
                />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Grafik Keuangan {data.year}</h2>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.chart_data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="bulan" />
                            <YAxis tickFormatter={(val) => `Rp${val / 1000}k`} />
                            <Tooltip formatter={(val) => formatCurrency(val)} />
                            <Legend />
                            <Bar dataKey="pemasukan" fill="#10b981" name="Pemasukan" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="pengeluaran" fill="#ef4444" name="Pengeluaran" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
