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

## 📸 Rangkuman Fitur (Studi Kasus)

### 1. Dashboard Keuangan
Visualisasi ringkasan arus kas perumahan dalam satu layar utama.
*   **Grafik**: Visualisasi bar chart Pemasukan vs Pengeluaran selama 1 tahun (Jan-Jun Lunas).
*   **Summary**: Informasi total saldo kas kumulatif yang tersedia saat ini.
<details>
  <summary>Klik untuk lihat Screenshot</summary>
  <br/>
  <img src="screenshots/dashboard.png" width="800" />
</details>

### 2. Mengelola Penghuni
Manajemen data warga dengan atribut lengkap sesuai requirement.
*   **Action**: Menambah/Mengubah data penghuni.
*   **Atribut**: Nama Lengkap, Foto KTP (Upload), Status Kontrak/Tetap, Nomor Telepon, dan Status Pernikahan.
<details>
  <summary>Klik untuk lihat Screenshot</summary>
  <br/>
  <img src="screenshots/residents_list.png" width="800" />
  <img src="screenshots/residents_modal.png" width="800" />
</details>

### 3. Mengelola Rumah & Historis
Manajemen **20 Rumah** (15 Hunian Tetap, 5 Sisanya Kontrak/Kosong).
*   **Status**: Monitoring status rumah (**Dihuni** atau **Tidak Dihuni**).
*   **Historical**: Mencatat riwayat penghuni lama (Contoh: Budi Mantan Penghuni di A-1).
*   **Status Iuran**: Tracking pembayaran iuran (Januari - Juni 2026 diset Lunas sebagai demo).
<details>
  <summary>Klik untuk lihat Screenshot</summary>
  <br/>
  <img src="screenshots/houses_grid.png" width="800" />
  <img src="screenshots/houses_management.png" width="800" />
  <img src="screenshots/houses_payment_status.png" width="800" />
  <img src="screenshots/houses_history.png" width="800" />
</details>

### 4. Mengelola Pembayaran Iuran
Pencatatan iuran wajib: **Satpam (100k)** dan **Kebersihan (15k)**.
*   **Fitur**: Mendukung opsi pembayaran langsung **1 Tahun/12 Bulan**.
<details>
  <summary>Klik untuk lihat Screenshot</summary>
  <br/>
  <img src="screenshots/payments_modal.png" width="800" />
</details>

### 5. Mengelola Pengeluaran
Pencatatan pengeluaran operasional perumahan untuk transparansi kas RT.
*   **Kategori**: Gaji Satpam, Sampah, Listrik Fasum, dan Kegiatan Warga.
<details>
  <summary>Klik untuk lihat Screenshot</summary>
  <br/>
  <img src="screenshots/expenses_list.png" width="800" />
</details>

### 6. Laporan Detail & Cetak
Rincian transaksi bulanan yang dapat difilter dan dicetak.
*   **Detail**: Laporan rincian pemasukan dan pengeluaran untuk bulan tertentu.
*   **Print**: Layout dioptimalkan untuk kebutuhan cetak/PDF.
<details>
  <summary>Klik untuk lihat Screenshot</summary>
  <br/>
  <img src="screenshots/reports_view.png" width="800" />
  <p><a href="screenshots/reports_print.pdf">Lihat File PDF Laporan</a></p>
</details>
