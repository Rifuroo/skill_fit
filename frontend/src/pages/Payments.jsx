import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import Modal from '../components/ui/Modal';

const Payments = () => {
    const [payments, setPayments] = useState([]);
    const [houses, setHouses] = useState([]);
    const [residents, setResidents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        house_id: '',
        resident_id: '',
        jenis_iuran: 'satpam',
        tahun: new Date().getFullYear(),
        bayar_tahunan: false,
        bulan: new Date().getMonth() + 1,
        jumlah: 100000,
        tanggal_bayar: new Date().toISOString().split('T')[0]
    });

    const fetchData = async () => {
        try {
            const [payRes, houseRes, resRes] = await Promise.all([
                api.get('/payments'),
                api.get('/houses'),
                api.get('/residents')
            ]);
            setPayments(payRes.data);
            setHouses(houseRes.data);
            setResidents(resRes.data);
        } catch (error) {
            console.error("Gagal ambil data pembayaran", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        let payload = { ...formData };
        if (payload.bayar_tahunan) {
            payload.bulan = Array.from({ length: 12 }, (_, i) => i + 1);
        }

        // Remove helper field
        delete payload.bayar_tahunan;

        try {
            await api.post('/payments', payload);
            alert('Pembayaran berhasil disimpan!');
            setIsModalOpen(false);
            const res = await api.get('/payments');
            setPayments(res.data);
        } catch (error) {
            alert('Gagal menyimpan pembayaran: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleHouseChange = (e) => {
        const houseId = e.target.value;
        setFormData({ ...formData, house_id: houseId });
        // Logic to auto-select resident if house has one could go here
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Pembayaran Iuran</h1>
                <button onClick={() => setIsModalOpen(true)} className="btn btn-primary flex items-center">
                    <Plus className="w-4 h-4 mr-2" /> Catat Pembayaran
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-sm uppercase font-semibold">
                        <tr>
                            <th className="px-6 py-4">Rumah</th>
                            <th className="px-6 py-4">Penghuni</th>
                            <th className="px-6 py-4">Jenis</th>
                            <th className="px-6 py-4">Periode</th>
                            <th className="px-6 py-4">Jumlah</th>
                            <th className="px-6 py-4">Tanggal</th>
                            <th className="px-6 py-4">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {payments.map(pay => (
                            <tr key={pay.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium">{pay.house?.nomor_rumah}</td>
                                <td className="px-6 py-4">{pay.resident?.nama_lengkap}</td>
                                <td className="px-6 py-4 capitalize">{pay.jenis_iuran}</td>
                                <td className="px-6 py-4">{pay.bulan}/{pay.tahun}</td>
                                <td className="px-6 py-4 text-green-600 font-medium">Rp {parseInt(pay.jumlah).toLocaleString('id-ID')}</td>
                                <td className="px-6 py-4 text-gray-500">{new Date(pay.tanggal_bayar).toLocaleDateString('id-ID')}</td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={async () => {
                                            if (confirm('Hapus pembayaran ini?')) {
                                                try {
                                                    await api.delete(`/payments/${pay.id}`);
                                                    const res = await api.get('/payments');
                                                    setPayments(res.data);
                                                } catch (e) {
                                                    alert('Gagal menghapus');
                                                }
                                            }
                                        }}
                                        className="text-gray-400 hover:text-red-600"
                                        title="Hapus Pembayaran"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Input Pembayaran">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Rumah</label>
                            <select className="w-full border rounded p-2" onChange={handleHouseChange} required>
                                <option value="">Pilih Rumah</option>
                                {houses.map(h => (
                                    <option key={h.id} value={h.id}>{h.nomor_rumah}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Penghuni</label>
                            <select className="w-full border rounded p-2" onChange={e => setFormData({ ...formData, resident_id: e.target.value })} required>
                                <option value="">Pilih Penghuni</option>
                                {residents.map(r => (
                                    <option key={r.id} value={r.id}>{r.nama_lengkap}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Jenis Iuran</label>
                            <select
                                className="w-full border rounded p-2"
                                value={formData.jenis_iuran}
                                onChange={e => {
                                    const jenis = e.target.value;
                                    setFormData({
                                        ...formData,
                                        jenis_iuran: jenis,
                                        jumlah: jenis === 'satpam' ? 100000 : 15000
                                    });
                                }}
                            >
                                <option value="satpam">Satpam (100k)</option>
                                <option value="kebersihan">Kebersihan (15k)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Jumlah (per bulan)</label>
                            <input
                                type="number"
                                className="w-full border rounded p-2 bg-gray-50"
                                value={formData.jumlah}
                                readOnly
                            />
                        </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                        <label className="flex items-center mb-2 font-medium text-blue-800">
                            <input
                                type="checkbox"
                                className="mr-2"
                                checked={formData.bayar_tahunan}
                                onChange={e => setFormData({ ...formData, bayar_tahunan: e.target.checked })}
                            />
                            Bayar Langsung 1 Tahun?
                        </label>

                        {!formData.bayar_tahunan && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm mb-1">Bulan</label>
                                    <select
                                        className="w-full border rounded p-2"
                                        value={formData.bulan}
                                        onChange={e => setFormData({ ...formData, bulan: parseInt(e.target.value) })}
                                    >
                                        {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                            <option key={m} value={m}>{new Date(0, m - 1).toLocaleString('id-ID', { month: 'long' })}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Tahun</label>
                                    <input
                                        type="number"
                                        className="w-full border rounded p-2"
                                        value={formData.tahun}
                                        onChange={e => setFormData({ ...formData, tahun: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}
                        {formData.bayar_tahunan && (
                            <p className="text-sm text-blue-600">
                                Total yang harus dibayar: <b>Rp {(formData.jumlah * 12).toLocaleString('id-ID')}</b>
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Tanggal Bayar</label>
                        <input
                            type="date"
                            className="w-full border rounded p-2"
                            value={formData.tanggal_bayar}
                            onChange={e => setFormData({ ...formData, tanggal_bayar: e.target.value })}
                            required
                        />
                    </div>

                    <div className="flex justify-end pt-2">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary mr-2">Batal</button>
                        <button type="submit" className="btn btn-primary">Simpan Pembayaran</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Payments;
