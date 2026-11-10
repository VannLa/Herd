// === 1. File: pam-frontend/src/App.vue ===
<script setup>
import { useRouter } from 'vue-router';
import api from './api/axios';

const router = useRouter();

const handleLogout = async () => {
    try {
        await api.post('/logout');
    } finally {
        localStorage.removeItem('pam_token');
        localStorage.removeItem('pam_user');
        router.push('/login');
    }
};
</script>

<template>
    <div>
        <nav style="background: #0f172a; color: white; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center;">
            <strong>💧 PAM Swadaya "Tirta Mandiri Perumahan"</strong>
            <div>
                <router-link to="/warga/tagihan" style="color: #38bdf8; margin-right: 16px;">Dashboard Warga</router-link>
                <router-link to="/petugas/meter" style="color: #38bdf8; margin-right: 16px;">Catat Meter (Petugas)</router-link>
                <button @click="handleLogout" style="background: #ef4444; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">
                    Logout
                </button>
            </div>
        </nav>
        <router-view />
    </div>
</template>

