<script setup>
import { ref, onMounted } from 'vue';
import api from '../api/axios';

const daftarWarga = ref([]);
const form = ref({
    warga_id: '',
    bulan_tahun: '2026-11',
    meter_awal: 0,
    meter_akhir: 0,
    tanggal_catat: new Date().toISOString().slice(0, 10)
});

const hasilTagihan = ref(null);
const pesanError = ref('');

onMounted(async () => {
    try {
        const res = await api.get('/warga');
        daftarWarga.value = res.data;
    } catch (err) {
        pesanError.value = 'Gagal mengambil daftar warga. Pastikan Anda login sebagai Petugas.';
    }
});

const submitMeteran = async () => {
    pesanError.value = '';
    hasilTagihan.value = null;
    try {
        const res = await api.post('/pencatatan-meter', form.value);
        hasilTagihan.value = res.data.tagihan;
    } catch (err) {
        // Tangkap pesan error validasi 422 (misal duplikasi periode bulan_tahun)
        const errors = err.response?.data?.errors;
        if (errors) {
            pesanError.value = Object.values(errors).flat().join(' ');
        } else {
            pesanError.value = err.response?.data?.message || 'Terjadi kesalahan saat menyimpan meteran.';
        }
    }
};
</script>

<template>
    <div style="max-width: 600px; margin: 30px auto; padding: 20px; border: 1px solid #cbd5e1; border-radius: 8px;">
        <h2>Form Pencatatan Meteran Air (Khusus Petugas)</h2>

        <div v-if="pesanError" style="background: #fef2f2; color: #991b1b; padding: 10px; border-radius: 6px; margin-bottom: 12px;">
            {{ pesanError }}
        </div>

        <div v-if="hasilTagihan" style="background: #f0fdf4; color: #166534; padding: 12px; border-radius: 6px; margin-bottom: 12px;">
            <strong>Berhasil! Tagihan Otomatis Terbit:</strong><br />
            No. Invoice: {{ hasilTagihan.nomor_tagihan }} | Total: Rp {{ hasilTagihan.total_tagihan.toLocaleString('id-ID') }}
        </div>

        <form @submit.prevent="submitMeteran">
            <div style="margin-bottom: 10px;">
                <label>Pilih Warga / Nomor Rumah:</label><br />
                <select v-model="form.warga_id" required style="width: 100%; padding: 8px;">
                    <option value="" disabled>-- Pilih Rumah Warga --</option>
                    <option v-for="w in daftarWarga" :key="w.id" :value="w.id">
                        Rumah {{ w.nomor_rumah }} — {{ w.nama_warga }}
                    </option>
                </select>
            </div>
            <div style="margin-bottom: 10px;">
                <label>Periode Bulan (YYYY-MM):</label><br />
                <input v-model="form.bulan_tahun" type="text" required placeholder="2026-11" style="width: 100%; padding: 8px;" />
            </div>
            <div style="display: flex; gap: 12px; margin-bottom: 10px;">
                <div style="flex: 1;">
                    <label>Meter Awal (m³):</label><br />
                    <input v-model.number="form.meter_awal" type="number" min="0" required style="width: 100%; padding: 8px;" />
                </div>
                <div style="flex: 1;">
                    <label>Meter Akhir (m³):</label><br />
                    <input v-model.number="form.meter_akhir" type="number" :min="form.meter_awal" required style="width: 100%; padding: 8px;" />
                </div>
            </div>
            <div style="margin-bottom: 14px;">
                <label>Tanggal Catat:</label><br />
                <input v-model="form.tanggal_catat" type="date" required style="width: 100%; padding: 8px;" />
            </div>
            <button type="submit" style="width: 100%; padding: 10px; background: #0284c7; color: white; border: none; border-radius: 6px; cursor: pointer;">
                Simpan Meteran & Terbitkan Tagihan
            </button>
        </form>
    </div>
</template>
