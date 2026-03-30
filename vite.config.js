import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react'; // Pastikan plugin react dipanggil

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'], // Ubah jadi .jsx di sini
            refresh: true,
        }),
        react(), // Tambahkan fungsi react() di sini
    ],
});