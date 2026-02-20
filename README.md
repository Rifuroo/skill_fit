# SKILL FIT TEST - FULL STACK PROGRAMMER
## RT Management System

Project ini adalah implementasi studi kasus sistem manajemen administrasi RT untuk seleksi Full Stack Programmer di Jagoanhosting.

### �️ Tech Stack
*   **Backend**: Laravel 11
*   **Frontend**: React 18 (Vite)
*   **Database**: MySQL

---

## 💻 Panduan Instalasi

Pastikan sudah terinstall: **PHP >= 8.2**, **Composer**, **Node.js**, **NPM**, dan **MySQL**.

### 1. Inisialisasi
```bash
git clone https://github.com/Rifuroo/skill_fit.git
cd skill_fit
```

### 2. Setup Backend
1. Masuk ke folder backend: `cd backend`
2. Install dependensi: `composer install`
3. Copy env: `cp .env.example .env`
4. Sesuaikan database di `.env` (isi `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`).
5. Buat database kosong bernama `skill_fit` di MySQL.
6. Generate key & link:
   ```bash
   php artisan key:generate
   php artisan storage:link
   ```
7. Migrasi & Seed: `php artisan migrate:fresh --seed`
8. Jalankan API: `php artisan serve`
> API jalan di: **http://127.0.0.1:8000**

### 3. Setup Frontend
1. Buka terminal baru.
2. Masuk ke folder frontend: `cd frontend`
3. Install dependensi: `npm install`
4. Jalankan aplikasi: `npm run dev`
> Aplikasi jalan di: **http://localhost:5173**

---

## 📊 Entity Relationship Diagram (ERD)
![ERD](ERD.png)

---

## 📸 Rangkuman Fitur

### 1. Manajemen Penghuni
Fitur CRUD warga dengan upload foto KTP dan atribut lengkap (status nikah, jenis penghuni, dll).
<details>
  <summary>Klik untuk lihat Screenshot</summary>
  <br/>
  <img src="screenshots/residents_list.png" width="800" />
  <img src="screenshots/residents_modal.png" width="800" />
</details>

### 2. Manajemen Rumah & History
Monitoring 20 rumah dengan histori penempatan penghuni dan status iuran bulanan per rumah.
<details>
  <summary>Klik untuk lihat Screenshot</summary>
  <br/>
  <img src="screenshots/houses_grid.png" width="800" />
  <img src="screenshots/houses_management.png" width="800" />
  <img src="screenshots/houses_payment_status.png" width="800" />
  <img src="screenshots/houses_history.png" width="800" />
</details>

### 3. Pembayaran Iuran
Pencatatan iuran (Satpam & Kebersihan) dengan dukungan fitur pembayaran langsung 1 tahun.
<details>
  <summary>Klik untuk lihat Screenshot</summary>
  <br/>
  <img src="screenshots/payments_modal.png" width="800" />
</details>

### 4. Manajemen Pengeluaran
Pencatatan dana keluar (Gaji satpam, perbaikan, dll) untuk laporan transparansi kas.
<details>
  <summary>Klik untuk lihat Screenshot</summary>
  <br/>
  <img src="screenshots/expenses_list.png" width="800" />
</details>

### 5. Report & Dashboard
Grafik pemasukan/pengeluaran 1 tahun, saldo kas, dan detail transaksi bulanan (PDF ready).
<details>
  <summary>Klik untuk lihat Screenshot</summary>
  <br/>
  <img src="screenshots/dashboard.png" width="800" />
  <img src="screenshots/reports_view.png" width="800" />
  <p><a href="screenshots/reports_print.pdf">Lihat File PDF Laporan</a></p>
</details>
