<?php

namespace App\Http\Controllers;

use App\Models\House;
use App\Models\Resident;
use App\Models\HouseResident;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HouseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $houses = House::with('currentResidents')->get();
        return response()->json($houses);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nomor_rumah' => 'required|unique:houses',
            'status_rumah' => 'required|in:dihuni,tidak_dihuni',
        ]);

        $house = House::create($validated);
        return response()->json($house, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $house = House::with(['currentResidents', 'houseResidents.resident', 'payments'])->find($id);
        
        if (!$house) {
            return response()->json(['message' => 'House not found'], 404);
        }

        return response()->json($house);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $house = House::find($id);
        if (!$house) {
            return response()->json(['message' => 'House not found'], 404);
        }

        $validated = $request->validate([
            'nomor_rumah' => 'unique:houses,nomor_rumah,' . $id,
            'status_rumah' => 'in:dihuni,tidak_dihuni',
        ]);

        $house->update($validated);
        return response()->json($house);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        // Not explicitly required but good to have
        // Payment constraints prevent easy deletion
    }

    // Assign resident to house
    public function assignResident(Request $request, $id)
    {
        $house = House::find($id);
        if (!$house) return response()->json(['message' => 'House not found'], 404);

        $validated = $request->validate([
            'resident_id' => 'required|exists:residents,id',
            'tanggal_masuk' => 'required|date',
        ]);

        // Transaction to ensure data integrity
        DB::transaction(function () use ($house, $validated) {
            // Optional: Deactivate current residents if policy is single-resident per house
            // For now, allow multiple, but let's assume one head of family for simple payments
            
            // Add new resident
            HouseResident::create([
                'house_id' => $house->id,
                'resident_id' => $validated['resident_id'],
                'tanggal_masuk' => $validated['tanggal_masuk'],
                'is_active' => true,
            ]);

            // Auto update status rumah if needed
            if ($house->status_rumah === 'tidak_dihuni') {
                $house->update(['status_rumah' => 'dihuni']);
            }
        });

        return response()->json(['message' => 'Resident assigned successfully']);
    }

    // Remove resident (move out)
    public function removeResident(Request $request, $id)
    {
        $validated = $request->validate([
            'resident_id' => 'required|exists:residents,id',
            'tanggal_keluar' => 'required|date',
        ]);

        $houseResident = HouseResident::where('house_id', $id)
                            ->where('resident_id', $validated['resident_id'])
                            ->where('is_active', true)
                            ->first();

        if (!$houseResident) {
            return response()->json(['message' => 'Active resident not found in this house'], 404);
        }

        $houseResident->update([
            'is_active' => false,
            'tanggal_keluar' => $validated['tanggal_keluar'],
        ]);

        // Check if house is empty now
        $activeCount = HouseResident::where('house_id', $id)->where('is_active', true)->count();
        if ($activeCount === 0) {
            $house = House::find($id);
            $house->update(['status_rumah' => 'tidak_dihuni']);
        }

        return response()->json(['message' => 'Resident moved out successfully']);
    }

    public function history($id)
    {
        $history = HouseResident::with('resident')
                    ->where('house_id', $id)
                    ->orderBy('tanggal_masuk', 'desc')
                    ->get();
        
        return response()->json($history);
    }
}
