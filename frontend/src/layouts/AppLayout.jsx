import React from 'react';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

const AppLayout = () => {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <div className="print:hidden">
                <Sidebar />
            </div>
            <main className="flex-1 ml-64 p-8 overflow-x-hidden print:ml-0 print:p-0">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AppLayout;
