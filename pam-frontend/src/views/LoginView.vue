<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api/axios';

const router = useRouter();
const email = ref('');
const password = ref('');
const errorMsg = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
    errorMsg.value = '';
    isLoading.value = true;
    try {
        const response = await api.post('/login', {
            email: email.value,
            password: password.value
        });

        // Simpan Bearer Token & Profil User ke localStorage
        const { access_token, user } = response.data;
        localStorage.setItem('pam_token', access_token);
        localStorage.setItem('pam_user', JSON.stringify(user));

        // Arahkan halaman berdasarkan Role RBAC dari Backend
        if (user.role === 'petugas') {
            router.push('/petugas/meter');
        } else {
            router.push('/warga/tagihan');
        }
    } catch (err) {
        errorMsg.value = err.response?.data?.message || 'Gagal terhubung ke server API.';
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <div style="max-width: 420px; margin: 60px auto; padding: 24px; border: 1px solid #cbd5e1; border-radius: 8px;">
        <h2 style="margin-top: 0; color: #0f172a;">Login PAM Swadaya</h2>
        <p style="color: #64748b; font-size: 14px;">Tirta Mandiri Perumahan — Sistem Terdistribusi</p>

        <div v-if="errorMsg" style="background: #fef2f2; color: #991b1b; padding: 10px; border-radius: 6px; margin-bottom: 12px;">
            {{ errorMsg }}
        </div>

        <form @submit.prevent="handleLogin">
            <div style="margin-bottom: 12px;">
                <label>Email Akun:</label><br />
                <input v-model="email" type="email" required placeholder="petugas@pam.test / budi@warga.test" style="width: 100%; padding: 8px;" />
            </div>
            <div style="margin-bottom: 16px;">
                <label>Kata Sandi:</label><br />
                <input v-model="password" type="password" required placeholder="password123" style="width: 100%; padding: 8px;" />
            </div>
            <button type="submit" :disabled="isLoading" style="width: 100%; padding: 10px; background: #0284c7; color: white; border: none; border-radius: 6px; cursor: pointer;">
                {{ isLoading ? 'Memverifikasi Kredensial...' : 'Masuk Aplikasi' }}
            </button>
        </form>
    </div>
</template>