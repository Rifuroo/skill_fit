<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function dashboard(Request $request)
    {
        $year = $request->input('year', date('Y'));

        // Income per month
        $incomes = Payment::selectRaw('bulan, sum(jumlah) as total')
                    ->where('tahun', $year)
                    ->groupBy('bulan')
                    ->pluck('total', 'bulan')
                    ->toArray();

        // Expenses per month
        $expenses = Expense::selectRaw('bulan, sum(jumlah) as total')
                    ->where('tahun', $year)
                    ->groupBy('bulan')
                    ->pluck('total', 'bulan')
                    ->toArray();

        // Merge 1-12
        $data = [];
        $totalIncome = 0;
        $totalExpense = 0;

        for ($m = 1; $m <= 12; $m++) {
            $inc = $incomes[$m] ?? 0;
            $exp = $expenses[$m] ?? 0;
            $bal = $inc - $exp;

            $totalIncome += $inc;
            $totalExpense += $exp;

            $data[] = [
                'bulan' => $m,
                'pemasukan' => (float)$inc,
                'pengeluaran' => (float)$exp,
                'saldo' => (float)$bal
            ];
        }

        return response()->json([
            'year' => $year,
            'summary' => [
                'total_pemasukan' => $totalIncome,
                'total_pengeluaran' => $totalExpense,
                'sisa_saldo' => $totalIncome - $totalExpense
            ],
            'chart_data' => $data
        ]);
    }

    public function monthly(Request $request)
    {
        $year = $request->input('year', date('Y'));
        $month = $request->input('month', date('n'));

        $incomeDetails = Payment::with(['house', 'resident'])
                            ->where('tahun', $year)
                            ->where('bulan', $month)
                            ->get();

        $expenseDetails = Expense::where('tahun', $year)
                            ->where('bulan', $month)
                            ->get();

        return response()->json([
            'year' => $year,
            'month' => $month,
            'incomes' => $incomeDetails,
            'expenses' => $expenseDetails,
            'total_income' => $incomeDetails->sum('jumlah'),
            'total_expense' => $expenseDetails->sum('jumlah'),
            'balance' => $incomeDetails->sum('jumlah') - $expenseDetails->sum('jumlah')
        ]);
    }
}
