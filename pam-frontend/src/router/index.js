import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import WargaDashboardView from '../views/WargaDashboardView.vue';
import PetugasMeterView from '../views/PetugasMeterView.vue';

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: LoginView },
    { path: '/warga/tagihan', component: WargaDashboardView, meta: { requiresAuth: true } },
    { path: '/petugas/meter', component: PetugasMeterView, meta: { requiresAuth: true } },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Navigation Guard: Cegah akses halaman internal jika belum memiliki pam_token di localStorage
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('pam_token');
    if (to.meta.requiresAuth && !token) {
        next('/login');
    } else {
        next();
    }
});

export default router;
