import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Home, User, History, Plus, CreditCard } from 'lucide-react';
import Modal from '../components/ui/Modal';

const Houses = () => {
    const [houses, setHouses] = useState([]);
    const [residents, setResidents] = useState([]); // For assignment dropdown
    const [selectedHouse, setSelectedHouse] = useState(null);
    const [history, setHistory] = useState([]);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [viewingPayments, setViewingPayments] = useState(false);

    // CRUD State
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        nomor_rumah: '',
        status_rumah: 'tidak_dihuni',
    });

    // Resident Assignment State
    const [assignData, setAssignData] = useState({
        resident_id: '',
        tanggal_masuk: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchHouses();
        fetchResidents();
    }, []);

    const fetchHouses = async () => {
        try {
            const res = await api.get('/houses');
            setHouses(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchResidents = async () => {
        try {
            const res = await api.get('/residents');
            setResidents(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const viewHistory = async (house) => {
        setSelectedHouse(house);
        try {
            const res = await api.get(`/houses/${house.id}/history`);
            setHistory(res.data);
            setIsHistoryOpen(true);
        } catch (error) {
            alert('Gagal memuat riwayat');
        }
    };

    // House CRUD
    const openAddModal = () => {
        setFormData({ id: null, nomor_rumah: '', status_rumah: 'tidak_dihuni' });
        setSelectedHouse(null);
        setPaymentStatus(null);
        setIsFormModalOpen(true);
    };

    const openEditModal = (house) => {
        setFormData({
            id: house.id,
            nomor_rumah: house.nomor_rumah,
            status_rumah: house.status_rumah
        });
        setSelectedHouse(house);
        setViewingPayments(false);
        fetchPaymentStatus(house.id);
        setIsFormModalOpen(true);
    };

    const fetchPaymentStatus = async (houseId) => {
        try {
            const res = await api.get(`/payments-status?house_id=${houseId}&year=${new Date().getFullYear()}`);
            setPaymentStatus(res.data);
        } catch (error) {
            console.error("Gagal ambil status pembayaran", error);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.id) {
                await api.put(`/houses/${formData.id}`, formData);
            } else {
                await api.post('/houses', formData);
            }
            fetchHouses();
            setIsFormModalOpen(false);
        } catch (error) {
            alert('Gagal menyimpan rumah: ' + (error.response?.data?.message || error.message));
        }
    };

    // Resident Management
    const handleAssignResident = async (e) => {
        e.preventDefault();
        if (!selectedHouse) return;
        try {
            await api.post(`/houses/${selectedHouse.id}/assign-resident`, assignData);
            alert('Penghuni berhasil ditambahkan');
            fetchHouses();
            // Refresh selected house data for UI update if needed, but fetchHouses covers main list.
            // If we want to update the modal view (if we list residents there), we might need to re-fetch specific house.
            if (selectedHouse) {
                const updatedHouse = await api.get(`/houses/${selectedHouse.id}`);
                setSelectedHouse(updatedHouse.data);
            }
        } catch (error) {
            alert('Gagal menambahkan penghuni: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleRemoveResident = async (residentId) => {
        if (!confirm('Keluarkan penghuni ini dari rumah?')) return;
        try {
            await api.post(`/houses/${selectedHouse.id}/remove-resident`, {
                resident_id: residentId,
                tanggal_keluar: new Date().toISOString().split('T')[0]
            });
            alert('Penghuni berhasil dikeluarkan');
            fetchHouses();
            if (selectedHouse) {
                const updatedHouse = await api.get(`/houses/${selectedHouse.id}`);
                setSelectedHouse(updatedHouse.data);
            }
        } catch (error) {
            alert('Gagal mengeluarkan penghuni');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manajemen Rumah</h1>
                <button onClick={openAddModal} className="btn btn-primary flex items-center">
                    <Plus className="w-4 h-4 mr-2" /> Tambah Rumah
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {houses.map(house => (
                    <div key={house.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 p-2 text-xs font-bold text-white rounded-bl-lg ${house.status_rumah === 'dihuni' ? 'bg-green-500' : 'bg-gray-400'
                            }`}>
                            {house.status_rumah.toUpperCase()}
                        </div>

                        {/* Edit Button overlay */}
                        <button
                            onClick={() => openEditModal(house)}
                            className="absolute top-2 right-16 px-2 py-1 bg-gray-100 rounded text-gray-600 hover:bg-blue-100 hover:text-blue-600 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            Edit / Kelola
                        </button>

                        <div className="flex items-center mb-4 mt-2">
                            <div className="bg-blue-100 p-3 rounded-full text-blue-600 mr-4">
                                <Home className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">{house.nomor_rumah}</h3>
                                <p className="text-sm text-gray-500">Blok A</p>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-4">
                            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Penghuni Saat Ini</h4>
                            {house.current_residents && house.current_residents.length > 0 ? (
                                house.current_residents.map(res => (
                                    <div key={res.id} className="flex items-center justify-between text-sm mb-1">
                                        <div className="flex items-center text-gray-700">
                                            <User className="w-4 h-4 mr-2 text-gray-400" />
                                            {res.nama_lengkap}
                                        </div>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${res.status_penghuni === 'tetap' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                                            }`}>
                                            {res.status_penghuni}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-400 italic">Tidak ada penghuni</p>
                            )}
                        </div>

                        <button
                            onClick={() => viewHistory(house)}
                            className="w-full mt-4 btn btn-secondary text-sm flex justify-center items-center"
                        >
                            <History className="w-4 h-4 mr-2" />
                            Riwayat Penghuni
                        </button>
                    </div>
                ))}
            </div>

            {/* Modal Edit / Add House */}
            <Modal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} title={formData.id ? `Edit Rumah ${formData.nomor_rumah}` : "Tambah Rumah"}>
                <div className="space-y-6">
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nomor Rumah</label>
                            <input
                                type="text"
                                required
                                className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border"
                                value={formData.nomor_rumah}
                                onChange={e => setFormData({ ...formData, nomor_rumah: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Status Rumah</label>
                            <select
                                className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border"
                                value={formData.status_rumah}
                                onChange={e => setFormData({ ...formData, status_rumah: e.target.value })}
                            >
                                <option value="dihuni">Dihuni</option>
                                <option value="tidak_dihuni">Tidak Dihuni</option>
                            </select>
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="btn btn-primary text-sm">Simpan Data Rumah</button>
                        </div>
                    </form>

                    {formData.id && (
                        <>
                            {/* Payment Status Tab Toggle */}
                            <div className="flex border-b mb-4">
                                <button
                                    onClick={() => setViewingPayments(false)}
                                    className={`px-4 py-2 text-sm font-medium ${!viewingPayments ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                                >
                                    Kelola Penghuni
                                </button>
                                <button
                                    onClick={() => setViewingPayments(true)}
                                    className={`px-4 py-2 text-sm font-medium ${viewingPayments ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                                >
                                    Status Iuran {new Date().getFullYear()}
                                </button>
                            </div>

                            {!viewingPayments ? (
                                <>
                                    {/* List Current in Modal */}
                                    <div className="bg-gray-50 p-3 rounded mb-4">
                                        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Penghuni Aktif</h4>
                                        {selectedHouse?.current_residents?.length > 0 ? (
                                            selectedHouse.current_residents.map(res => (
                                                <div key={res.id} className="flex justify-between items-center bg-white p-2 rounded border mb-1">
                                                    <span>{res.nama_lengkap}</span>
                                                    <button
                                                        onClick={() => handleRemoveResident(res.id)}
                                                        className="text-red-500 text-xs hover:underline"
                                                    >
                                                        Keluarkan
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-400">Rumah kosong.</p>
                                        )}
                                    </div>

                                    {/* Assign Form */}
                                    <form onSubmit={handleAssignResident} className="bg-blue-50 p-4 rounded">
                                        <h4 className="text-sm font-semibold text-blue-800 mb-2">Tambah Penghuni Baru</h4>
                                        <div className="space-y-2">
                                            <select
                                                className="w-full border p-2 rounded text-sm"
                                                value={assignData.resident_id}
                                                onChange={e => setAssignData({ ...assignData, resident_id: e.target.value })}
                                                required
                                            >
                                                <option value="">Pilih Warga...</option>
                                                {residents.map(r => (
                                                    <option key={r.id} value={r.id}>{r.nama_lengkap} ({r.status_penghuni})</option>
                                                ))}
                                            </select>
                                            <input
                                                type="date"
                                                className="w-full border p-2 rounded text-sm"
                                                value={assignData.tanggal_masuk}
                                                onChange={e => setAssignData({ ...assignData, tanggal_masuk: e.target.value })}
                                                required
                                            />
                                            <button type="submit" className="w-full btn btn-primary text-sm">Masukan ke Rumah</button>
                                        </div>
                                    </form>
                                </>
                            ) : (
                                <div className="space-y-4">
                                    <div className="text-xs text-gray-500 mb-2 italic">* Menampilkan status pembayaran tahun berjalan</div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="border rounded overflow-hidden">
                                            <div className="bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border-b">IURAN SATPAM</div>
                                            <div className="p-2 grid grid-cols-6 gap-1">
                                                {Array.from({ length: 12 }, (_, i) => (i + 1).toString()).map(m => {
                                                    const s = paymentStatus?.satpam ? paymentStatus.satpam[String(m)] : 'belum';
                                                    return (
                                                        <div
                                                            key={m}
                                                            className={`text-[10px] text-center p-1 rounded font-bold border transition-all ${s === 'lunas' ? 'bg-green-500 text-white border-green-600 shadow-sm' : 'bg-red-500 text-white border-red-600 shadow-sm'}`}
                                                            title={`Bulan ${m}: ${s?.toUpperCase()}`}
                                                        >
                                                            {m}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                        <div className="border rounded overflow-hidden">
                                            <div className="bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border-b">IURAN KEBERSIHAN</div>
                                            <div className="p-2 grid grid-cols-6 gap-1">
                                                {Array.from({ length: 12 }, (_, i) => (i + 1).toString()).map(m => {
                                                    const s = paymentStatus?.kebersihan ? paymentStatus.kebersihan[String(m)] : 'belum';
                                                    return (
                                                        <div
                                                            key={m}
                                                            className={`text-[10px] text-center p-1 rounded font-bold border transition-all ${s === 'lunas' ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm' : 'bg-red-500 text-white border-red-600 shadow-sm'}`}
                                                            title={`Bulan ${m}: ${s?.toUpperCase()}`}
                                                        >
                                                            {m}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4 text-[10px] text-gray-500 mt-2">
                                        <div className="flex items-center"><div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div> Lunas</div>
                                        <div className="flex items-center"><div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div> Belum Lunas</div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </Modal>

            {/* Modal History */}
            <Modal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} title={`Riwayat Penghuni: ${selectedHouse?.nomor_rumah}`}>
                <div className="space-y-4">
                    {history.length === 0 ? (
                        <p className="text-center text-gray-500">Belum ada riwayat penghuni.</p>
                    ) : (
                        history.map((h, idx) => (
                            <div key={idx} className="flex items-start border-b border-gray-100 pb-2">
                                <div className="bg-gray-100 p-2 rounded-full mr-3">
                                    <User className="w-4 h-4 text-gray-600" />
                                </div>
                                <div>
                                    <div className="flex items-center justify-between">
                                        <p className="font-medium text-gray-800">{h.resident.nama_lengkap}</p>
                                        <span className={`text-[10px] px-2 rounded-full font-bold uppercase ${h.resident.status_penghuni === 'tetap' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                                            }`}>
                                            {h.resident.status_penghuni}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        {h.tanggal_masuk} — {h.tanggal_keluar || 'Sekarang'}
                                    </p>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${h.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {h.is_active ? 'PENGHUNI AKTIF' : 'MANTAN PENGHUNI'}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default Houses;
