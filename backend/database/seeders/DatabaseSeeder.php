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
                    'tanggal_masuk' => Carbon::now()->subMonths(rand(1, 10)),
                    'is_active' => true,
                ]);

                // 4. Create Payments (Jan-Jun only as per user request)
                for ($m = 1; $m <= 6; $m++) {
                    Payment::create([
                        'house_id' => $house->id,
                        'resident_id' => $resident->id,
                        'jenis_iuran' => 'satpam',
                        'bulan' => $m,
                        'tahun' => 2026,
                        'jumlah' => 100000,
                        'tanggal_bayar' => Carbon::create(2026, $m, rand(1, 10)),
                    ]);

                    Payment::create([
                        'house_id' => $house->id,
                        'resident_id' => $resident->id,
                        'jenis_iuran' => 'kebersihan',
                        'bulan' => $m,
                        'tahun' => 2026,
                        'jumlah' => 15000, // Matching study case: 15k
                        'tanggal_bayar' => Carbon::create(2026, $m, rand(1, 10)),
                    ]);
                }
            }
        }

        // 5. Balanced Expenses for Jan-Jun 2026
        $expenseCategories = [
            'Gaji Satpam' => 1000000,
            'Sampah & Kebersihan' => 200000,
            'Listrik Fasum' => 100000,
            'Kegiatan Warga' => 50000
        ];

        for ($m = 1; $m <= 6; $m++) {
            foreach ($expenseCategories as $cat => $baseAmount) {
                Expense::create([
                    'kategori' => $cat,
                    'deskripsi' => "$cat Bulan $m",
                    'jumlah' => $baseAmount + rand(-5000, 10000),
                    'tanggal' => Carbon::create(2026, $m, rand(5, 25)),
                    'bulan' => $m,
                    'tahun' => 2026,
                ]);
            }
        }
    }
}
