<script setup>
import { ref, onMounted } from 'vue';
import api from '../api/axios';

const daftarTagihan = ref([]);
const pesanInfo = ref('');
const user = JSON.parse(localStorage.getItem('pam_user') || '{}');

const muatTagihan = async () => {
    try {
        const res = await api.get('/tagihan');
        // Laravel API Resource membungkus koleksi di dalam properti data
        daftarTagihan.value = res.data.data || res.data;
    } catch (err) {
        pesanInfo.value = 'Gagal memuat daftar tagihan.';
    }
};

const bayarTagihan = async (idTagihan) => {
    pesanInfo.value = '';
    try {
        const res = await api.patch(`/tagihan/${idTagihan}/bayar`);
        pesanInfo.value = res.data.message;
        await muatTagihan(); // Refresh tabel setelah lunas
    } catch (err) {
        pesanInfo.value = err.response?.data?.message || 'Gagal memproses pembayaran.';
    }
};

onMounted(() => muatTagihan());
</script>

<template>
    <div style="max-width: 820px; margin: 30px auto; padding: 20px;">
        <h2>Dashboard Tagihan Air Warga</h2>
        <p>Selamat datang, <strong>{{ user.name }}</strong> (Nomor Rumah: <strong>{{ user.nomor_rumah || '-' }}</strong>)</p>

        <div v-if="pesanInfo" style="background: #f0fdf4; color: #166534; padding: 10px; border-radius: 6px; margin-bottom: 14px;">
            {{ pesanInfo }}
        </div>

        <table border="1" cellpadding="10" cellspacing="0" style="width: 100%; border-collapse: collapse;">
            <thead style="background: #0f172a; color: white;">
                <tr>
                    <th>No. Tagihan</th>
                    <th>Pemakaian (m³)</th>
                    <th>Total Tagihan</th>
                    <th>Tenggat</th>
                    <th>Status</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in daftarTagihan" :key="item.id">
                    <td>{{ item.nomor_tagihan }}</td>
                    <td>{{ item.pemakaian_kubik }} m³</td>
                    <td><strong>{{ item.formatted_total }}</strong></td>
                    <td>{{ item.tanggal_tenggat }}</td>
                    <td>
                        <span :style="{ color: item.status_pembayaran === 'lunas' ? '#16a34a' : '#dc2626', fontWeight: 'bold' }">
                            {{ item.status_pembayaran.toUpperCase() }}
                        </span>
                    </td>
                    <td>
                        <button v-if="item.status_pembayaran === 'belum_bayar'" @click="bayarTagihan(item.id)"
                                style="background: #16a34a; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">
                            Bayar Sekarang
                        </button>
                        <span v-else style="color: #64748b;">Lunas ({{ item.tanggal_bayar }})</span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
