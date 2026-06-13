# Capstone Project Kelompok 4 - Juita Laundry 

Juita Laundry adalah aplikasi sistem manajemen kasir dan operasional laundry berbasis web. Aplikasi ini dirancang untuk mempermudah pengelolaan pesanan, manajemen pelanggan (membership), pencatatan pengeluaran, hingga pembuatan laporan keuangan.

**Live App / Demo:** [https://juitalaundry.sainzcloud.my.id/login](https://juitalaundry.sainzcloud.my.id/login)

<br>
<div align="center">
  <img src="public/images/logo.png" alt="Logo Juita Laundry" width="200">
</div>
<br>

Aplikasi ini dibangun menggunakan arsitektur *Single Page Application* (SPA) dengan teknologi **Laravel**, **Inertia.js**, dan **React** untuk memberikan pengalaman antarmuka yang cepat, modern, dan interaktif tanpa perlu *reload* halaman.

**Anggota Kelompok:**
1. Yudi Andika Pratama - [D1A230412 - Programmer]
2. Tri Meiliyani Kurnia - [D1A230426 - Database]
3. Ananda Romy Julio - [D1A230420 - UI/UX]
4. Syifa Mutaalia - [D1A231004 - DataAnalys]
5. Rohidin - [D1A230408 - ProjectManager]

## Teknologi yang Digunakan
* **Backend:** Laravel 11.x
* **Frontend:** React.js
* **Routing & Bridge:** Inertia.js
* **Styling:** Tailwind CSS & PostCSS
* **Bundler:** Vite
* **Database:** MySQL / PostgreSQL

## Fitur Utama

Aplikasi ini membagi hak akses ke dalam dua peran utama melalui sistem Middleware (`RoleMiddleware`):

### 1. Admin
Memiliki kontrol penuh atas laporan dan manajemen sistem:
* **Dashboard Admin:** Ringkasan statistik operasional laundry (`DashboardAdminView.jsx`).
* **Manajemen Kasir:** Mengelola akun staf kasir (`CashierController.php`, `CashierView.jsx`).
* **Layanan (Services):** Menambah, mengubah, atau menghapus jenis layanan laundry beserta harganya (`ServiceController.php`, `ServicesView.jsx`).
* **Pengeluaran (Expense):** Mencatat pengeluaran operasional toko (`ExpenseController.php`, `ExpenseView.jsx`).
* **Laporan Keuangan:** Melihat dan mencetak laporan pendapatan dan pengeluaran (`FinancialReportController.php`, `FinancialReportView.jsx`).

### 2. Kasir (Cashier)
Berfokus pada transaksi dan operasional harian:
* **Dashboard Kasir:** Tampilan antarmuka utama untuk kasir (`DashboardCashierView.jsx`).
* **Manajemen Pesanan:** Membuat pesanan baru (`CreateOrderView.jsx`) dan mengedit status pesanan (`EditOrderView.jsx`).
* **Membership:** Mengelola data pelanggan yang tergabung dalam keanggotaan/membership (`MembershipController.php`).
* **Riwayat Transaksi:** Melihat riwayat transaksi yang sudah selesai (`HistoryController.php`).
* **Cetak Nota:** Fitur untuk mencetak nota pelanggan (`print/nota.blade.php`).

## Struktur Proyek Terkini
Proyek ini membedakan penamaan *View* secara eksplisit (`*View.jsx`) pada sisi React untuk menghindari tumpang tindih nama dengan Model PHP.

* `app/Models/` : Berisi representasi tabel database (`Order`, `Service`, `Membership`, `FinancialReport`, dll).
* `app/Http/Controllers/` : Logika bisnis yang memproses data dan mengirimkannya ke tampilan melalui Inertia.
* `resources/js/Pages/` : Tampilan antarmuka pengguna (UI) yang ditulis dalam React.js.
* `resources/views/` : File template standar Laravel, termasuk file root `app.blade.php` dan desain cetak `nota.blade.php`.

## Panduan Instalasi Lokal (Bagi Developer)

Jika Anda ingin menjalankan atau mengembangkan aplikasi ini secara lokal, pastikan Anda sudah menginstal **PHP (>= 8.2)**, **Composer**, **Node.js**, dan database **MySQL**.

1. **Clone repositori ini:**
   ```bash
   git clone [https://github.com/YuCvn/juitalaundry](https://github.com/YuCvn/juitalaundry)
pindah ke Folder terbaru
    ```bash
   cd juitalaundry

2. Instal dependensi PHP (Backend):

    ```bash
    composer install

2. Instal dependensi Node.js (Frontend):
    ```bash
    npm install

4. Konfigurasi Environment:
Salin file konfigurasi environment standar.
    ```bash
    cp .env.example .env
    
Buka file `.env` dan sesuaikan koneksi database Anda:
   ```ini
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=juita_laundry
   DB_USERNAME=root
   DB_PASSWORD=
   ```

6. Generate Application Key:
    ```bash
    php artisan key:generate

7. Migrasi dan Seeding Database:
Perintah ini akan membuat tabel-tabel di database (users, services, orders, dll) dan mengisi data awal (akun admin default, dsb).
    ```bash
    php artisan migrate --seed

8. Kompilasi Aset Frontend (Vite):
Untuk tahap pengembangan (development):
    ```bash
    npm run dev

9. Jalankan Server Lokal:
Buka terminal baru dan jalankan server web internal Laravel:
    ```bash
    php artisan serve

Aplikasi pengembangan kini dapat diakses di http://localhost:8000.

Keamanan
Aplikasi ini dilengkapi dengan middleware XssSanitization bawaan untuk mencegah injeksi Cross-Site Scripting (XSS) pada seluruh form input pengguna.