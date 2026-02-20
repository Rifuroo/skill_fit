<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Resident extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_lengkap',
        'foto_ktp',
        'status_penghuni',
        'nomor_telepon',
        'status_menikah',
    ];

    protected $casts = [
        'status_menikah' => 'boolean',
    ];

    public function houses()
    {
        return $this->belongsToMany(House::class, 'house_residents')
                    ->withPivot('tanggal_masuk', 'tanggal_keluar', 'is_active')
                    ->withTimestamps();
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
