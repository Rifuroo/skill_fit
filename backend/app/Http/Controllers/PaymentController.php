<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\House;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Payment::with(['house', 'resident']);

        if ($request->has('house_id')) {
            $query->where('house_id', $request->house_id);
        }
        if ($request->has('year')) {
            $query->where('tahun', $request->year);
        }
        if ($request->has('month')) {
            $query->where('bulan', $request->month);
        }

        return response()->json($query->orderBy('tahun', 'desc')->orderBy('bulan', 'desc')->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'house_id' => 'required|exists:houses,id',
            'resident_id' => 'required|exists:residents,id',
            'jenis_iuran' => 'required|in:satpam,kebersihan',
            'tahun' => 'required|integer|min:2020|max:2030',
            'bulan' => 'required', // Can be int or array
            'jumlah' => 'required|numeric',
            'tanggal_bayar' => 'required|date',
        ]);

        $months = is_array($request->bulan) ? $request->bulan : [$request->bulan];
        
        // Validation check for duplicates before inserting
        foreach ($months as $m) {
            $exists = Payment::where('house_id', $validated['house_id'])
                        ->where('jenis_iuran', $validated['jenis_iuran'])
                        ->where('tahun', $validated['tahun'])
                        ->where('bulan', $m)
                        ->exists();
            if ($exists) {
                return response()->json(['message' => "Payment for month $m already exists"], 422);
            }
        }

        DB::beginTransaction();
        try {
            $payments = [];
            foreach ($months as $m) {
                $payments[] = Payment::create([
                    'house_id' => $validated['house_id'],
                    'resident_id' => $validated['resident_id'],
                    'jenis_iuran' => $validated['jenis_iuran'],
                    'tahun' => $validated['tahun'],
                    'bulan' => $m,
                    'jumlah' => $validated['jumlah'], // Assumed amount PER MONTH
                    'tanggal_bayar' => $validated['tanggal_bayar'],
                ]);
            }
            DB::commit();
            return response()->json(['message' => 'Payments created successfully', 'data' => $payments], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to process payments: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return response()->json(Payment::with(['house', 'resident'])->find($id));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        // Typically payments aren't edited, but let's allow basic edits
        $payment = Payment::find($id);
        if (!$payment) return response()->json(['message' => 'Not found'], 404);
        
        $payment->update($request->all());
        return response()->json($payment);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        Payment::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }

    // Check status lunas/belum for a specific house in a specific year
    public function status(Request $request)
    {
        $year = $request->input('year', date('Y'));
        $houseId = $request->input('house_id');

        if (!$houseId) return response()->json(['message' => 'House ID required'], 400);

        // Get all payments for this house this year
        $payments = Payment::where('house_id', $houseId)
                        ->where('tahun', $year)
                        ->get()
                        ->groupBy('jenis_iuran');

        // Structure: ['satpam' => [1=>true, 2=>true...], 'kebersihan' => ...]
        $status = [
            'satpam' => [],
            'kebersihan' => []
        ];

        foreach (['satpam', 'kebersihan'] as $type) {
            for ($m = 1; $m <= 12; $m++) {
                $paid = false;
                if (isset($payments[$type])) {
                    $paid = $payments[$type]->contains(fn($p) => (string)$p->bulan === (string)$m);
                }
                $status[$type][(string)$m] = $paid ? 'lunas' : 'belum';
            }
        }

        return response()->json($status);
    }
    
    public function summary() {
        // Simple summary if needed, but ReportController handles the big picture
    }
}
