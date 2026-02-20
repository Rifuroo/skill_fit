<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('house_id')->constrained()->onDelete('cascade');
            $table->foreignId('resident_id')->constrained()->onDelete('cascade'); // Who paid
            $table->enum('jenis_iuran', ['satpam', 'kebersihan']);
            $table->integer('bulan'); // 1-12
            $table->integer('tahun');
            $table->decimal('jumlah', 10, 2);
            $table->date('tanggal_bayar');
            $table->timestamps();

            // Prevent duplicate payment for same house, type, month, year
            $table->unique(['house_id', 'jenis_iuran', 'bulan', 'tahun']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
