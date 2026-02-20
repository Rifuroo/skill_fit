import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, Building, Wallet, Receipt, PieChart } from 'lucide-react';
import clsx from 'clsx';

const Sidebar = () => {
    const navItems = [
        { name: 'Dashboard', path: '/', icon: Home },
        { name: 'Penghuni', path: '/residents', icon: Users },
        { name: 'Rumah', path: '/houses', icon: Building },
        { name: 'Pembayaran', path: '/payments', icon: Wallet },
        { name: 'Pengeluaran', path: '/expenses', icon: Receipt },
        { name: 'Laporan', path: '/reports', icon: PieChart },
    ];

    return (
        <aside className="w-64 bg-primary text-white h-screen fixed left-0 top-0 overflow-y-auto">
            <div className="p-6">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                    RT Manager
                </h1>
                <p className="text-sm text-gray-400 mt-1">Sistem Iuran Warga</p>
            </div>

            <nav className="mt-6 px-4">
                <ul className="space-y-2">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    clsx(
                                        'flex items-center px-4 py-3 rounded-lg transition-colors',
                                        isActive
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                                            : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                                    )
                                }
                            >
                                <item.icon className="w-5 h-5 mr-3" />
                                <span className="font-medium">{item.name}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="absolute bottom-0 w-full p-6 border-t border-slate-800">
                <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center font-bold text-slate-900">
                        RT
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium">Pak RT</p>
                        <p className="text-xs text-gray-500">Admin</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
