import axios from 'axios';

// 1. Inisialisasi instance Axios dengan Base URL dari environment variable
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://tirta.test/api',
    timeout: 10000, // Timeout 10 detik
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
});

// 2. REQUEST INTERCEPTOR: Otomatis sisipkan Bearer Token sebelum request dikirim
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('pam_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 3. RESPONSE INTERCEPTOR: Tangani otomatis jika Token kedaluwarsa / dicabut (HTTP 401)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Bersihkan kredensial lokal jika token sudah tidak valid di server
            localStorage.removeItem('pam_token');
            localStorage.removeItem('pam_user');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
