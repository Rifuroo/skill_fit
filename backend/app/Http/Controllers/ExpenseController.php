<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    public function index(Request $request)
    {
        $query = Expense::query();
        if ($request->has('year')) {
            $query->where('tahun', $request->year);
        }
        if ($request->has('month')) {
            $query->where('bulan', $request->month);
        }
        return response()->json($query->orderBy('tanggal', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'kategori' => 'required|string',
            'deskripsi' => 'nullable|string',
            'jumlah' => 'required|numeric',
            'tanggal' => 'required|date',
        ]);
        
        // Auto derive month/year from date
        $date = \Carbon\Carbon::parse($validated['tanggal']);
        $validated['bulan'] = $date->month;
        $validated['tahun'] = $date->year;

        $expense = Expense::create($validated);
        return response()->json($expense, 201);
    }

    public function show($id)
    {
        return response()->json(Expense::find($id));
    }

    public function update(Request $request, $id)
    {
        $expense = Expense::find($id);
        $expense->update($request->all());
        return response()->json($expense);
    }

    public function destroy($id)
    {
        Expense::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }
}
