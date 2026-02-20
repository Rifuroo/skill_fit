<?php

namespace App\Http\Controllers;

use App\Models\Resident;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ResidentController extends Controller
{
    public function index()
    {
        return response()->json(Resident::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_lengkap' => 'required|string',
            'foto_ktp' => 'nullable|image|max:2048', // 2MB Max
            'status_penghuni' => 'required|in:tetap,kontrak',
            'nomor_telepon' => 'required|string',
            'status_menikah' => 'required|boolean',
        ]);

        if ($request->hasFile('foto_ktp')) {
            $path = $request->file('foto_ktp')->store('ktp_photos', 'public');
            $validated['foto_ktp'] = $path;
        }

        $resident = Resident::create($validated);
        return response()->json($resident, 201);
    }

    public function show($id)
    {
        $resident = Resident::with(['houses', 'payments'])->find($id);
        if (!$resident) return response()->json(['message' => 'Resident not found'], 404);
        return response()->json($resident);
    }

    public function update(Request $request, $id)
    {
        $resident = Resident::find($id);
        if (!$resident) return response()->json(['message' => 'Resident not found'], 404);

        $validated = $request->validate([
            'nama_lengkap' => 'string',
            'foto_ktp' => 'nullable|image|max:2048',
            'status_penghuni' => 'in:tetap,kontrak',
            'nomor_telepon' => 'string',
            'status_menikah' => 'boolean',
        ]);

        if ($request->hasFile('foto_ktp')) {
            // Delete old photo
            if ($resident->foto_ktp) {
                Storage::disk('public')->delete($resident->foto_ktp);
            }
            $path = $request->file('foto_ktp')->store('ktp_photos', 'public');
            $validated['foto_ktp'] = $path;
        }

        $resident->update($validated);
        return response()->json($resident);
    }
}
