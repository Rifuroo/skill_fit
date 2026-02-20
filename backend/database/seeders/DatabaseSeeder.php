<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\House;
use App\Models\Resident;
use App\Models\HouseResident;
use App\Models\Payment;
use App\Models\Expense;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Admin User
        User::create([
            'name' => 'Pak RT',
            'email' => 'rt@example.com',
            'password' => bcrypt('password'),
        ]);

        // 2. Create 20 Houses
        $houses = [];
        for ($i = 1; $i <= 20; $i++) {
            // Study Case: 15 dihuni tetap, 5 lainnya (kontrak/kosong)
            // Kita buat 15 dihuni tetap, 3 dihuni kontrak, 2 kosong
            $status = $i <= 18 ? 'dihuni' : 'tidak_dihuni'; 
            $houses[] = House::create([
                'nomor_rumah' => 'A-' . $i,
                'status_rumah' => $status,
            ]);
        }

        $faker = \Faker\Factory::create('id_ID');

        // 3. Create Residents for occupied houses
        $residents = [];
        foreach ($houses as $index => $house) {
            if ($house->status_rumah === 'dihuni') {
                // Add historical resident for A-1
                if ($index === 0) {
                    $former = Resident::create([
                        'nama_lengkap' => 'Budi Mantan Penghuni',
                        'status_penghuni' => 'kontrak',
                        'nomor_telepon' => '081299998888',
                        'status_menikah' => true,
                    ]);
                    HouseResident::create([
                        'house_id' => $house->id,
                        'resident_id' => $former->id,
                        'tanggal_masuk' => Carbon::now()->subMonths(24),
                        'tanggal_keluar' => Carbon::now()->subMonths(12),
                        'is_active' => false,
                    ]);
                }

                $isTetap = ($index < 15); // 1-15 Tetap, 16-18 Kontrak
                $resident = Resident::create([
                    'nama_lengkap' => $faker->firstName() . ' ' . $faker->lastName(),
                    'status_penghuni' => $isTetap ? 'tetap' : 'kontrak',
                    'nomor_telepon' => $faker->numerify('08##########'),
                    'status_menikah' => $faker->boolean(),
                ]);
                $residents[] = $resident;

                HouseResident::create([
                    'house_id' => $house->id,
                    'resident_id' => $resident->id,
                    'tanggal_masuk' => Carbon::now()->subMonths(rand(12, 24)), // Modified for realism: already stayed for a while
                    'is_active' => true,
                ]);

                // 4. Create Payments (Jan-Jun 2026)
                for ($m = 1; $m <= 6; $m++) {
                    // Satpam: 100k (Usually monthly as per study case)
                    Payment::create([
                        'house_id' => $house->id,
                        'resident_id' => $resident->id,
                        'jenis_iuran' => 'satpam',
                        'bulan' => $m,
                        'tahun' => 2026,
                        'jumlah' => 100000,
                        'tanggal_bayar' => Carbon::create(2026, $m, rand(1, 15)),
                    ]);

                    // Kebersihan: 15k
                    // Study Case: "Terkadang terdapat penghuni yang membayar iuran bulanan 1 tahun"
                    // Let's make A-1 and A-2 pay for 12 months in January
                    if ($index < 2) {
                        if ($m === 1) {
                            for ($yearMonth = 1; $yearMonth <= 12; $yearMonth++) {
                                Payment::create([
                                    'house_id' => $house->id,
                                    'resident_id' => $resident->id,
                                    'jenis_iuran' => 'kebersihan',
                                    'bulan' => $yearMonth,
                                    'tahun' => 2026,
                                    'jumlah' => 15000,
                                    'tanggal_bayar' => Carbon::create(2026, 1, rand(1, 10)),
                                ]);
                            }
                        }
                        // Skip other months for A-1/A-2 kebersihan
                        continue;
                    }

                    // For others, pay monthly
                    Payment::create([
                        'house_id' => $house->id,
                        'resident_id' => $resident->id,
                        'jenis_iuran' => 'kebersihan',
                        'bulan' => $m,
                        'tahun' => 2026,
                        'jumlah' => 15000,
                        'tanggal_bayar' => Carbon::create(2026, $m, rand(1, 15)),
                    ]);
                }
            }
        }

        // 5. Realistic Expenses for Jan-Jun 2026
        // Fixed monthly expenses
        $fixedExpenses = [
            'Gaji Satpam' => 1000000,
            'Token Listrik Pos Satpam' => 150000,
            'Biaya Sampah' => 200000,
        ];

        for ($m = 1; $m <= 6; $m++) {
            foreach ($fixedExpenses as $cat => $amount) {
                Expense::create([
                    'kategori' => $cat,
                    'deskripsi' => "$cat Bulan $m",
                    'jumlah' => $amount,
                    'tanggal' => Carbon::create(2026, $m, rand(1, 5)),
                    'bulan' => $m,
                    'tahun' => 2026,
                ]);
            }

            // Incidental Expenses (from Study Case: Perbaikan jalan, selokan, dll)
            if ($m === 2) { // February
                Expense::create([
                    'kategori' => 'Perbaikan Selokan',
                    'deskripsi' => 'Pembersihan dan perbaikan selokan blok A',
                    'jumlah' => 350000,
                    'tanggal' => Carbon::create(2026, 2, 10),
                    'bulan' => 2,
                    'tahun' => 2026,
                ]);
            }

            if ($m === 5) { // May
                Expense::create([
                    'kategori' => 'Perbaikan Jalan',
                    'deskripsi' => 'Tambal lubang jalan depan gapura',
                    'jumlah' => 600000,
                    'tanggal' => Carbon::create(2026, 5, 20),
                    'bulan' => 5,
                    'tahun' => 2026,
                ]);
            }

            // Occasional "Kegiatan Warga"
            if ($m === 3 || $m === 6) {
                Expense::create([
                    'kategori' => 'Kegiatan Warga',
                    'deskripsi' => 'Fogging nyamuk dan kerja bakti',
                    'jumlah' => 250000,
                    'tanggal' => Carbon::create(2026, $m, 15),
                    'bulan' => $m,
                    'tahun' => 2026,
                ]);
            }
        }
    }
}
