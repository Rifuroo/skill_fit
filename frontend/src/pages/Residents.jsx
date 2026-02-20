import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, Edit, Phone, User, Trash2 } from 'lucide-react';
import Modal from '../components/ui/Modal';

const Residents = () => {
    const [residents, setResidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        nama_lengkap: '',
        status_penghuni: 'tetap',
        nomor_telepon: '',
        status_menikah: false,
    });

    const fetchResidents = async () => {
        try {
            const response = await api.get('/residents');
            setResidents(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResidents();
    }, []);

    const [ktpFile, setKtpFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = new FormData();
        payload.append('nama_lengkap', formData.nama_lengkap);
        payload.append('status_penghuni', formData.status_penghuni);
        payload.append('nomor_telepon', formData.nomor_telepon);
        payload.append('status_menikah', formData.status_menikah ? '1' : '0');
        if (ktpFile) {
            payload.append('foto_ktp', ktpFile);
        }

        try {
            if (formData.id) {
                // Update
                payload.append('_method', 'PUT');
                await api.post(`/residents/${formData.id}`, payload, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                // Create
                await api.post('/residents', payload, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            fetchResidents();
            setIsModalOpen(false);
            setKtpFile(null);
            setFormData({
                nama_lengkap: '',
                status_penghuni: 'tetap',
                nomor_telepon: '',
                status_menikah: false,
            });
        } catch (error) {
            alert('Gagal menyimpan data: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus penghuni ini?')) {
            try {
                await api.delete(`/residents/${id}`);
                fetchResidents();
            } catch (error) {
                alert('Gagal menghapus data');
            }
        }
    };

    const handleEdit = (resident) => {
        setFormData({
            ...resident,
            status_menikah: Boolean(resident.status_menikah)
        });
        setKtpFile(null); // Reset file input
        setIsModalOpen(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Data Penghuni</h1>
                <button
                    onClick={() => {
                        setFormData({
                            nama_lengkap: '',
                            status_penghuni: 'tetap',
                            nomor_telepon: '',
                            status_menikah: false,
                        });
                        setKtpFile(null);
                        setIsModalOpen(true);
                    }}
                    className="flex items-center btn btn-primary"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Penghuni
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-sm uppercase font-semibold">
                        <tr>
                            <th className="px-6 py-4">Nama Lengkap</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Telepon</th>
                            <th className="px-6 py-4">Menikah</th>
                            <th className="px-6 py-4">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan="5" className="px-6 py-4 text-center">Loading...</td></tr>
                        ) : residents.map((resident) => (
                            <tr key={resident.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">{resident.nama_lengkap}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${resident.status_penghuni === 'tetap'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-orange-100 text-orange-700'
                                        }`}>
                                        {resident.status_penghuni}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{resident.nomor_telepon}</td>
                                <td className="px-6 py-4 text-gray-600">
                                    {resident.status_menikah ? 'Ya' : 'Belum'}
                                </td>
                                <td className="px-6 py-4 flex space-x-2">
                                    <button
                                        onClick={() => handleEdit(resident)}
                                        className="text-gray-400 hover:text-blue-600"
                                    >
                                        <Edit className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(resident.id)}
                                        className="text-gray-400 hover:text-red-600"
                                        title="Hapus Penghuni"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={formData.id ? "Edit Penghuni" : "Tambah Penghuni Baru"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                        <input
                            type="text"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                            value={formData.nama_lengkap}
                            onChange={(e) => setFormData({ ...formData, nama_lengkap: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Status Penghuni</label>
                        <select
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                            value={formData.status_penghuni}
                            onChange={(e) => setFormData({ ...formData, status_penghuni: e.target.value })}
                        >
                            <option value="tetap">Tetap</option>
                            <option value="kontrak">Kontrak</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nomor Telepon</label>
                        <input
                            type="text"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                            value={formData.nomor_telepon}
                            onChange={(e) => setFormData({ ...formData, nomor_telepon: e.target.value })}
                        />
                    </div>

                    {/* KTP Upload Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Foto KTP</label>
                        <input
                            type="file"
                            accept="image/*"
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            onChange={(e) => setKtpFile(e.target.files[0])}
                        />
                        {formData.foto_ktp && !ktpFile && (
                            <p className="text-xs text-gray-500 mt-1">Foto KTP saat ini sudah ada. Upload baru untuk mengganti.</p>
                        )}
                    </div>

                    <div>
                        <label className="flex items-center mt-4">
                            <input
                                type="checkbox"
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                checked={formData.status_menikah}
                                onChange={(e) => setFormData({ ...formData, status_menikah: e.target.checked })}
                            />
                            <span className="ml-2 text-sm text-gray-600">Sudah Menikah</span>
                        </label>
                    </div>
                    <div className="flex justify-end pt-4">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary mr-2">Batal</button>
                        <button type="submit" className="btn btn-primary">Simpan</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Residents;
