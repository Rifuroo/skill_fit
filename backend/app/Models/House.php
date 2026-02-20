<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class House extends Model
{
    use HasFactory;

    protected $fillable = [
        'nomor_rumah',
        'status_rumah',
    ];

    public function residents()
    {
        return $this->belongsToMany(Resident::class, 'house_residents')
                    ->withPivot('tanggal_masuk', 'tanggal_keluar', 'is_active')
                    ->withTimestamps();
    }

    public function currentResidents()
    {
        return $this->belongsToMany(Resident::class, 'house_residents')
                    ->wherePivot('is_active', true)
                    ->withPivot('tanggal_masuk');
    }

    public function houseResidents()
    {
        return $this->hasMany(HouseResident::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
